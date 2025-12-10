import { IAnchor } from '@/types/anchor'
import { IParley } from '@/types/parley'
import { ITreasureMap } from '@/types/treasure-map'
import { User } from '@/types/user'
import { createSlice } from '@reduxjs/toolkit'

interface DashboardState {
  parleys: any
  loading: boolean
  error: string | null
  totalMembers: number
  totalMembersChange: number
  totalRevenue: number
  totalRevenueChange: number
  conversionRate: number
  conversionChangePercent: number
  chapterHealth: number
  healthChangePercent: number
  totalParleys: number
  parleysChangePercent: number
  totalTreasureMaps: number
  treasureMapsChangePercent: number
  totalAnchors: number
  anchorsChangePercent: number
  memberRetention: number
  retentionChangePercent: number
  weeklyActivity: any[]
  industrySlots: any[]
  capacityPercent: number
  activeUsersCount: number
  participationPercent: number
  buckets: any[]
  topPerformers: any[]
  newApplicationsCount: number
  parleyRequestsCount: number
}

const initialState: DashboardState = {
  loading: true,
  error: null,
  totalMembers: 0,
  totalMembersChange: 0,
  totalRevenue: 0,
  totalRevenueChange: 0,
  conversionRate: 0,
  conversionChangePercent: 0,
  chapterHealth: 0,
  healthChangePercent: 0,
  totalParleys: 0,
  parleysChangePercent: 0,
  totalTreasureMaps: 0,
  treasureMapsChangePercent: 0,
  totalAnchors: 0,
  anchorsChangePercent: 0,
  memberRetention: 0,
  retentionChangePercent: 0,
  weeklyActivity: [],
  industrySlots: [],
  capacityPercent: 0,
  activeUsersCount: 0,
  participationPercent: 0,
  buckets: [],
  topPerformers: [],
  newApplicationsCount: 0,
  parleyRequestsCount: 0,
  parleys: []
}

const getStartOfMonth = (date: Date) => {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

const getEndOfMonth = (date: Date) => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999)
}

const getStartOfLastMonth = (date: Date) => {
  return new Date(date.getFullYear(), date.getMonth() - 1, 1)
}

const getEndOfLastMonth = (date: Date) => {
  return new Date(date.getFullYear(), date.getMonth(), 0, 23, 59, 59, 999)
}

const calculateConversionRate = (users: User[], treasureMaps: ITreasureMap[]): number => {
  const totalActiveUsers = users.filter((u) => u.membershipStatus === 'ACTIVE').length

  if (totalActiveUsers === 0) return 0

  const uniqueGiverIds = new Set(treasureMaps.map((tm) => tm.giverId))
  const countUsersWhoSentMaps = uniqueGiverIds.size

  return parseFloat(((countUsersWhoSentMaps / totalActiveUsers) * 100).toFixed(2))
}

