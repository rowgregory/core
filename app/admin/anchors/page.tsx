import AdminAnchorsClient from '@/app/components/pages/AdminAnchorsClient'
import { getAnchors } from '@/app/lib/actions/getAnchors'

export default async function AdminAnchorsPage() {
  const data = await getAnchors()
  return <AdminAnchorsClient data={data} />
}
