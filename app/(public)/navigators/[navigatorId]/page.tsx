import PublicNavigatorClient from '@/app/components/pages/PublicNavigatorClient'
import { getNavigatorProfile } from '@/app/lib/actions/getNavigatorProfile'
import { getUsers } from '@/app/lib/actions/getUsers'

interface NavigatorPageProps {
  params: Promise<{ navigatorId: string }>
}

export default async function NavigatorPage({ params }: NavigatorPageProps) {
  const { navigatorId } = await params
  const data = await getNavigatorProfile(navigatorId)
  const users = await getUsers()

  if (!data) {
    return null
  }

  return <PublicNavigatorClient user={data} users={users} />
}
