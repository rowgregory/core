'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Calendar,
  Users,
  UserCheck,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  MapPin,
  Edit3,
  Search,
  Eye,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Minus,
  Phone,
  Mail,
  UserPlus,
  Award,
  Target,
  CalendarDays,
  Timer,
  Compass
} from 'lucide-react'

interface MusterRecord {
  id: string
  date: string
  meetingType: 'regular' | 'leadership' | 'visitor_day' | 'special'
  location: string
  totalCapacity: number
  musterData: {
    memberId: string
    memberName: string
    industry: string
    status: 'present' | 'absent' | 'excused' | 'substitute' | 'visitor'
    arrivalTime?: string
    departureTime?: string
    substituteFor?: string
    excuseReason?: string
    contactAttempts?: number
  }[]
  weatherConditions?: string
  specialNotes?: string
  guestSpeaker?: string
}

interface MemberMusterStats {
  memberId: string
  memberName: string
  industry: string
  joinDate: string
  totalMeetings: number
  presentCount: number
  absentCount: number
  excusedCount: number
  substituteCount: number
  attendanceRate: number
  perfectAttendanceStreak: number
  lastAbsence?: string
  contactInfo: {
    phone: string
    email: string
  }
  membershipStatus: 'active' | 'probation' | 'suspended'
  attendanceTrend: 'improving' | 'stable' | 'declining'
}

