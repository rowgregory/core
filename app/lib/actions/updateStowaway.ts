'use server'

import prisma from '@/prisma/client'
import { createLog } from '../utils/api/createLog'
import { auth } from '../auth'
import { revalidateTag } from 'next/cache'

export default async function updateStowaway(
  stowawayId: string,
  data: { name: string; email: string; company: string; website: string; industry: string }
) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return {
        success: false,
        error: 'Unauthorized'
      }
    }

    const { name, email, company, website, industry } = data

    // Check if stowaway exists and user has permission to update
    const existingUser = await prisma.user.findFirst({
      where: {
        id: stowawayId
      }
    })

    if (!existingUser) {
      return {
        success: false,
        error: 'User not found or you do not have permission to update this profile'
      }
    }

    // Prepare update data
    const updateData: any = {
      name: name?.trim(),
      email: email?.trim(),
      company: company?.trim(),
      industry: industry?.trim(),
      website: website?.trim()
    }

    // Update the stowaway
    await prisma.user.update({ where: { id: existingUser.id }, data: updateData })

    await createLog('info', 'Updated stowaway', {
      location: ['server action - updateStowaway'],
      message: `Stowaway ${stowawayId} updated by user ${session.user.id}`,
      name: 'StowawayUpdated',
      timestamp: new Date().toISOString(),
      stowawayId,
      userId: session.user.id
    })

    revalidateTag('User', 'default')

    return {
      succes: true,
      message: 'Stowaway updated'
    }
  } catch (error) {
    await createLog('error', 'Failed to update stowaway', {
      location: ['server action - updateStowaway'],
      message: error instanceof Error ? error.message : 'Unknown error',
      name: 'UpdateStowawayError',
      timestamp: new Date().toISOString(),
      stowawayId,
      error
    })

    return {
      success: false,
      error: 'Failed to update stowaway'
    }
  }
}
