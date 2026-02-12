'use server'

import prisma from '@/prisma/client'
import { createLog } from '@/app/lib/utils/api/createLog'
import { auth } from '@/app/lib/auth'
import { chapterId } from '@/app/lib/constants/api/chapterId'

export async function getMyProfile() {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return {
        success: false,
        error: 'Unauthorized'
      }
    }

    const userId = session.user.id

    // Get user profile data
    const user = await prisma.user.findFirst({
      where: {
        id: userId,
        chapterId: chapterId
      },
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
        role: true,
        interests: true,
        profileImage: true,
        profileImageFilename: true,
        isPublic: true,
        isActive: true,
        membershipStatus: true,
        joinedAt: true,
        expiresAt: true,
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true,
        isAdmin: true,
        isMembership: true,
        isSuperUser: true,
        isLicensed: true,

        // Professional Goals & Media
        goal: true,
        collage: true,
        coverImage: true,
        coverImageFilename: true,

        // Social Media & Online Presence
        facebookUrl: true,
        threadsUrl: true,
        youtubeUrl: true,
        xUrl: true,
        linkedInUrl: true,
        portfolioUrl: true,

        // Content & Communication
        posts: true,
        podcasts: true,

        // Skills & Professional Development
        skills: true,
        careerAchievements: true,
        learningGoals: true,

        // Services & Professional Network
        servicesOffered: true,
        professionalAssociations: true,
        professionalBooks: true,

        // Projects & Expertise Sharing
        sideProjects: true,
        askMeAbout: true,

        chapter: {
          select: {
            id: true,
            name: true,
            location: true,
            hasUnlockedMuster: true,
            hasUnlockedBooty: true,
            hasUnlockedGrog: true
          }
        }
      }
    })

    if (!user) {
      return {
        success: false,
        error: 'User profile not found in this chapter'
      }
    }

    // Check if user profile is complete
    const isProfileComplete = !!(
      user.name?.trim() &&
      user.email?.trim() &&
      user.company?.trim() &&
      user.industry?.trim()
    )

    // Calculate membership days
    const membershipDays = user.joinedAt
      ? Math.floor((new Date().getTime() - new Date(user.joinedAt).getTime()) / (1000 * 60 * 60 * 24))
      : 0

    // Check if membership is expiring soon (within 30 days)
    const isExpiringSoon = user.expiresAt
      ? Math.floor((new Date(user.expiresAt).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) <= 30
      : false

    // Serialize Date fields for client components
    const serializedUser = {
      ...user,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
      joinedAt: user.joinedAt?.toISOString() ?? null,
      expiresAt: user.expiresAt?.toISOString() ?? null,
      lastLoginAt: user.lastLoginAt?.toISOString() ?? null,
      // Add computed fields
      isProfileComplete,
      membershipDays,
      isExpiringSoon
    }

    return {
      success: true,
      user: serializedUser,
      meta: {
        chapterId,
        lastUpdated: user.updatedAt.toISOString(),
        profileCompleteness: {
          isComplete: isProfileComplete,
          missingFields: [
            !user.name?.trim() && 'name',
            !user.company?.trim() && 'company',
            !user.industry?.trim() && 'industry',
            !user.phone?.trim() && 'phone'
          ].filter(Boolean)
        },
        membership: {
          status: user.membershipStatus,
          joinedDaysAgo: membershipDays,
          expiresAt: user.expiresAt?.toISOString() ?? null,
          isExpiringWithin30Days: isExpiringSoon
        }
      }
    }
  } catch (error) {
    await createLog('error', 'Failed to fetch user profile', {
      location: ['server action - getMyProfile'],
      message: error instanceof Error ? error.message : 'Unknown error',
      name: 'GetMyProfileError',
      timestamp: new Date().toISOString(),
      error
    })

    return {
      success: false,
      error: 'Failed to fetch user profile'
    }
  }
}
