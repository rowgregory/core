'use server'

import prisma from '@/prisma/client'
import { chapterId } from '@/app/lib/constants/api/chapterId'

export async function getMemberProfile(userId: string) {
  if (!userId) return null

  const user = await prisma.user.findFirst({
    where: { id: userId, chapterId },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      company: true,
      industry: true,
      website: true,
      title: true,
      businessLicenseNumber: true,
      yearsInBusiness: true,
      bio: true,
      profileImage: true,
      isPublic: true,
      goal: true,
      location: true,
      weeklyTreasureWishlist: true,
      facebookUrl: true,
      threadsUrl: true,
      youtubeUrl: true,
      xUrl: true,
      linkedInUrl: true
    }
  })

  return user ?? null
}
