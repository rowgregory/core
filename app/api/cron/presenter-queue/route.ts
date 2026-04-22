import { NextResponse } from 'next/server'
import prisma from '@/prisma/client'
import { chapterId } from '@/app/lib/constants/api/chapterId'
import { fmtDate } from '@/app/lib/utils/date.utils'
import { getPresenterSchedule } from '@/app/lib/actions/presenter-queue/getPresenterSchedule'
import { presenterQueueTemplate } from '@/app/lib/email-templates/presenter-queue.template'
import { resend } from '@/app/lib/resend'

const BATCH_SIZE = 10

async function sendPresenterQueue() {
  const BASE_URL =
    process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://coastal-referral-exchange.com'

  //   const members = await prisma.user.findMany({
  //     where: { chapterId, membershipStatus: 'ACTIVE' },
  //     select: { id: true, name: true, email: true }
  //   })

  const members = [{ id: 'test', name: 'Sqysh', email: 'sqysh@sqysh.io' }]

  const scheduleRes = await getPresenterSchedule()
  const schedule = (scheduleRes.data ?? [])
    .filter((s) => s.type === 'presenter')
    .slice(0, 8)
    .map((s) => ({
      name: s.name,
      company: s.company,
      date: fmtDate(s.date),
      isNext: s.isNext
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
