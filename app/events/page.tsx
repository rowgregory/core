'use client'

import React, { useState } from 'react'
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Anchor,
  Navigation,
  Search,
  ChevronRight,
  User,
  Coffee,
  Briefcase,
  Star,
  CheckCircle,
  Sparkle
} from 'lucide-react'
import { formatDate } from '../lib/utils/date/formatDate'
import { useGetGrogsQuery } from '../redux/services/grogApi'
import { GrogFormStateTyped } from '@/types/grog'
import { chapterId } from '../lib/constants/api/chapterId'

// Mock Storm Effects Component
const StormEffects = () => (
  <div className="absolute inset-0 opacity-10">
    <div className="absolute top-20 left-10 w-32 h-32 bg-cyan-400 rounded-full blur-3xl animate-pulse"></div>
    <div
      className="absolute bottom-40 right-20 w-40 h-40 bg-blue-400 rounded-full blur-3xl animate-pulse"
      style={{ animationDelay: '2s' }}
    ></div>
  </div>
)

const filterOptions = [
  { value: 'all', label: 'All Events', icon: Calendar },
  { value: 'networking', label: 'Networking', icon: Users },
  { value: 'workshop', label: 'Workshops', icon: Briefcase },
  { value: 'mixer', label: 'Mixers', icon: Coffee },
  { value: 'special-event', label: 'Special Event', icon: Sparkle }
]

const getEventIcon = (type: string) => {
  switch (type) {
    case 'networking':
      return Users
    case 'workshop':
      return Briefcase
    case 'mixer':
      return Coffee
    case 'luncheon':
      return Anchor
    default:
      return Calendar
  }
}

// const events = [
//     {
//       id: 1,
//       title: "Storm Harbor Watch - Weekly Breakfast Meeting",
//       date: "2025-01-14",
//       time: "07:00 AM",
//       duration: "90 minutes",
//       location: "The Anchor Inn, Lynn MA",
//       type: "networking",
//       attendees: 24,
//       maxAttendees: 30,
//       status: "upcoming",
//       description: "Join fellow business professionals for our weekly networking breakfast. Share referrals, build relationships, and grow your business network.",
//       host: "Captain Sarah Mitchell",
//       category: "Weekly Meeting",
//       featured: true
//     },
//     {
//       id: 2,
//       title: "North Shore Business Mixer",
//       date: "2025-01-18",
//       time: "06:00 PM",
//       duration: "3 hours",
//       location: "Marblehead Yacht Club",
//       type: "mixer",
//       attendees: 45,
//       maxAttendees: 75,
//       status: "upcoming",
//       description: "An exclusive evening mixer for North Shore business leaders. Network with industry professionals while enjoying harbor views.",
//       host: "Harbor Master Tom Richardson",
//       category: "Special Event"
//     },
//     {
//       id: 3,
//       title: "Professional Development Workshop: Maritime Law",
//       date: "2025-01-22",
//       time: "02:00 PM",
//       duration: "2 hours",
//       location: "Salem Maritime Center",
//       type: "workshop",
//       attendees: 18,
//       maxAttendees: 25,
//       status: "upcoming",
//       description: "Learn the fundamentals of maritime law and how it affects coastal businesses. Continuing education credits available.",
//       host: "Attorney Maria Santos",
//       category: "Education"
//     },
//     {
//       id: 4,
//       title: "Storm Harbor Watch - Weekly Breakfast Meeting",
//       date: "2025-01-21",
//       time: "07:00 AM",
//       duration: "90 minutes",
//       location: "The Anchor Inn, Lynn MA",
//       type: "networking",
//       attendees: 22,
//       maxAttendees: 30,
//       status: "upcoming",
//       description: "Join fellow business professionals for our weekly networking breakfast. Share referrals, build relationships, and grow your business network.",
//       host: "Captain Sarah Mitchell",
//       category: "Weekly Meeting"
//     },
//     {
//       id: 5,
//       title: "Coastal Chamber Commerce Luncheon",
//       date: "2025-01-25",
//       time: "12:00 PM",
//       duration: "2 hours",
//       location: "Newburyport Harbor Restaurant",
//       type: "luncheon",
//       attendees: 35,
//       maxAttendees: 50,
//       status: "upcoming",
//       description: "Monthly chamber luncheon featuring keynote speaker on coastal economic development and business growth strategies.",
//       host: "Chamber President Lisa Wong",
//       category: "Chamber Event"
//     },
//     {
//       id: 6,
//       title: "Storm Harbor Watch - Weekly Breakfast Meeting",
//       date: "2025-01-07",
//       time: "07:00 AM",
//       duration: "90 minutes",
//       location: "The Anchor Inn, Lynn MA",
//       type: "networking",
//       attendees: 28,
//       maxAttendees: 30,
//       status: "completed",
//       description: "Successful networking breakfast with record attendance. Great referral exchanges and new member introductions.",
//       host: "Captain Sarah Mitchell",
//       category: "Weekly Meeting"
//     }
//   ];

