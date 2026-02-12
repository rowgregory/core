import MemberAnchorsClient from '@/app/components/pages/MemberAnchorsClient'
import { getAnchorsById } from '@/app/lib/actions/getAnchorsById'

export default async function MemberAnchorsPage() {
  const data = await getAnchorsById()
  return <MemberAnchorsClient data={data} />
}