const calculateChapterHealth = (
  users: User[],
  anchors: IAnchor[],
  treasureMaps: ITreasureMap[],
  parleys: IParley[]
): { chapterHealth: number; healthChangePercent: number } => {
  // This month boundaries
  const startOfThisMonth = getStartOfMonth(new Date())
  const endOfThisMonth = getEndOfMonth(new Date())

  // Last month boundaries
  const startOfLastMonth = getStartOfLastMonth(new Date())
  const endOfLastMonth = getEndOfLastMonth(new Date())

  // Active users count
  const activeUsers = users.filter((u) => u.membershipStatus === 'ACTIVE').length

  if (activeUsers === 0) {
    const chapterHealth = 0
    const healthChangePercent = 0
    return { chapterHealth, healthChangePercent }
  }

  // === THIS MONTH ===

  // Anchors this month
  const anchorsThisMonth = anchors.filter((a) => {
    const createdAt = new Date(a.createdAt)
    return createdAt >= startOfThisMonth && createdAt <= endOfThisMonth
  }).length

  // Treasure maps this month
  const mapsThisMonth = treasureMaps.filter((tm) => {
    const createdAt = new Date(tm.createdAt)
    return createdAt >= startOfThisMonth && createdAt <= endOfThisMonth
  }).length

  // Parleys this month
  const parleysThisMonth = parleys.filter((p) => {
    const createdAt = new Date(p.createdAt)
    return createdAt >= startOfThisMonth && createdAt <= endOfThisMonth
  }).length

  // Calculate rates for this month
  const anchorRateThisMonth = anchorsThisMonth / activeUsers
  const treasureMapRateThisMonth = mapsThisMonth / activeUsers
  const parleyRateThisMonth = parleysThisMonth / activeUsers

  const thisMonthHealth = ((anchorRateThisMonth + treasureMapRateThisMonth + parleyRateThisMonth) / 3) * 100

  // === LAST MONTH ===

  // Anchors last month
  const anchorsLastMonth = anchors.filter((a) => {
    const createdAt = new Date(a.createdAt)
    return createdAt >= startOfLastMonth && createdAt <= endOfLastMonth
  }).length

  // Treasure maps last month
  const mapsLastMonth = treasureMaps.filter((tm) => {
    const createdAt = new Date(tm.createdAt)
    return createdAt >= startOfLastMonth && createdAt <= endOfLastMonth
  }).length

  // Parleys last month
  const parleysLastMonth = parleys.filter((p) => {
    const createdAt = new Date(p.createdAt)
    return createdAt >= startOfLastMonth && createdAt <= endOfLastMonth
  }).length

  // Calculate rates for last month
  const anchorRateLastMonth = anchorsLastMonth / activeUsers
  const treasureMapRateLastMonth = mapsLastMonth / activeUsers
  const parleyRateLastMonth = parleysLastMonth / activeUsers

  const lastMonthHealth = ((anchorRateLastMonth + treasureMapRateLastMonth + parleyRateLastMonth) / 3) * 100

  // Calculate change
  const healthChange = thisMonthHealth - lastMonthHealth
  const healthChangePercent = lastMonthHealth ? (healthChange / lastMonthHealth) * 100 : 100

  const chapterHealth = parseFloat(thisMonthHealth.toFixed(2))
  const changePercentage = parseFloat(healthChangePercent.toFixed(2))

  return { chapterHealth, healthChangePercent: changePercentage }
}

const calculateMemberRetention = (users: User[]): { memberRetention: number; retentionChangePercent: number } => {
  const now = new Date()

  // This month boundaries
  const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const endOfThisMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999)

  // Last month boundaries
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999)

  // Total active members
  const totalActiveMembers = users.filter((u) => u.membershipStatus === 'ACTIVE').length

  if (totalActiveMembers === 0) {
    const memberRetention = 0
    const retentionChangePercent = 0
    return { memberRetention, retentionChangePercent }
  }

  // Members who left this month
  const leftThisMonth = users.filter((u) => {
    const updatedAt = new Date(u.updatedAt)
    const leftStatuses = ['SUSPENDED', 'EXPIRED', 'CANCELLED']
    return leftStatuses.includes(u.membershipStatus) && updatedAt >= startOfThisMonth && updatedAt <= endOfThisMonth
  }).length

  // Members who left last month
  const leftLastMonth = users.filter((u) => {
    const updatedAt = new Date(u.updatedAt)
    const leftStatuses = ['SUSPENDED', 'EXPIRED', 'CANCELLED']
    return leftStatuses.includes(u.membershipStatus) && updatedAt >= startOfLastMonth && updatedAt <= endOfLastMonth
  }).length

  // Calculate retention
  const retainedThisMonth = totalActiveMembers - leftThisMonth
  const retainedLastMonth = totalActiveMembers - leftLastMonth

  const memberRetention = (retainedThisMonth / totalActiveMembers) * 100

  const retentionChange = retainedThisMonth - retainedLastMonth
  const retentionChangePercent = retainedLastMonth ? (retentionChange / retainedLastMonth) * 100 : 100

  const memberRetentionNumber = parseFloat(memberRetention.toFixed(2))
  const retentionChangePercentNumber = parseFloat(retentionChangePercent.toFixed(2))

  return { memberRetention: memberRetentionNumber, retentionChangePercent: retentionChangePercentNumber }
}

