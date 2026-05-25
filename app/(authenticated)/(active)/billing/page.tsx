import { getBillingData } from '@/app/lib/actions/user/getBillingData'
import BillingClient from './BillingClient'

export default async function BillingPage() {
  const result = await getBillingData()

  return <BillingClient {...result.data} />
}
