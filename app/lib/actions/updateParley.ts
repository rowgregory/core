'use server'

import { revalidateTag } from 'next/cache'
import { auth } from '../auth'
import prisma from '@/prisma/client'
import { chapterId } from '../constants/api/chapterId'
import { createLog } from '../utils/api/createLog'

export async function updateParley(
  parleyId: string,
  data: {
    scheduledAt?: Date
    duration?: number
    location?: string | null
    meetingType?: 'DECK_TO_DECK' | 'VOYAGE_CALL' | 'MESSAGE_IN_A_BOTTLE' | 'LANTERN_LIGHT'
    status?: 'REQUESTED' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED'
    completed?: boolean
    completedAt?: Date | null
    referralGiven?: boolean
    referralReceived?: boolean
    followUpRequired?: boolean
    notes?: string | null
    requesterNotes?: string | null
    recipientNotes?: string | null
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

    const userId = session.user.id

    if (!parleyId) {
      return {
        success: false,
        error: 'Parley ID is required'
      }
    }

    const {
      scheduledAt,
      duration,
      location,
      meetingType,
      status,
      completed,
      completedAt,
      referralGiven,
      referralReceived,
      followUpRequired,
      notes,
      requesterNotes,
      recipientNotes
    } = data

    // Validate meeting type if provided
    const validMeetingTypes = ['DECK_TO_DECK', 'VOYAGE_CALL', 'MESSAGE_IN_A_BOTTLE', 'LANTERN_LIGHT']
    if (meetingType && !validMeetingTypes.includes(meetingType)) {
      return {
        success: false,
        error: 'Invalid meeting type'
      }
    }

    // Validate status if provided
    const validStatuses = ['REQUESTED', 'CONFIRMED', 'COMPLETED', 'CANCELLED']
    if (status && !validStatuses.includes(status)) {
      return {
        success: false,
        error: 'Invalid status value'
      }
    }

    // Validate duration if provided
    if (duration && (isNaN(Number(duration)) || Number(duration) <= 0)) {
      return {
        success: false,
        error: 'Duration must be a positive number'
      }
    }

    // Check if parley exists and user has permission
    const existingParley = await prisma.parley.findUnique({
      where: {
        id: parleyId,
        chapterId
      },
      select: {
        id: true,
        requesterId: true,
        recipientId: true,
        status: true,
        completedAt: true
      }
    })

    if (!existingParley) {
      return {
        success: false,
        error: 'Parley not found'
      }
    }

    // Check permissions - only requester or recipient can update
    const canUpdate = existingParley.requesterId === userId || existingParley.recipientId === userId
    if (!canUpdate) {
      return {
        success: false,
        error: 'You do not have permission to update this parley'
      }
    }

    // Build update data object, only including provided fields
    const updateData: any = {
      updatedAt: new Date()
    }

    if (scheduledAt !== undefined) {
      updateData.scheduledAt = new Date(scheduledAt)
    }
    if (duration !== undefined) {
      updateData.duration = Number(duration)
    }
    if (location !== undefined) {
      updateData.location = location
    }
    if (meetingType !== undefined) {
      updateData.meetingType = meetingType
    }
    if (status !== undefined) {
      updateData.status = status
    }
    if (completed !== undefined) {
      updateData.completed = Boolean(completed)
    }
    if (completedAt !== undefined) {
      updateData.completedAt = completedAt ? new Date(completedAt) : null
    }
    if (referralGiven !== undefined) {
      updateData.referralGiven = Boolean(referralGiven)
    }
    if (referralReceived !== undefined) {
      updateData.referralReceived = Boolean(referralReceived)
    }
    if (followUpRequired !== undefined) {
      updateData.followUpRequired = Boolean(followUpRequired)
    }
    if (notes !== undefined) {
      updateData.notes = notes
    }
    if (requesterNotes !== undefined) {
      updateData.requesterNotes = requesterNotes
    }
    if (recipientNotes !== undefined) {
      updateData.recipientNotes = recipientNotes
    }

    // Business logic validations
    if (updateData.completed && !updateData.completedAt && !existingParley.completedAt) {
      updateData.completedAt = new Date()
    }

    // Update the parley
    const updatedParley = await prisma.parley.update({
      where: {
        id: parleyId
      },
      data: updateData,
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
      }
    })

    // Serialize Date fields for client components
    const serializedParley = {
      ...updatedParley,
      createdAt: updatedParley.createdAt.toISOString(),
      updatedAt: updatedParley.updatedAt.toISOString(),
      scheduledAt: updatedParley.scheduledAt.toISOString(),
      completedAt: updatedParley.completedAt?.toISOString() ?? null
    }

    await createLog('info', 'Parley updated', {
      location: ['server action - updateParley'],
      message: `Parley ${parleyId} updated by user ${userId}`,
      name: 'ParleyUpdated',
      timestamp: new Date().toISOString(),
      parleyId,
      userId
    })

    revalidateTag('Parley', 'default')

    return {
      success: true,
      parley: serializedParley,
      message: 'Parley updated successfully'
    }
  } catch (error) {
    await createLog('error', 'Failed to update parley', {
      location: ['server action - updateParley'],
      message: error instanceof Error ? error.message : 'Unknown error',
      name: 'UpdateParleyError',
      timestamp: new Date().toISOString(),
      parleyId,
      error
    })

    return {
      success: false,
      error: 'Failed to update parley'
    }
  }
}
