import { sliceSettings } from '@/app/lib/constants/api/sliceNames'
import { createLog } from '@/app/lib/utils/api/createLog'
import { handleApiError } from '@/app/lib/utils/api/handleApiError'
import prisma from '@/prisma/client'
import { NextRequest, NextResponse } from 'next/server'

export async function updateChapterSettings(req: NextRequest, chapterId: string) {
  try {
    // Validate chapter ID
    if (!chapterId) {
      await createLog('error', 'Chapter update failed - Missing chapter ID', {
        location: ['app route - PATCH /api/chapter/[chapterId]/settings'],
        message: 'Chapter update failed - Missing chapter ID',
        name: 'ChapterUpdateFailed',
        timestamp: new Date().toISOString(),
        url: req.url,
        method: req.method,
        error: 'Missing chapter ID parameter'
      })

      return NextResponse.json({ error: 'Chapter ID is required' }, { status: 400 })
    }

    // Parse request body
    const body = await req.json()
    const { name, location, meetingDay, meetingTime, meetingFrequency } = body

    // Validate required fields
    if (!name || !location || !meetingDay || !meetingTime || !meetingFrequency) {
      return NextResponse.json(
        { error: 'All fields are required: name, location, meetingDay, meetingTime, meetingFrequency' },
        { status: 400 }
      )
    }

    // Check if chapter exists
    const existingChapter = await prisma.chapter.findUnique({
      where: { id: chapterId }
    })

    if (!existingChapter) {
      return NextResponse.json({ error: 'Chapter not found' }, { status: 404 })
    }

    const updateData: any = {
      name: name.trim(),
      location: location.trim(),
      meetingDay,
      meetingTime,
      meetingFrequency
    }

    const updatedChapter = await prisma.chapter.update({
      where: { id: chapterId },
      data: updateData
    })

    await createLog('info', 'Chapter settings updated by admin', {
      location: ['app route - PUT /api/settings/<chapterId>'],
      message: 'Chapter settings updated by admin',
      name: 'ChapterSettingsUpdated',
      timestamp: new Date().toISOString(),
      url: req.url,
      method: req.method,
      chapterId,
      updatedFields: Object.keys(updateData).filter((key) => key !== 'updatedAt'),
      previousName: existingChapter.name,
      newName: updateData.name,
      previousLocation: existingChapter.location,
      newLocation: updateData.location
    })

    return NextResponse.json(
      {
        message: 'Chapter settings updated successfully',
        chapter: updatedChapter
      },
      { status: 200 }
    )
  } catch (error: any) {
    return await handleApiError({
      error,
      req,
      action: 'Chapter settings updated',
      sliceName: sliceSettings
    })
  }
}
