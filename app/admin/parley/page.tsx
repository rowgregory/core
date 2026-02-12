import AdminParleysClient from '@/app/components/pages/AdminParleysClient'
import { getParleys } from '@/app/lib/actions/getParleys'

export default async function AdminParleysPage() {
  const data = await getParleys()
  return <AdminParleysClient data={data} />
}
