'use server'

import ApplicationConfirmationClient from '@/app/components/pages/ApplicationConfirmationClient'
import { getApplicant } from '@/app/lib/actions/getApplicant'

export default async function ApplicationConfirmationPage({ params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params
  const result = await getApplicant(userId)

  return <ApplicationConfirmationClient application={result.data} />
}
