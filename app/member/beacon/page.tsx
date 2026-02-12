import BeaconClient from '@/app/components/pages/BeaconClient'
import { getUserById } from '@/app/lib/actions/getUserById'

export default async function MemberBeaconPage() {
  const data = await getUserById()
  return <BeaconClient data={data} />
}
