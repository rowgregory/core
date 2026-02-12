'use server'

import prisma from '@/prisma/client'
import { createLog } from '@/app/lib/utils/api/createLog'
import { auth } from '@/app/lib/auth'
import { chapterId } from '@/app/lib/constants/api/chapterId'

export async function getUserById() {
  const session = await auth()

  try {
    if (!session?.user) {
      return {
        success: false,
        error: 'Unauthorized'
      }
    }

    if (!session.user.id) {
      return {
        success: false,
        error: 'User ID is required'
      }
    }

    // Check if user exists
    const user = await prisma.user.findFirst({
      where: {
        id: session.user.id,
        chapterId: chapterId
      }
    })

    if (!user) {
      return {
        success: false,
        error: 'User not found'
      }
    }

    // Serialize Date fields for client components
    const serializedUser = {
      ...user,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
      joinedAt: user.joinedAt?.toISOString() ?? null
    }

    return serializedUser
  } catch (error) {
    await createLog('error', 'Failed to fetch user by ID', {
      location: ['server action - getUserById'],
      message: error instanceof Error ? error.message : 'Unknown error',
      name: 'GetUserByIdError',
      timestamp: new Date().toISOString(),
      userId: session.user.id,
      error
    })

    return {
      success: false,
      error: 'Failed to fetch user'
    }
  }
}
