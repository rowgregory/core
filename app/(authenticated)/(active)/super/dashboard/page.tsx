import { auth } from '@/app/lib/auth'
import { redirect } from 'next/navigation'
import prisma from '@/prisma/client'
import { chapterId } from '@/app/lib/constants/api/chapterId'
import SuperDashboardClient from './SuperDashboardClient'

export const dynamic = 'force-dynamic'

function sumBy(orders: { amount: number; type: string }[], type?: string) {
  return orders.filter((o) => !type || o.type === type).reduce((s, o) => s + o.amount, 0)
}

export default async function SuperDashboardPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')
  if (session.user.role !== 'SUPER_USER') redirect('/dashboard')

  const now = new Date()
  const quarterStart = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1)
  const yearStart = new Date(now.getFullYear(), 0, 1)

  const [allOrders, activeMembers, pendingApplicants] = await Promise.all([
    prisma.order.findMany({
      where: { chapterId, status: { in: ['ACTIVE', 'SCHEDULED', 'INCOMPLETE'] } },
      select: { amount: true, type: true, status: true, createdAt: true }
    }),
    prisma.user.count({ where: { chapterId, membershipStatus: 'ACTIVE' } }),
    prisma.user.count({ where: { chapterId, membershipStatus: 'PENDING', role: 'APPLICANT' } })
  ])

  const mapped = allOrders.map((o) => ({ ...o, amount: Number(o.amount) }))

  const byStatus = (status: string) => mapped.filter((o) => o.status === status)
  const inPeriod = (orders: typeof mapped, start: Date) => orders.filter((o) => new Date(o.createdAt) >= start)

  const active = byStatus('ACTIVE')
  const scheduled = byStatus('SCHEDULED')
  const incomplete = byStatus('INCOMPLETE')

  return (
    <SuperDashboardClient
      stats={{
        activeMembers,
        pendingApplicants,
        totalOrders: mapped.length,

        active: {
          total: sumBy(active),
          annual: sumBy(active, 'ANNUAL'),
          quarterly: sumBy(active, 'QUARTERLY'),
          ytd: sumBy(inPeriod(active, yearStart)),
          qtd: sumBy(inPeriod(active, quarterStart)),
          ytdAnnual: sumBy(inPeriod(active, yearStart), 'ANNUAL'),
          ytdQuarterly: sumBy(inPeriod(active, yearStart), 'QUARTERLY'),
          qtdAnnual: sumBy(inPeriod(active, quarterStart), 'ANNUAL'),
          qtdQuarterly: sumBy(inPeriod(active, quarterStart), 'QUARTERLY'),
          count: active.length
        },

        scheduled: {
          total: sumBy(scheduled),
          annual: sumBy(scheduled, 'ANNUAL'),
          quarterly: sumBy(scheduled, 'QUARTERLY'),
          ytd: sumBy(inPeriod(scheduled, yearStart)),
          qtd: sumBy(inPeriod(scheduled, quarterStart)),
          ytdAnnual: sumBy(inPeriod(scheduled, yearStart), 'ANNUAL'),
          ytdQuarterly: sumBy(inPeriod(scheduled, yearStart), 'QUARTERLY'),
          qtdAnnual: sumBy(inPeriod(scheduled, quarterStart), 'ANNUAL'),
          qtdQuarterly: sumBy(inPeriod(scheduled, quarterStart), 'QUARTERLY'),
          count: scheduled.length
        },

        incomplete: {
          total: sumBy(incomplete),
          annual: sumBy(incomplete, 'ANNUAL'),
          quarterly: sumBy(incomplete, 'QUARTERLY'),
          ytd: sumBy(inPeriod(incomplete, yearStart)),
          qtd: sumBy(inPeriod(incomplete, quarterStart)),
          ytdAnnual: sumBy(inPeriod(incomplete, yearStart), 'ANNUAL'),
          ytdQuarterly: sumBy(inPeriod(incomplete, yearStart), 'QUARTERLY'),
          qtdAnnual: sumBy(inPeriod(incomplete, quarterStart), 'ANNUAL'),
          qtdQuarterly: sumBy(inPeriod(incomplete, quarterStart), 'QUARTERLY'),
          count: incomplete.length
        },

        combined: {
          total: sumBy(mapped),
          annual: sumBy(mapped, 'ANNUAL'),
          quarterly: sumBy(mapped, 'QUARTERLY'),
          ytd: sumBy(inPeriod(mapped, yearStart)),
          qtd: sumBy(inPeriod(mapped, quarterStart)),
          ytdAnnual: sumBy(inPeriod(mapped, yearStart), 'ANNUAL'),
          ytdQuarterly: sumBy(inPeriod(mapped, yearStart), 'QUARTERLY'),
          qtdAnnual: sumBy(inPeriod(mapped, quarterStart), 'ANNUAL'),
          qtdQuarterly: sumBy(inPeriod(mapped, quarterStart), 'QUARTERLY'),
          count: mapped.length
        }
      }}
    />
  )
}