const calculateMemberWeeklyActivity = (
  userId: string,
  parleys: IParley[],
  treasureMaps: ITreasureMap[],
  anchors: IAnchor[]
): { day: string; parleys: number; treasureMaps: number; anchors: number }[] => {
  const now = new Date()

  // Force start of the week = Thursday
  const dayOfWeek = now.getDay() // 0 = Sunday, 1 = Monday...
  const diffToThursday = (dayOfWeek + 3) % 7 // convert so Thursday = 0
  const weekStart = new Date(now)
  weekStart.setDate(now.getDate() - diffToThursday)
  weekStart.setHours(0, 0, 0, 0)

  const daysShort = ['Thu', 'Fri', 'Sat', 'Sun', 'Mon', 'Tue', 'Wed']
  const weeklyActivity = []

  for (let i = 0; i < 7; i++) {
    const dayStart = new Date(weekStart)
    dayStart.setDate(weekStart.getDate() + i)
    dayStart.setHours(0, 0, 0, 0)

    const dayEnd = new Date(dayStart)
    dayEnd.setDate(dayStart.getDate() + 1)
    dayEnd.setHours(0, 0, 0, 0)

    const parleysCount = parleys.filter((p) => {
      if (p.requesterId !== userId) return false
      const createdAt = new Date(p.createdAt)
      return createdAt >= dayStart && createdAt < dayEnd
    }).length

    const treasureMapsCount = treasureMaps.filter((t) => {
      if (t.giverId !== userId) return false
      const createdAt = new Date(t.createdAt)
      return createdAt >= dayStart && createdAt < dayEnd
    }).length

    const anchorsCount = anchors.filter((a) => {
      if (a.giverId !== userId) return false
      const createdAt = new Date(a.createdAt)
      return createdAt >= dayStart && createdAt < dayEnd
    }).length

    weeklyActivity.push({
      day: daysShort[i],
      parleys: parleysCount,
      treasureMaps: treasureMapsCount,
      anchors: anchorsCount
    })
  }

  return weeklyActivity
}

const calculateAdminWeeklyActivity = (
  parleys: IParley[],
  treasureMaps: ITreasureMap[],
  anchors: IAnchor[]
): { day: string; parleys: number; treasureMaps: number; anchors: number }[] => {
  const now = new Date()

  // Force start of the week = Thursday
  const dayOfWeek = now.getDay() // 0 = Sunday, 1 = Monday...
  const diffToThursday = (dayOfWeek + 3) % 7 // convert so Thursday = 0
  const weekStart = new Date(now)
  weekStart.setDate(now.getDate() - diffToThursday)
  weekStart.setHours(0, 0, 0, 0)

  const daysShort = ['Thu', 'Fri', 'Sat', 'Sun', 'Mon', 'Tue', 'Wed']
  const weeklyActivity = []

  for (let i = 0; i < 7; i++) {
    const dayStart = new Date(weekStart)
    dayStart.setDate(weekStart.getDate() + i)
    dayStart.setHours(0, 0, 0, 0)

    const dayEnd = new Date(dayStart)
    dayEnd.setDate(dayStart.getDate() + 1)
    dayEnd.setHours(0, 0, 0, 0)

    const parleysCount = parleys.filter((p) => {
      const createdAt = new Date(p.createdAt)
      return createdAt >= dayStart && createdAt < dayEnd
    }).length

    const treasureMapsCount = treasureMaps.filter((t) => {
      const createdAt = new Date(t.createdAt)
      return createdAt >= dayStart && createdAt < dayEnd
    }).length

    const anchorsCount = anchors.filter((a) => {
      const createdAt = new Date(a.createdAt)
      return createdAt >= dayStart && createdAt < dayEnd
    }).length

    weeklyActivity.push({
      day: daysShort[i],
      parleys: parleysCount,
      treasureMaps: treasureMapsCount,
      anchors: anchorsCount
    })
  }

  return weeklyActivity
}

