'use server'

import prisma from '@/prisma/client'
import { auth } from '../auth'
import { chapterId } from '../constants/api/chapterId'
import { createLog } from '../utils/api/createLog'
import { revalidateTag } from 'next/cache'

export async function updateAnchor(
  anchorId: string,
  data: {
    businessValue?: number
    clientName?: string
    closedDate?: Date
    description?: string
    notes?: string
    receiverId?: string
    status?: string
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

    if (!anchorId) {
      return {
        success: false,
        error: 'Anchor ID is required'
      }
    }

    const userId = session.user.id

    // Check if anchor exists and user has permission
    const existingAnchor = await prisma.anchor.findUnique({
      where: {
        id: anchorId,
        chapterId
      },
      select: {
        id: true,
        giverId: true,
        receiverId: true
      }
    })

    if (!existingAnchor) {
      return {
        success: false,
        error: 'Anchor not found'
      }
    }

    // Check permissions - only giver or receiver can update
    const canUpdate = existingAnchor.giverId === userId || existingAnchor.receiverId === userId
    if (!canUpdate) {
      return {
        success: false,
        error: 'You do not have permission to update this anchor'
      }
    }

    // Build update data object, only including provided fields
    const updateData: any = {
      updatedAt: new Date()
    }

    if (data.clientName !== undefined) {
      updateData.clientName = data.clientName
    }
    if (data.businessValue !== undefined) {
      updateData.businessValue = data.businessValue
    }
    if (data.closedDate !== undefined) {
      updateData.closedDate = data.closedDate
    }
    if (data.description !== undefined) {
      updateData.description = data.description
    }
    if (data.notes !== undefined) {
      updateData.notes = data.notes
    }
    if (data.status !== undefined) {
      updateData.status = data.status
    }
    if (data.receiverId !== undefined) {
      updateData.receiverId = data.receiverId
    }

    // Update the anchor
    await prisma.anchor.update({
      where: {
        id: anchorId
      },
      data: updateData,
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
      }
    })

    await createLog('info', 'Anchor updated', {
      location: ['server action - updateAnchor'],
      message: `Anchor ${anchorId} updated by user ${userId}`,
      name: 'AnchorUpdated',
      timestamp: new Date().toISOString(),
      anchorId,
      userId
    })

    revalidateTag(`Anchor`, 'default')

    return {
      success: true
    }
  } catch (error) {
    await createLog('error', 'Failed to update anchor', {
      location: ['server action - updateAnchor'],
      message: error instanceof Error ? error.message : 'Unknown error',
      name: 'UpdateAnchorError',
      timestamp: new Date().toISOString(),
      anchorId,
      error
    })

    return {
      success: false,
      error: 'Failed to update anchor'
    }
  }
}
