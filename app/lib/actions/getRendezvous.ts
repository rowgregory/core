'use server'

import prisma from '@/prisma/client'
import { auth } from '../auth'
import { chapterId } from '../constants/api/chapterId'
import { createLog } from '../utils/api/createLog'

export async function getRendezvous() {
  try {
    const session = await auth()

    if (!session?.user) {
      return {
        success: false,
        error: 'Unauthorized'
      }
    }

    const rendezvous = await prisma.rendezvous.findMany({
      where: {
        chapterId
      },
      orderBy: {
        startTime: 'asc'
      }
    })

    // Serialize Date fields for client components
    const serializedRendezvous = rendezvous.map((item) => ({
      ...item,
      createdAt: item.createdAt.toISOString(),
      updatedAt: item.updatedAt.toISOString(),
      startTime: item.startTime.toISOString(),
      endTime: item.endTime.toISOString()
    }))

    return serializedRendezvous
  } catch (error) {
    await createLog('error', 'Failed to fetch rendezvous', {
      location: ['server action - getRendezvous'],
      message: error instanceof Error ? error.message : 'Unknown error',
      name: 'GetRendezvousError',
      timestamp: new Date().toISOString(),
      error
    })

    return {
      success: false,
      error: 'Failed to fetch rendezvous'
    }
  }
}
