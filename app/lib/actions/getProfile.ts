import { ProfileData } from '@/types/user'
import { auth } from '../auth'
import prisma from '@/prisma/client'

export async function getProfile(): Promise<{ success: boolean; data?: ProfileData; error?: string }> {
  try {
    const session = await auth()
    if (!session?.user?.id) return { success: false, error: 'Unauthorized' }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        name: true,
        email: true,
        secondaryEmail: true,
        phone: true,
        company: true,
        isPublic: true,
        profileImage: true,
        profileImageFilename: true,
        location: true,
        bio: true,
        businessLicenseNumber: true,
        industry: true,
        title: true,
        website: true,
        yearsInBusiness: true,
        facebookUrl: true,
        goal: true,
        linkedInUrl: true,
        threadsUrl: true,
        xUrl: true,
        youtubeUrl: true,
        weeklyTreasureWishlist: true
      }
    })

    if (!user) return { success: false, error: 'User not found' }

    return {
      success: true,
      data: {
        name: user.name,
        email: user.email,
        secondaryEmail: user.secondaryEmail ?? '',
        phone: user.phone ?? '',
        company: user.company,
        isPublic: user.isPublic,
        profileImage: user.profileImage,
        profileImageFilename: user.profileImageFilename,
        location: user.location ?? '',
        bio: user.bio ?? '',
        businessLicenseNumber: user.businessLicenseNumber ?? '',
        industry: user.industry ?? '',
        title: user.title ?? '',
        website: user.website ?? '',
        yearsInBusiness: user.yearsInBusiness ?? '',
        facebookUrl: user.facebookUrl ?? '',
        goal: user.goal ?? '',
        linkedInUrl: user.linkedInUrl ?? '',
        threadsUrl: user.threadsUrl ?? '',
        xUrl: user.xUrl ?? '',
        youtubeUrl: user.youtubeUrl ?? '',
        weeklyTreasureWishlist: user.weeklyTreasureWishlist ?? ''
      }
    }
  } catch (error) {
    return { success: false, error: 'Failed to load profile' }
  }
}
