import AdminBridgeClient from '@/app/components/pages/AdminBridgeClient'
import { getAdminOverview } from '@/app/lib/actions/getAdminOverview'

export default async function AdminBridgePage() {
  const data = await getAdminOverview()
  return <AdminBridgeClient data={data} />
}
