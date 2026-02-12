import MemberTreasureMapsClient from '@/app/components/pages/MemberTreasureMapsClient'
import { getTreasureMapsById } from '@/app/lib/actions/getTreasureMapsById'

export default async function MemberTreasureMapsPage() {
  const data = await getTreasureMapsById()
  return <MemberTreasureMapsClient data={data} />
}
