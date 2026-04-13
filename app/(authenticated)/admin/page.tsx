import { redirect } from 'next/navigation'
import { auth } from '@/app/lib/auth'
import { getAdminDashboardData } from '@/app/lib/actions/getAdminDashboardData'
import AdminDashClient from '@/app/components/pages/AdminDashClient'

export default async function AdminDashPage() {
  const session = await auth()
  if (!session?.user) redirect('/auth/login')
  if (!session.user.isAdmin) redirect('/dashboard')

  const result = await getAdminDashboardData()

  if (!result.success || !result.data) {
    return (
      <div className="min-h-screen bg-bg-light dark:bg-bg-dark flex items-center justify-center px-4">
        <p className="font-nunito text-sm text-muted-light dark:text-muted-dark text-center">
          Unable to load dashboard. Please refresh.
        </p>
      </div>
    )
  }

  return <AdminDashClient data={result.data} />
}
