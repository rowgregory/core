import { createLog } from '@/app/lib/utils/api/createLog'
import { resend } from '@/app/lib/resend'
import prisma from '@/prisma/client'
import { NextRequest, NextResponse } from 'next/server'
import { presenterQueueTemplate } from '@/app/lib/email-templates/presenter-queue.template'
import { chapterId } from '@/app/lib/constants/api/chapterId'
import { countPastMeetingThursdays, toDateKey } from '@/app/lib/utils/presenter-engine'
import { fmtDate, getAllUpcomingThursdays } from '@/app/lib/utils/date.utils'

const BATCH_SIZE = 2
const DELAY_MS = 1000

async function sendPresenterQueue(req: NextRequest) {
  const BASE_URL =
    process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://coastal-referral-exchange.com'
  const normalizedUrl = `${BASE_URL}/api/cron/presenter-queue`

  try {
    const [members, queue, cancelledMeetings, visitorDays] = await Promise.all([
      prisma.user.findMany({
        where: { chapterId, membershipStatus: 'ACTIVE' },
        select: { id: true, name: true, email: true }
      }),
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

    const anchor = new Date('2026-04-09T12:00:00')
    const pastCount = countPastMeetingThursdays(anchor, cancelledDates, visitorDates)
    const startIndex = queue.length > 0 ? pastCount % queue.length : 0

    const sorted = [...queue].sort((a, b) => a.position - b.position)
    const rotated = [...sorted.slice(startIndex), ...sorted.slice(0, startIndex)]

    const allThursdays = getAllUpcomingThursdays(12)

    const schedule = allThursdays.slice(0, 8).map((dateStr, i) => {
      const isCancelled = cancelledDates.some((d) => toDateKey(new Date(d)) === dateStr)
      const isVisitor = visitorDates.some((d) => toDateKey(new Date(d)) === dateStr)

      if (isCancelled)
        return {
          name: 'No Meeting',
          company: 'Cancelled',
          date: fmtDate(`${dateStr}T12:00:00`),
          isNext: false,
          type: 'off' as const
        }
      if (isVisitor)
        return {
          name: 'Visitor Day',
          company: 'Open to guests',
          date: fmtDate(`${dateStr}T12:00:00`),
          isNext: false,
          type: 'visitor' as const
        }

      const presenterSlot =
        allThursdays.slice(0, i + 1).filter((d) => {
          return (
            !cancelledDates.some((c) => toDateKey(new Date(c)) === d) &&
            !visitorDates.some((v) => toDateKey(new Date(v)) === d)
          )
        }).length - 1

      const q = rotated[presenterSlot % rotated.length]
      return {
        name: q?.user.name ?? '',
        company: q?.user.company ?? '',
        date: fmtDate(`${dateStr}T12:00:00`),
        isNext: presenterSlot === 0,
        type: 'presenter' as const
      }
    })

    const results = []

    for (let i = 0; i < members.length; i += BATCH_SIZE) {
      const batch = members.slice(i, i + BATCH_SIZE)

      const batchResults = await Promise.all(
        batch.map(async (member) => {
          try {
            const result = await resend.emails.send({
              from: `Coastal Referral Exchange <noreply@coastal-referral-exchange.com>`,
              to: member.email,
              subject: `Presenter Schedule — This Week & Upcoming`,
              html: presenterQueueTemplate(
                member.name.split(' ')[0] || member.email.split('@')[0],
                schedule,
                `${BASE_URL}/dashboard`
              )
            })
            return { success: true, email: member.email, result }
          } catch (error) {
            return {
              success: false,
              email: member.email,
              error: error instanceof Error ? error.message : 'Unknown error'
            }
          }
        })
      )

      results.push(...batchResults)

      if (i + BATCH_SIZE < members.length) {
        await new Promise((resolve) => setTimeout(resolve, DELAY_MS))
      }
    }

    const successful = results.filter((r) => r.success).length
    const failed = results.filter((r) => !r.success).length
    const failedEmails = results.filter((r) => !r.success).map((r) => ({ email: r.email, error: r.error }))

    await createLog('info', `Presenter queue emails sent — ${successful}/${members.length}`, {
      location: ['app route - GET /api/cron/presenter-queue'],
      name: 'PresenterQueueEmailsSent',
      timestamp: new Date().toISOString(),
      url: normalizedUrl,
      method: req.method
    })

    if (failed > 0) {
      await createLog('error', `Some presenter queue emails failed`, {
        location: ['app route - GET /api/cron/presenter-queue'],
        name: 'PresenterQueueEmailsPartialFailure',
        timestamp: new Date().toISOString(),
        metadata: { failedCount: failed, failures: failedEmails }
      })
    }

    return NextResponse.json({ success: true, sent: successful, failed })
  } catch (error: any) {
    await createLog('error', `Presenter queue cron failed`, {
      location: ['app route - GET /api/cron/presenter-queue'],
      name: 'PresenterQueueCronError',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : String(error)
    })
    return NextResponse.json({ success: false, error: 'Failed to send presenter queue emails' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  return sendPresenterQueue(req)
}

export async function POST(req: NextRequest) {
  return sendPresenterQueue(req)
}
