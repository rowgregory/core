'use server'

import prisma from '@/prisma/client'
import { createLog } from '@/app/lib/utils/api/createLog'
import { chapterId } from '@/app/lib/constants/api/chapterId'

export async function getNavigatorProfile(userId: string) {
  try {
    if (!userId) {
      return null
    }

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
      return null
    }

    return {
      ...user,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
      joinedAt: user.joinedAt?.toISOString() ?? null,
      expiresAt: user.expiresAt?.toISOString() ?? null,
      lastLoginAt: user.lastLoginAt?.toISOString() ?? null
    }
  } catch (error) {
    await createLog('error', 'Failed to fetch navigator profile', {
      location: ['server action - getNavigatorProfile'],
      message: error instanceof Error ? error.message : 'Unknown error',
      name: 'GetNavigatorProfileError',
      timestamp: new Date().toISOString(),
      userId,
      error
    })

    return null
  }
}
