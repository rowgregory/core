import { auth } from '../auth'
import { memberStatCardFactory } from '../utils/api/member/memberStatCardFactory'
import { memberWeeklyActivityFactory } from '../utils/api/member/memberWeeklyActivityFactory'
import { memberSessionFactory } from '../utils/api/member/memberSessionFactory'
// import prisma from '@/prisma/client'
// import { chapterId } from '../constants/api/chapterId'
import serializePrisma from '../utils/common/serializePrisma'

export async function getMemberBridge() {
  try {
    const session = await auth()
    const id = session?.user.id || ''

    const { totalRevenue, totalRevenueChange } = await memberStatCardFactory.card.revenue(id)
    const { parleysChangePercent, totalParleys } = await memberStatCardFactory.card.parley(id)
    const { anchorsChangePercent, totalAnchors } = await memberStatCardFactory.card.anchor(id)
    const { totalTreasureMaps, treasureMapsChangePercent } = await memberStatCardFactory.card.treasureMap(id)

    const { weeklyActivity } = await memberWeeklyActivityFactory.chart(id)

    const { participationPercent } = await memberSessionFactory.participation(id)
    const { engagementPercent } = await memberSessionFactory.engagement(id)
    const {
      parleys,
      totalRequestedParleyCountThisMonth,
      totalGivenTreasureMapCountThisMonth,
      totalClosedAnchorCountThisMonth
    } = await memberSessionFactory.output(id)

    // const anchors = await prisma.anchor.findMany({
    //   where: {
    //     chapterId,
    //     OR: [{ giverId: id }, { receiverId: id }]
    //   },
    //   include: {
    //     chapter: {
    //       select: {
    //         id: true,
    //         name: true
    //       }
    //     },
    //     giver: {
    //       select: {
    //         id: true,
    //         name: true,
    //         email: true,
    //         company: true,
    //         profileImage: true
    //       }
    //     },
    //     receiver: {
    //       select: {
    //         id: true,
    //         name: true,
    //         email: true,
    //         company: true,
    //         profileImage: true
    //       }
    //     }
    //   },
    //   orderBy: {
    //     createdAt: 'desc'
    //   }
    // })

    // const users = await prisma.user.findMany()

    // const user = await prisma.user.findFirst({
    //   where: {
    //     id,
    //     chapterId
    //   },
    //   select: {
    //     id: true,
    //     name: true,
    //     email: true,
    //     phone: true,
    //     company: true,
    //     industry: true,
    //     website: true,
    //     title: true,
    //     businessLicenseNumber: true,
    //     yearsInBusiness: true,
    //     bio: true,
    //     role: true,
    //     interests: true,
    //     profileImage: true,
    //     profileImageFilename: true,
    //     isPublic: true,
    //     isActive: true,
    //     membershipStatus: true,
    //     joinedAt: true,
    //     expiresAt: true,
    //     lastLoginAt: true,
    //     createdAt: true,
    //     updatedAt: true,
    //     isAdmin: true,
    //     isSuperUser: true,
    //     isLicensed: true,

    //     // NEW: Professional Goals & Media
    //     goal: true,
    //     collage: true,
    //     coverImage: true,
    //     coverImageFilename: true,

    //     // NEW: Social Media & Online Presence
    //     facebookUrl: true,
    //     threadsUrl: true,
    //     youtubeUrl: true,
    //     xUrl: true,
    //     linkedInUrl: true,
    //     portfolioUrl: true,

    //     // NEW: Content & Communication
    //     posts: true,
    //     podcasts: true,

    //     // NEW: Skills & Professional Development
    //     skills: true,
    //     careerAchievements: true,
    //     learningGoals: true,

    //     // NEW: Services & Professional Network
    //     servicesOffered: true,
    //     professionalAssociations: true,
    //     professionalBooks: true,

    //     // NEW: Projects & Expertise Sharing
    //     sideProjects: true,
    //     askMeAbout: true,

    //     weeklyTreasureWishlist: true,

    //     chapter: {
    //       select: {
    //         id: true,
    //         name: true,
    //         location: true,
    //         hasUnlockedMuster: true,
    //         hasUnlockedBooty: true,
    //         hasUnlockedGrog: true
    //       }
    //     }
    //   }
    // })

    // if (!user) {
    //   return {
    //     error: 'User profile not found in this chapter'
    //   }
    // }

    // Check if user profile is complete
    // const isProfileComplete = !!(
    //   user.name?.trim() &&
    //   user.email?.trim() &&
    //   user.company?.trim() &&
    //   user.industry?.trim()
    // )

    // // Calculate membership days
    // const membershipDays = user.joinedAt
    //   ? Math.floor((new Date().getTime() - new Date(user.joinedAt).getTime()) / (1000 * 60 * 60 * 24))
    //   : 0

    // // Check if membership is expiring soon (within 30 days)
    // const isExpiringSoon = user.expiresAt
    //   ? Math.floor((new Date(user.expiresAt).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) <= 30
    //   : false

    // const rendezvous = await prisma.rendezvous.findMany({
    //   where: { id: chapterId },
    //   include: {
    //     chapter: {
    //       select: {
    //         id: true,
    //         name: true
    //       }
    //     }
    //   },
    //   orderBy: {
    //     createdAt: 'desc'
    //   }
    // })

    // const chapter = await prisma.chapter.findUnique({
    //   where: { id: chapterId },
    //   select: {
    //     id: true,
    //     name: true,
    //     location: true,
    //     meetingDay: true,
    //     meetingTime: true,
    //     meetingFrequency: true,
    //     createdAt: true,
    //     updatedAt: true
    //   }
    // })

    // const treasureMaps = await prisma.treasureMap.findMany({
    //   where: {
    //     chapterId,
    //     OR: [{ giverId: id }, { receiverId: id }]
    //   },
    //   include: {
    //     chapter: {
    //       select: {
    //         id: true,
    //         name: true
    //       }
    //     },
    //     giver: {
    //       select: {
    //         id: true,
    //         name: true,
    //         email: true,
    //         company: true,
    //         profileImage: true
    //       }
    //     },
    //     receiver: {
    //       select: {
    //         id: true,
    //         name: true,
    //         email: true,
    //         company: true,
    //         profileImage: true
    //       }
    //     }
    //   },
    //   orderBy: {
    //     createdAt: 'desc'
    //   }
    // })

    // const serializedAnchors = serializePrisma(anchors)
    const serializedParleys = serializePrisma(parleys)
    // const serializedRendezvous = serializePrisma(rendezvous)
    // const serializedTreasureMaps = serializePrisma(treasureMaps)
    const serializedTotalRevenue = serializePrisma(totalRevenue)

    return {
      totalRevenue: Number(serializedTotalRevenue),
      totalRevenueChange,
      totalParleys,
      parleysChangePercent: parleysChangePercent,
      totalAnchors,
      anchorsChangePercent: anchorsChangePercent,
      totalTreasureMaps,
      treasureMapsChangePercent: treasureMapsChangePercent,
      weeklyActivity,
      participationPercent: participationPercent,
      engagementPercent: engagementPercent,
      parleys: serializedParleys,
      totalRequestedParleyCountThisMonth,
      totalGivenTreasureMapCountThisMonth,
      totalClosedAnchorCountThisMonth
      // anchors: serializedAnchors,
      // rendezvous: serializedRendezvous,
      // chapter,
      // treasureMaps: serializedTreasureMaps,
      // users,
      // user: {
      //   ...user,
      //   isProfileComplete,
      //   membershipDays,
      //   isExpiringSoon,
      //   meta: {
      //     chapterId,
      //     lastUpdated: user.updatedAt,
      //     profileCompleteness: {
      //       isComplete: isProfileComplete,
      //       missingFields: [
      //         !user.name?.trim() && 'name',
      //         !user.company?.trim() && 'company',
      //         !user.industry?.trim() && 'industry',
      //         !user.phone?.trim() && 'phone'
      //       ].filter(Boolean)
      //     },
      //     membership: {
      //       status: user.membershipStatus,
      //       joinedDaysAgo: membershipDays,
      //       expiresAt: user.expiresAt,
      //       isExpiringWithin30Days: isExpiringSoon
      //     }
      //   }
      // }
    }
  } catch {
    return {
      error: 'Internal server error',
      message: 'Something went wrong while fetching member overview',
      status: 500
    }
  }
}
