import PublicMemberClient from '@/app/components/pages/PublicMemberClient'
import { getMemberProfile } from '@/app/lib/actions/getMemberProfile'
import { getUsers } from '@/app/lib/actions/getUsers'

export default async function PublicMemberPage({ params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params
  const [user, users] = await Promise.all([getMemberProfile(userId), getUsers()])
  return <PublicMemberClient user={user} users={users?.data} />
}
