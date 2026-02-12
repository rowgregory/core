import BeaconClient from '@/app/components/pages/BeaconClient'
import { getUserById } from '@/app/lib/actions/getUserById'

export default async function AdminBeaconPage() {
  const data = await getUserById()
  return <BeaconClient data={data} />
}
