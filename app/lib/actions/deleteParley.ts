'use server'

import { revalidateTag } from 'next/cache'
import { auth } from '../auth'
import prisma from '@/prisma/client'
import { createLog } from '../utils/api/createLog'

export async function deleteParley(parleyId: string) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return {
        success: false,
        error: 'Unauthorized'
      }
    }

    const userId = session.user.id

    if (!parleyId) {
      return {
        success: false,
        error: 'Parley ID is required'
      }
    }

    const parley = await prisma.parley.findUnique({
      where: { id: parleyId }
    })

    if (!parley) {
      return {
        success: false,
        error: 'Parley not found'
      }
    }

    // Check if the requester is the owner
    if (parley.requesterId !== userId) {
      return {
        success: false,
        error: 'You can only delete your own parleys'
      }
    }

    await prisma.parley.delete({
      where: { id: parleyId }
    })

    await createLog('info', 'Parley deleted', {
      location: ['server action - deleteParley'],
      message: `Parley ${parleyId} deleted by user ${userId}`,
      name: 'ParleyDeleted',
      timestamp: new Date().toISOString(),
      parleyId,
      userId
    })

    revalidateTag('Parley', 'default')

    return {
      success: true,
      message: 'Parley deleted successfully'
    }
  } catch (error) {
    await createLog('error', 'Failed to delete parley', {
      location: ['server action - deleteParley'],
      message: error instanceof Error ? error.message : 'Unknown error',
      name: 'DeleteParleyError',
      timestamp: new Date().toISOString(),
      parleyId,
      error
    })

    return {
      success: false,
      error: 'Failed to delete parley'
    }
  }
}