const EventsPage = () => {
  const { data } = useGetGrogsQuery({ chapterId }) as { data: { grogs: GrogFormStateTyped[] } }
  const events = data?.grogs
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  const filteredEvents = events?.filter?.((event) => {
    const matchesFilter = selectedFilter === 'all' || event.type === selectedFilter
    const matchesSearch =
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const upcomingEvents = filteredEvents?.filter?.((event) => event.status === 'UPCOMING')
  const pastEvents = filteredEvents?.filter?.((event) => event.status === 'COMPLETED')

  const handleExternalLink = (registrationUrl: string) => window.open(registrationUrl, '_blank')

  return (
    <div className="min-h-screen py-12 relative overflow-hidden bg-gray-900">
      <StormEffects />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="h-12 w-12 bg-linear-to-r from-teal-500 via-cyan-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-900/50">
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white">Harbor Events</h1>
          </div>
          <p className="text-cyan-200 text-lg">Navigate Your Business Network Through Stormy Seas</p>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-slate-800/40 backdrop-blur-md border border-slate-600/30 rounded-xl p-6 mb-8 shadow-lg">
          <div className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search events or locations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500/50 focus:bg-slate-700/70 transition-all"
              />
            </div>

            {/* Filter Buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
              {filterOptions?.map((option) => {
                const Icon = option.icon
                return (
                  <button
                    key={option.value}
                    onClick={() => setSelectedFilter(option.value)}
                    className={`inline-flex items-center justify-center px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      selectedFilter === option.value
                        ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-900/50'
                        : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50 border border-slate-600/50'
                    }`}
                  >
                    <Icon className="w-4 h-4 sm:mr-2" />
                    <span className="hidden sm:inline">{option.label}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upcoming Events */}
          <div className="space-y-6">
            <div className="flex items-center mb-6">
              <div className="bg-linear-to-r from-emerald-600 to-emerald-700 p-2 rounded-lg mr-4 shadow-lg shadow-emerald-900/50">
                <Navigation className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-semibold text-white">Upcoming Voyages</h2>
              <span className="ml-3 px-2 py-1 bg-emerald-400/20 text-emerald-400 text-xs rounded-full">
                {upcomingEvents?.length} events
              </span>
            </div>

            <div className="space-y-4">
              {upcomingEvents?.map((event) => {
                const EventIcon = getEventIcon(event.type)
                return (
                  <div
                    key={event.id}
                    className={`bg-slate-800/40 backdrop-blur-md border border-slate-600/30 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all hover:border-cyan-500/30 group ${
                      event.featured ? 'ring-2 ring-cyan-500/30 ring-opacity-50' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="bg-linear-to-r from-cyan-600 to-blue-600 p-2 rounded-lg shadow-lg shadow-cyan-900/50">
                          <EventIcon className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white group-hover:text-cyan-400 transition-colors">
                            {event.title}
                          </h3>
                          <span className="text-sm text-slate-400">{event.category}</span>
                        </div>
                      </div>
                      {event.featured && (
                        <div className="flex items-center space-x-1 bg-amber-900/20 border border-amber-600/50 px-2 py-1 rounded-full">
                          <Star className="w-3 h-3 text-amber-400 fill-current" />
                          <span className="text-xs text-amber-400">Featured</span>
                        </div>
                      )}
                    </div>

                    <p className="text-slate-300 text-sm mb-4">{event.description}</p>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center text-slate-400 text-sm">
                        <Calendar className="w-4 h-4 mr-2 text-cyan-400" />
                        <span>{formatDate(event.date)}</span>
                      </div>
                      <div className="flex items-center text-slate-400 text-sm">
                        <Clock className="w-4 h-4 mr-2 text-emerald-400" />
                        <span>
                          {event.time} ({event.duration})
                        </span>
                      </div>
                      <div className="flex items-center text-slate-400 text-sm">
                        <MapPin className="w-4 h-4 mr-2 text-blue-400" />
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center text-slate-400 text-sm">
                        <Users className="w-4 h-4 mr-2 text-purple-400" />
                        <span>
                          {event.attendees}/{event.maxAttendees} sailors
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-600/50">
                      <div className="flex items-center text-sm text-slate-400">
                        <User className="w-4 h-4 mr-2" />
                        <span>Hosted by {event.host}</span>
                      </div>
                      <button
                        onClick={() => handleExternalLink(event.registrationUrl)}
                        className="inline-flex items-center px-4 py-2 bg-linear-to-r from-cyan-600 to-blue-600 text-white text-sm font-medium rounded-lg hover:from-cyan-500 hover:to-blue-500 transition-all shadow-lg shadow-cyan-900/50 group"
                      >
                        Set Sail
                        <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Past Events */}
          <div className="space-y-6">
            <div className="flex items-center mb-6">
              <div className="bg-linear-to-r from-slate-600 to-slate-700 p-2 rounded-lg mr-4 shadow-lg">
                <Anchor className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-semibold text-white">Completed Voyages</h2>
              <span className="ml-3 px-2 py-1 bg-slate-400/20 text-slate-400 text-xs rounded-full">
                {pastEvents?.length} events
              </span>
            </div>

            <div className="space-y-4">
              {pastEvents?.map((event) => {
                const EventIcon = getEventIcon(event.type)
                return (
                  <div key={event.id} className="bg-slate-800/30 border border-slate-600/20 rounded-xl p-6 opacity-75">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="bg-slate-600 p-2 rounded-lg">
                          <EventIcon className="w-4 h-4 text-slate-300" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-slate-300">{event.title}</h3>
                          <span className="text-sm text-slate-500">{event.category}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1 bg-slate-700/50 border border-slate-600/50 px-2 py-1 rounded-full">
                        <CheckCircle className="w-3 h-3 text-slate-400" />
                        <span className="text-xs text-slate-400">Completed</span>
                      </div>
                    </div>

                    <p className="text-slate-400 text-sm mb-4">{event.description}</p>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center text-slate-500 text-sm">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span>{formatDate(event.date)}</span>
                      </div>
                      <div className="flex items-center text-slate-500 text-sm">
                        <Users className="w-4 h-4 mr-2" />
                        <span>{event.attendees} sailors attended</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-600/30">
                      <div className="flex items-center text-sm text-slate-500">
                        <User className="w-4 h-4 mr-2" />
                        <span>Hosted by {event.host}</span>
                      </div>
                      <button className="inline-flex items-center px-4 py-2 bg-slate-700/50 text-slate-400 text-sm font-medium rounded-lg hover:bg-slate-600/50 transition-all border border-slate-600/50">
                        View Summary
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EventsPage
