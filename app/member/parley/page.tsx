import MemberParleysClient from '@/app/components/pages/MemberParleysClient'
import { getParleysById } from '@/app/lib/actions/getParleysById'

export default async function MemberParleysPage() {
  const data = await getParleysById()
  return <MemberParleysClient data={data} />
}
