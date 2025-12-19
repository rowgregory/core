'use client'

import React, { FC, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Calendar,
  Users,
  MapPin,
  Clock,
  Edit3,
  Search,
  DollarSign,
  BarChart3,
  Target,
  Compass,
  PartyPopper,
  Wine,
  Heart,
  CheckCircle,
  X,
  Trophy,
  Star,
  Sparkles,
  TrendingUp
} from 'lucide-react'
// import { useGetGrogsQuery, useUpdateGrogStatusMutation } from '@/app/redux/services/grogApi'
// import { GrogFormStateTyped } from '@/types/grog'
// import { chapterId } from '@/app/lib/constants/api/chapterId'
import { setInputs } from '@/app/redux/features/formSlice'
import { setOpenGrogDrawer } from '@/app/redux/features/grogSlice'
import { useAppDispatch } from '@/app/redux/store'
import getGrogStatusColor from '@/app/lib/constants/grogs/getGrogStatusColor'
import CalendarGrid from '@/app/components/grogs/CalendarGrid'
import InfoBanner from '@/app/components/common/InfoBanner'
import { LockedModuleBanner } from '@/app/components/common/LockedModuleBanner'
// import { useSession } from 'next-auth/react'
// import { showToast } from '@/app/redux/features/toastSlice'

const getEventTypeIcon = (type: string) => {
  switch (type) {
    case 'workshop':
      return Wine
    case 'networking':
      return Users
    case 'mixer':
      return Heart
    case 'luncheon':
      return Target
    case 'seminar':
      return PartyPopper
    case 'conference':
      return BarChart3
    default:
      return Calendar
  }
}

const getEventTypeColor = (type: string) => {
  switch (type) {
    case 'workshop':
      return 'text-purple-400 bg-purple-500/10 border-purple-500/30'
    case 'networking':
      return 'text-blue-400 bg-blue-500/10 border-blue-500/30'
    case 'mixer':
      return 'text-red-400 bg-red-500/10 border-red-500/30'
    case 'luncheon':
      return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
    case 'seminar':
      return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30'
    case 'conference':
      return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30'
    default:
      return 'text-gray-400 bg-gray-500/10 border-gray-500/30'
  }
}

interface GrogEvent {
  id: string
  title: string
  category: 'social' | 'networking' | 'charity' | 'training' | 'celebration' | 'business'
  type: 'workshop' | 'networking' | 'mixer' | 'luncheon' | 'seminar' | 'conference'
  date: string
  time: string
  location: string
  description: string
  maxAttendees?: number
  attendees: number
  cost?: number
  host: string
  status: 'UPCOMING' | 'ONGOING' | 'COMPLETED' | 'CANCELLED'
  isPublic: boolean
  requiresRSVP: boolean
  images?: string[]
  attendeeList: {
    memberId: string
    memberName: string
    rsvpStatus: 'yes' | 'no' | 'maybe' | 'pending'
    checkedIn: boolean
    plusOnes?: number
  }[]
  feedback?: {
    rating: number
    comments: string[]
    totalResponses: number
  }
  revenue?: number
  expenses?: number
  specialNotes?: string
  createdAt: any
}