const AdminMusterPage: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('current_quarter')
  const [viewMode, setViewMode] = useState<'summary' | 'detailed' | 'individual'>('summary')
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [showProbationMembers, setShowProbationMembers] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  // Mock data - replace with actual data
  const recentMuster: MusterRecord = {
    id: '1',
    date: '2025-01-10',
    meetingType: 'regular',
    location: 'Harbor Conference Room',
    totalCapacity: 25,
    weatherConditions: 'Clear skies, light breeze',
    guestSpeaker: 'Captain Sarah Martinez - Maritime Law',
    musterData: [
      {
        memberId: '1',
        memberName: 'John Smith',
        industry: 'Technology',
        status: 'present',
        arrivalTime: '07:00',
        departureTime: '08:30'
      },
      {
        memberId: '2',
        memberName: 'Sarah Johnson',
        industry: 'Marketing',
        status: 'present',
        arrivalTime: '07:05',
        departureTime: '08:30'
      },
      {
        memberId: '3',
        memberName: 'Mike Davis',
        industry: 'Finance',
        status: 'absent',
        contactAttempts: 2
      },
      {
        memberId: '4',
        memberName: 'Lisa Chen',
        industry: 'Legal',
        status: 'excused',
        excuseReason: 'Business travel - client meeting'
      },
      {
        memberId: '5',
        memberName: 'Tom Wilson',
        industry: 'Real Estate',
        status: 'substitute',
        substituteFor: 'Mark Thompson'
      }
    ],
    specialNotes: 'New member orientation conducted. Discussed upcoming charity regatta.'
  }

  const memberStats: MemberMusterStats[] = [
    {
      memberId: '1',
      memberName: 'John Smith',
      industry: 'Technology',
      joinDate: '2024-01-15',
      totalMeetings: 48,
      presentCount: 46,
      absentCount: 1,
      excusedCount: 1,
      substituteCount: 0,
      attendanceRate: 95.8,
      perfectAttendanceStreak: 12,
      contactInfo: { phone: '555-0101', email: 'john@techcorp.com' },
      membershipStatus: 'active',
      attendanceTrend: 'stable'
    },
    {
      memberId: '2',
      memberName: 'Sarah Johnson',
      industry: 'Marketing',
      joinDate: '2024-02-20',
      totalMeetings: 44,
      presentCount: 38,
      absentCount: 4,
      excusedCount: 2,
      substituteCount: 0,
      attendanceRate: 86.4,
      perfectAttendanceStreak: 3,
      lastAbsence: '2024-12-15',
      contactInfo: { phone: '555-0102', email: 'sarah@marketpro.com' },
      membershipStatus: 'active',
      attendanceTrend: 'improving'
    },
    {
      memberId: '3',
      memberName: 'Mike Davis',
      industry: 'Finance',
      joinDate: '2024-03-10',
      totalMeetings: 40,
      presentCount: 28,
      absentCount: 10,
      excusedCount: 2,
      substituteCount: 0,
      attendanceRate: 70.0,
      perfectAttendanceStreak: 0,
      lastAbsence: '2025-01-10',
      contactInfo: { phone: '555-0103', email: 'mike@financefirm.com' },
      membershipStatus: 'probation',
      attendanceTrend: 'declining'
    },
    {
      memberId: '4',
      memberName: 'Lisa Chen',
      industry: 'Legal',
      joinDate: '2023-09-05',
      totalMeetings: 65,
      presentCount: 58,
      absentCount: 3,
      excusedCount: 4,
      substituteCount: 0,
      attendanceRate: 89.2,
      perfectAttendanceStreak: 8,
      contactInfo: { phone: '555-0104', email: 'lisa@legalpartners.com' },
      membershipStatus: 'active',
      attendanceTrend: 'stable'
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
      case 'excused':
        return 'text-blue-400 bg-blue-500/10 border-blue-500/30'
      case 'substitute':
        return 'text-purple-400 bg-purple-500/10 border-purple-500/30'
      case 'visitor':
        return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30'
      case 'absent':
        return 'text-red-400 bg-red-500/10 border-red-500/30'
      default:
        return 'text-gray-400 bg-gray-500/10 border-gray-500/30'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present':
        return CheckCircle
      case 'excused':
        return Clock
      case 'substitute':
        return UserPlus
      case 'visitor':
        return Eye
      case 'absent':
        return XCircle
      default:
        return Minus
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving':
        return TrendingUp
      case 'declining':
        return TrendingDown
      case 'stable':
        return Minus
      default:
        return Minus
    }
  }

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'improving':
        return 'text-emerald-400'
      case 'declining':
        return 'text-red-400'
      case 'stable':
        return 'text-blue-400'
      default:
        return 'text-gray-400'
    }
  }

  const calculateOverallStats = () => {
    const totalMembers = memberStats.length
    const activeMembers = memberStats.filter((m) => m.membershipStatus === 'active').length
    const onProbation = memberStats.filter((m) => m.membershipStatus === 'probation').length
    const avgAttendanceRate = memberStats.reduce((sum, m) => sum + m.attendanceRate, 0) / totalMembers
    const perfectAttendanceMembers = memberStats.filter((m) => m.attendanceRate >= 90).length
    const needsAttention = memberStats.filter((m) => m.attendanceRate < 80).length

    const lastMuster = recentMuster
    const presentToday = lastMuster.musterData.filter((m) => m.status === 'present').length
    const totalExpected = lastMuster.musterData.length

    return {
      totalMembers,
      activeMembers,
      onProbation,
      avgAttendanceRate: Math.round(avgAttendanceRate * 10) / 10,
      perfectAttendanceMembers,
      needsAttention,
      presentToday,
      totalExpected,
      lastMusterRate: Math.round((presentToday / totalExpected) * 100)
    }
  }

  const overallStats = calculateOverallStats()

  return (
    <div className="h-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      <div className="flex-1 mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          {/* <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2 flex items-center">
                <Anchor className="w-8 h-8 mr-3 text-blue-400" />
                Chapter Muster
              </h1>
              <p className="text-gray-400">Track crew attendance, monitor patterns, and maintain ship discipline</p>
            </div>
            <div className="flex items-center space-x-3 mt-4 sm:mt-0">
              <button className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg text-white transition-colors">
                <Plus className="w-4 h-4" />
                <span>New Muster</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 bg-gray-700/50 hover:bg-gray-700/70 border border-gray-600 rounded-lg text-gray-300 transition-colors">
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
            </div>
          </div> */}

          {/* Controls */}
          <div className="flex flex-wrap items-center gap-4 p-4 bg-gray-800/40 border border-gray-700/50 rounded-xl backdrop-blur-sm">
            <div className="flex items-center space-x-2">
              <Compass className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-400">Navigation:</span>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('summary')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  viewMode === 'summary'
                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    : 'bg-gray-700 text-gray-400 border border-gray-600 hover:bg-gray-700/70'
                }`}
              >
                Fleet Overview
              </button>
              <button
                onClick={() => setViewMode('detailed')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  viewMode === 'detailed'
                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    : 'bg-gray-700 text-gray-400 border border-gray-600 hover:bg-gray-700/70'
                }`}
              >
                Daily Muster
              </button>
              <button
                onClick={() => setViewMode('individual')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  viewMode === 'individual'
                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    : 'bg-gray-700 text-gray-400 border border-gray-600 hover:bg-gray-700/70'
                }`}
              >
                Crew Records
              </button>
            </div>

            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-3 py-1.5 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="current_week">This Week</option>
              <option value="current_month">This Month</option>
              <option value="current_quarter">This Quarter</option>
              <option value="current_year">This Year</option>
            </select>

            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search crew..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-1.5 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              onClick={() => setShowProbationMembers(!showProbationMembers)}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                showProbationMembers
                  ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                  : 'bg-gray-700 text-gray-400 border border-gray-600'
              }`}
            >
              <AlertTriangle className="w-4 h-4" />
              <span>Show Probation</span>
            </button>
          </div>
        </motion.div>

        {/* Overview Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8"
        >
          <div className="bg-gray-800/40 border border-gray-700/50 rounded-xl p-4 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-5 h-5 text-blue-400" />
              <span className="text-xs text-gray-400">Crew</span>
            </div>
            <div className="text-2xl font-bold text-white">{overallStats.totalMembers}</div>
            <div className="text-xs text-gray-400">Total Members</div>
          </div>

          <div className="bg-gray-800/40 border border-gray-700/50 rounded-xl p-4 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-2">
              <UserCheck className="w-5 h-5 text-emerald-400" />
              <span className="text-xs text-gray-400">Present</span>
            </div>
            <div className="text-2xl font-bold text-emerald-400">{overallStats.presentToday}</div>
            <div className="text-xs text-gray-400">Last Muster</div>
          </div>

          <div className="bg-gray-800/40 border border-gray-700/50 rounded-xl p-4 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-2">
              <Target className="w-5 h-5 text-blue-400" />
              <span className="text-xs text-gray-400">Rate</span>
            </div>
            <div className="text-2xl font-bold text-white">{overallStats.lastMusterRate}%</div>
            <div className="text-xs text-gray-400">Last Meeting</div>
          </div>

          <div className="bg-gray-800/40 border border-gray-700/50 rounded-xl p-4 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-2">
              <BarChart3 className="w-5 h-5 text-purple-400" />
              <span className="text-xs text-gray-400">Average</span>
            </div>
            <div className="text-2xl font-bold text-white">{overallStats.avgAttendanceRate}%</div>
            <div className="text-xs text-gray-400">Attendance</div>
          </div>

          <div className="bg-gray-800/40 border border-gray-700/50 rounded-xl p-4 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-2">
              <Award className="w-5 h-5 text-emerald-400" />
              <span className="text-xs text-gray-400">Perfect</span>
            </div>
            <div className="text-2xl font-bold text-emerald-400">{overallStats.perfectAttendanceMembers}</div>
            <div className="text-xs text-gray-400">90%+ Rate</div>
          </div>

          <div className="bg-gray-800/40 border border-gray-700/50 rounded-xl p-4 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-2">
              <AlertTriangle className="w-5 h-5 text-yellow-400" />
              <span className="text-xs text-gray-400">Probation</span>
            </div>
            <div className="text-2xl font-bold text-yellow-400">{overallStats.onProbation}</div>
            <div className="text-xs text-gray-400">Members</div>
          </div>

          <div className="bg-gray-800/40 border border-gray-700/50 rounded-xl p-4 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-2">
              <XCircle className="w-5 h-5 text-red-400" />
              <span className="text-xs text-gray-400">Attention</span>
            </div>
            <div className="text-2xl font-bold text-red-400">{overallStats.needsAttention}</div>
            <div className="text-xs text-gray-400">Needed</div>
          </div>
        </motion.div>

        {/* Content based on view mode */}
        {viewMode === 'summary' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-800/40 border border-gray-700/50 rounded-xl backdrop-blur-sm overflow-hidden"
          >
            <div className="p-6 border-b border-gray-700/50">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white flex items-center">
                  <Users className="w-6 h-6 mr-2" />
                  Fleet Overview - Crew Muster Records
                </h2>
                <div className="flex items-center space-x-2 text-sm text-gray-400">
                  <CalendarDays className="w-4 h-4" />
                  <span>Updated continuously</span>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-700/30">
                  <tr className="text-left">
                    <th className="px-6 py-4 text-sm font-semibold text-gray-300">Crew Member</th>
                    <th className="px-4 py-4 text-sm font-semibold text-gray-300">Status</th>
                    <th className="px-4 py-4 text-sm font-semibold text-gray-300">Attendance Rate</th>
                    <th className="px-4 py-4 text-sm font-semibold text-gray-300">Streak</th>
                    <th className="px-4 py-4 text-sm font-semibold text-gray-300">Trend</th>
                    <th className="px-4 py-4 text-sm font-semibold text-gray-300">Last Absence</th>
                    <th className="px-4 py-4 text-sm font-semibold text-gray-300">Contact</th>
                    <th className="px-4 py-4 text-sm font-semibold text-gray-300">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700/50">
                  {memberStats.map((member, index) => {
                    const TrendIcon = getTrendIcon(member.attendanceTrend)
                    const memberStatusColor =
                      member.membershipStatus === 'active'
                        ? 'text-emerald-400'
                        : member.membershipStatus === 'probation'
                          ? 'text-yellow-400'
                          : 'text-red-400'

                    return (
                      <motion.tr
                        key={member.memberId}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * index }}
                        className="hover:bg-gray-700/20 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <div className="flex-shrink-0 w-10 h-10 bg-linear-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                              <span className="text-white font-semibold text-sm">
                                {member.memberName
                                  .split(' ')
                                  .map((n) => n[0])
                                  .join('')}
                              </span>
                            </div>
                            <div>
                              <div className="font-semibold text-white">{member.memberName}</div>
                              <div className="text-sm text-gray-400">{member.industry}</div>
                              <div className={`text-xs font-medium ${memberStatusColor}`}>
                                {member.membershipStatus.toUpperCase()}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-4">
                          <div className="text-center">
                            <div className="text-lg font-bold text-white">
                              {member.presentCount}/{member.totalMeetings}
                            </div>
                            <div className="text-xs text-gray-400">P/A/E/S</div>
                            <div className="text-xs text-gray-400">
                              {member.presentCount}/{member.absentCount}/{member.excusedCount}/{member.substituteCount}
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-4">
                          <div className="flex items-center space-x-3">
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <span
                                  className={`text-lg font-bold ${
                                    member.attendanceRate >= 90
                                      ? 'text-emerald-400'
                                      : member.attendanceRate >= 80
                                        ? 'text-blue-400'
                                        : member.attendanceRate >= 70
                                          ? 'text-yellow-400'
                                          : 'text-red-400'
                                  }`}
                                >
                                  {member.attendanceRate}%
                                </span>
                              </div>
                              <div className="w-full bg-gray-700/50 rounded-full h-2">
                                <div
                                  className={`h-2 rounded-full ${
                                    member.attendanceRate >= 90
                                      ? 'bg-emerald-500'
                                      : member.attendanceRate >= 80
                                        ? 'bg-blue-500'
                                        : member.attendanceRate >= 70
                                          ? 'bg-yellow-500'
                                          : 'bg-red-500'
                                  }`}
                                  style={{ width: `${member.attendanceRate}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-4 text-center">
                          <div
                            className={`inline-flex items-center space-x-1 px-2 py-1 rounded-lg text-sm font-medium ${
                              member.perfectAttendanceStreak >= 10
                                ? 'bg-emerald-500/20 text-emerald-400'
                                : member.perfectAttendanceStreak >= 5
                                  ? 'bg-blue-500/20 text-blue-400'
                                  : member.perfectAttendanceStreak > 0
                                    ? 'bg-yellow-500/20 text-yellow-400'
                                    : 'bg-gray-500/20 text-gray-400'
                            }`}
                          >
                            {member.perfectAttendanceStreak >= 10 && <Award className="w-3 h-3" />}
                            <span>{member.perfectAttendanceStreak}</span>
                          </div>
                          <div className="text-xs text-gray-400 mt-1">meetings</div>
                        </td>

                        <td className="px-4 py-4">
                          <div className="flex items-center space-x-2">
                            <TrendIcon className={`w-4 h-4 ${getTrendColor(member.attendanceTrend)}`} />
                            <span className={`text-sm font-medium capitalize ${getTrendColor(member.attendanceTrend)}`}>
                              {member.attendanceTrend}
                            </span>
                          </div>
                        </td>

                        <td className="px-4 py-4">
                          {member.lastAbsence ? (
                            <div className="text-sm text-gray-400">
                              {new Date(member.lastAbsence).toLocaleDateString()}
                            </div>
                          ) : (
                            <div className="text-sm text-emerald-400">No recent absence</div>
                          )}
                        </td>

                        <td className="px-4 py-4">
                          <div className="flex items-center space-x-2">
                            <button className="p-1 text-gray-400 hover:text-blue-400 transition-colors">
                              <Phone className="w-4 h-4" />
                            </button>
                            <button className="p-1 text-gray-400 hover:text-blue-400 transition-colors">
                              <Mail className="w-4 h-4" />
                            </button>
                          </div>
                        </td>

                        <td className="px-4 py-4">
                          <div className="flex items-center space-x-2">
                            <button className="p-1 text-gray-400 hover:text-blue-400 transition-colors">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="p-1 text-gray-400 hover:text-emerald-400 transition-colors">
                              <Edit3 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {viewMode === 'detailed' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-800/40 border border-gray-700/50 rounded-xl backdrop-blur-sm"
          >
            <div className="p-6 border-b border-gray-700/50">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white flex items-center">
                  <Calendar className="w-6 h-6 mr-2" />
                  Daily Muster - {new Date(recentMuster.date).toLocaleDateString()}
                </h2>
                <div className="flex items-center space-x-4">
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white text-sm transition-colors">
                    Load Muster
                  </button>
                </div>
              </div>
            </div>

            <div className="p-6">
              {/* Meeting Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gray-700/30 rounded-xl p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <MapPin className="w-4 h-4 text-blue-400" />
                    <h3 className="font-semibold text-white">Location</h3>
                  </div>
                  <p className="text-gray-300">{recentMuster.location}</p>
                  <p className="text-sm text-gray-400 mt-1">Capacity: {recentMuster.totalCapacity}</p>
                </div>

                <div className="bg-gray-700/30 rounded-xl p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Users className="w-4 h-4 text-emerald-400" />
                    <h3 className="font-semibold text-white">Attendance</h3>
                  </div>
                  <p className="text-2xl font-bold text-emerald-400">
                    {recentMuster.musterData.filter((m) => m.status === 'present').length}/
                    {recentMuster.musterData.length}
                  </p>
                  <p className="text-sm text-gray-400">
                    {Math.round(
                      (recentMuster.musterData.filter((m) => m.status === 'present').length /
                        recentMuster.musterData.length) *
                        100
                    )}
                    % present
                  </p>
                </div>

                <div className="bg-gray-700/30 rounded-xl p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Calendar className="w-4 h-4 text-purple-400" />
                    <h3 className="font-semibold text-white">Meeting Type</h3>
                  </div>
                  <p className="text-gray-300 capitalize">{recentMuster.meetingType.replace('_', ' ')}</p>
                  {recentMuster.guestSpeaker && (
                    <p className="text-sm text-gray-400 mt-1">Speaker: {recentMuster.guestSpeaker}</p>
                  )}
                </div>
              </div>

              {/* Weather & Notes */}
              {(recentMuster.weatherConditions || recentMuster.specialNotes) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {recentMuster.weatherConditions && (
                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                      <h3 className="font-semibold text-blue-400 mb-2">Weather Conditions</h3>
                      <p className="text-gray-300">{recentMuster.weatherConditions}</p>
                    </div>
                  )}
                  {recentMuster.specialNotes && (
                    <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4">
                      <h3 className="font-semibold text-purple-400 mb-2">Special Notes</h3>
                      <p className="text-gray-300">{recentMuster.specialNotes}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Detailed Attendance List */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-white">Crew Roll Call</h3>
                <div className="grid gap-4">
                  {recentMuster.musterData.map((member, index) => {
                    const StatusIcon = getStatusIcon(member.status)
                    return (
                      <motion.div
                        key={member.memberId}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.05 * index }}
                        className="flex items-center justify-between p-4 bg-gray-700/20 rounded-lg hover:bg-gray-700/30 transition-colors"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="flex-shrink-0 w-12 h-12 bg-linear-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-semibold">
                              {member.memberName
                                .split(' ')
                                .map((n) => n[0])
                                .join('')}
                            </span>
                          </div>
                          <div>
                            <h4 className="font-semibold text-white">{member.memberName}</h4>
                            <p className="text-sm text-gray-400">{member.industry}</p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-4">
                          {/* Status */}
                          <div
                            className={`inline-flex items-center space-x-2 px-3 py-1 rounded-lg border ${getStatusColor(member.status)}`}
                          >
                            <StatusIcon className="w-4 h-4" />
                            <span className="text-sm font-medium capitalize">{member.status}</span>
                          </div>

                          {/* Time Info */}
                          {member.arrivalTime && (
                            <div className="text-sm text-gray-400">
                              <div className="flex items-center space-x-1">
                                <Clock className="w-3 h-3" />
                                <span>In: {member.arrivalTime}</span>
                              </div>
                              {member.departureTime && (
                                <div className="flex items-center space-x-1 mt-1">
                                  <Timer className="w-3 h-3" />
                                  <span>Out: {member.departureTime}</span>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Special Notes */}
                          {member.excuseReason && (
                            <div className="text-sm text-blue-400 max-w-xs">
                              <strong>Excuse:</strong> {member.excuseReason}
                            </div>
                          )}

                          {member.substituteFor && (
                            <div className="text-sm text-purple-400">
                              <strong>Substitute for:</strong> {member.substituteFor}
                            </div>
                          )}

                          {member.contactAttempts && member.contactAttempts > 0 && (
                            <div className="text-sm text-yellow-400">
                              <strong>Contact attempts:</strong> {member.contactAttempts}
                            </div>
                          )}

                          {/* Actions */}
                          <div className="flex items-center space-x-2">
                            <button className="p-2 text-gray-400 hover:text-blue-400 rounded-lg hover:bg-blue-500/10 transition-colors">
                              <Edit3 className="w-4 h-4" />
                            </button>
                            {member.status === 'absent' && (
                              <button className="p-2 text-gray-400 hover:text-emerald-400 rounded-lg hover:bg-emerald-500/10 transition-colors">
                                <Phone className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {viewMode === 'individual' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {memberStats.map((member, index) => {
              const TrendIcon = getTrendIcon(member.attendanceTrend)
              return (
                <motion.div
                  key={member.memberId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="bg-gray-800/40 border border-gray-700/50 rounded-xl backdrop-blur-sm p-6"
                >
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-linear-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-lg">
                          {member.memberName
                            .split(' ')
                            .map((n) => n[0])
                            .join('')}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-white">{member.memberName}</h3>
                        <p className="text-gray-400">{member.industry}</p>
                        <div className="flex items-center space-x-4 mt-2">
                          <span className="text-sm text-gray-400">
                            Joined: {new Date(member.joinDate).toLocaleDateString()}
                          </span>
                          <div
                            className={`px-2 py-1 rounded text-xs font-medium ${
                              member.membershipStatus === 'active'
                                ? 'bg-emerald-500/20 text-emerald-400'
                                : member.membershipStatus === 'probation'
                                  ? 'bg-yellow-500/20 text-yellow-400'
                                  : 'bg-red-500/20 text-red-400'
                            }`}
                          >
                            {member.membershipStatus.toUpperCase()}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="flex items-center space-x-2 mb-2">
                        <TrendIcon className={`w-5 h-5 ${getTrendColor(member.attendanceTrend)}`} />
                        <span className={`font-semibold ${getTrendColor(member.attendanceTrend)}`}>
                          {member.attendanceRate}%
                        </span>
                      </div>
                      <div className="text-sm text-gray-400">Overall Rate</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                    <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3 text-center">
                      <div className="text-2xl font-bold text-emerald-400">{member.presentCount}</div>
                      <div className="text-xs text-emerald-400">Present</div>
                    </div>
                    <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-center">
                      <div className="text-2xl font-bold text-red-400">{member.absentCount}</div>
                      <div className="text-xs text-red-400">Absent</div>
                    </div>
                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 text-center">
                      <div className="text-2xl font-bold text-blue-400">{member.excusedCount}</div>
                      <div className="text-xs text-blue-400">Excused</div>
                    </div>
                    <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-3 text-center">
                      <div className="text-2xl font-bold text-purple-400">{member.substituteCount}</div>
                      <div className="text-xs text-purple-400">Substitute</div>
                    </div>
                    <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 text-center">
                      <div className="text-2xl font-bold text-yellow-400">{member.perfectAttendanceStreak}</div>
                      <div className="text-xs text-yellow-400">Streak</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white text-sm transition-colors">
                        <Eye className="w-4 h-4" />
                        <span>View Details</span>
                      </button>
                      <button className="flex items-center space-x-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white text-sm transition-colors">
                        <Phone className="w-4 h-4" />
                        <span>{member.contactInfo.phone}</span>
                      </button>
                      <button className="flex items-center space-x-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white text-sm transition-colors">
                        <Mail className="w-4 h-4" />
                        <span>Email</span>
                      </button>
                    </div>

                    {member.lastAbsence && (
                      <div className="text-sm text-gray-400">
                        Last absence: {new Date(member.lastAbsence).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        )}

        {/* Quick Actions Footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6">
            <h3 className="text-lg font-bold text-red-400 mb-3 flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2" />
              Immediate Attention Required
            </h3>
            <div className="space-y-2">
              {memberStats
                .filter((m) => m.attendanceRate < 80 || m.membershipStatus === 'probation')
                .map((member) => (
                  <div key={member.memberId} className="flex items-center justify-between text-sm">
                    <span className="text-gray-300">{member.memberName}</span>
                    <span className="text-red-400">{member.attendanceRate}%</span>
                  </div>
                ))}
            </div>
          </div>

          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-6">
            <h3 className="text-lg font-bold text-emerald-400 mb-3 flex items-center">
              <Award className="w-5 h-5 mr-2" />
              Outstanding Crew
            </h3>
            <div className="space-y-2">
              {memberStats
                .filter((m) => m.attendanceRate >= 95)
                .map((member) => (
                  <div key={member.memberId} className="flex items-center justify-between text-sm">
                    <span className="text-gray-300">{member.memberName}</span>
                    <span className="text-emerald-400">{member.attendanceRate}%</span>
                  </div>
                ))}
            </div>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
            <h3 className="text-lg font-bold text-blue-400 mb-3 flex items-center">
              <Target className="w-5 h-5 mr-2" />
              Fleet Targets
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-300">Target Attendance:</span>
                <span className="text-blue-400">90%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Current Average:</span>
                <span className={overallStats.avgAttendanceRate >= 90 ? 'text-emerald-400' : 'text-yellow-400'}>
                  {overallStats.avgAttendanceRate}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Perfect Streak Goal:</span>
                <span className="text-blue-400">5+ meetings</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default AdminMusterPage
