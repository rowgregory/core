'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Users,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Award,
  BarChart3,
  Filter,
  Eye,
  EyeOff,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Info
} from 'lucide-react'
// import { chapterId } from '@/app/lib/constants/api/chapterId'
import Picture from '@/app/components/common/Picture'
import TooltipWrapper from '@/app/components/common/TooltipWrapper'
// import { generateAdminCoreReport } from '@/app/lib/utils/reports/generateAdminCoreReport'
import { useSession } from 'next-auth/react'
// import { generateMemberMetrics } from '@/app/lib/actions/generateMemberMetrics'

const getOverallHealth = (memberJoinedAt: string | Date, engagementScore: number, networkingScore: number) => {
  const joinDate = typeof memberJoinedAt === 'string' ? new Date(memberJoinedAt) : memberJoinedAt
  const daysSinceJoin = Math.floor((Date.now() - joinDate.getTime()) / (1000 * 60 * 60 * 24))

  // Grace period for first year (365 days)
  if (daysSinceJoin < 365) {
    if (engagementScore >= 33) return 'excellent' // Any weekly activity = excellent
    if (engagementScore >= 0) return 'good' // Just being active = good
    return 'good' // Default to good during grace period
  }

  // Normal thresholds after grace period
  if (engagementScore >= 67 && networkingScore >= 25) return 'excellent'
  if (engagementScore >= 33 && networkingScore >= 15) return 'good'
  if (engagementScore >= 0 && networkingScore >= 5) return 'warning'
  return 'critical'
}

const getHealthColor = (health: string) => {
  switch (health) {
    case 'excellent':
      return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
    case 'good':
      return 'text-blue-400 bg-blue-500/10 border-blue-500/30'
    case 'warning':
      return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30'
    case 'critical':
      return 'text-red-400 bg-red-500/10 border-red-500/30'
    default:
      return 'text-gray-400 bg-gray-500/10 border-gray-500/30'
  }
}

const getHealthIcon = (health: string) => {
  switch (health) {
    case 'excellent':
      return CheckCircle
    case 'good':
      return CheckCircle
    case 'warning':
      return AlertTriangle
    case 'critical':
      return XCircle
    default:
      return Minus
  }
}

const getMetricStatus = (actual: number, target: number) => {
  const percentage = (actual / target) * 100
  if (percentage >= 100) return { status: 'excellent', icon: ArrowUpRight, color: 'text-emerald-400' }
  if (percentage >= 50) return { status: 'good', icon: ArrowUpRight, color: 'text-blue-400' }
  if (percentage >= 25) return { status: 'warning', icon: Minus, color: 'text-yellow-400' }
  return { status: 'critical', icon: ArrowDownRight, color: 'text-red-400' }
}

const calculateOverallStats = (members: any) => {
  const activeMembers = members?.filter((m: { membershipStatus: string }) => m.membershipStatus === 'ACTIVE')

  return {
    totalMembers: members?.length,
    activeMembers: activeMembers?.length,
    excellentHealth: members?.filter((m: { overallHealth: string }) => m.overallHealth === 'excellent').length,
    goodHealth: members?.filter((m: { overallHealth: string }) => m.overallHealth === 'good').length,
    warningHealth: members?.filter((m: { overallHealth: string }) => m.overallHealth === 'warning').length,
    criticalHealth: members?.filter((m: { overallHealth: string }) => m.overallHealth === 'critical').length,
    avgNetworkingScore:
      (
        activeMembers?.reduce(
          (sum: any, m: { scores: { networkingScore: any } }) => sum + m.scores.networkingScore,
          0
        ) / activeMembers?.length
      ).toFixed(2) || 0,
    avgEngagementScore:
      activeMembers?.reduce((sum: any, m: { scores: { engagementScore: any } }) => sum + m.scores.engagementScore, 0) /
        activeMembers?.length || 0,
    totalRevenue: activeMembers?.reduce((sum: any, m: { scores: { revenue: any } }) => sum + m.scores.revenue, 0),
    totalBusinessGiven: activeMembers?.reduce(
      (sum: any, m: { scores: { businessGiven: any } }) => sum + m.scores.businessGiven,
      0
    )
  }
}

