import NavigatorsClient from '@/app/components/pages/NavigatorsClient'
import { getUsers } from '@/app/lib/actions/getUsers'

export default async function AdminNavigatorsPage() {
  const data = await getUsers()
  return <NavigatorsClient data={data} />
}
