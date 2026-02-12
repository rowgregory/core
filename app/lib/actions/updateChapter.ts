'use server'

import { revalidateTag } from 'next/cache'
import prisma from '@/prisma/client'
import { createLog } from '@/app/lib/utils/api/createLog'
import { auth } from '@/app/lib/auth'
import { chapterId } from '@/app/lib/constants/api/chapterId'

export async function updateChapter(data: {
  name?: string
  location?: string
  meetingDay?: string
  meetingTime?: string
  meetingFrequency?: string
  hasUnlockedBooty?: boolean
  hasUnlockedGrog?: boolean
  hasUnlockedMuster?: boolean
}) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return {
        success: false,
        error: 'Unauthorized'
      }
    }

    // Build update data object, only including provided fields
    const updateData: any = {
      updatedAt: new Date()
    }

    if (data.name !== undefined) {
      updateData.name = data.name
    }
    if (data.location !== undefined) {
      updateData.location = data.location
    }
    if (data.meetingDay !== undefined) {
      updateData.meetingDay = data.meetingDay
    }
    if (data.meetingTime !== undefined) {
      updateData.meetingTime = data.meetingTime
    }
    if (data.meetingFrequency !== undefined) {
      updateData.meetingFrequency = data.meetingFrequency
    }
    if (data.hasUnlockedBooty !== undefined) {
      updateData.hasUnlockedBooty = data.hasUnlockedBooty
    }
    if (data.hasUnlockedGrog !== undefined) {
      updateData.hasUnlockedGrog = data.hasUnlockedGrog
    }
    if (data.hasUnlockedMuster !== undefined) {
      updateData.hasUnlockedMuster = data.hasUnlockedMuster
    }

    // Update the chapter
    await prisma.chapter.update({
      where: { id: chapterId },
      data: updateData
    })

    await createLog('info', 'Chapter updated', {
      location: ['server action - updateChapter'],
      message: `Chapter ${chapterId} updated by user ${session.user.id}`,
      name: 'ChapterUpdated',
      timestamp: new Date().toISOString(),
      chapterId,
      userId: session.user.id
    })

    revalidateTag('Chapter', 'default')

    return {
      success: true,
      message: 'Chapter updated successfully'
    }
  } catch (error) {
    await createLog('error', 'Failed to update chapter', {
      location: ['server action - updateChapter'],
      message: error instanceof Error ? error.message : 'Unknown error',
      name: 'UpdateChapterError',
      timestamp: new Date().toISOString(),
      chapterId,
      error
    })

    return {
      success: false,
      error: 'Failed to update chapter'
    }
  }
}