const EXPECTED_TREASUREMAPS = 1
const EXPECTED_ANCHORS = 1
const EXPECTED_PARLEYS = 1

const calculateMemberParticipation = (
  userId: string,
  parleys: IParley[],
  treasureMaps: ITreasureMap[],
  anchors: IAnchor[]
): number => {
  const now = new Date()
  const sevenDaysAgo = new Date(now)
  sevenDaysAgo.setDate(now.getDate() - 7)
  sevenDaysAgo.setHours(0, 0, 0, 0)

  // Count treasure maps created by user in last 7 days
  const treasureMapCount = treasureMaps.filter((tm) => {
    if (tm.giverId !== userId) return false
    const createdAt = new Date(tm.createdAt)
    return createdAt >= sevenDaysAgo
  }).length

  // Count anchors given by user in last 7 days
  const anchorCount = anchors.filter((a) => {
    if (a.giverId !== userId) return false
    const createdAt = new Date(a.createdAt)
    return createdAt >= sevenDaysAgo
  }).length

  // Count parleys requested by user in last 7 days
  const parleyCount = parleys.filter((p) => {
    if (p.requesterId !== userId) return false
    const createdAt = new Date(p.createdAt)
    return createdAt >= sevenDaysAgo
  }).length

  // Calculate compliance for each activity type
  const treasureMapCompliance = Math.min(treasureMapCount / EXPECTED_TREASUREMAPS, 1)
  const anchorCompliance = Math.min(anchorCount / EXPECTED_ANCHORS, 1)
  const parleyCompliance = Math.min(parleyCount / EXPECTED_PARLEYS, 1)

  // Average compliance across the three expected actions
  const totalCompliance = (treasureMapCompliance + anchorCompliance + parleyCompliance) / 3

  // Convert to percentage
  const participationPercent = totalCompliance * 100

  return participationPercent
}

const calculateAdminParticipation = (
  users: User[],
  parleys: IParley[],
  treasureMaps: ITreasureMap[],
  anchors: IAnchor[]
): number => {
  const now = new Date()
  const sevenDaysAgo = new Date(now)
  sevenDaysAgo.setDate(now.getDate() - 7)
  sevenDaysAgo.setHours(0, 0, 0, 0)

  // Filter only active members
  const activeMembers = users.filter((u) => u.membershipStatus === 'ACTIVE')

  if (activeMembers.length === 0) {
    return 0
  }

  let totalCompliance = 0

  activeMembers.forEach((user) => {
    // Count treasure maps created by this user in last 7 days
    const userTreasureMapCount = treasureMaps.filter((tm) => {
      if (tm.giverId !== user.id) return false
      const createdAt = new Date(tm.createdAt)
      return createdAt >= sevenDaysAgo
    }).length

    // Count anchors given by this user in last 7 days
    const userAnchorCount = anchors.filter((a) => {
      if (a.giverId !== user.id) return false
      const createdAt = new Date(a.createdAt)
      return createdAt >= sevenDaysAgo
    }).length

    // Count parleys requested by this user in last 7 days
    const userParleyCount = parleys.filter((p) => {
      if (p.requesterId !== user.id) return false
      const createdAt = new Date(p.createdAt)
      return createdAt >= sevenDaysAgo
    }).length

    // Calculate compliance for this user
    const treasureMapCompliance = Math.min(userTreasureMapCount / EXPECTED_TREASUREMAPS, 1)
    const anchorCompliance = Math.min(userAnchorCount / EXPECTED_ANCHORS, 1)
    const parleyCompliance = Math.min(userParleyCount / EXPECTED_PARLEYS, 1)

    // Average compliance across the three expected actions for this user
    totalCompliance += (treasureMapCompliance + anchorCompliance + parleyCompliance) / 3
  })

  // Calculate average participation across all active members
  const participationPercent = (totalCompliance / activeMembers.length) * 100

  return participationPercent
}

