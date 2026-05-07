'use server'

import { auth } from '@/app/lib/auth'
import prisma from '@/prisma/client'
import { chapterId } from '../../constants/api/chapterId'
import { pusher } from '../../pusher'
import { createLog } from '../../utils/api/createLog'
import { toDateKey } from '../../utils/time.utils'

export async function checkIn(): Promise<{
  success: boolean
  alreadyCheckedIn?: boolean
  error?: string
}> {
  const session = await auth()
  if (!session?.user?.id) return { success: false, error: 'Unauthorized' }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, name: true, company: true }
    })

    if (!user) return { success: false, error: 'User not found' }

    // Get or create today's meeting
    const today = new Date()
    const start = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    // const end = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1)

    const meeting = await prisma.meeting.upsert({
      where: { chapterId_date: { chapterId, date: start } },
      create: { chapterId, date: start },
      update: {},
      select: { id: true }
    })

    // Check if already checked in
    const existing = await prisma.attendance.findUnique({
      where: { meetingId_userId: { meetingId: meeting.id, userId: user.id } }
    })

    if (existing) {
      return { success: true, alreadyCheckedIn: true }
    }

    // Create attendance record
    await prisma.attendance.create({
      data: { meetingId: meeting.id, userId: user.id }
    })

    // Broadcast to TV
    await pusher.trigger('meeting-attendance', 'check-in', {
      userId: user.id,
      name: user.name,
      company: user.company
    })

    await createLog('info', `${user.name} checked in`, {
      action: 'CHECK_IN',
      userId: user.id,
      date: toDateKey(start)
    })

    return { success: true, alreadyCheckedIn: false }
  } catch (err) {
    console.error('[checkIn]', err)
    return { success: false, error: 'Failed to check in. Please try again.' }
  }
}
