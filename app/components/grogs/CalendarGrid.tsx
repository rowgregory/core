import { chapterId } from '@/app/lib/constants/api/chapterId'
import generateCalendarDays from '@/app/lib/utils/calendar/generateCalendarDays'
import navigateMonth from '@/app/lib/utils/calendar/navigateMonth'
import { formatMonth, isCurrentMonth, isToday } from '@/app/lib/utils/date/formatDate'
import { createFormActions, setInputs } from '@/app/redux/features/formSlice'
import { setUpdateRendezvous } from '@/app/redux/features/rendezvousSlice'
import { showToast } from '@/app/redux/features/toastSlice'
import { useCreateRendezvousMutation, useUpdateRendezvousMutation } from '@/app/redux/services/rendezvousApi'
import { useAppDispatch, useFormSelector, useUserSelector } from '@/app/redux/store'
import { SerializedError } from '@reduxjs/toolkit'
import { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import { motion } from 'framer-motion'
import { Calendar, ChevronLeft, ChevronRight, Clock } from 'lucide-react'
import { FC, useState } from 'react'

interface CalendarGridProps {
  selectedDate: string
  events: any[]
  onDateSelect: (date: string) => void
  getEventTypeIcon: (type: string) => any
  getEventTypeColor: (type: string) => string
  getEventsForDate: (events: any[], date: Date) => any[]
}

const CalendarGrid: FC<CalendarGridProps> = ({
  selectedDate,
  events,
  onDateSelect,
  getEventTypeIcon,
  getEventTypeColor,
  getEventsForDate
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const calendarDays = generateCalendarDays(currentMonth)
  const [createRendezvous, { isLoading: isCreating }] = useCreateRendezvousMutation()
  const [updateRendezvous, { isLoading: isUpdating }] = useUpdateRendezvousMutation()
  const dispatch = useAppDispatch()
  const { handleInput } = createFormActions('rendezvousForm', dispatch)
  const { rendezvousForm } = useFormSelector()
  const [removingMeetingId, setRemovingMeetingId] = useState<string | null>(null)
  const { user } = useUserSelector()
  const inputs = rendezvousForm?.inputs

  const handleDayClick = (date: Date, dayEvents: any) => {
    // Use local date formatting instead of UTC
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const dateString = `${year}-${month}-${day}`
    onDateSelect(dateString)
    dispatch(setInputs({ formName: 'rendezvousForm', data: dayEvents[0] }))
  }

  const handleRemoveMeeting = (rendezvous: any) => setRemovingMeetingId(rendezvous.id)

  const handleCancelRemove = () => setRemovingMeetingId(null)

  const prepareRendezvousData = {
    description: inputs?.description,
    type: inputs?.type,
    status: 'CANCELLED',
    title: inputs?.title,
    chapterId,
    startTime: inputs?.startTime,
    endTime: inputs?.endTime
  }

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault()

    const isUpdating = !inputs.isRecurring
    let rendezvous:
      | { data: any; error?: undefined }
      | { data?: undefined; error: FetchBaseQueryError | SerializedError }
    try {
      if (isUpdating) {
        rendezvous = await updateRendezvous({
          id: inputs.id,
          ...prepareRendezvousData
        })
      } else {
        rendezvous = await createRendezvous(prepareRendezvousData)
      }

      dispatch(setUpdateRendezvous(rendezvous?.data))

      dispatch(
        showToast({
          type: 'success',
          message: 'Updated rendezvous',
          description: 'Rendezvous details have been updated'
        })
      )

      setRemovingMeetingId(null)
    } catch (error: any) {
      dispatch(showToast({ type: 'error', message: 'Failed to update meeting', description: error?.data?.message }))
    }
  }

  return (
    <div className="">
      {/* Built-in Month Navigation */}
      <div className="flex items-center justify-center gap-3 sm:gap-4 mb-4 sm:mb-6">
        <button
          onClick={() => navigateMonth('prev', setCurrentMonth)}
          className="p-1.5 sm:p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-all duration-200"
          aria-label="Previous month"
        >
          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        <h3 className="text-base xs:text-lg sm:text-xl font-semibold text-white min-w-[140px] xs:min-w-[180px] text-center">
          {formatMonth(currentMonth)}
        </h3>

        <button
          onClick={() => navigateMonth('next', setCurrentMonth)}
          className="p-1.5 sm:p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-all duration-200"
          aria-label="Next month"
        >
          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-1.5 sm:gap-2 mb-1 sm:mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div
            key={day}
            className="p-1.5 sm:p-2 text-center text-[10px] xs:text-xs sm:text-sm font-semibold text-gray-400"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar days */}
      <div className="grid grid-cols-7 gap-1 xs:gap-1.5 sm:gap-2">
        {calendarDays.map((date, index) => {
          const dayEvents = getEventsForDate(events, date)
          const isCurrentMonthDay = isCurrentMonth(date, currentMonth)
          const isTodayDay = isToday(date)
          const isSelected = selectedDate === date.toISOString().split('T')[0]

          const hasUpdatedEvents = dayEvents.some(
            (event) => event.createdAt || event.updatedAt || event.status !== 'ACTIVE'
          )

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.01 }}
              onClick={() => handleDayClick(date, dayEvents)}
              className={`
          relative min-h-[72px] xs:min-h-[88px] sm:min-h-[100px]
          p-1.5 xs:p-2 cursor-pointer rounded-md border
          transition-all duration-200 hover:border-purple-500/50
          ${isCurrentMonthDay ? 'bg-gray-700/20 border-gray-600/30' : 'bg-gray-800/10 border-gray-700/20 opacity-40'}
          ${isTodayDay ? 'ring-2 ring-blue-400/50' : ''}
          ${isSelected ? 'bg-purple-500/20 border-purple-500/50' : ''}
          ${hasUpdatedEvents && !isSelected ? 'ring-1 ring-cyan-400/40' : ''}
        `}
            >
              <div
                className={`text-xs xs:text-sm font-medium mb-0.5 xs:mb-1 ${
                  isTodayDay ? 'text-blue-400 font-bold' : isCurrentMonthDay ? 'text-white' : 'text-gray-500'
                }`}
              >
                {date.getDate()}
                {hasUpdatedEvents && <span className="ml-1 inline-block w-1.5 h-1.5 bg-cyan-400 rounded-full" />}
              </div>

              <div className="space-y-0.5 xs:space-y-1">
                {dayEvents.slice(0, 3).map((event) => {
                  const EventIcon = getEventTypeIcon(event.type)
                  const isUpdated = event.createdAt || event.updatedAt || event.status !== 'ACTIVE'
                  const isCancelled = event.status === 'CANCELLED'
                  const isRemoved = event.status === 'REMOVED'

                  return (
                    <div
                      key={event.id}
                      className={`flex items-center space-x-1 p-0.5 xs:p-1 rounded text-[10px] xs:text-xs truncate
                  ${getEventTypeColor(event.type)}
                  ${isUpdated ? 'ring-1 ring-cyan-300/50' : ''}
                  ${isCancelled ? 'opacity-60' : ''}
                  ${isRemoved ? 'opacity-40' : ''}
                `}
                      title={`${event.title}${isUpdated ? ' (Modified)' : ''}`}
                    >
                      <EventIcon className={`w-3 h-3 shrink-0 ${isCancelled ? 'opacity-50' : ''}`} />
                      <span className="truncate">{event.title}</span>
                      {isUpdated && !isCancelled && !isRemoved && (
                        <span className="w-1 h-1 bg-cyan-400 rounded-full shrink-0 ml-1" />
                      )}
                    </div>
                  )
                })}

                {dayEvents.length > 3 && (
                  <div className="text-[10px] xs:text-xs text-gray-400 font-medium text-center">
                    +{dayEvents.length - 3} more
                  </div>
                )}
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Selected Day Meeting Details */}
      {selectedDate && (
        <div className="border-t border-gray-700/50 pt-4 xs:pt-5 sm:pt-6">
          {(() => {
            const selectedDayEvents = (() => {
              const [year, month, day] = selectedDate.split('-')
              const targetDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))

              return events.filter((event) => {
                if (event.startTime) {
                  const eventDate = new Date(event.startTime)
                  return eventDate.toDateString() === targetDate.toDateString()
                } else {
                  const eventDate = new Date(event.date)
                  return eventDate.toDateString() === targetDate.toDateString()
                }
              })
            })()

            const formattedSelectedDate = (() => {
              const [year, month, day] = selectedDate.split('-')
              const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
              return date.toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric'
              })
            })()

            if (selectedDayEvents.length === 0) {
              return (
                <div className="text-center text-gray-400 px-2">
                  <Calendar className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm xs:text-base">No meeting scheduled for {formattedSelectedDate}</p>
                </div>
              )
            }

            return (
              <div>
                <h3 className="pl-3 text-base xs:text-lg sm:text-xl font-bold text-white mb-3 xs:mb-4 flex flex-wrap items-center gap-1">
                  <Calendar className="w-4 h-4 xs:w-5 xs:h-5 mr-1" />
                  <span>Meeting on&nbsp;</span>
                  <span className="text-violet-300">{formattedSelectedDate}</span>
                </h3>

                <div className="space-y-3 xs:space-y-4">
                  {selectedDayEvents.map((event, index) => {
                    const EventIcon = getEventTypeIcon(event.type)
                    const formatTime = (dateTime: string | number | Date) => {
                      return new Date(dateTime).toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true
                      })
                    }

                    const isRemoving = removingMeetingId === event.id

                    return (
                      <motion.div
                        key={event.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-gray-700/20 border border-gray-600/30 rounded-lg p-3 xs:p-4"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                          <div className="flex items-start space-x-3">
                            <div className={`p-2 rounded-lg ${getEventTypeColor(event.type)}`}>
                              <EventIcon className="w-4 h-4 xs:w-5 xs:h-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-white mb-1 text-sm xs:text-base wrap-break-word">
                                {event.title}
                              </h4>
                              <p className="text-xs xs:text-sm text-gray-400 mb-2 wrap-break-word">
                                {event.description}
                              </p>

                              {event.startTime && event.endTime && (
                                <div className="flex items-center flex-wrap gap-1 text-[11px] xs:text-xs text-gray-500 mb-2">
                                  <Clock className="w-3 h-3" />
                                  <span className={`${event.status === 'CANCELLED' ? 'line-through opacity-50' : ''}`}>
                                    {formatTime(event.startTime)} - {formatTime(event.endTime)}
                                  </span>
                                </div>
                              )}

                              {event.isRecurring && (
                                <div className="inline-flex items-center px-2 py-1 rounded text-[11px] xs:text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/30">
                                  Recurring {event.recurrencePattern}
                                </div>
                              )}
                            </div>
                          </div>

                          {user?.isAdmin && !isRemoving && (
                            <button
                              onClick={() => handleRemoveMeeting(event)}
                              className="w-full sm:w-auto px-3 py-1.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-medium rounded-md transition-all duration-200 hover:bg-emerald-500/30 hover:shadow-lg whitespace-nowrap text-center"
                            >
                              Update Meeting
                            </button>
                          )}
                        </div>

                        {isRemoving && (
                          <motion.form
                            onSubmit={handleSubmit}
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="mt-3 xs:mt-4 pt-3 xs:pt-4 border-t border-gray-600/30"
                          >
                            <h5 className="text-sm font-medium text-white mb-3">Update Meeting Details</h5>

                            <div className="space-y-3">
                              <div>
                                <label className="block text-xs font-medium text-gray-400 mb-1">
                                  Title (e.g. Labor Day)
                                </label>
                                <input
                                  name="title"
                                  value={inputs?.title || ''}
                                  onChange={handleInput}
                                  className="w-full px-3 py-2 bg-gray-800/50 border border-gray-600/30 rounded-md text-white text-sm focus:outline-none focus:border-violet-500"
                                  placeholder="Enter title"
                                />
                              </div>

                              <div>
                                <label className="block text-xs font-medium text-gray-400 mb-1">
                                  Message (optional)
                                </label>
                                <textarea
                                  name="description"
                                  value={inputs?.description || ''}
                                  onChange={handleInput}
                                  className="w-full px-3 py-2 bg-gray-800/50 border border-gray-600/30 rounded-md text-white text-sm focus:outline-none focus:border-violet-500"
                                  rows={2}
                                  placeholder="Enter reason for updating this meeting..."
                                />
                              </div>

                              <div>
                                <label className="block text-xs font-medium text-gray-400 mb-1">Meeting Type</label>
                                <select
                                  name="type"
                                  value={inputs?.type || ''}
                                  onChange={handleInput}
                                  className="w-full px-3 py-2 bg-gray-800/50 border border-gray-600/30 rounded-md text-white text-sm focus:outline-none focus:border-violet-500"
                                >
                                  <option value="meeting">Meeting</option>
                                  <option value="social">Social</option>
                                  <option value="entertainment">Entertainment</option>
                                  <option value="holiday">Holiday</option>
                                </select>
                              </div>

                              <div className="flex flex-col xs:flex-row gap-2 pt-2">
                                <button
                                  type="submit"
                                  className="inline-flex items-center justify-center px-4 py-2 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-medium rounded-md transition-all duration-200 hover:bg-emerald-500/30"
                                >
                                  Confirm Update
                                  {(isCreating || isUpdating) && (
                                    <div className="ml-2 w-3 h-3 border-2 border-emerald-500 animate-spin rounded-full border-t-transparent" />
                                  )}
                                </button>
                                <button
                                  type="button"
                                  onClick={handleCancelRemove}
                                  className="px-4 py-2 bg-gray-500/20 text-gray-400 border border-gray-500/30 text-xs font-medium rounded-md transition-all duration-200 hover:bg-gray-500/30"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          </motion.form>
                        )}
                      </motion.div>
                    )
                  })}
                </div>
              </div>
            )
          })()}
        </div>
      )}
    </div>
  )
}

export default CalendarGrid