const grogs: GrogEvent[] = [
  {
    id: '1',
    title: 'Harbor Happy Hour',
    category: 'social',
    date: '2025-01-15',
    time: '18:00',
    location: 'The Anchor Tavern',
    description:
      'Monthly social gathering for crew members to unwind and network in a relaxed setting. Enjoy drinks, appetizers, and great conversation with your fellow chapter mates.',
    maxAttendees: 30,
    attendees: 24,
    cost: 25,
    host: 'Sarah Johnson',
    status: 'UPCOMING',
    isPublic: false,
    requiresRSVP: true,
    attendeeList: [
      { memberId: '1', memberName: 'John Smith', rsvpStatus: 'yes', checkedIn: false },
      { memberId: '2', memberName: 'Mike Davis', rsvpStatus: 'yes', checkedIn: false, plusOnes: 1 },
      { memberId: '3', memberName: 'Lisa Chen', rsvpStatus: 'maybe', checkedIn: false }
    ],
    createdAt: '',
    type: 'mixer'
  },
  {
    id: '2',
    title: 'Charity Regatta Fundraiser',
    category: 'charity',
    date: '2025-01-22',
    time: '10:00',
    location: 'Marina Bay',
    description:
      'Annual sailing event to raise funds for local maritime education programs. Includes boat races, silent auction, and family activities.',
    maxAttendees: 100,
    attendees: 67,
    cost: 50,
    host: 'Captain Tom Wilson',
    status: 'UPCOMING',
    isPublic: true,
    requiresRSVP: true,
    revenue: 3350,
    expenses: 1200,
    attendeeList: [
      { memberId: '1', memberName: 'John Smith', rsvpStatus: 'yes', checkedIn: false, plusOnes: 2 },
      { memberId: '4', memberName: 'Emma Rodriguez', rsvpStatus: 'yes', checkedIn: false }
    ],
    createdAt: '',
    type: 'conference'
  },
  {
    id: '3',
    title: 'Leadership Workshop: Navigation Skills',
    category: 'training',
    date: '2025-01-18',
    time: '09:00',
    location: 'Chapter Conference Room',
    description:
      'Professional development session focusing on leadership techniques and team navigation in business environments.',
    maxAttendees: 20,
    attendees: 16,
    host: 'Dr. Rachel Green',
    status: 'UPCOMING',
    isPublic: false,
    requiresRSVP: true,
    cost: 0,
    attendeeList: [],
    createdAt: '',
    type: 'luncheon'
  },
  {
    id: '4',
    title: 'New Year Celebration Grog',
    category: 'celebration',
    date: '2025-01-01',
    time: '19:00',
    location: 'Harbor Grand Ballroom',
    description:
      'Celebrate the new year with our biggest grog of the season! Formal attire, dinner, dancing, and awards ceremony.',
    maxAttendees: 80,
    attendees: 78,
    cost: 75,
    host: 'Event Committee',
    status: 'COMPLETED',
    isPublic: false,
    requiresRSVP: true,
    feedback: {
      rating: 4.8,
      comments: ['Amazing venue!', 'Great food and music', 'Best chapter event yet'],
      totalResponses: 65
    },
    revenue: 5850,
    expenses: 3200,
    attendeeList: [],
    createdAt: '',
    type: 'seminar'
  }
]

