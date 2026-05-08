'use server'

import { auth } from '@/app/lib/auth'
import prisma from '@/prisma/client'
import { chapterId } from '../../constants/api/chapterId'
import { createLog } from '../../utils/api/createLog'

export async function toggleAttendance({
  date,
  userId,
  attended
}: {
  date: string // YYYY-MM-DD
  userId: string
  attended: boolean
}): Promise<{ success: boolean; error?: string }> {
  const session = await auth()
  if (!session?.user?.isSuperUser) return { success: false, error: 'Unauthorized' }

  try {
    const meetingDate = new Date(`${date}T00:00:00.000Z`)

    console.log('meeting date: ', meetingDate)
    console.log('date: ', date)

    const meeting = await prisma.meeting.upsert({
      where: { chapterId_date: { chapterId, date: meetingDate } },
      create: { chapterId, date: meetingDate },
      update: {},
      select: { id: true }
    })

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { name: true }
    })

    if (attended) {
      // Remove attendance
      await prisma.attendance.deleteMany({
        where: { meetingId: meeting.id, userId }
      })
      await createLog('info', `${session.user.name} removed attendance for ${user?.name} on ${date}`, {
        action: 'TOGGLE_ATTENDANCE',
        userId,
        date,
        attended: false
      })
    } else {
      // Add attendance
      await prisma.attendance.upsert({
        where: { meetingId_userId: { meetingId: meeting.id, userId } },
        create: { meetingId: meeting.id, userId },
        update: {}
      })
      await createLog('info', `${session.user.name} marked ${user?.name} as attended on ${date}`, {
        action: 'TOGGLE_ATTENDANCE',
        userId,
        date,
        attended: true
      })
    }

    return { success: true }
  } catch (err) {
    console.error('[toggleAttendance]', err)
    return { success: false, error: 'Failed to toggle attendance' }
  }
}
