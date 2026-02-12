'use server'

import prisma from '@/prisma/client'
import { createLog } from '@/app/lib/utils/api/createLog'
import { auth } from '@/app/lib/auth'
import { chapterId } from '@/app/lib/constants/api/chapterId'

export async function getChapter() {
  try {
    const session = await auth()

    if (!session?.user) {
      return {
        success: false,
        error: 'Unauthorized'
      }
    }

    // Get chapter with settings
    const chapter = await prisma.chapter.findUnique({
      where: { id: chapterId },
      select: {
        id: true,
        name: true,
        location: true,
        meetingDay: true,
        meetingTime: true,
        meetingFrequency: true,
        createdAt: true,
        updatedAt: true
      }
    })

    if (!chapter) {
      return {
        success: false,
        error: 'Chapter not found'
      }
    }

    // Serialize Date fields for client components
    const serializedChapter = {
      ...chapter,
      createdAt: chapter.createdAt.toISOString(),
      updatedAt: chapter.updatedAt.toISOString()
    }

    await createLog('info', 'Chapter settings retrieved successfully', {
      location: ['server action - getChapterSettings'],
      message: 'Chapter settings retrieved successfully',
      name: 'ChapterSettingsRetrieved',
      timestamp: new Date().toISOString(),
      chapterId
    })

    return {
      success: true,
      settings: serializedChapter
    }
  } catch (error) {
    await createLog('error', 'Failed to get chapter settings', {
      location: ['server action - getChapterSettings'],
      message: error instanceof Error ? error.message : 'Unknown error',
      name: 'GetChapterSettingsError',
      timestamp: new Date().toISOString(),
      error
    })

    return {
      success: false,
      error: 'Failed to get chapter settings'
    }
  }
}
