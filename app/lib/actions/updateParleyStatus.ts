'use server'

import { revalidateTag } from 'next/cache'
import { Resend } from 'resend'
import { auth } from '../auth'
import prisma from '@/prisma/client'
import { chapterId } from '../constants/api/chapterId'
import parleyCompletedTemplate from '../email-templates/parley-complete'
import { formatDate } from '../utils/date/formatDate'
import { createLog } from '../utils/api/createLog'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function updateParleyStatus(
  parleyId: string,
  status: 'REQUESTED' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED'
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

    if (!status) {
      return {
        success: false,
        error: 'Status is required'
      }
    }

    // Validate status value
    const validStatuses = ['REQUESTED', 'CONFIRMED', 'COMPLETED', 'CANCELLED']
    if (!validStatuses.includes(status)) {
      return {
        success: false,
        error: 'Invalid status value'
      }
    }

    // Check if parley exists and user has permission to update it
    const existingParley = await prisma.parley.findUnique({
      where: {
        id: parleyId,
        chapterId
      },
      select: {
        id: true,
        requesterId: true,
        recipientId: true,
        status: true
      }
    })

    if (!existingParley) {
      return {
        success: false,
        error: 'Parley not found'
      }
    }

    // Check if user has permission to update this parley
    const canUpdate = existingParley.requesterId === userId || existingParley.recipientId === userId
    if (!canUpdate) {
      return {
        success: false,
        error: 'You do not have permission to update this parley'
      }
    }

    // Prepare update data
    const updateData: any = {
      status,
      updatedAt: new Date()
    }

    // Add completion timestamp if marking as completed
    if (status === 'COMPLETED') {
      updateData.completed = true
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

    if (updatedParley.status === 'COMPLETED') {
      const nodeEnv = process.env.NODE_ENV
      const baseUrl = nodeEnv === 'development' ? 'http://localhost:3000' : 'https://coastal-referral-exchange.com'
      const bridgePath = session.user.isAdmin ? '/admin/parley' : '/member/parley'
      const fullUrl = `${baseUrl}${bridgePath}`

      const parleyCompletedHtmlString = parleyCompletedTemplate(
        updatedParley.requester.name,
        updatedParley.recipient.name,
        formatDate(updatedParley.updatedAt, { includeTime: true }),
        fullUrl
      )

      await resend.emails.send({
        from: `Parley Completed <no-reply@coastal-referral-exchange.com>`,
        to: [updatedParley.recipient.email],
        subject: `Parley between ${updatedParley.requester.name === 'Gregory Row' ? 'Sqysh' : updatedParley.requester.name} and ${updatedParley.recipient.name}`,
        html: parleyCompletedHtmlString
      })
    }

    await createLog('info', 'Parley status updated', {
      location: ['server action - updateParleyStatus'],
      message: `Parley ${parleyId} status updated to ${status} by user ${userId}`,
      name: 'ParleyStatusUpdated',
      timestamp: new Date().toISOString(),
      parleyId,
      userId,
      status
    })

    revalidateTag('Parley', 'default')

    return {
      success: true,
      message: `Parley status updated to ${status.toLowerCase()}`
    }
  } catch (error) {
    await createLog('error', 'Failed to update parley status', {
      location: ['server action - updateParleyStatus'],
      message: error instanceof Error ? error.message : 'Unknown error',
      name: 'UpdateParleyStatusError',
      timestamp: new Date().toISOString(),
      parleyId,
      error
    })

    return {
      success: false,
      error: 'Failed to update parley status'
    }
  }
}
