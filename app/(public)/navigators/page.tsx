'use server'

import PublicNavigatorsClient from '@/app/components/pages/PublicNavigatorsClient'
import { getUsers } from '@/app/lib/actions/getUsers'

export default async function PublicNavigatorsPage() {
  const data = await getUsers()
  return <PublicNavigatorsClient data={data} />
}
