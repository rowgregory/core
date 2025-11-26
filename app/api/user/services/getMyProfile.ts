import { sliceUser } from '@/app/lib/constants/api/sliceNames'
import { handleApiError } from '@/app/lib/utils/api/handleApiError'
import prisma from '@/prisma/client'
import { NextRequest, NextResponse } from 'next/server'

export async function getMyProfile(req: NextRequest, chapterId: string, userId: string) {
  try {
    // Validate chapter ID
    if (!chapterId) {
      return NextResponse.json({ error: 'Chapter ID is required' }, { status: 400 })
    }

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

        // NEW: Professional Goals & Media
        goal: true,
        collage: true,
        coverImage: true,
        coverImageFilename: true,

        // NEW: Social Media & Online Presence
        facebookUrl: true,
        threadsUrl: true,
        youtubeUrl: true,
        xUrl: true,
        linkedInUrl: true,
        portfolioUrl: true,

        // NEW: Content & Communication
        posts: true,
        podcasts: true,

        // NEW: Skills & Professional Development
        skills: true,
        careerAchievements: true,
        learningGoals: true,

        // NEW: Services & Professional Network
        servicesOffered: true,
        professionalAssociations: true,
        professionalBooks: true,

        // NEW: Projects & Expertise Sharing
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
      return NextResponse.json(
        {
          error: 'User profile not found in this chapter'
        },
        { status: 404 }
      )
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

    return NextResponse.json(
      {
        user: {
          ...user,
          // Add computed fields
          isProfileComplete,
          membershipDays,
          isExpiringSoon
        },
        meta: {
          chapterId,
          lastUpdated: user.updatedAt,
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
            expiresAt: user.expiresAt,
            isExpiringWithin30Days: isExpiringSoon
          }
        }
      },
      { status: 200 }
    )
  } catch (error: any) {
    return await handleApiError({
      error,
      req,
      action: 'Get my profile',
      sliceName: sliceUser
    })
  }
}
