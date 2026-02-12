'use server'

import { revalidateTag } from 'next/cache'
import prisma from '@/prisma/client'
import { createLog } from '@/app/lib/utils/api/createLog'
import { auth } from '@/app/lib/auth'
import { chapterId } from '@/app/lib/constants/api/chapterId'

export async function updateTreasureMap(
  treasureMapId: string,
  data: {
    clientName?: string
    clientEmail?: string
    clientPhone?: string
    serviceNeeded?: string
    notes?: string
    giverNotes?: string
    receiverId?: string
    giverId?: string
    isThirdParty?: boolean
  }
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
        error: 'Treasure Map ID is required'
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
        receiverId: true
      }
    })

    if (!existingTreasureMap) {
      return {
        success: false,
        error: 'Treasure map not found'
      }
    }

    // Build update data object, only including provided fields
    const updateData: any = {
      updatedAt: new Date()
    }

    if (data.clientName !== undefined) {
      updateData.clientName = data.clientName
    }
    if (data.clientEmail !== undefined) {
      updateData.clientEmail = data.clientEmail
    }
    if (data.clientPhone !== undefined) {
      updateData.clientPhone = data.clientPhone
    }
    if (data.serviceNeeded !== undefined) {
      updateData.serviceNeeded = data.serviceNeeded
    }
    if (data.notes !== undefined) {
      updateData.notes = data.notes
    }
    if (data.giverNotes !== undefined) {
      updateData.giverNotes = data.giverNotes
    }
    if (data.receiverId !== undefined) {
      updateData.receiverId = data.receiverId
    }
    if (data.giverId !== undefined) {
      updateData.giverId = data.giverId
    }
    if (data.isThirdParty !== undefined) {
      updateData.isThirdParty = data.isThirdParty
    }

    // Update the treasure map
    await prisma.treasureMap.update({
      where: {
        id: treasureMapId
      },
      data: updateData
    })

    await createLog('info', 'Treasure map updated', {
      location: ['server action - updateTreasureMap'],
      message: `Treasure map ${treasureMapId} updated by user ${session.user.id}`,
      name: 'TreasureMapUpdated',
      timestamp: new Date().toISOString(),
      treasureMapId,
      userId: session.user.id
    })

    revalidateTag('TreasureMap', 'default')

    return {
      success: true,
      message: 'Treasure map updated successfully'
    }
  } catch (error) {
    await createLog('error', 'Failed to update treasure map', {
      location: ['server action - updateTreasureMap'],
      message: error instanceof Error ? error.message : 'Unknown error',
      name: 'UpdateTreasureMapError',
      timestamp: new Date().toISOString(),
      treasureMapId,
      error
    })

    return {
      success: false,
      error: 'Failed to update treasure map'
    }
  }
}
