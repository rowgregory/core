'use server'

import prisma from '@/prisma/client'
import { createLog } from '@/app/lib/utils/api/createLog'
import { auth } from '@/app/lib/auth'
import { chapterId } from '@/app/lib/constants/api/chapterId'

export async function getTreasureMapsById() {
  try {
    const session = await auth()

    if (!session?.user) {
      return {
        success: false,
        error: 'Unauthorized'
      }
    }

    if (!session.user.id) {
      return {
        success: false,
        error: 'User ID is required'
      }
    }

    const treasureMaps = await prisma.treasureMap.findMany({
      where: {
        chapterId: chapterId,
        OR: [{ giverId: session.user.id }, { receiverId: session.user.id }]
      },
      include: {
        chapter: {
          select: {
            id: true,
            name: true
          }
        },
        giver: {
          select: {
            id: true,
            name: true,
            email: true,
            company: true,
            profileImage: true
          }
        },
        receiver: {
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
    const serializedTreasureMaps = treasureMaps.map((treasureMap) => ({
      ...treasureMap,
      createdAt: treasureMap.createdAt.toISOString(),
      updatedAt: treasureMap.updatedAt.toISOString()
    }))

    return serializedTreasureMaps
  } catch (error) {
    await createLog('error', 'Failed to fetch treasure maps by user', {
      location: ['server action - getTreasureMapsById'],
      message: error instanceof Error ? error.message : 'Unknown error',
      name: 'GetTreasureMapsByIdError',
      timestamp: new Date().toISOString(),
      error
    })

    return {
      success: false,
      error: 'Failed to fetch treasure maps'
    }
  }
}