export const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setHydrateDashboard: (state, { payload }) => {
      state.totalMembers = payload.totalMembers
      state.totalMembersChange = payload.totalMembersChange
      state.totalRevenue = payload.totalRevenue
      state.totalRevenueChange = payload.totalRevenueChange
      state.conversionRate = payload.conversionRate
      state.conversionChangePercent = payload.conversionChangePercent
      state.chapterHealth = payload.chapterHealth
      state.healthChangePercent = payload.healthChangePercent
      state.totalParleys = payload.totalParleys
      state.parleysChangePercent = payload.parleysChangePercent
      state.totalTreasureMaps = payload.totalTreasureMaps
      state.treasureMapsChangePercent = payload.treasureMapsChangePercent
      state.totalAnchors = payload.totalAnchors
      state.anchorsChangePercent = payload.anchorsChangePercent
      state.memberRetention = payload.memberRetention
      state.retentionChangePercent = payload.retentionChangePercent
      state.weeklyActivity = payload.weeklyActivity
      state.industrySlots = payload.industrySlots
      state.capacityPercent = payload.capacityPercent
      state.activeUsersCount = payload.activeUsersCount
      state.participationPercent = payload.participationPercent
      state.buckets = payload.buckets
      state.topPerformers = payload.topPerformers
      state.newApplicationsCount = payload.newApplicationsCount
      state.parleyRequestsCount = payload.parleyRequestsCount
      state.loading = false
    },
    recomputeMemberCard: (state) => {
      state.totalMembers += 1
      state.totalMembersChange += 1
    },
    recomputeAnchorCard: (state, { payload }) => {
      state.totalAnchors += 1
      const businessValue = parseFloat(payload.businessValue) || 0
      state.totalRevenue += businessValue
    },
    recomputeParleyCard: (state) => {
      state.totalParleys += 1
    },
    recomputeTreasureMapCard: (state) => {
      state.totalTreasureMaps += 1
    },
    recomputeAllStats: (state, action) => {
      const { userId, isAdmin, users, anchors, treasureMaps, parleys } = action.payload

      if (isAdmin) {
        state.conversionRate = calculateConversionRate(users, treasureMaps)

        const healthResult = calculateChapterHealth(users, anchors, treasureMaps, parleys)
        state.chapterHealth = healthResult.chapterHealth
        state.healthChangePercent = healthResult.healthChangePercent

        const retentionResult = calculateMemberRetention(users)
        state.memberRetention = retentionResult.memberRetention
        state.retentionChangePercent = retentionResult.retentionChangePercent

        const weeklyActivity = calculateAdminWeeklyActivity(parleys, treasureMaps, anchors)
        state.weeklyActivity = weeklyActivity

        const participationPercent = calculateAdminParticipation(users, parleys, treasureMaps, anchors)
        state.participationPercent = participationPercent
      } else {
        const weeklyActivity = calculateMemberWeeklyActivity(userId, parleys, treasureMaps, anchors)
        state.weeklyActivity = weeklyActivity

        const participationPercent = calculateMemberParticipation(userId, parleys, treasureMaps, anchors)
        state.participationPercent = participationPercent
      }
    }
  }
})

export const {
  recomputeAnchorCard,
  recomputeAllStats,
  recomputeMemberCard,
  recomputeParleyCard,
  recomputeTreasureMapCard,
  setHydrateDashboard
} = dashboardSlice.actions
export const dashboardReducer = dashboardSlice.reducer
