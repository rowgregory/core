'use server'

import prisma from '@/prisma/client'
import { auth } from '../auth'
import { chapterId } from '../constants/api/chapterId'
import { createLog } from '../utils/api/createLog'

export async function getParleys() {
  try {
    const session = await auth()

    if (!session?.user) {
      return {
        success: false,
        error: 'Unauthorized'
      }
    }

    const parleys = await prisma.parley.findMany({
      where: {
        chapterId
      },
      include: {
        chapter: {
          select: {
            id: true,
            name: true
          }
        },
        requester: {
          select: {
            id: true,
            name: true,
            email: true,
            company: true,
            profileImage: true
          }
        },
        recipient: {
          select: {
            id: true,
            name: true,
            email: true,
            company: true,
            profileImage: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Serialize Date fields for client components
    const serializedParleys = parleys.map((parley) => ({
      ...parley,
      createdAt: parley.createdAt.toISOString(),
      updatedAt: parley.updatedAt.toISOString(),
      scheduledAt: parley.scheduledAt.toISOString(),
      completedAt: parley.completedAt?.toISOString() ?? null
    }))

    return serializedParleys
  } catch (error) {
    await createLog('error', 'Failed to fetch parleys', {
      location: ['server action - getParleys'],
      message: error instanceof Error ? error.message : 'Unknown error',
      name: 'GetParleysError',
      timestamp: new Date().toISOString(),
      error
    })

    return {
      success: false,
      error: 'Failed to fetch parleys'
    }
  }
}
