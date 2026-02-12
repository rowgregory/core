'use server'

import { revalidateTag } from 'next/cache'
import prisma from '@/prisma/client'
import { createLog } from '@/app/lib/utils/api/createLog'
import { auth } from '@/app/lib/auth'
import { chapterId } from '@/app/lib/constants/api/chapterId'
import { Resend } from 'resend'
import swabbiePendingTemplate from '@/app/lib/email-templates/swabbie-pending'
import swabbieInitialReviewTemplate from '@/app/lib/email-templates/swabbie-initial-review'
import swabbieBackgroundCheckTemplate from '@/app/lib/email-templates/swabbie-background-check'
import swabbieActiveTemplate from '@/app/lib/email-templates/swabbie-active'
import swabbieRejectedTemplate from '@/app/lib/email-templates/swabbie-rejected'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function updateUserStatus(
  swabbieId: string,
  membershipStatus: 'PENDING' | 'INITIAL_REVIEW' | 'BACKGROUND_CHECK' | 'ACTIVE' | 'REJECTED'
) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return {
        success: false,
        error: 'Unauthorized'
      }
    }

    // Check if the current user is an admin
    if (!session.user.isAdmin) {
      return {
        success: false,
        error: 'Only admins can update user status'
      }
    }

    if (!swabbieId) {
      return {
        success: false,
        error: 'User ID is required'
      }
    }

    // Check if user exists
    const existingUser = await prisma.user.findFirst({
      where: {
        id: swabbieId,
        chapterId: chapterId
      }
    })

    if (!existingUser) {
      return {
        success: false,
        error: 'User not found or you do not have permission to update this profile'
      }
    }

    const updateData: any = {
      membershipStatus,
      updatedAt: new Date()
    }

    switch (membershipStatus) {
      case 'PENDING':
        updateData.role = 'SWABBIE'
        break
      case 'INITIAL_REVIEW':
        updateData.initialReviewCompletedAt = new Date()
        updateData.isInitialReviewCompleted = true
        break
      case 'BACKGROUND_CHECK':
        updateData.backgroundCheckCompletedAt = new Date()
        updateData.isBackgroudCheckCompleted = true
        break
      case 'ACTIVE':
        updateData.finalDecisionAt = new Date()
        updateData.isFinalDecisionMade = true
        updateData.role = 'MEMBER'
        break
      case 'REJECTED':
        updateData.rejectedAt = new Date()
        updateData.rejectedStep = membershipStatus
        updateData.isRejected = true
        break
    }

    const updatedUser = await prisma.user.update({
      where: { id: swabbieId },
      data: updateData
    })

    const nodeEnv = process.env.NODE_ENV
    const baseUrl = nodeEnv === 'development' ? 'http://localhost:3000' : 'https://coastal-referral-exchange.com'
    const portPath = `/port/swabbie?swabbieId=${swabbieId}`
    const fullPortUrl = `${baseUrl}${portPath}`
    const noReplyEmail = '<no-reply@coastal-referral-exchange.com>'

    switch (updatedUser.membershipStatus) {
      case 'PENDING':
        await resend.emails.send({
          from: `Pending Review ${noReplyEmail}`,
          to: [updatedUser.email],
          subject: `Your application is pending review`,
          html: swabbiePendingTemplate(updatedUser.name, 'Storm Watch', fullPortUrl)
        })
        break
      case 'INITIAL_REVIEW':
        await resend.emails.send({
          from: `Initial Review ${noReplyEmail}`,
          to: [updatedUser.email],
          subject: `Your application is pending background check`,
          html: swabbieInitialReviewTemplate(fullPortUrl)
        })
        break
      case 'BACKGROUND_CHECK':
        await resend.emails.send({
          from: `Background Check ${noReplyEmail}`,
          to: [updatedUser.email],
          subject: `Your application is pending final review`,
          html: swabbieBackgroundCheckTemplate(updatedUser.name, fullPortUrl)
        })
        break
      case 'ACTIVE':
        const bridgePath = '/member/bridge'
        const fullBridgeUrl = `${baseUrl}${bridgePath}`

        await resend.emails.send({
          from: `Final Decision ${noReplyEmail}`,
          to: [updatedUser.email],
          subject: `Welcome aboard – your application is approved!`,
          html: swabbieActiveTemplate(updatedUser.name, fullBridgeUrl)
        })
        break
      case 'REJECTED':
        await resend.emails.send({
          from: `Rejected ${noReplyEmail}`,
          to: [updatedUser.email],
          subject: `Your application was not approved at this time`,
          html: swabbieRejectedTemplate(updatedUser.name, updatedUser.rejectedAt?.toString() ?? '')
        })
        break
    }

    await createLog('info', 'User status updated by admin', {
      location: ['server action - updateUserStatus'],
      message: `User ${swabbieId} status updated to ${membershipStatus} by admin ${session.user.id}`,
      name: 'UserStatusUpdatedByAdmin',
      timestamp: new Date().toISOString(),
      userId: swabbieId,
      adminId: session.user.id,
      membershipStatus
    })

    revalidateTag('User', 'default')

    return {
      success: true,
      message: 'Swabbie status updated'
    }
  } catch (error) {
    await createLog('error', 'Failed to update user status', {
      location: ['server action - updateUserStatus'],
      message: error instanceof Error ? error.message : 'Unknown error',
      name: 'UpdateUserStatusError',
      timestamp: new Date().toISOString(),
      userId: swabbieId,
      error
    })

    return {
      success: false,
      error: 'Failed to update user status'
    }
  }
}