const getActionItems = (members: any) => {
  const activeMembers = members?.filter((m: any) => m.membershipStatus === 'ACTIVE') || []

  // Check if member joined more than 1 year ago (grace period)
  const oneYearAgo = new Date()
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1)

  const isInGracePeriod = (member: any) => {
    if (!member.joinedAt) return true // If no join date, assume in grace period
    return new Date(member.joinedAt) > oneYearAgo
  }

  // Only flag critical health issues during grace period
  const criticalMembers = activeMembers.filter((m: any) => m.overallHealth === 'critical')

  // For warning members, only include those past grace period with genuinely low engagement
  const warningMembers = activeMembers.filter((m: any) => {
    if (isInGracePeriod(m)) return false // No warnings during grace period
    return m.overallHealth === 'warning' || (m.scores.networkingScore === 0 && m.scores.engagementScore === 0)
  })

  // Get top performers (anyone with any positive engagement)
  const topPerformers = activeMembers
    .filter((m: any) => m.scores.networkingScore > 0 || m.scores.engagementScore > 0)
    .sort(
      (a: any, b: any) =>
        b.scores.networkingScore + b.scores.engagementScore - (a.scores.networkingScore + a.scores.engagementScore)
    )
    .slice(0, 3) // Top 3 performers

  return { criticalMembers, warningMembers, topPerformers }
}

