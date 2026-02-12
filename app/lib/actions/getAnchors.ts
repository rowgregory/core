'use server'

import prisma from '@/prisma/client'
import { auth } from '../auth'
import { chapterId } from '../constants/api/chapterId'
import { createLog } from '../utils/api/createLog'

export async function getAnchors() {
  try {
    const session = await auth()

    if (!session.user) {
      return {
        success: false,
        error: 'Unauthorized'
      }
    }

    const anchors = await prisma.anchor.findMany({
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

    // Serialize Decimal fields to numbers for client components
    const serializedAnchors = anchors.map((anchor) => ({
      ...anchor,
      businessValue: anchor.businessValue ? Number(anchor.businessValue) : null,
      createdAt: anchor.createdAt.toISOString(),
      updatedAt: anchor.updatedAt.toISOString(),
      closedDate: anchor.closedDate?.toISOString() ?? null,
      announcedAt: anchor.announcedAt?.toISOString() ?? null
    }))

    return serializedAnchors
  } catch (error) {
    await createLog('error', 'Failed to fetch anchors', {
      location: ['server action - getAnchors'],
      message: error instanceof Error ? error.message : 'Unknown error',
      name: 'GetAnchorsError',
      timestamp: new Date().toISOString(),
      error
    })

    return {
      success: false,
      error: 'Failed to fetch anchors'
    }
  }
}
