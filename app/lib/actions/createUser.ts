'use server'

import { CreateUserInput, CreateUserResponse } from '@/types/user'
import { Prisma } from '@prisma/client'
import { Resend } from 'resend'
import swabbiePendingTemplate from '../email-templates/swabbie-pending'
import adminVisitorNotificationTemplate from '../email-templates/admin-visitor-notification'
import stowawayInvitationTemplate from '../email-templates/stowaway-flagged'
import { validateUserData } from '../utils/api/validations/validateUserData'
import prisma from '@/prisma/client'
import { createLog } from '../utils/api/createLog'
import { revalidateTag } from 'next/cache'

const resend = new Resend(process.env.RESEND_API_KEY)

const BASE_URL =
  process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://coastal-referral-exchange.com'

/**
 * Determine user role based on status and application completion
 */
function determineUserRole(input: CreateUserInput): string {
  if (input.isAdmin) return 'ADMIN'
  if (input.hasCompletedApplication) return 'SWABBIE'
  if (input.membershipStatus === 'FLAGGED') return 'STOWAWAY'
  return 'MEMBER'
}

/**
 * Calculate expiration date (1 year from joined date)
 */
function calculateExpiresAt(joinedAt: Date, providedExpiresAt?: string): Date {
  if (providedExpiresAt) return new Date(providedExpiresAt)
  return new Date(joinedAt.getTime() + 365 * 24 * 60 * 60 * 1000)
}

/**
 * Build user creation data object
 */
function buildUserData(input: CreateUserInput, joinedAt: Date): Prisma.UserCreateInput {
  const userData: Prisma.UserCreateInput = {
    name: input.name.trim(),
    email: input.email.toLowerCase(),
    phone: input.phone || null,
    role: determineUserRole(input),
    company: input.company?.trim(),
    industry: input.industry?.trim(),
    isLicensed: input.isLicensed || false,
    membershipStatus: input.membershipStatus || 'PENDING',
    isAdmin: !!input.isAdmin,
    isPublic: false,
    isActive: false,
    joinedAt,
    expiresAt: calculateExpiresAt(joinedAt, input.expiresAt),
    hasCompletedApplication: input.hasCompletedApplication,
    chapter: {
      connect: {
        id: input.chapterId
      }
    }
  }

  // Add optional fields only if they exist
  if (input.location?.trim()) {
    userData.location = input.location.trim()
  }

  if (input.businessLicenseNumber?.trim()) {
    userData.businessLicenseNumber = input.businessLicenseNumber.trim()
  }

  return userData
}

/**
 * Send pending status emails to user and admins
 */
async function sendPendingEmails(user: any, shouldNotifyAdmins: boolean): Promise<void> {
  const portPath = `/swabbie/port?swabbieId=${user.id}`
  const fullPortUrl = `${BASE_URL}${portPath}`

  // Send pending email to user
  await resend.emails.send({
    from: 'Pending <no-reply@coastal-referral-exchange.com>',
    to: [user.email],
    subject: 'Your Coastal Referral application is pending initial review',
    html: swabbiePendingTemplate(user.name, 'Storm Watch', fullPortUrl)
  })

  // Notify admins only if user submitted their own application
  if (!shouldNotifyAdmins) return

  const adminUsers = await prisma.user.findMany({
    where: { isAdmin: true },
    select: { email: true, name: true }
  })

  const adminEmailPromises = adminUsers.map((admin) =>
    resend.emails.send({
      from: 'New Application <no-reply@coastal-referral-exchange.com>',
      to: [admin.email],
      subject: `New visitor form submission - ${user.name}`,
      html: adminVisitorNotificationTemplate(admin.name, user.name, user.email, `${BASE_URL}/admin/bridge`)
    })
  )

  await Promise.all(adminEmailPromises)
}

/**
 * Send flagged status invitation email
 */
async function sendFlaggedInvitationEmail(user: any): Promise<void> {
  const eventInfo = `Thursday, October 2nd, 2025
7:00 AM - 8:15 AM
Boys & Girls Club of Lynn
25 N Common St, Lynn, MA 01902`

  await resend.emails.send({
    from: "You're Invited! <no-reply@coastal-referral-exchange.com>",
    to: [user.email],
    subject: "You're Invited to Coastal Referral Exchange Visitor Day!",
    html: stowawayInvitationTemplate(user.name, eventInfo)
  })
}

/**
 * Create a new user
 */
export async function createUser(input: CreateUserInput): Promise<CreateUserResponse> {
  try {
    // Validate input data
    const validationErrors = validateUserData(input)
    if (validationErrors.length > 0) {
      return {
        error: 'Validation failed',
        fieldErrors: validationErrors,
        user: null
      }
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: input.email.toLowerCase() }
    })

    if (existingUser) {
      return {
        error: 'Email already exists',
        user: null
      }
    }

    // Check if chapter exists
    const chapter = await prisma.chapter.findUnique({
      where: { id: input.chapterId }
    })

    if (!chapter) {
      return {
        error: 'Chapter not found',
        user: null
      }
    }

    // Create user
    const joinedAt = input.joinedAt ? new Date(input.joinedAt) : new Date()
    const userData = buildUserData(input, joinedAt)

    const user = await prisma.user.create({
      data: userData,
      include: {
        chapter: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })

    // Send emails based on membership status
    if (user.membershipStatus === 'PENDING') {
      await sendPendingEmails(user, !input.isAddedByAdmin)
    } else if (user.membershipStatus === 'FLAGGED') {
      await sendFlaggedInvitationEmail(user)
    }

    // Log user creation
    await createLog('info', 'New user created', {
      location: ['server action - createUser'],
      message: 'New user created',
      name: 'NewUserCreated',
      timestamp: new Date().toISOString(),
      method: 'POST'
    })

    // Revalidate chapter cache
    revalidateTag('User', 'default')

    return { user }
  } catch (error: any) {
    return {
      error: 'Failed to create user',
      user: null
    }
  }
}
