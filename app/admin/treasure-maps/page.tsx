import AdminTreasureMapsClient from '@/app/components/pages/AdminTreasureMapsClient'
import { getTreasureMaps } from '@/app/lib/actions/getTreasureMaps'

export default async function AdminTreasureMapsPage() {
  const data = await getTreasureMaps()
  return <AdminTreasureMapsClient data={data} />
}
