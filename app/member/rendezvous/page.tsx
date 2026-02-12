import RendezvousClient from '@/app/components/pages/RendezvousClient'
import { getRendezvous } from '@/app/lib/actions/getRendezvous'

export default async function MemberRendezvousPage() {
  const data = await getRendezvous()
  return <RendezvousClient data={data} />
}
