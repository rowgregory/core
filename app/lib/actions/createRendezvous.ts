'use server'

import { revalidateTag } from 'next/cache'
import { auth } from '../auth'
import prisma from '@/prisma/client'
import { chapterId } from '../constants/api/chapterId'
import { RendezvousStatus } from '@prisma/client'
import { createLog } from '../utils/api/createLog'

export async function createRendezvous(data: {
  title: string
  description?: string
  type: string
  startTime: Date
  endTime: Date
  status?: string
  isRecurring?: boolean
  recurrencePattern?: string | null
}) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return {
        success: false,
        error: 'Unauthorized'
      }
    }

    const { title, description, type, startTime, endTime, status, isRecurring, recurrencePattern } = data

    // Validate required fields
    if (!title || !type || !startTime || !endTime) {
      return {
        success: false,
        error: 'Missing required fields: title, type, startTime, endTime'
      }
    }

    // Create rendezvous
    const rendezvous = await prisma.rendezvous.create({
      data: {
        title,
        description: description || null,
        type,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        isRecurring: isRecurring || false,
        recurrencePattern: recurrencePattern || null,
        status: status as RendezvousStatus,
        chapterId
      }
    })

    await createLog('info', 'Rendezvous created', {
      location: ['server action - createRendezvous'],
      message: `Rendezvous "${title}" created by user ${session.user.id}`,
      name: 'RendezvousCreated',
      timestamp: new Date().toISOString(),
      rendezvousId: rendezvous.id,
      userId: session.user.id
    })

    revalidateTag('Rendezvous', 'default')

    return {
      success: true,
      message: 'Rendezvous created successfully'
    }
  } catch (error) {
    await createLog('error', 'Failed to create rendezvous', {
      location: ['server action - createRendezvous'],
      message: error instanceof Error ? error.message : 'Unknown error',
      name: 'CreateRendezvousError',
      timestamp: new Date().toISOString(),
      error
    })

    return {
      success: false,
      error: 'Failed to create rendezvous'
    }
  }
}
