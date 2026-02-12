import ApplicationsClient from '@/app/components/pages/ApplicationsClient'
import { getUsers } from '@/app/lib/actions/getUsers'

export default async function MemberApplicationsPage() {
  const data = await getUsers()
  return <ApplicationsClient data={data} />
}
