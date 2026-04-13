import { ScheduledPresenter } from '@/types/presenter-queue'
import { auth } from '../../auth'
import prisma from '@/prisma/client'
import { chapterId } from '../../constants/api/chapterId'
import { buildSchedule, countPastMeetingThursdays, getUpcomingMeetingDates } from '../../utils/presenter-engine'
import { getAllUpcomingThursdays } from '../../utils/date.utils'
import { toDateKey } from '../../utils/time.utils'

export async function getPresenterSchedule(): Promise<{
  success: boolean
  data?: ScheduledPresenter[]
  error?: string
}> {
  try {
    const session = await auth()
    if (!session?.user?.id) return { success: false, error: 'Unauthorized' }

    const [queue, cancelledMeetings, visitorDays] = await Promise.all([
      prisma.presenterQueue.findMany({
        where: { chapterId },
        orderBy: { position: 'asc' },
        select: {
          id: true,
          userId: true,
          position: true,
          createdAt: true,
          user: { select: { name: true, company: true, industry: true } }
        }
      }),
      prisma.cancelledMeeting.findMany({
        where: { chapterId },
        select: { date: true }
      }),
      prisma.visitorDay.findMany({
        where: { chapterId },
        select: { date: true }
      })
    ])

    if (!queue.length) return { success: true, data: [] }

    const cancelledDates = cancelledMeetings.map((m) => m.date.toISOString())
    const visitorDates = visitorDays.map((v) => v.date.toISOString())

    // Auto-calculate start index based on elapsed meeting Thursdays
    const queueStartedAt = queue[0].createdAt
    const pastMeetings = countPastMeetingThursdays(queueStartedAt, cancelledDates, visitorDates)
    const startIndex = pastMeetings % queue.length

    const dates = getUpcomingMeetingDates(cancelledDates, visitorDates, 52)
    const scheduled = buildSchedule(
      queue.map((q) => ({ userId: q.userId, name: q.user.name ?? '', position: q.position })),
      dates.map((d) => new Date(`${d}T12:00:00`)),
      startIndex
    )

    const allThursdays = getAllUpcomingThursdays(52)

    const data: ScheduledPresenter[] = allThursdays
      .slice(0, 24)
      .map((dateStr, i) => {
        const key = dateStr // already in YYYY-MM-DD format

        if (cancelledDates.some((d) => toDateKey(new Date(d)) === key)) {
          return {
            userId: null,
            name: 'No Meeting',
            company: 'Cancelled',
            date: `${dateStr}T12:00:00`,
            isNext: false,
            isYou: false,
            type: 'off' as const
          }
        }

        if (visitorDates.some((d) => toDateKey(new Date(d)) === key)) {
          return {
            userId: null,
            name: 'Visitor Day',
            company: 'Open to guests',
            date: `${dateStr}T12:00:00`,
            isNext: false,
            isYou: false,
            type: 'visitor_day' as const
          }
        }

        const presenterIndex =
          allThursdays.slice(0, i + 1).filter((d) => {
            return (
              !cancelledDates.some((c) => toDateKey(new Date(c)) === d) &&
              !visitorDates.some((v) => toDateKey(new Date(v)) === d)
            )
          }).length - 1

        const s = scheduled[presenterIndex % scheduled.length]
        if (!s) return null

        return {
          userId: s.userId,
          name: s.name,
          company: queue.find((q) => q.userId === s.userId)?.user.company ?? '',
          date: `${dateStr}T12:00:00`,
          isNext: presenterIndex === 0,
          isYou: s.userId === session.user.id,
          type: 'presenter' as const
        }
      })
      .filter(Boolean) as ScheduledPresenter[]
    return { success: true, data }
  } catch (error) {
    return { success: false, error: 'Failed to load presenter schedule' }
  }
}
