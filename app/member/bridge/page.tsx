import MemberBridgeClient from '@/app/components/pages/MemberBridgeClient'
import { getMemberBridge } from '@/app/lib/actions/getMemberBridge'

export default async function MemberBridgePage() {
  const data = await getMemberBridge()
  return <MemberBridgeClient data={data} />
}
