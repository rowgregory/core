'use server'

import { revalidateTag } from 'next/cache'
import prisma from '@/prisma/client'
import { createLog } from '@/app/lib/utils/api/createLog'
import { auth } from '@/app/lib/auth'

export async function updateRendezvous(
  id: string,
  data: {
    status?: string
    title?: string
    description?: string
    type?: string
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

    if (!id) {
      return {
        success: false,
        error: 'Rendezvous ID is required'
      }
    }

    const { status, title, description, type } = data

    // Validate status if provided
    const validStatuses = ['ACTIVE', 'REMOVED', 'CANCELLED']
    if (status && !validStatuses.includes(status)) {
      return {
        success: false,
        error: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      }
    }

    // Build update data object, only including provided fields
    const updateData: any = {
      updatedAt: new Date()
    }

    if (status !== undefined) {
      updateData.status = status
    }
    if (title !== undefined) {
      updateData.title = title
    }
    if (description !== undefined) {
      updateData.description = description
    }
    if (type !== undefined) {
      updateData.type = type
    }

    // Update rendezvous
    await prisma.rendezvous.update({
      where: { id },
      data: updateData
    })

    await createLog('info', 'Rendezvous updated', {
      location: ['server action - updateRendezvous'],
      message: `Rendezvous ${id} updated by user ${session.user.id}`,
      name: 'RendezvousUpdated',
      timestamp: new Date().toISOString(),
      rendezvousId: id,
      userId: session.user.id
    })

    revalidateTag('Rendezvous', 'default')

    return {
      success: true,
      message: 'Rendezvous updated successfully'
    }
  } catch (error) {
    await createLog('error', 'Failed to update rendezvous', {
      location: ['server action - updateRendezvous'],
      message: error instanceof Error ? error.message : 'Unknown error',
      name: 'UpdateRendezvousError',
      timestamp: new Date().toISOString(),
      rendezvousId: id,
      error
    })

    return {
      success: false,
      error: 'Failed to update rendezvous'
    }
  }
}
