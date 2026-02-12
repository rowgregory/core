'use server'

import { revalidateTag } from 'next/cache'
import prisma from '@/prisma/client'
import { createLog } from '@/app/lib/utils/api/createLog'
import { auth } from '@/app/lib/auth'
import { chapterId } from '@/app/lib/constants/api/chapterId'

export async function updateTreasureMapStatus(
  treasureMapId: string,
  status: 'GIVEN' | 'ACCEPTED' | 'CONTACTED' | 'CLOSED' | 'DECLINED'
) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return {
        success: false,
        error: 'Unauthorized'
      }
    }

    if (!treasureMapId) {
      return {
        success: false,
        error: 'Treasure map ID is required'
      }
    }

    if (!status) {
      return {
        success: false,
        error: 'Status is required'
      }
    }

    // Validate status value
    const validStatuses = ['GIVEN', 'ACCEPTED', 'CONTACTED', 'CLOSED', 'DECLINED']
    if (!validStatuses.includes(status)) {
      return {
        success: false,
        error: 'Invalid status value'
      }
    }

    // Check if treasure map exists
    const existingTreasureMap = await prisma.treasureMap.findUnique({
      where: {
        id: treasureMapId,
        chapterId: chapterId
      },
      select: {
        id: true,
        giverId: true,
        receiverId: true,
        status: true
      }
    })

    if (!existingTreasureMap) {
      return {
        success: false,
        error: 'Treasure map not found'
      }
    }

    // Prepare update data
    const updateData: any = {
      status,
      updatedAt: new Date()
    }

    // Update the treasure map
    await prisma.treasureMap.update({
      where: {
        id: treasureMapId
      },
      data: updateData
    })

    await createLog('info', 'Treasure map status updated', {
      location: ['server action - updateTreasureMapStatus'],
      message: `Treasure map ${treasureMapId} status updated to ${status} by user ${session.user.id}`,
      name: 'TreasureMapStatusUpdated',
      timestamp: new Date().toISOString(),
      treasureMapId,
      userId: session.user.id,
      status
    })

    revalidateTag('TreasureMap', 'default')

    return {
      success: true,
      message: `Treasure map status updated to ${status.toLowerCase()}`
    }
  } catch (error) {
    await createLog('error', 'Failed to update treasure map status', {
      location: ['server action - updateTreasureMapStatus'],
      message: error instanceof Error ? error.message : 'Unknown error',
      name: 'UpdateTreasureMapStatusError',
      timestamp: new Date().toISOString(),
      treasureMapId,
      error
    })

    return {
      success: false,
      error: 'Failed to update treasure map status'
    }
  }
}
