'use server'

import { revalidateTag } from 'next/cache'
import prisma from '@/prisma/client'
import { createLog } from '@/app/lib/utils/api/createLog'
import { auth } from '@/app/lib/auth'
import { chapterId } from '@/app/lib/constants/api/chapterId'

export async function createStowaway(data: {
  name: string
  email: string
  company?: string
  industry?: string
  website?: string
}) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return {
        success: false,
        error: 'Unauthorized'
      }
    }

    const { name, email, company, industry, website } = data

    // Validate required fields
    if (!name || !email) {
      return {
        success: false,
        error: 'Name and email are required'
      }
    }

    // Check if user with this email already exists in the chapter
    const existingUser = await prisma.user.findFirst({
      where: {
        email: email.trim().toLowerCase(),
        chapterId
      }
    })

    if (existingUser) {
      return {
        success: false,
        error: 'A user with this email already exists in this chapter'
      }
    }

    // Create the stowaway user
    const stowaway = await prisma.user.create({
      data: {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        company: company?.trim(),
        industry: industry?.trim(),
        website,
        chapterId,
        membershipStatus: 'FLAGGED',
        role: 'STOWAWAY',
        isActive: false,
        isPublic: false
      }
    })

    await createLog('info', 'Stowaway created', {
      location: ['server action - createStowaway'],
      message: `Stowaway ${name} created by user ${session.user.id}`,
      name: 'StowawayCreated',
      timestamp: new Date().toISOString(),
      stowawayId: stowaway.id,
      userId: session.user.id
    })

    revalidateTag('User', 'default')

    return {
      success: true,
      message: 'Stowaway created successfully'
    }
  } catch (error) {
    await createLog('error', 'Failed to create stowaway', {
      location: ['server action - createStowaway'],
      message: error instanceof Error ? error.message : 'Unknown error',
      name: 'CreateStowawayError',
      timestamp: new Date().toISOString(),
      error
    })

    return {
      success: false,
      error: 'Failed to create stowaway'
    }
  }
}
