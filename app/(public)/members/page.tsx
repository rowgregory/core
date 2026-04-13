'use server'

import { PublicMembersClient } from '@/app/components/pages/PublicMembersClient'
import { getUsers } from '@/app/lib/actions/getUsers'

export default async function PublicMembersPage() {
  const result = await getUsers()
  return <PublicMembersClient data={result?.data} />
}
