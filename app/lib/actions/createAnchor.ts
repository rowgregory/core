'use server'

import { revalidateTag } from 'next/cache'
import { auth } from '../auth'
import prisma from '@/prisma/client'
import { chapterId } from '../constants/api/chapterId'
import { createLog } from '../utils/api/createLog'

export async function createAnchor(data: {
  businessValue?: number
  clientName?: string
  closedDate?: Date
  description?: string
  notes?: string
  receiverId?: string
  giverId?: string
  status: string
  externalGiverName?: string
  externalGiverEmail?: string
  externalGiverCompany?: string
  externalReceiverName?: string
  externalReceiverEmail?: string
  externalReceiverCompany?: string
}) {
  try {
    const user = await auth()

    if (!user) {
      return {
        success: false,
        error: 'Unauthorized'
      }
    }

    const {
      businessValue,
      clientName,
      closedDate,
      description,
      notes,
      receiverId,
      giverId,
      status,
      externalGiverName,
      externalGiverEmail,
      externalGiverCompany,
      externalReceiverName,
      externalReceiverEmail,
      externalReceiverCompany
    } = data

    // Validation: ensure at least one participant is internal
    if (!giverId && !receiverId) {
      return {
        success: false,
        error: 'At least one participant (giver or receiver) must be a registered user'
      }
    }

    // Prevent self-referral
    if (giverId && receiverId && giverId === receiverId) {
      return {
        success: false,
        error: 'Cannot drop anchor for yourself'
      }
    }

    // Validate internal giver if provided
    let giver = null
    if (giverId) {
      giver = await prisma.user.findFirst({
        where: {
          id: giverId,
          chapterId
        }
      })

      if (!giver) {
        return {
          success: false,
          error: 'Giver not found or not in the same chapter'
        }
      }
    }

    // Validate internal receiver if provided
    let receiver = null
    if (receiverId) {
      receiver = await prisma.user.findFirst({
        where: {
          id: receiverId,
          chapterId
        }
      })

      if (!receiver) {
        return {
          success: false,
          error: 'Receiver not found or not in the same chapter'
        }
      }
    }

    // Validate external participant data
    if (!giverId && !externalGiverName?.trim()) {
      return {
        success: false,
        error: 'External giver name is required when no internal giver is selected'
      }
    }

    if (!receiverId && !externalReceiverName?.trim()) {
      return {
        success: false,
        error: 'External receiver name is required when no internal receiver is selected'
      }
    }

    const anchor = await prisma.anchor.create({
      data: {
        businessValue,
        clientName,
        closedDate,
        description,
        notes,
        chapterId,
        giverId: giverId || null,
        receiverId: receiverId || null,
        status,
        // External giver fields (only when no internal giver)
        externalGiverName: !giverId ? externalGiverName?.trim() : null,
        externalGiverEmail: !giverId ? externalGiverEmail?.trim() : null,
        externalGiverCompany: !giverId ? externalGiverCompany?.trim() : null,
        // External receiver fields (only when no internal receiver)
        externalReceiverName: !receiverId ? externalReceiverName?.trim() : null,
        externalReceiverEmail: !receiverId ? externalReceiverEmail?.trim() : null,
        externalReceiverCompany: !receiverId ? externalReceiverCompany?.trim() : null
      },
      include: {
        ...(giverId && {
          giver: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true
            }
          }
        }),
        ...(receiverId && {
          receiver: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true
            }
          }
        }),
        chapter: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })

    // Send emails (only for internal users)
    if (status === 'REPORTED') {
      if (giverId && receiverId) {
        // Both internal - send notification to receiver
      } else if (giverId) {
        // Internal giver, external receiver - could send admin notification
      } else if (receiverId) {
        // External giver, internal receiver - notify the receiver
      }
    }

    await createLog('info', 'New anchor created', {
      location: ['server action - createAnchor'],
      message: `New anchor created with ${giverId ? 'internal' : 'external'} giver and ${receiverId ? 'internal' : 'external'} receiver`,
      name: 'AnchorCreated',
      timestamp: new Date().toISOString(),
      anchorId: anchor.id,
      hasExternalParticipant: !giverId || !receiverId
    })

    revalidateTag('Anchor', 'default')

    return {
      success: true,
      anchor,
      message: 'Anchor created successfully'
    }
  } catch (error) {
    await createLog('error', 'Failed to create anchor', {
      location: ['server action - createAnchor'],
      message: error instanceof Error ? error.message : 'Unknown error',
      name: 'AnchorCreationError',
      timestamp: new Date().toISOString(),
      error
    })

    return {
      success: false,
      error: 'Failed to create anchor'
    }
  }
}