const GrogsEventsPage: FC = () => {
  // const { data } = useGetGrogsQuery({ chapterId }) as { data: { grogs: GrogFormStateTyped[] } }
  // const grogs = data?.grogs
  const dispatch = useAppDispatch()
  const [viewMode, setViewMode] = useState<'calendar' | 'list' | 'analytics'>('calendar')
  const [filterType, setFilterType] = useState<
    'all' | 'workshop' | 'networking' | 'mixer' | 'luncheon' | 'seminar' | 'conference'
  >('all')
  const [filterStatus, setFilterStatus] = useState<'all' | 'UPCOMING' | 'COMPLETED' | 'CANCELLED' | 'ONGOING'>('all')
  const [filterCategory, setCategoryStatus] = useState<
    'all' | 'weekly-meeting' | 'special-event' | 'education' | 'chamber-event' | 'social' | 'training'
  >('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  // const [isLoading, setIsLoading] = useState(false)
  // const [updateGrogStatus] = useUpdateGrogStatusMutation()
  // const session = useSession()

  // const handleMarkComplete = async (grogId: Key | null | undefined | string) => {
  //   setIsLoading(true)
  //   try {
  //     await updateGrogStatus({ chapterId, userId: session.data?.user?.id, grogId, status: 'COMPLETED' }).unwrap()
  //     dispatch(
  //       showToast({
  //         type: 'success',
  //         message: `Update Grog Success`,
  //         description: `Grog status updated to completed.`
  //       })
  //     )
  //   } catch (error) {
  //     dispatch(
  //       showToast({
  //         type: 'error',
  //         message: `Update Grog Error`,
  //         description: `Grog status failed to update to completed: ${error}`
  //       })
  //     )
  //   } finally {
  //     setIsLoading(false)
  //   }
  // }

  // const handleCancelEvent = async (grogId: Key | null | undefined | string) => {
  //   setIsLoading(true)
  //   try {

  //     await updateGrogStatus({ chapterId, userId: session.data?.user?.id, grogId, status: 'CANCELLED' }).unwrap()
  //     dispatch(
  //       showToast({
  //         type: 'success',
  //         message: `Update Grog Success`,
  //         description: `Grog status updated to cancelled.`
  //       })
  //     )
  //   } catch (error) {
  //     dispatch(
  //       showToast({
  //         type: 'error',
  //         message: `Update Grog Error`,
  //         description: `Grog status failed to update to cancelled: ${error}`
  //       })
  //     )
  //   } finally {
  //     setIsLoading(false)
  //   }
  // }

  const calculateEventStats = () => {
    const totalEvents = grogs?.length
    const upcomingEvents = grogs?.filter((e) => e.status === 'UPCOMING').length
    const completedEvents = grogs?.filter((e) => e.status === 'COMPLETED').length
    const cancelledEvents = grogs?.filter((e) => e.status === 'CANCELLED').length
    const ongoingEvents = grogs?.filter((e) => e.status === 'ONGOING').length
    const totalRevenue = grogs.reduce((sum, e) => sum + (e.revenue || 0), 0)
    const totalAttendees = grogs?.reduce((sum, e) => sum + e.attendees, 0)
    const avgAttendance =
      (grogs?.filter((e) => e.maxAttendees).reduce((sum, e) => sum + e.attendees / (Number(e.maxAttendees) || 1), 0) /
        grogs?.filter((e) => e.maxAttendees).length) *
      100

    return {
      totalEvents,
      upcomingEvents,
      completedEvents,
      cancelledEvents,
      ongoingEvents,
      totalAttendees,
      totalRevenue,
      avgAttendance: Math.round(avgAttendance * 10) / 10
    }
  }

  const stats = calculateEventStats()

  const filteredGrogs = grogs
    ?.filter((grog) => {
      // Search filter - check if any searchable field contains the search term
      const searchLower = searchTerm.toLowerCase()
      const matchesSearch =
        searchTerm === '' ||
        grog.title?.toLowerCase().includes(searchLower) ||
        grog.description?.toLowerCase().includes(searchLower) ||
        grog.location?.toLowerCase().includes(searchLower)

      // Type filter (networking, workshop, etc.)
      const matchesType = filterType === 'all' || grog.category === filterType

      // Status filter (UPCOMING, COMPLETED, etc.)
      const matchesStatus = filterStatus === 'all' || grog.status === filterStatus

      // Category filter - convert both to same format for comparison
      const grogCategoryFormatted = grog.category?.toLowerCase().replace(/\s+/g, '-')
      const matchesCategory = filterCategory === 'all' || grogCategoryFormatted === filterCategory

      return matchesSearch && matchesType && matchesStatus && matchesCategory
    })
    .sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })
  const getEventsForDate = (grogs: any[], date: Date) => {
    const dateString = date.toISOString().split('T')[0]
    return grogs.filter((event) => event.date === dateString)
  }
  return (
    <div className="bg-gray-900 min-h-[calc(100vh-68px)]">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex-1 px-3 py-6 sm:p-6 overflow-y-auto space-y-6"
      >
        <InfoBanner
          type="grog"
          description="Grog is the chapter’s social event module, used to create and manage meetup-style gatherings. This feature is currently locked and not yet enabled for your chapter. Once purchased and built, you’ll be able to schedule events, track attendance, and keep members engaged."
        />

        <LockedModuleBanner />

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          {/* Navigation & Filters */}
          <div className="flex flex-col sm:flex-wrap sm:items-center gap-y-4 sm:gap-4 p-4 bg-gray-800/40 border border-gray-700/50 rounded-xl backdrop-blur-sm">
            <div className="flex items-center space-x-2">
              <Compass className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-400">Navigation:</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-x-2">
              <button
                onClick={() => setViewMode('calendar')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  viewMode === 'calendar'
                    ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                    : 'bg-gray-700 text-gray-400 border border-gray-600 hover:bg-gray-700/70'
                }`}
              >
                Calendar View
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  viewMode === 'list'
                    ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                    : 'bg-gray-700 text-gray-400 border border-gray-600 hover:bg-gray-700/70'
                }`}
              >
                List View
              </button>
              <button
                onClick={() => setViewMode('analytics')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  viewMode === 'analytics'
                    ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                    : 'bg-gray-700 text-gray-400 border border-gray-600 hover:bg-gray-700/70'
                }`}
              >
                Analytics
              </button>
            </div>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search grogs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-1.5 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 w-full md:w-fit"
              />
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="px-3 py-1.5 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Types</option>
              <option value="networking">Networking</option>
              <option value="workshop">Workshop</option>
              <option value="mixer">Mixer</option>
              <option value="luncheon">Luncheon</option>
              <option value="seminar">Seminar</option>
              <option value="conference">Conference</option>
            </select>
            <select
              value={filterCategory}
              onChange={(e) => setCategoryStatus(e.target.value as any)}
              className="px-3 py-1.5 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Categories</option>
              <option value="weekly-meeting">Weekly Meeting</option>
              <option value="special-event">Special Event</option>
              <option value="education">Education</option>
              <option value="chamber-event">Chamber Event</option>
              <option value="social">Social</option>
              <option value="training">Training</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-3 py-1.5 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Status</option>
              <option value="UPCOMING">Upcoming</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8"
        >
          <div className="bg-gray-800/40 border border-gray-700/50 rounded-xl p-4 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-2">
              <Calendar className="w-5 h-5 text-purple-400" />
              <span className="text-xs text-gray-400">Total</span>
            </div>
            <div className="text-2xl font-bold text-white">{stats.totalEvents}</div>
            <div className="text-xs text-gray-400">Events</div>
          </div>

          <div className="bg-gray-800/40 border border-gray-700/50 rounded-xl p-4 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-2">
              <Clock className="w-5 h-5 text-blue-400" />
              <span className="text-xs text-gray-400">Coming</span>
            </div>
            <div className="text-2xl font-bold text-blue-400">{stats.upcomingEvents}</div>
            <div className="text-xs text-gray-400">Upcoming</div>
          </div>

          <div className="bg-gray-800/40 border border-gray-700/50 rounded-xl p-4 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
              <span className="text-xs text-gray-400">Done</span>
            </div>
            <div className="text-2xl font-bold text-emerald-400">{stats.completedEvents}</div>
            <div className="text-xs text-gray-400">Completed</div>
          </div>
        </motion.div>

        {/* Events List View */}
        {viewMode === 'list' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {filteredGrogs?.map((grog, index) => {
              const EventTypeIcon = getEventTypeIcon(grog.type)
              const attendanceRate = grog.maxAttendees ? (grog.attendees / Number(grog.maxAttendees)) * 100 : 0

              return (
                <motion.div
                  key={grog.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="bg-gray-800/40 border border-gray-700/50 rounded-xl backdrop-blur-sm overflow-hidden hover:border-gray-600/50 transition-all duration-300"
                >
                  <div className="p-6">
                    {/* Event Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start space-x-4">
                        <div className="shrink-0">
                          <div className={`p-3 rounded-xl ${getEventTypeColor(grog.category)}`}>
                            <EventTypeIcon className="w-6 h-6" />
                          </div>
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-white mb-2">{grog.title}</h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-400 mb-2">
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-4 h-4" />
                              <span>{new Date(grog.date).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="w-4 h-4" />
                              <span>{grog.time}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <MapPin className="w-4 h-4" />
                              <span>{grog.location}</span>
                            </div>
                          </div>
                          <p className="text-gray-300 text-sm leading-relaxed max-w-2xl">{grog.description}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <div
                          className={`inline-flex items-center px-3 py-1 rounded-lg text-sm font-medium border ${getGrogStatusColor(grog.status)}`}
                        >
                          {grog.status.charAt(0).toUpperCase() + grog.status.slice(1)}
                        </div>
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => {
                              dispatch(setInputs({ formName: 'grogForm', data: { ...grog, isUpdating: true } }))
                              dispatch(setOpenGrogDrawer())
                            }}
                            className="p-2 text-gray-400 hover:text-emerald-400 rounded-lg hover:bg-emerald-500/10 transition-colors"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Event Details Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="bg-gray-700/20 rounded-lg p-3">
                        <div className="flex items-center space-x-2 mb-1">
                          <Users className="w-4 h-4 text-cyan-400" />
                          <span className="text-sm font-medium text-gray-300">Attendance</span>
                        </div>
                        <div className="text-lg font-bold text-white">
                          {grog.attendees ?? 0}
                          {grog.maxAttendees ? `/${grog.maxAttendees}` : ''}
                        </div>
                        {grog.maxAttendees && (
                          <div className="text-xs text-gray-400">{Math.round(attendanceRate)}% full</div>
                        )}
                      </div>

                      <div className="bg-gray-700/20 rounded-lg p-3">
                        <div className="flex items-center space-x-2 mb-1">
                          <Users className="w-4 h-4 text-purple-400" />
                          <span className="text-sm font-medium text-gray-300">Organizer</span>
                        </div>
                        <div className="text-sm font-semibold text-white">{grog.host}</div>
                      </div>

                      {grog.cost !== undefined && (
                        <div className="bg-gray-700/20 rounded-lg p-3">
                          <div className="flex items-center space-x-2 mb-1">
                            <DollarSign className="w-4 h-4 text-green-400" />
                            <span className="text-sm font-medium text-gray-300">Cost</span>
                          </div>
                          <div className="text-lg font-bold text-white">
                            {grog.cost === 0 ? 'Free' : `$${grog.cost}`}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    {grog.status === 'UPCOMING' && (
                      <div className="flex gap-2 mb-4 pt-4 border-t border-gray-700/50">
                        <button
                          // onClick={() => handleMarkComplete(grog.id)}
                          // disabled={isLoading}
                          className="flex items-center space-x-2 px-4 py-2 border border-green-600 text-green-400 rounded-lg hover:bg-green-600/10 hover:border-green-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Mark Complete
                        </button>

                        <button
                          // onClick={() => handleCancelEvent(grog.id)}
                          // disabled={isLoading}
                          className="flex items-center space-x-2 px-4 py-2 border border-red-600 text-red-400 rounded-lg hover:bg-red-600/10 hover:border-red-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                        >
                          <X className="w-4 h-4 mr-2" />
                          Cancel Event
                        </button>
                      </div>
                    )}

                    {/* Event Tags */}
                    <div className="flex items-center space-x-2">
                      <div
                        className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium border ${getEventTypeColor(grog.type)}`}
                      >
                        <EventTypeIcon className="w-3 h-3 mr-1" />
                        {grog.type.charAt(0).toUpperCase() + grog.type.slice(1)}
                      </div>
                      {grog.requiresRSVP && (
                        <div className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/30">
                          RSVP Required
                        </div>
                      )}
                      {grog.isPublic && (
                        <div className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/30">
                          Public Event
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        )}

        {/* Calendar View */}
        {viewMode === 'calendar' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-800/40 border border-gray-700/50 rounded-xl backdrop-blur-sm overflow-hidden"
          >
            <div className="p-6 border-b border-gray-700/50">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white flex items-center">
                  <Calendar className="w-6 h-6 mr-2" />
                  Grogs Calendar
                </h2>
                <div className="flex items-center space-x-3">{/* Month navigation buttons */}</div>
              </div>
            </div>

            <CalendarGrid
              selectedDate={selectedDate}
              events={grogs}
              onDateSelect={setSelectedDate}
              getEventTypeIcon={getEventTypeIcon}
              getEventTypeColor={getEventTypeColor}
              getEventsForDate={getEventsForDate}
            />
          </motion.div>
        )}

        {/* Analytics View */}
        {viewMode === 'analytics' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {/* Event Type Distribution */}
            <div className="bg-gray-800/40 border border-gray-700/50 rounded-xl backdrop-blur-sm p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2" />
                Event Type Distribution
              </h3>
              <div className="space-y-3">
                {['social', 'charity', 'training', 'celebration'].map((type) => {
                  const count = grogs?.filter((e) => e.type === type).length
                  const percentage = (count / grogs?.length) * 100
                  const TypeIcon = getEventTypeIcon(type)
                  return (
                    <div key={type} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <TypeIcon className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-300 capitalize">{type}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-gray-700 rounded-full h-2">
                          <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${percentage}%` }} />
                        </div>
                        <span className="text-white font-semibold text-sm w-8">{count}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Revenue Analysis */}
            <div className="bg-gray-800/40 border border-gray-700/50 rounded-xl backdrop-blur-sm p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <DollarSign className="w-5 h-5 mr-2" />
                Revenue Analysis
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                  <div>
                    <div className="text-sm text-gray-400">Total Revenue</div>
                    <div className="text-2xl font-bold text-green-400">${stats.totalRevenue.toLocaleString()}</div>
                  </div>
                  <TrendingUp className="w-8 h-8 text-green-400" />
                </div>

                <div className="space-y-2">
                  {grogs
                    ?.filter((e) => e.revenue)
                    .map((event) => (
                      <div key={event.id} className="flex items-center justify-between p-2 bg-gray-700/20 rounded">
                        <span className="text-gray-300 text-sm">{event.title}</span>
                        <span className="text-white font-semibold">${event.revenue}</span>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            {/* Attendance Trends */}
            <div className="bg-gray-800/40 border border-gray-700/50 rounded-xl backdrop-blur-sm p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Attendance Trends
              </h3>
              <div className="space-y-3">
                {grogs?.slice?.(0, 5)?.map((event) => {
                  const attendanceRate = event.maxAttendees ? (event.attendees / Number(event.maxAttendees)) * 100 : 100
                  return (
                    <div key={event.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300 text-sm truncate">{event.title}</span>
                        <span className="text-white font-semibold text-sm">{Math.round(attendanceRate)}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            attendanceRate >= 80
                              ? 'bg-emerald-500'
                              : attendanceRate >= 60
                                ? 'bg-yellow-500'
                                : 'bg-red-500'
                          }`}
                          style={{ width: `${attendanceRate}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Top Performers */}
            <div className="bg-gray-800/40 border border-gray-700/50 rounded-xl backdrop-blur-sm p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <Trophy className="w-5 h-5 mr-2" />
                Top Performing Events
              </h3>
              <div className="space-y-3">
                {grogs
                  .filter((e) => e.feedback)
                  .sort((a, b) => (b.feedback?.rating || 0) - (a.feedback?.rating || 0))
                  .slice(0, 3)
                  .map((event, index) => (
                    <div key={event.id} className="flex items-center space-x-3 p-3 bg-gray-700/20 rounded-lg">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                          index === 0
                            ? 'bg-yellow-500 text-black'
                            : index === 1
                              ? 'bg-gray-400 text-black'
                              : 'bg-orange-500 text-black'
                        }`}
                      >
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-white text-sm">{event.title}</div>
                        <div className="text-xs text-gray-400">{event.feedback?.totalResponses} reviews</div>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-white font-bold">{event.feedback?.rating}</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Upcoming Events Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
            <h3 className="text-lg font-bold text-blue-400 mb-3 flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              Next Event
            </h3>
            {grogs?.filter((e) => e.status === 'UPCOMING')[0] && (
              <div>
                <div className="font-semibold text-white mb-1">
                  {grogs?.filter((e) => e.status === 'UPCOMING')[0].title}
                </div>
                <div className="text-sm text-gray-400 mb-2">
                  {new Date(grogs?.filter((e) => e.status === 'UPCOMING')[0].date).toLocaleDateString()}
                </div>
                <div className="text-sm text-blue-400">
                  {grogs?.filter((e) => e.status === 'UPCOMING')[0].attendees} registered
                </div>
              </div>
            )}
          </div>

          <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-6">
            <h3 className="text-lg font-bold text-purple-400 mb-3 flex items-center">
              <Sparkles className="w-5 h-5 mr-2" />
              Popular This Month
            </h3>
            {grogs?.sort((a, b) => b.attendees - a.attendees)[0] && (
              <div>
                <div className="font-semibold text-white mb-1">
                  {grogs?.sort((a, b) => b.attendees - a.attendees)[0].title}
                </div>
                <div className="text-sm text-gray-400 mb-2">
                  {grogs
                    ?.sort((a, b) => b.attendees - a.attendees)[0]
                    .type.charAt(0)
                    .toUpperCase() + grogs?.sort((a, b) => b.attendees - a.attendees)[0].type.slice(1)}{' '}
                  Event
                </div>
                <div className="text-sm text-purple-400">
                  {grogs?.sort((a, b) => b.attendees - a.attendees)[0].attendees} attendees
                </div>
              </div>
            )}
          </div>

          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-6">
            <h3 className="text-lg font-bold text-emerald-400 mb-3 flex items-center">
              <Target className="w-5 h-5 mr-2" />
              Action Items
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-300">Events needing setup:</span>
                <span className="text-emerald-400 font-semibold">
                  {
                    grogs?.filter(
                      (e) =>
                        e.status === 'UPCOMING' && new Date(e.date) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                    ).length
                  }
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Pending RSVPs:</span>
                <span className="text-yellow-400 font-semibold">
                  {grogs?.reduce((sum, e) => sum + e.attendeeList.filter((a) => a.rsvpStatus === 'pending').length, 0)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Feedback needed:</span>
                <span className="text-blue-400 font-semibold">
                  {grogs?.filter((e) => e.status === 'COMPLETED' && !e.feedback).length}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default GrogsEventsPage
