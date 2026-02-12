import StowawaysClient from '@/app/components/pages/StowawaysClient'
import { getStowaways } from '@/app/lib/actions/getStowaways'

export default async function AdminStowawaysPage() {
  const data = await getStowaways()
  return <StowawaysClient data={data} />
}