const AdminReportsPage: React.FC = () => {
  const session = useSession()
  const [selectedPeriod, setSelectedPeriod] = useState('weekly')
  const [filterStatus, setFilterStatus] = useState('all')
  const [showInactiveMembers, setShowInactiveMembers] = useState(true)
  const members = []

  // Calculate total external revenue for the entire chapter
  const totalExternalRevenue = members?.reduce((chapterSum: any, user: { allAnchors: { received: any[] } }) => {
    const userExternalRevenue =
      user.allAnchors?.received
        ?.filter((anchor) => !anchor.giverId)
        ?.reduce((sum, anchor) => {
          const value = Number(anchor.businessValue) || 0
          return sum + value
        }, 0) || 0

    return Number(chapterSum) + Number(userExternalRevenue)
  }, 0)

  const stats = calculateOverallStats(members)
  const { criticalMembers, warningMembers, topPerformers } = getActionItems(members)

  // const handleExport = async (e: { preventDefault: () => void }) => {
  //   e.preventDefault()

  //   const activeMembers = members?.filter((m: { membershipStatus: string }) => m.membershipStatus === 'ACTIVE')

  //   await generateAdminCoreReport(activeMembers, {
  //     title: 'Storm Watch Chapter',
  //     subtitle: `${selectedPeriod} Business Review`,
  //     colorScheme: 'nautical',
  //     includeDetailedBreakdown: true
  //   })
  // }

  const filteredMembers = members?.filter(
    (member: { joinedAt: string | Date; scores: { engagementScore: number; networkingScore: number } }) => {
      const overallHealth = getOverallHealth(
        member.joinedAt,
        member.scores.engagementScore,
        member.scores.networkingScore
      )
      if (overallHealth === filterStatus || filterStatus === 'all') {
        return true
      } else {
        return false
      }
    }
  )

  return (
    <div className="h-full bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      <div className="flex-1 mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          {/* <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">CORE Chapter Reports</h1>
              <p className="text-gray-400">Enhanced stoplight system with comprehensive member analytics</p>
            </div>
            <div className="flex items-center space-x-3 mt-4 sm:mt-0">
              <button
                onClick={handleExport}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-700/50 hover:bg-gray-700/70 border border-gray-600 rounded-lg text-gray-300 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
              <button
                onClick={() => refetch()}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-colors"
              >
                <RefreshCw className={`${isFetching ? 'animate-spin' : ''} w-4 h-4`} />
                <span>Refresh</span>
              </button>
            </div>
          </div> */}

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-4 p-4 bg-gray-800/40 border border-gray-700/50 rounded-xl backdrop-blur-sm">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-400">Filters:</span>
            </div>
            <select
              value={selectedPeriod}
              onChange={(e) => {
                setSelectedPeriod(e.target.value)
              }}
              className="px-3 py-1.5 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="weekly">This Week</option>
              <option value="monthly">This Month</option>
              <option value="quarterly">This Quarter</option>
              <option value="yearly">This Year</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-1.5 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Members</option>
              <option value="excellent">Excellent Health</option>
              <option value="warning">Needs Attention</option>
              <option value="critical">Critical</option>
            </select>
            <button
              onClick={() => setShowInactiveMembers(!showInactiveMembers)}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                showInactiveMembers
                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                  : 'bg-gray-700 text-gray-400 border border-gray-600'
              }`}
            >
              {showInactiveMembers ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              <span>Inactive Members</span>
            </button>
          </div>
        </motion.div>

        {/* Overview Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8"
        >
          <div className="bg-gray-800/40 border border-gray-700/50 rounded-xl p-4 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-5 h-5 text-blue-400" />
              <span className="text-xs text-gray-400">Total</span>
            </div>
            <div className="text-2xl font-bold text-white">{stats.totalMembers}</div>
            <div className="text-xs text-gray-400">Members</div>
          </div>

          <div className="bg-gray-800/40 border border-gray-700/50 rounded-xl p-4 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
              <span className="text-xs text-gray-400">Excellent</span>
            </div>
            <div className="text-2xl font-bold text-emerald-400">{stats.excellentHealth}</div>
            <div className="text-xs text-gray-400">Health</div>
          </div>

          <div className="bg-gray-800/40 border border-gray-700/50 rounded-xl p-4 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-2">
              <AlertTriangle className="w-5 h-5 text-yellow-400" />
              <span className="text-xs text-gray-400">Warning</span>
            </div>
            <div className="text-2xl font-bold text-yellow-400">{stats.warningHealth}</div>
            <div className="text-xs text-gray-400">Attention</div>
          </div>

          <div className="bg-gray-800/40 border border-gray-700/50 rounded-xl p-4 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-2">
              <XCircle className="w-5 h-5 text-red-400" />
              <span className="text-xs text-gray-400">Critical</span>
            </div>
            <div className="text-2xl font-bold text-red-400">{stats.criticalHealth}</div>
            <div className="text-xs text-gray-400">Issues</div>
          </div>

          <div className="bg-gray-800/40 border border-gray-700/50 rounded-xl p-4 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-2">
              <BarChart3 className="w-5 h-5 text-purple-400" />
              <span className="text-xs text-gray-400">Avg</span>
            </div>
            <div className="text-2xl font-bold text-white">{stats?.avgNetworkingScore}</div>
            <div className="text-xs text-gray-400">Network Score</div>
          </div>

          <div className="bg-gray-800/40 border border-gray-700/50 rounded-xl p-4 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-5 h-5 text-green-400" />
              <span className="text-xs text-gray-400">Total</span>
            </div>
            <div className="text-2xl font-bold text-white">
              ${(stats?.totalRevenue + totalExternalRevenue)?.toLocaleString()}k
            </div>
            <div className="flex items-center justify-between">
              <div className="text-xs text-gray-400">Revenue</div>
              {totalExternalRevenue > 0 && (
                <div className="text-xs text-orange-400">
                  {Math.round((totalExternalRevenue / stats.totalRevenue) * 100)}% external
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Enhanced CORE Stoplight */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-800/40 border border-gray-700/50 rounded-xl overflow-hidden"
        >
          <TooltipWrapper
            tooltip={`Network Score measures your total CORE activity for the selected time period. It counts everything you do AND everything others do with you - giving and receiving referrals (treasure maps), thank-yous for business (anchors), and meeting requests (parleys). The system adds up all 6 types of activities and compares it to a target number. For example, weekly targets 6 total activities, monthly targets 24. If you hit the target, you get 100%. Engagement Score focuses only on what you can control - whether you're actively giving referrals, thanking people for business, and requesting meetings. It checks if you've done each of these 3 things enough times for the period and gives you credit for each one you complete. This score encourages you to take initiative rather than just wait for others to engage with you.`}
            className="inline-block"
          >
            <div className="p-6 border-b border-gray-700/50">
              <div className="flex items-center gap-x-4">
                <h2 className="text-2xl font-bold text-white">Enhanced CORE Stoplight Report</h2>
                <Info className="w-4 h-4 text-gray-400" />
              </div>
            </div>
          </TooltipWrapper>

          {/* Member List */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700/30">
                <tr className="text-left">
                  <th className="px-6 py-4 text-sm font-semibold text-gray-300">Member</th>
                  <th className="px-4 py-4 text-sm font-semibold text-gray-300">
                    <div className="flex items-center space-x-1 relative">
                      <span>Health</span>
                      <Info className="w-3 h-3 text-gray-400" />
                    </div>
                  </th>
                  <th className="px-4 py-4 text-sm font-semibold text-gray-300">Treasure Maps</th>
                  <th className="px-4 py-4 text-sm font-semibold text-gray-300">Anchors</th>
                  <th className="px-4 py-4 text-sm font-semibold text-gray-300">Parleys</th>
                  <th className="px-4 py-4 text-sm font-semibold text-gray-300">
                    <div className="flex items-center space-x-1 relative">
                      <span>Attendance</span>
                      <Info className="w-3 h-3 text-gray-400" />
                    </div>
                  </th>
                  <th className="px-4 py-4 text-sm font-semibold text-gray-300">Network Score</th>
                  <th className="px-4 py-4 text-sm font-semibold text-gray-300">Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700/50">
                {filteredMembers?.map((member: any, index: number) => {
                  const HealthIcon = getHealthIcon(member.overallHealth)
                  const treasureMapStatus = getMetricStatus(
                    member.metrics.treasureMaps.given,
                    member.metrics.treasureMaps.target
                  )
                  const anchorStatus = getMetricStatus(member.metrics.anchors.given, member.metrics.anchors.target)
                  const parleyStatus = getMetricStatus(member.metrics.parleys.requested, member.metrics.parleys.target)
                  const attendancePercentage =
                    (member.metrics.attendance.present / member.metrics.attendance.total) * 100

                  const overallHealth = getOverallHealth(
                    member.joinedAt,
                    member.scores.engagementScore,
                    member.scores.networkingScore
                  )

                  return (
                    <motion.tr
                      key={member.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 * index }}
                      className="hover:bg-gray-700/20 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          {member?.profileImage ? (
                            <Picture
                              src={member?.profileImage}
                              className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center object-cover"
                              priority={false}
                            />
                          ) : (
                            <div className="shrink-0 w-10 h-10 bg-linear-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center">
                              <span className="text-white font-semibold text-sm">
                                {member.name
                                  .split(' ')
                                  .map((n: any[]) => n[0])
                                  .join('')}
                              </span>
                            </div>
                          )}
                          <div>
                            <div className="font-semibold text-white">{member.name}</div>
                            <div className="text-sm text-gray-400">{member.company}</div>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <div
                          className={`inline-flex items-center space-x-2 px-3 py-1 rounded-lg border ${getHealthColor(overallHealth)}`}
                        >
                          <HealthIcon className="w-4 h-4" />
                          <span className="text-sm font-medium capitalize">{overallHealth}</span>
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex items-center space-x-2">
                          <treasureMapStatus.icon className={`w-4 h-4 ${treasureMapStatus.color}`} />
                          <div>
                            <div className="text-sm font-semibold text-white">
                              {member.metrics.treasureMaps.given}/{member.metrics.treasureMaps.target}
                            </div>
                            <div className="text-xs text-gray-400">
                              +{member.metrics.treasureMaps.received} received
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex items-center space-x-2">
                          <anchorStatus.icon className={`w-4 h-4 ${anchorStatus.color}`} />
                          <div>
                            <div className="text-sm font-semibold text-white">
                              {member.metrics.anchors.given}/{member.metrics.anchors.target}
                            </div>
                            <div className="text-xs text-gray-400">+{member.metrics.anchors.received} received</div>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex items-center space-x-2">
                          <parleyStatus.icon className={`w-4 h-4 ${parleyStatus.color}`} />
                          <div>
                            <div className="text-sm font-semibold text-white">
                              {member.metrics.parleys.requested}/{member.metrics.parleys.target}
                            </div>
                            <div className="text-xs text-gray-400">+{member.metrics.parleys.received} received</div>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex items-center space-x-2 opacity-50">
                          <div className="w-3 h-3 rounded-full bg-gray-500" />
                          <div>
                            <div className="text-sm font-semibold text-gray-500">
                              {attendancePercentage.toFixed(0)}%
                            </div>
                            <div className="text-xs text-gray-500">
                              {member.metrics.attendance.present}/{member.metrics.attendance.total} meetings
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-400">Network</span>
                            <span className="text-lg font-bold text-gray-300">{member.scores.networkingScore}%</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-400">Engagement</span>
                            <span className="text-sm font-semibold text-white">{member.scores.engagementScore}%</span>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <div>
                          <div className="text-sm font-semibold text-white">
                            ${(member.scores.revenue / 1000).toFixed(0)}k
                          </div>
                          <div className="text-xs text-gray-400 whitespace-nowrap">
                            Given: ${member.scores.businessGiven?.toLocaleString()}k
                          </div>
                          {session.data?.user?.id === member?.id && (
                            <div className="text-xs text-gray-400">
                              Received: ${member.scores.businessReceived?.toLocaleString()}k
                            </div>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Action Items */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <div className="bg-gray-800/40 border border-gray-700/50 rounded-xl p-6 backdrop-blur-sm">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2 text-yellow-400" />
              Action Required
            </h3>
            <div className="space-y-3">
              {criticalMembers.length === 0 && warningMembers.length === 0 ? (
                <div className="text-gray-400 text-sm italic">No immediate action items</div>
              ) : (
                <>
                  {criticalMembers.map((member: any) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between p-3 bg-red-500/10 border border-red-500/30 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <XCircle className="w-4 h-4 text-red-400" />
                        <div>
                          <div className="font-semibold text-red-400">{member.name}</div>
                          <div className="text-xs text-gray-400">Critical health - needs immediate attention</div>
                        </div>
                      </div>
                      <button className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-white text-xs transition-colors">
                        Contact
                      </button>
                    </div>
                  ))}
                  {warningMembers.slice(0, 3).map((member: any) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <AlertTriangle className="w-4 h-4 text-yellow-400" />
                        <div>
                          <div className="font-semibold text-yellow-400">{member.name}</div>
                          <div className="text-xs text-gray-400">
                            {member.overallHealth === 'warning'
                              ? 'Warning health status'
                              : 'No engagement after 1+ years'}
                          </div>
                        </div>
                      </div>
                      <button className="px-3 py-1 bg-yellow-600 hover:bg-yellow-700 rounded text-white text-xs transition-colors">
                        Review
                      </button>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>

          <div className="bg-gray-800/40 border border-gray-700/50 rounded-xl p-6 backdrop-blur-sm">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center">
              <Award className="w-5 h-5 mr-2 text-emerald-400" />
              Top Performers
            </h3>
            <div className="space-y-3">
              {topPerformers.length === 0 ? (
                <div className="text-gray-400 text-sm italic">
                  Building momentum... Any member activity will show here!
                </div>
              ) : (
                topPerformers.map((member: any, index: number) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                      <div>
                        <div className="font-semibold text-emerald-400">{member.name}</div>
                        <div className="text-xs text-gray-400">
                          Networking: {member.scores.networkingScore} • Engagement: {member.scores.engagementScore}
                        </div>
                      </div>
                    </div>
                    <div className="text-emerald-400 font-bold">{index === 0 ? '🏆' : index === 1 ? '🥈' : '🥉'}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default AdminReportsPage
