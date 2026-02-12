import prisma from '@/prisma/client'
import { chapterId } from '../constants/api/chapterId'
import { auth } from '../auth'
import { createLog } from '../utils/api/createLog'

const getWeekStart = () => {
  const now = new Date()
  const dayOfWeek = now.getDay() // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

  // Calculate days back to Thursday (4)
  // If today is Thursday (4), go back 0 days
  // If today is Friday (5), go back 1 day
  // If today is Saturday (6), go back 2 days
  // If today is Sunday (0), go back 3 days
  // If today is Monday (1), go back 4 days
  // If today is Tuesday (2), go back 5 days
  // If today is Wednesday (3), go back 6 days

  // The + 3 is part of a modulo calculation to handle the circular nature of days of the week.
  // The + 3 shifts the calculation so Thursday becomes the "zero point" for our week.
  const daysBackToThursday = (dayOfWeek + 3) % 7

  const weekStart = new Date(now)
  weekStart.setDate(now.getDate() - daysBackToThursday)
  weekStart.setHours(0, 0, 0, 0)

  //   Thursday 12:00 AM starts the new week
  // Wednesday 11:59 PM ends the previous week

  return weekStart
}

const getMonthStart = () => {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth(), 1)
}

const getQuarterStart = (date?: Date): Date => {
  const targetDate = date || new Date()
  const year = targetDate.getFullYear()
  const month = targetDate.getMonth()

  // Determine which quarter we're in and get the start month
  const quarterStartMonth = Math.floor(month / 3) * 3

  return new Date(year, quarterStartMonth, 1, 0, 0, 0, 0)
}

const getYearStart = (date?: Date): Date => {
  const targetDate = date || new Date()
  return new Date(targetDate.getFullYear(), 0, 1, 0, 0, 0, 0)
}

