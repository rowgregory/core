import { adminIndustrySlotFactory } from '@/app/lib/utils/api/admin/adminIndustrySlotFactory'
import { adminSessionFactory } from '@/app/lib/utils/api/admin/adminSessionFactory'
import { adminStatCardFactory } from '@/app/lib/utils/api/admin/adminStatCardFactory'
import { adminWeeklyActivityFactory } from '@/app/lib/utils/api/admin/adminWeeklyActivityFactory'
import prisma from '@/prisma/client'
import { NextResponse } from 'next/server'
import { chapterId } from '../lib/constants/api/chapterId'
import { auth } from '../lib/auth'
import serializePrisma from '../lib/utils/common/serializePrisma'

export async function getAdminOverview() {
  try {
    const session = await auth()

    const where: any = {}

    if (chapterId) {
      where.chapterId = chapterId
    }

    const anchors = await prisma.anchor.findMany({
      where,
      include: {
        chapter: {
          select: {
            id: true,
            name: true
          }
        },
        giver: {
          select: {
            id: true,
            name: true,
            email: true,
            company: true,
            profileImage: true
          }
        },
        receiver: {
          select: {
            id: true,
            name: true,
            email: true,
            company: true,
            profileImage: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    const { totalMembers, totalMembersChange } = await adminStatCardFactory.card.member()
    const { totalRevenue, totalRevenueChange } = await adminStatCardFactory.card.revenue()
    const { conversionChangePercent, conversionRate } = await adminStatCardFactory.card.conversion()
    const { chapterHealth, healthChangePercent } = await adminStatCardFactory.card.health()
    const { memberRetention, retentionChangePercent } = await adminStatCardFactory.card.retention()
    const { parleysChangePercent, totalParleys } = await adminStatCardFactory.card.parley()
    const { anchorsChangePercent, totalAnchors } = await adminStatCardFactory.card.anchor()
    const { totalTreasureMaps, treasureMapsChangePercent } = await adminStatCardFactory.card.treasureMap()

    const { weeklyActivity } = await adminWeeklyActivityFactory.chart()

    const { industrySlots, capacityPercent, activeUsersCount } = await adminIndustrySlotFactory.slots()

    const { participationPercent } = await adminSessionFactory.participation()
    const { buckets } = await adminSessionFactory.engagement()
    const { topPerformers } = await adminSessionFactory.topPerformers()
    const { newApplicationsCount, parleyRequestsCount } = await adminSessionFactory.output()

    const grogs = await prisma.grog.findMany({
      where,
      include: {
        chapter: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    const parleys = await prisma.parley.findMany({
      where,
      include: {
        chapter: {
          select: {
            id: true,
            name: true
          }
        },
        requester: {
          select: {
            id: true,
            name: true,
            email: true,
            company: true,
            profileImage: true
          }
        },
        recipient: {
          select: {
            id: true,
            name: true,
            email: true,
            company: true,
            profileImage: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    const rendezvous = await prisma.rendezvous.findMany({
      where,
      include: {
        chapter: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    const chapter = await prisma.chapter.findUnique({
      where: { id: chapterId },
      select: {
        id: true,
        name: true,
        location: true,
        meetingDay: true,
        meetingTime: true,
        meetingFrequency: true,
        createdAt: true,
        updatedAt: true
      }
    })

    const treasureMaps = await prisma.treasureMap.findMany({
      where,
      include: {
        chapter: {
          select: {
            id: true,
            name: true
          }
        },
        giver: {
          select: {
            id: true,
            name: true,
            email: true,
            company: true,
            profileImage: true
          }
        },
        receiver: {
          select: {
            id: true,
            name: true,
            email: true,
            company: true,
            profileImage: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    const user = await prisma.user.findFirst({
      where: {
        id: session?.user.id,
        chapterId
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

        weeklyTreasureWishlist: true,

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

    const serializedAnchors = serializePrisma(anchors)
    const serializedParleys = serializePrisma(parleys)
    const serializedRendezvous = serializePrisma(rendezvous)
    const serializedTreasureMaps = serializePrisma(treasureMaps)
    const serializedGrogs = serializePrisma(grogs)
    const serializedTotalRevenue = serializePrisma(totalRevenue)

    return {
      anchors: serializedAnchors,
      totalMembers,
      totalMembersChange,
      totalRevenue: Number(serializedTotalRevenue),
      totalRevenueChange,
      conversionRate,
      conversionChangePercent,
      chapterHealth,
      healthChangePercent,
      memberRetention,
      retentionChangePercent,
      totalParleys,
      parleysChangePercent,
      totalAnchors,
      anchorsChangePercent,
      totalTreasureMaps,
      treasureMapsChangePercent,
      weeklyActivity,
      industrySlots,
      capacityPercent,
      activeUsersCount,
      participationPercent,
      buckets,
      topPerformers,
      newApplicationsCount,
      parleyRequestsCount,
      grogs: serializedGrogs,
      parleys: serializedParleys,
      rendezvous: serializedRendezvous,
      chapter,
      treasureMaps: serializedTreasureMaps,
      user: {
        ...user,
        isProfileComplete,
        membershipDays,
        isExpiringSoon,
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
      }
    }
  } catch {
    return {
      error: 'Internal server error',
      message: 'Something went wrong while fetching admin overview',
      status: 500
    }
  }
}
