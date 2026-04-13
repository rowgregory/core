'use server'

import prisma from '@/prisma/client'
import { auth } from '../../auth'
import { MembershipStatus } from '@/types/user'
import { createLog } from '../../utils/api/createLog'

export async function updateMember(
  userId: string,
  data: {
    name?: string
    phone?: string | null
    company?: string
    secondaryEmail?: string
    title?: string
    isPublic?: boolean
    isAdmin?: boolean
    isMembership?: boolean
    membershipStatus?: MembershipStatus
    profileImage?: string | null
    profileImageFilename?: string | null
    yearsInBusiness?: string | null
  }
): Promise<{ success: boolean; error?: string }> {
  try {
    const session = await auth()
    if (!session?.user?.id) return { success: false, error: 'Unauthorized' }

    await prisma.user.update({
      where: { id: userId },
      data: {
        name: data.name ?? undefined,
        phone: data.phone ?? undefined,
        company: data.company ?? undefined,
        secondaryEmail: data.secondaryEmail ?? undefined,
        title: data.title ?? undefined,
        isPublic: data.isPublic ?? undefined,
        isAdmin: data.isAdmin ?? undefined,
        isMembership: data.isMembership ?? undefined,
        membershipStatus: data.membershipStatus ?? undefined,
        profileImage: data.profileImage ?? undefined,
        profileImageFilename: data.profileImageFilename ?? undefined,
        yearsInBusiness: data.yearsInBusiness ?? undefined
      }
    })

    await createLog('info', 'Member updated by superuser', {
      location: ['server action - updateMember'],
      message: `Superuser updated member ${userId}`,
      name: 'SuperMemberUpdated',
      timestamp: new Date().toISOString()
    })

    return { success: true }
  } catch (error) {
    await createLog('error', 'Failed to update member', {
      location: ['server action - updateMember'],
      message: error instanceof Error ? error.message : 'Unknown error',
      name: 'SuperMemberUpdateError',
      timestamp: new Date().toISOString(),
      error
    })
    return { success: false, error: 'Failed to update member' }
  }
}