async function getAllUsersForAdmin(filterType: string) {
  const weekStart = getWeekStart()
  const monthStart = getMonthStart()
  const quarterStart = getQuarterStart()
  const yearStart = getYearStart()

  // Build where clause
  const whereClause = {
    ...(chapterId && { chapterId })
  }

  // Get ALL users with ALL their data
  const users = await prisma.user.findMany({
    where: whereClause,
    include: {
      // Chapter relationship
      chapter: true,

      // All Treasure Maps
      giver: {
        include: {
          receiver: {
            select: { id: true, name: true, company: true }
          }
        }
      },
      receiver: {
        include: {
          giver: {
            select: { id: true, name: true, company: true }
          }
        }
      },

      // All Anchors
      givenCredits: {
        include: {
          receiver: {
            select: { id: true, name: true, company: true }
          }
        }
      },
      receivedCredits: {
        include: {
          giver: {
            select: { id: true, name: true, company: true }
          }
        }
      },

      // All Parleys
      requestedMeetings: {
        include: {
          recipient: {
            select: { id: true, name: true, company: true }
          }
        }
      },
      receivedMeetings: {
        include: {
          requester: {
            select: { id: true, name: true, company: true }
          }
        }
      }
    },
    orderBy: [{ isAdmin: 'desc' }, { isSuperUser: 'desc' }, { name: 'asc' }]
  })

  // Transform each user with complete admin data
  const completeUserData = users.map((user) => {
    // Helper to get filtered data based on filterType
    const getFilteredData = (items: any[]) => {
      switch (filterType) {
        case 'weekly':
          return items.filter((item) => new Date(item.createdAt) >= weekStart)
        case 'monthly':
          return items.filter((item) => new Date(item.createdAt) >= monthStart)
        case 'quarterly':
          return items.filter((item) => new Date(item.createdAt) >= quarterStart)
        case 'yearly':
          return items.filter((item) => new Date(item.createdAt) >= yearStart)
        default:
          return items.filter((item) => new Date(item.createdAt) >= weekStart) // Default to weekly
      }
    }

    // Get filtered data for current period
    const filteredTreasureMapsGiven = getFilteredData(user.giver)
    const filteredTreasureMapsReceived = getFilteredData(user.receiver)
    const filteredAnchorsGiven = getFilteredData(user.givenCredits)
    const filteredAnchorsReceived = getFilteredData(user.receivedCredits)
    const filteredParleysRequested = getFilteredData(user.requestedMeetings)
    const filteredParleysReceived = getFilteredData(user.receivedMeetings)

    // Calculate business revenue for filtered period
    const businessGiven = filteredAnchorsGiven.reduce((total, anchor) => total + (+anchor.businessValue || 0), 0)
    const businessReceived = filteredAnchorsReceived.reduce((total, anchor) => total + (+anchor.businessValue || 0), 0)
    const revenue = businessGiven

    // Get target based on filter type
    const getTarget = () => {
      switch (filterType) {
        case 'weekly':
          return 1
        case 'monthly':
          return 4
        case 'quarterly':
          return 13
        case 'yearly':
          return 52
        default:
          return 1
      }
    }

    const target = getTarget()

    // Calculate engagement score based on completing targets
    const treasureMapCompletion = filteredTreasureMapsGiven.length >= target ? 100 : 0
    const anchorCompletion = filteredAnchorsGiven.length >= target ? 100 : 0
    const parleyCompletion = filteredParleysRequested.length >= target ? 100 : 0

    const engagementScore = Math.round((treasureMapCompletion + anchorCompletion + parleyCompletion) / 3)

    // Calculate networking score
    const totalActivity =
      filteredTreasureMapsGiven.length +
      filteredTreasureMapsReceived.length +
      filteredAnchorsGiven.length +
      filteredAnchorsReceived.length +
      filteredParleysRequested.length +
      filteredParleysReceived.length

    const getNetworkingTarget = () => {
      switch (filterType) {
        case 'weekly':
          return 6 // 1 week × 6 activities
        case 'monthly':
          return 24 // 4 weeks × 6 activities
        case 'quarterly':
          return 78 // 13 weeks × 6 activities
        case 'yearly':
          return 312 // 52 weeks × 6 activities
        default:
          return 6
      }
    }

    const networkingTarget = getNetworkingTarget()
    const networkingScore = Math.min(100, (totalActivity / networkingTarget) * 100)
    const networkingDisplayScore =
      networkingScore < 10 ? parseFloat(networkingScore.toFixed(1)) : Math.round(networkingScore)

    // Health calculation
    const getOverallHealth = (memberJoinedAt: string | number | Date | null) => {
      const joinDate: any = typeof memberJoinedAt === 'string' ? new Date(memberJoinedAt) : memberJoinedAt
      const daysSinceJoin = Math.floor((Date.now() - joinDate?.getTime()) / (1000 * 60 * 60 * 24))

      // Grace period for first year (365 days)
      if (daysSinceJoin < 365) {
        if (engagementScore >= 33) return 'excellent'
        if (engagementScore >= 0) return 'good'
        return 'good'
      }

      // Normal thresholds after grace period
      if (engagementScore >= 67 && networkingScore >= 25) return 'excellent'
      if (engagementScore >= 33 && networkingScore >= 15) return 'good'
      if (engagementScore >= 0 && networkingScore >= 5) return 'warning'
      return 'critical'
    }

    return {
      // === BASIC USER INFO ===
      id: user.id,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      name: user.name,
      role: user.role,
      email: user.email,
      phone: user.phone,
      company: user.company,
      industry: user.industry,
      title: user.title,
      isLicensed: user.isLicensed,
      businessLicenseNumber: user.businessLicenseNumber,
      chapterId: user.chapterId,
      chapter: user.chapter,
      joinedAt: user.joinedAt,
      expiresAt: user.expiresAt,
      membershipStatus: user.membershipStatus,
      lastLoginAt: user.lastLoginAt,
      joinDate: user.joinedAt ? user.joinedAt.toISOString().split('T')[0] : null,
      profileImage: user.profileImage,

      // === FILTERED METRICS (based on filterType) ===
      metrics: {
        treasureMaps: {
          given: filteredTreasureMapsGiven.length,
          received: filteredTreasureMapsReceived.length,
          target
        },
        anchors: {
          given: filteredAnchorsGiven.length,
          received: filteredAnchorsReceived.length,
          target
        },
        parleys: {
          requested: filteredParleysRequested.length,
          received: filteredParleysReceived.length,
          target
        },
        attendance: {
          present: Math.floor(Math.random() * 4) + 1,
          total: 4
        }
      },

      // === CALCULATED SCORES ===
      scores: {
        revenue: Math.round(revenue),
        businessReceived: Math.round(businessReceived),
        businessGiven: Math.round(businessGiven),
        networkingScore: networkingDisplayScore,
        engagementScore: engagementScore
      },

      overallHealth: getOverallHealth(user.joinedAt),
      filterType, // Include so frontend knows what period this represents

      // === COMPLETE ACTIVITY DATA (all time) ===
      allTreasureMaps: {
        given: user.giver,
        received: user.receiver,
        totalGiven: user.giver.length,
        totalReceived: user.receiver.length
      },

      allAnchors: {
        given: user.givenCredits,
        received: user.receivedCredits,
        totalGiven: user.givenCredits.length,
        totalReceived: user.receivedCredits.length
      },

      allParleys: {
        requested: user.requestedMeetings,
        received: user.receivedMeetings,
        totalRequested: user.requestedMeetings.length,
        totalReceived: user.receivedMeetings.length
      },

      // === SUMMARY STATS ===
      totalActivities:
        user.giver.length +
        user.receiver.length +
        user.givenCredits.length +
        user.receivedCredits.length +
        user.requestedMeetings.length +
        user.receivedMeetings.length,

      lastActivityDate: Math.max(
        ...user.giver.map((g) => new Date(g.createdAt).getTime()),
        ...user.receiver.map((r) => new Date(r.createdAt).getTime()),
        ...user.givenCredits.map((gc) => new Date(gc.createdAt).getTime()),
        ...user.receivedCredits.map((rc) => new Date(rc.createdAt).getTime()),
        ...user.requestedMeetings.map((rm) => new Date(rm.createdAt).getTime()),
        ...user.receivedMeetings.map((rm) => new Date(rm.createdAt).getTime()),
        0
      ),

      daysSinceLastActivity: user.lastLoginAt
        ? Math.floor((+new Date() - +new Date(user.lastLoginAt)) / (1000 * 60 * 60 * 24))
        : null
    }
  })

  return completeUserData
}
export async function generateMemberMetrics({ params }) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return {
        success: false,
        error: 'Unauthorized'
      }
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { isAdmin: true, isSuperUser: true, chapterId: true }
    })

    if (!user?.isAdmin && !user?.isSuperUser) {
      return { error: 'Admin access required' }
    }

    const { filterType } = await params

    // Get all users data
    const users = await getAllUsersForAdmin(filterType)

    return {
      success: true,
      users,
      count: users.length,
      timestamp: new Date().toISOString()
    }
  } catch (error: any) {
    await createLog('error', 'Failed to generate member metrics', {
      location: ['server action - generateMemberMetrics'],
      message: error instanceof Error ? error.message : 'Unknown error',
      name: 'GenerateMemberMetrics',
      timestamp: new Date().toISOString(),
      error
    })

    return {
      success: false,
      error: 'Failed to generate member metrics'
    }
  }
}
