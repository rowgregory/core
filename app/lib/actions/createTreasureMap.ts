'use server'

import { revalidateTag } from 'next/cache'
import prisma from '@/prisma/client'
import { createLog } from '@/app/lib/utils/api/createLog'
import { auth } from '@/app/lib/auth'
import { chapterId } from '@/app/lib/constants/api/chapterId'

export async function createTreasureMap(data: {
  clientName: string
  clientEmail?: string
  clientPhone?: string
  serviceNeeded: string
  notes?: string
  giverNotes?: string
  receiverId: string
  giverId: string
  isThirdParty?: boolean
}) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return {
        success: false,
        error: 'Unauthorized'
      }
    }

    const {
      clientName,
      clientEmail,
      clientPhone,
      serviceNeeded,
      notes,
      giverNotes,
      receiverId,
      giverId,
      isThirdParty
    } = data

    // Prevent self-referral
    if (giverId === receiverId) {
      return {
        success: false,
        error: 'Cannot give treasure map to yourself'
      }
    }

    // Validate required fields
    if (!clientName || !serviceNeeded || !receiverId) {
      return {
        success: false,
        error: 'Missing required fields: clientName, serviceNeeded, and receiverId are required'
      }
    }

    // Check if receiver exists and is in the same chapter
    const receiver = await prisma.user.findFirst({
      where: {
        id: receiverId,
        chapterId: chapterId
      }
    })

    if (!receiver) {
      return {
        success: false,
        error: 'Receiver not found or not in the same chapter'
      }
    }

    // Create the TreasureMap
    const treasureMap = await prisma.treasureMap.create({
      data: {
        clientName,
        clientEmail,
        clientPhone,
        serviceNeeded,
        notes,
        giverNotes,
        chapterId,
        giverId,
        receiverId,
        status: 'GIVEN',
        isThirdParty
      }
    })

    // Send notification to receiver
    // notificationFactory.treasureMap.given(
    //   treasureMap.giver.name,
    //   chapterId,
    //   treasureMap.id,
    //   giverId,
    //   treasureMap.receiver.id,
    //   treasureMap.clientName,
    //   treasureMap.serviceNeeded
    // )

    await createLog('info', 'New treasure map created', {
      location: ['server action - createTreasureMap'],
      message: `New treasure map referral created for client: ${clientName}`,
      name: 'TreasureMapCreated',
      timestamp: new Date().toISOString(),
      metadata: {
        treasureMapId: treasureMap.id,
        clientName: treasureMap.clientName,
        serviceNeeded: treasureMap.serviceNeeded,
        giverId: treasureMap.giverId,
        receiverId: treasureMap.receiverId
      }
    })

    revalidateTag('TreasureMap', 'default')

    return {
      success: true,
      message: 'Treasure map created successfully'
    }
  } catch (error) {
    await createLog('error', 'Failed to create treasure map', {
      location: ['server action - createTreasureMap'],
      message: error instanceof Error ? error.message : 'Unknown error',
      name: 'CreateTreasureMapError',
      timestamp: new Date().toISOString(),
      error
    })

    return {
      success: false,
      error: 'Failed to create treasure map'
    }
  }
}
