'use server'

import prisma from '@/prisma/client'
import { createLog } from '@/app/lib/utils/api/createLog'
import { chapterId } from '@/app/lib/constants/api/chapterId'

export async function getSwabbie(userId: string) {
  try {
    if (!userId) {
      return {
        success: false,
        error: 'User ID is required'
      }
    }

    const swabbie = await prisma.user.findFirst({
      where: {
        id: userId,
        chapterId: chapterId
      }
    })

    if (!swabbie) {
      return {
        success: false,
        error: 'Swabbie not found'
      }
    }

    // Serialize Date fields for client components
    const serializedSwabbie = {
      ...swabbie,
      createdAt: swabbie.createdAt.toISOString(),
      updatedAt: swabbie.updatedAt.toISOString(),
      joinedAt: swabbie.joinedAt?.toISOString() ?? null,
      expiresAt: swabbie.expiresAt?.toISOString() ?? null,
      lastLoginAt: swabbie.lastLoginAt?.toISOString() ?? null,
      initialReviewCompletedAt: swabbie.initialReviewCompletedAt ?? null,
      backgroundCheckCompletedAt: swabbie.backgroundCheckCompletedAt ?? null,
      finalDecisionAt: swabbie.finalDecisionAt ?? null,
      rejectedAt: swabbie.rejectedAt ?? null
    }

    return serializedSwabbie
  } catch (error) {
    await createLog('error', 'Failed to fetch swabbie', {
      location: ['server action - getSwabbie'],
      message: error instanceof Error ? error.message : 'Unknown error',
      name: 'GetSwabbieError',
      timestamp: new Date().toISOString(),
      userId,
      error
    })

    return {
      success: false,
      error: 'Failed to fetch swabbie'
    }
  }
}
