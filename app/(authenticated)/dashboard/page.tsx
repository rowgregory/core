import { redirect } from 'next/navigation'
import { auth } from '@/app/lib/auth'
import DashboardClient from '@/app/components/pages/DashboardClient'
import { getDashboardData } from '@/app/lib/actions/getDashboardData'
import { getPresenterSchedule } from '@/app/lib/actions/presenter-queue/getPresenterSchedule'
import { getLinkedRecord } from '@/app/lib/actions/getLinkedRecord'
import { getEvents } from '@/app/lib/actions/event/getEvents'

export default async function DashboardPage({
  searchParams
}: {
  searchParams: Promise<{ action?: string; id?: string }>
}) {
  const session = await auth()
  if (!session?.user) redirect('/auth/login')

  const { action, id } = await searchParams

  const [result, schedule, linkedRecord, events] = await Promise.all([
    getDashboardData(),
    getPresenterSchedule(),
    action && id ? getLinkedRecord(action, id) : Promise.resolve(null),
    getEvents()
  ])

  if (!result.success || !result.data) {
    return (
      <div className="min-h-screen bg-bg-light dark:bg-bg-dark flex items-center justify-center px-4">
        <p className="font-nunito text-sm text-muted-light dark:text-muted-dark text-center">
          Unable to load your dashboard. Please refresh.
        </p>
      </div>
    )
  }

  const { currentUser, members, stats, recentActivity } = result.data

  return (
    <DashboardClient
      currentUser={currentUser}
      members={members}
      stats={stats}
      recentActivity={recentActivity}
      schedule={schedule.data}
      linkedRecord={linkedRecord}
      events={events?.data}
    />
  )
}
