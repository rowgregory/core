import { NextResponse } from 'next/server'
import prisma from '@/prisma/client'
import { chapterId } from '@/app/lib/constants/api/chapterId'
import { fmtDate } from '@/app/lib/utils/date.utils'
import { presenterQueueTemplate } from '@/app/lib/email-templates/presenter-queue.template'
import { resend } from '@/app/lib/resend'
import { countPastMeetingThursdays, getUpcomingMeetingDates } from '@/app/lib/utils/presenter-engine'

const BATCH_SIZE = 10

async function sendPresenterQueue() {
  const BASE_URL =
    process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://coastal-referral-exchange.com'

  //   const members = await prisma.user.findMany({
  //     where: { chapterId, membershipStatus: 'ACTIVE' },
  //     select: { id: true, name: true, email: true }
  //   })

  const members = [{ id: 'test', name: 'Sqysh', email: 'sqysh@sqysh.io' }]

  // Replace getPresenterSchedule() call with direct query
  const [queue, cancelledMeetings, visitorDays] = await Promise.all([
    prisma.presenterQueue.findMany({
      where: { chapterId },
      orderBy: { position: 'asc' },
      select: {
        userId: true,
        position: true,
        user: { select: { name: true, company: true } }
      }
    }),
    prisma.cancelledMeeting.findMany({ where: { chapterId }, select: { date: true } }),
    prisma.visitorDay.findMany({ where: { chapterId }, select: { date: true } })
  ])

  const cancelledDates = cancelledMeetings.map((m) => m.date.toISOString())
  const visitorDates = visitorDays.map((v) => v.date.toISOString())
  const dates = getUpcomingMeetingDates(cancelledDates, visitorDates, queue.length + 20)

  const anchor = new Date('2026-04-09T12:00:00')
  const pastCount = countPastMeetingThursdays(anchor, cancelledDates, visitorDates)
  const startIndex = queue.length > 0 ? pastCount % queue.length : 0

  const sorted = [...queue].sort((a, b) => a.position - b.position)
  const rotated = [...sorted.slice(startIndex), ...sorted.slice(0, startIndex)]

  const schedule = rotated.slice(0, 8).map((q, i) => ({
    name: q.user.name ?? '',
    company: q.user.company ?? '',
    date: fmtDate(dates[i] ?? ''),
    isNext: i === 0
  }))

  let sent = 0

  for (let i = 0; i < members.length; i += BATCH_SIZE) {
    const batch = members.slice(i, i + BATCH_SIZE)

    await Promise.all(
      batch.map((member) =>
        resend.emails.send({
          from: `Coastal Referral Exchange <noreply@coastal-referral-exchange.com>`,
          to: [member.email],
          subject: `Presenter Schedule — This Week & Upcoming`,
          html: presenterQueueTemplate(member.name.split(' ')[0], schedule, `${BASE_URL}/dashboard`)
        })
      )
    )

    sent += batch.length
  }

  return NextResponse.json({ success: true, sent })
}

// Handle both GET (cron) and POST (manual trigger)
export async function GET() {
  return sendPresenterQueue()
}

export async function POST() {
  return sendPresenterQueue()
}
