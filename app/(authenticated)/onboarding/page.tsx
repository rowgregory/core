'use server'

import { redirect } from 'next/navigation'
import { auth } from '@/app/lib/auth'
// import prisma from '@/prisma/client'
import OnboardingClient from '@/app/components/pages/OnboardingClient'

export default async function OnboardingPage() {
  const session = await auth()
  if (!session?.user) redirect('/auth/login')

  //   const user = await prisma.user.findUnique({
  //     where: { id: session.user.id },
  //     select: { name: true, hasCompletedOnboarding: true, membershipStatus: true }
  //   })

  //   if (!user || user.membershipStatus !== 'ACTIVE') redirect('/auth/login')
  //   if (user.hasCompletedOnboarding) redirect('/dashboard')

  const firstName = session.user.name.split(' ')[0]

  return <OnboardingClient firstName={firstName} />
}
