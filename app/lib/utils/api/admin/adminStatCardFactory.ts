import prisma from '@/prisma/client'
import {
  endOfMonth,
  startOfLastMonth,
  startOfMonth,
  startOfNextMonth,
  startOfThisMonth,
  startOfThisMonthCopy
} from '../../date/formatDate'

export const adminStatCardFactory = {
  card: {
    member: async () => {
      // === Total Members's ===
      const totalMembers = await prisma.user.count()

      // 1. New members this month
      const newMembers = await prisma.user.count({
        where: {
          createdAt: {
            gte: startOfMonth,
            lt: endOfMonth
          }
        }
      })

      // 2. Members who left this month (if you track with membershipStatus)
      const leftMembers = await prisma.user.count({
        where: {
          membershipStatus: { in: ['SUSPENDED', 'EXPIRED', 'CANCELLED'] },
          updatedAt: {
            gte: startOfMonth,
            lt: endOfMonth
          }
        }
      })

      const totalMembersChange = newMembers - leftMembers

      return { totalMembers, totalMembersChange }
    },
    revenue: async () => {
      // === Calculate total revenue from Anchor.businessValue ===
      const totalRevenueResult = await prisma.anchor.aggregate({
        _sum: {
          businessValue: true
        }
      })

      const totalRevenue = totalRevenueResult._sum.businessValue || 0

      // === Calculate total revenue change month over month

      // 1. Revenue this month
      const thisMonthRevenue = await prisma.anchor.aggregate({
        _sum: { businessValue: true },
        where: {
          createdAt: {
            gte: startOfThisMonth,
            lt: startOfNextMonth
          }
        }
      })

      // 2. Revenue last month
      const lastMonthRevenue = await prisma.anchor.aggregate({
        _sum: { businessValue: true },
        where: {
          createdAt: {
            gte: startOfLastMonth,
            lt: startOfThisMonthCopy
          }
        }
      })

      const currentRevenue: any = thisMonthRevenue._sum.businessValue || 0
      const previousRevenue: any = lastMonthRevenue._sum.businessValue || 0

      const revenueChange = currentRevenue - previousRevenue
      const totalRevenueChange = previousRevenue ? (revenueChange / previousRevenue) * 100 : 100 // if no revenue last month, consider 100%
      return { totalRevenue, totalRevenueChange: totalRevenueChange }
    },
    conversion: async () => {
      // === Calculate conversion rate (users who sent at least one treasure map) ===
      const totalActiveUsers = await prisma.user.count({
        where: { membershipStatus: 'ACTIVE' }
      })

      const usersWhoSentMaps = await prisma.treasureMap.findMany({
        select: { giverId: true },
        distinct: ['giverId']
      })

      const countUsersWhoSentMaps = usersWhoSentMaps.length

      const conversionRate = (countUsersWhoSentMaps / totalActiveUsers) * 100

      // Calculate month over month conversion change
      const getConversionRateForMonth = async (start: Date, end: Date) => {
        // Active users during that month
        const totalActiveUsers = await prisma.user.count({
          where: { membershipStatus: 'ACTIVE' }
        })

        // Users who sent at least one Treasure Map during the month
        const usersWhoSentMaps = await prisma.treasureMap.findMany({
          where: { createdAt: { gte: start, lt: end } },
          select: { giverId: true },
          distinct: ['giverId']
        })

        const countUsersWhoSentMaps = usersWhoSentMaps.length

        return (countUsersWhoSentMaps / totalActiveUsers) * 100
      }

      const thisMonthConversion = await getConversionRateForMonth(startOfThisMonth, startOfNextMonth)
      const lastMonthConversion = await getConversionRateForMonth(startOfLastMonth, startOfThisMonthCopy)

      const conversionChange = thisMonthConversion - lastMonthConversion
      const conversionChangePercent = lastMonthConversion ? (conversionChange / lastMonthConversion) * 100 : 100

      return { conversionRate, conversionChangePercent }
    },
    health: async () => {
      // === Calculate chapter health
      const sevenDaysAgo = new Date()
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

      const totalUsers = await prisma.user.count()

      // Active users by category
      const activeAnchors = await prisma.user.count({
        where: {
          OR: [
            { givenCredits: { some: { createdAt: { gte: sevenDaysAgo } } } },
            { receivedCredits: { some: { createdAt: { gte: sevenDaysAgo } } } }
          ]
        }
      })

      const activeTreasureMaps = await prisma.user.count({
        where: {
          OR: [
            { giver: { some: { createdAt: { gte: sevenDaysAgo } } } },
            { receiver: { some: { createdAt: { gte: sevenDaysAgo } } } }
          ]
        }
      })

      const activeParleys = await prisma.user.count({
        where: {
          OR: [
            { requestedMeetings: { some: { createdAt: { gte: sevenDaysAgo } } } },
            { receivedMeetings: { some: { createdAt: { gte: sevenDaysAgo } } } }
          ]
        }
      })

      const anchorRate = activeAnchors / totalUsers
      const treasureMapRate = activeTreasureMaps / totalUsers
      const parleyRate = activeParleys / totalUsers

      // This gives a single percentage representing overall chapter engagement across all three activities.
      // Example: equal weighting
      const chapterHealth = ((anchorRate + treasureMapRate + parleyRate) / 3) * 100

      // Here, Anchors and Treasure Maps matter more than Parleys.
      // const chapterHealth = (0.4 * anchorRate + 0.4 * treasureMapRate + 0.2 * parleyRate) * 100;

      //  === Calculate  month over month chapter health
      const getChapterHealthForMonth = async (start: Date, end: Date) => {
        const totalUsers = await prisma.user.count({
          where: { membershipStatus: 'ACTIVE' }
        })

        // Users who engaged in any activity during the month
        const activeUsers = await prisma.user.count({
          where: {
            OR: [
              { giver: { some: { createdAt: { gte: start, lt: end } } } }, // sent Treasure Maps
              { receiver: { some: { createdAt: { gte: start, lt: end } } } }, // received Treasure Maps
              { givenCredits: { some: { createdAt: { gte: start, lt: end } } } }, // gave Anchors
              { receivedCredits: { some: { createdAt: { gte: start, lt: end } } } }, // received Anchors
              { requestedMeetings: { some: { createdAt: { gte: start, lt: end } } } }, // requested Parleys
              { receivedMeetings: { some: { createdAt: { gte: start, lt: end } } } } // received Parleys
            ]
          }
        })

        const healthPercent = totalUsers ? (activeUsers / totalUsers) * 100 : 0
        return healthPercent
      }

      const thisMonthHealth = await getChapterHealthForMonth(startOfThisMonth, startOfNextMonth)
      const lastMonthHealth = await getChapterHealthForMonth(startOfLastMonth, startOfThisMonthCopy)

      const healthChange = thisMonthHealth - lastMonthHealth
      const healthChangePercent = lastMonthHealth ? (healthChange / lastMonthHealth) * 100 : 100

      return { chapterHealth, healthChangePercent }
    },
    retention: async () => {
      // === Calculate Member Retention ===
      const totalUsers = await prisma.user.count()
      const activeUsers = await prisma.user.count({
        where: { membershipStatus: 'ACTIVE' } // or not canceled/deactivated
      })
      const memberRetention = (activeUsers / totalUsers) * 100

      //  === Calculate total member retnetion month-over-month
      const getRetainedMembersForMonth = async (start: Date) => {
        // Users who signed up before 'start' and are still ACTIVE during this period
        const retainedUsers = await prisma.user.count({
          where: {
            membershipStatus: 'ACTIVE',
            createdAt: { lt: start } // signed up before the month started
          }
        })

        return retainedUsers
      }

      const retainedThisMonth = await getRetainedMembersForMonth(startOfThisMonth)
      const retainedLastMonth = await getRetainedMembersForMonth(startOfLastMonth)

      const retentionChange = retainedThisMonth - retainedLastMonth
      const retentionChangePercent = retainedLastMonth ? (retentionChange / retainedLastMonth) * 100 : 100

      return { memberRetention, retentionChangePercent }
    },
    parley: async () => {
      // === Total Parley's ===
      const totalParleys = await prisma.parley.count()

      //  === Calculate total parleys month-over-month
      const getParleysCountForMonth = async (start: Date, end: Date) => {
        const parleys = await prisma.parley.count({
          where: {
            createdAt: { gte: start, lt: end }
          }
        })

        return parleys
      }

      const thisMonthParleys = await getParleysCountForMonth(startOfThisMonth, startOfNextMonth)
      const lastMonthParleys = await getParleysCountForMonth(startOfLastMonth, startOfThisMonthCopy)

      const parleysChange = thisMonthParleys - lastMonthParleys
      const parleysChangePercent = lastMonthParleys ? (parleysChange / lastMonthParleys) * 100 : 100

      return { totalParleys, parleysChangePercent }
    },
    anchor: async () => {
      // === Total Anchor's ===
      const totalAnchors = await prisma.anchor.count()

      //  === Calculate total anchors month-over-month
      const getAnchorsCountForMonth = async (start: Date, end: Date) => {
        const anchors = await prisma.anchor.count({
          where: {
            createdAt: { gte: start, lt: end }
          }
        })

        return anchors
      }

      const thisMonthAnchors = await getAnchorsCountForMonth(startOfThisMonth, startOfNextMonth)
      const lastMonthAnchors = await getAnchorsCountForMonth(startOfLastMonth, startOfThisMonthCopy)

      const anchorsChange = thisMonthAnchors - lastMonthAnchors
      const anchorsChangePercent = lastMonthAnchors ? (anchorsChange / lastMonthAnchors) * 100 : 100

      return { totalAnchors, anchorsChangePercent }
    },
    treasureMap: async () => {
      // === Total Treasure Maps ===
      const totalTreasureMaps = await prisma.treasureMap.count()

      //  === Calculate total treasure maps month-over-month
      const getTreasureMapsCountForMonth = async (start: Date, end: Date) => {
        const treasureMaps = await prisma.treasureMap.count({
          where: {
            createdAt: { gte: start, lt: end }
          }
        })

        return treasureMaps
      }

      const thisMonthTreasureMaps = await getTreasureMapsCountForMonth(startOfThisMonth, startOfNextMonth)
      const lastMonthTreasureMaps = await getTreasureMapsCountForMonth(startOfLastMonth, startOfThisMonthCopy)

      const treasureMapsChange = thisMonthTreasureMaps - lastMonthTreasureMaps
      const treasureMapsChangePercent = lastMonthTreasureMaps ? (treasureMapsChange / lastMonthTreasureMaps) * 100 : 100

      return { totalTreasureMaps, treasureMapsChangePercent }
    }
  }
}
