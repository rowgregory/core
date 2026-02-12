'use server'

import SwabbiePortClient from '@/app/components/pages/SwabbiePortClient'
import { getSwabbie } from '@/app/lib/actions/getSwabbie'

interface SwabbiePortPageProps {
  searchParams: Promise<{ swabbieId: string }>
}

export default async function SwabbiePortPage({ searchParams }: SwabbiePortPageProps) {
  const { swabbieId } = await searchParams

  if (!swabbieId) {
    return null
  }

  const data = await getSwabbie(swabbieId)

  if (!data) {
    return null
  }

  return <SwabbiePortClient data={data} />
}
