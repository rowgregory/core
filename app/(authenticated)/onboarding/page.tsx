'use server'

import { redirect } from 'next/navigation'
import { auth } from '@/app/lib/auth'
import OnboardingClient from './OnboardingClient'
import prisma from '@/prisma/client'

export default async function OnboardingPage() {
  const session = await auth()
  if (!session?.user) redirect('/login')

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { hasAnnualSubscription: true, hasQuarterlySubscription: true, membershipStatus: true }
  })

  // Already fully set up active members shouldn't be here
  if (user?.hasAnnualSubscription && user?.hasQuarterlySubscription && user?.membershipStatus === 'ACTIVE') {
    redirect('/dashboard')
  }

  return <OnboardingClient />
}
