'use client'

import React, { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Compass } from 'lucide-react'
import CalendarGrid from '@/app/components/grogs/CalendarGrid'
import getRendezvousTypeColor from '@/app/lib/utils/rendezvous/getRendezvousTypeColor'
import generateRecurringThursdayMeetings from '@/app/lib/utils/rendezvous/generateRecurringThursdayMeetings'
import getRendezvousTypeIcon from '@/app/lib/utils/rendezvous/getRendezvousTypeIcon'
import getRendezvousForDate from '@/app/lib/utils/rendezvous/getRendezvousForDates'
import { useFetchRendezvousListQuery } from '@/app/redux/services/rendezvousApi'
import { RendezvousEvent } from '@/types/rendezvous'
import { chapterId } from '@/app/lib/constants/api/chapterId'
import RendezvousListView from '@/app/components/rendezvous/RendezvousListView'
import InfoBanner from '@/app/components/common/InfoBanner'

const Rendezvous = () => {
  const { data } = useFetchRendezvousListQuery({ chapterId }) as { data: { rendezvous: RendezvousEvent[] } }
  const [viewMode, setViewMode] = useState('calendar')
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])

  // Generate dynamic Thursday meetings
  const dynamicMeetings = useMemo(() => {
    const startDate = new Date()
    const endDate = new Date()
    endDate.setFullYear(endDate.getFullYear() + 2)

    const meetingDetails = {
      title: 'Weekly Team Meeting',
      type: 'meeting',
      description: 'Weekly team sync every Thursday 7-8 AM'
    }

    return generateRecurringThursdayMeetings(startDate, endDate, meetingDetails).map((meeting) => ({
      ...meeting,
      status: 'ACTIVE' // Add default status to dynamic meetings
    }))
  }, [])

  // Merge dynamic meetings with database overrides
  const mergedMeetings = useMemo(() => {
    if (!data?.rendezvous) {
      return dynamicMeetings // Return dynamic meetings if no database data yet
    }

    const dbOverrides = data.rendezvous

    // Create merged meetings array
    const merged = dynamicMeetings.map((dynamicMeeting) => {
      // Find override by matching date and time only
      const override = dbOverrides.find((db) => {
        const dbDate = new Date(db.startTime)
        const dynamicDate = dynamicMeeting.startTime

        // Match on same date and time (7:00 AM Thursday meetings)
        return (
          dbDate.getFullYear() === dynamicDate.getFullYear() &&
          dbDate.getMonth() === dynamicDate.getMonth() &&
          dbDate.getDate() === dynamicDate.getDate() &&
          dbDate.getHours() === dynamicDate.getHours() &&
          dbDate.getMinutes() === dynamicDate.getMinutes()
        )
      })

      if (override) {
        // Replace with database version, converting dates
        return {
          ...override,
          startTime: new Date(override.startTime),
          endTime: new Date(override.endTime)
        }
      }

      // Return original dynamic meeting if no override
      return dynamicMeeting
    })

    // Filter out meetings with REMOVED status
    return merged.filter((meeting) => meeting.status !== 'REMOVED')
  }, [dynamicMeetings, data?.rendezvous])

  return (
    <div className="bg-gray-900 min-h-[calc(100vh-68px)]">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex-1 px-3 py-6 sm:p-6 overflow-y-auto space-y-6"
      >
        {/* Rendezvous Info Banner */}
        <InfoBanner
          type="rendezvous"
          description="is the recurring weekly networking group meeting, tracked in the calendar or list."
        />
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          {/* Navigation & Filters */}
          <div className="flex flex-wrap items-center gap-4 p-4 bg-gray-800/40 border border-gray-700/50 rounded-xl backdrop-blur-sm">
            <div className="flex items-center space-x-2">
              <Compass className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-400">Navigation:</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-x-2 w-full">
              <button
                onClick={() => setViewMode('calendar')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors w-full sm:w-fit ${
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
            </div>
          </div>
        </motion.div>

        {/* Calendar View */}
        {viewMode === 'calendar' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-800/40 border border-gray-700/50 rounded-xl backdrop-blur-sm overflow-hidden"
          >
            <div className="px-3 py-6 sm:p-6 border-b border-gray-700/50">
              <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-3">
                <h2 className="text-lg xs:text-xl sm:text-2xl font-bold text-white flex items-center">
                  <Calendar className="w-5 h-5 xs:w-6 xs:h-6 mr-2 shrink-0" />
                  <span className="truncate">The Gathering Point</span>
                </h2>
                <div className="flex items-center justify-end space-x-2 xs:space-x-3 w-full xs:w-auto">
                  {/* Month navigation buttons */}
                </div>
              </div>
            </div>

            <CalendarGrid
              selectedDate={selectedDate}
              events={mergedMeetings}
              onDateSelect={setSelectedDate}
              getEventTypeIcon={getRendezvousTypeIcon}
              getEventTypeColor={getRendezvousTypeColor}
              getEventsForDate={getRendezvousForDate}
            />
          </motion.div>
        )}

        {/* Calendar View */}
        {viewMode === 'list' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-800/40 border border-gray-700/50 rounded-xl backdrop-blur-sm overflow-hidden"
          >
            <div className="px-3 py-6 sm:p-6 border-b border-gray-700/50">
              <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-3">
                <h2 className="text-lg xs:text-xl sm:text-2xl font-bold text-white flex items-center">
                  <Calendar className="w-5 h-5 xs:w-6 xs:h-6 mr-2 shrink-0" />
                  <span className="truncate">The Gathering Point</span>
                </h2>
                <div className="flex items-center justify-end space-x-2 xs:space-x-3 w-full xs:w-auto">
                  {/* Month navigation buttons */}
                </div>
              </div>
            </div>

            <RendezvousListView
              events={mergedMeetings}
              getEventTypeIcon={getRendezvousTypeIcon}
              getEventTypeColor={getRendezvousTypeColor}
              getEventsForDate={getRendezvousForDate}
            />
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}

export default Rendezvous
