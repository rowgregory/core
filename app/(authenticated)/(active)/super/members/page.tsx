import { auth } from '@/app/lib/auth'
import { redirect } from 'next/navigation'
import prisma from '@/prisma/client'
import { chapterId } from '@/app/lib/constants/api/chapterId'
import SuperMembersClient from './SuperMembersClient'

export const dynamic = 'force-dynamic'

export default async function SuperMembersPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')
  if (session.user.role !== 'SUPER_USER') redirect('/dashboard')

  const members = await prisma.user.findMany({
    where: { chapterId, membershipStatus: 'ACTIVE' },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      lastLoginAt: true,
      membershipStatus: true,
      role: true,
      hasAnnualSubscription: true,
      hasQuarterlySubscription: true,
      profileImage: true,
      company: true,
      title: true
    },
    orderBy: { name: 'asc' }
  })

  return <SuperMembersClient members={members} />
}
