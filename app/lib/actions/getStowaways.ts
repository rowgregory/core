'use server'

import prisma from '@/prisma/client'
import { createLog } from '@/app/lib/utils/api/createLog'
import { auth } from '@/app/lib/auth'
import { chapterId } from '@/app/lib/constants/api/chapterId'

export async function getStowaways() {
  try {
    const session = await auth()

    if (!session?.user) {
      return {
        success: false,
        error: 'Unauthorized'
      }
    }

    const stowaways = await prisma.user.findMany({
      where: {
        chapterId: chapterId,
        membershipStatus: 'FLAGGED'
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Serialize Date fields for client components
    const serializedStowaways = stowaways.map((user) => ({
      ...user,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
      joinedAt: user.joinedAt?.toISOString() ?? null,
      expiresAt: user.expiresAt?.toISOString() ?? null,
      lastLoginAt: user.lastLoginAt?.toISOString() ?? null,
      // These fields are already strings, not Dates
      initialReviewCompletedAt: user.initialReviewCompletedAt ?? null,
      backgroundCheckCompletedAt: user.backgroundCheckCompletedAt ?? null,
      finalDecisionAt: user.finalDecisionAt ?? null,
      rejectedAt: user.rejectedAt ?? null
    }))

    return serializedStowaways
  } catch (error) {
    await createLog('error', 'Failed to fetch stowaways', {
      location: ['server action - getStowaways'],
      message: error instanceof Error ? error.message : 'Unknown error',
      name: 'GetStowawaysError',
      timestamp: new Date().toISOString(),
      error
    })

    return {
      success: false,
      error: 'Failed to fetch stowaways'
    }
  }
}
