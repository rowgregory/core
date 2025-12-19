import { useState, useMemo, SetStateAction } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, Filter, ChevronDown, ChevronUp } from 'lucide-react'
import { RendezvousEvent } from '@/types/rendezvous'

const RendezvousListView = ({ events, getEventTypeIcon, getEventTypeColor, onRemoveEvent, onRestoreEvent }: any) => {
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterType, setFilterType] = useState('all')
  const [sortBy, setSortBy] = useState('date')
  const [sortOrder, setSortOrder] = useState('asc')
  const [expandedEvent, setExpandedEvent] = useState(null) as any

  // Filter and sort events
  const filteredAndSortedEvents = useMemo(() => {
    let filtered = events

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter((event: { status: string }) => event.status === filterStatus)
    }

    // Filter by type
    if (filterType !== 'all') {
      filtered = filtered.filter((event: { type: string }) => event.type === filterType)
    }

    // Sort events
    filtered.sort(
      (
        a: { startTime: string | number | Date; title: string; type: any; status: any },
        b: { startTime: string | number | Date; title: string; type: any; status: any }
      ) => {
        let aValue, bValue

        switch (sortBy) {
          case 'date':
            aValue = new Date(a.startTime).getTime()
            bValue = new Date(b.startTime).getTime()
            break
          case 'title':
            aValue = a.title.toLowerCase()
            bValue = b.title.toLowerCase()
            break
          case 'type':
            aValue = a.type
            bValue = b.type
            break
          case 'status':
            aValue = a.status
            bValue = b.status
            break
          default:
            return 0
        }

        if (sortOrder === 'asc') {
          return aValue > bValue ? 1 : -1
        } else {
          return aValue < bValue ? 1 : -1
        }
      }
    )

    return filtered
  }, [events, filterStatus, filterType, sortBy, sortOrder])

  const formatDateTime = (dateTime: string | number | Date) => {
    return new Date(dateTime).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  const getStatusBadge = (status: any) => {
    const baseClasses = 'inline-flex items-center px-2 py-1 rounded text-xs font-medium'

    switch (status) {
      case 'ACTIVE':
        return `${baseClasses} bg-green-500/10 text-green-400 border border-green-500/30`
      case 'CANCELLED':
        return `${baseClasses} bg-red-500/10 text-red-400 border border-red-500/30`
      case 'REMOVED':
        return `${baseClasses} bg-gray-500/10 text-gray-400 border border-gray-500/30`
      default:
        return `${baseClasses} bg-blue-500/10 text-blue-400 border border-blue-500/30`
    }
  }

  const toggleSort = (field: SetStateAction<string>) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('asc')
    }
  }

  const getSortIcon = (field: string) => {
    if (sortBy !== field) return null
    return sortOrder === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
  }

  return (
    <div className="px-3 py-6">
      {/* Filters and Controls */}
      <div className="mb-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white flex items-center">
            <Filter className="w-5 h-5 mr-2" />
            Meeting List ({filteredAndSortedEvents.length} events)
          </h3>
        </div>

        <div className="flex flex-wrap gap-4">
          {/* Status Filter */}
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 bg-gray-800/50 border border-gray-600/30 rounded-md text-white text-sm"
            >
              <option value="all">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="CANCELLED">Cancelled</option>
              <option value="REMOVED">Removed</option>
            </select>
          </div>

          {/* Type Filter */}
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Type</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 bg-gray-800/50 border border-gray-600/30 rounded-md text-white text-sm"
            >
              <option value="all">All Types</option>
              <option value="meeting">Meeting</option>
              <option value="social">Social</option>
              <option value="holiday">Holiday</option>
            </select>
          </div>
        </div>
      </div>

      {/* Sort Headers */}
      <div className="hidden sm:block mb-4">
        <div className="grid grid-cols-12 gap-4 p-3 bg-gray-800/30 rounded-lg text-xs font-medium text-gray-400">
          <button
            onClick={() => toggleSort('date')}
            className="col-span-3 flex items-center space-x-1 hover:text-white transition-colors"
          >
            <span>Date & Time</span>
            {getSortIcon('date')}
          </button>
          <button
            onClick={() => toggleSort('title')}
            className="col-span-3 flex items-center space-x-1 hover:text-white transition-colors"
          >
            <span>Title</span>
            {getSortIcon('title')}
          </button>
          <button
            onClick={() => toggleSort('type')}
            className="col-span-2 flex items-center space-x-1 hover:text-white transition-colors"
          >
            <span>Type</span>
            {getSortIcon('type')}
          </button>
          <button
            onClick={() => toggleSort('status')}
            className="col-span-2 flex items-center space-x-1 hover:text-white transition-colors"
          >
            <span>Status</span>
            {getSortIcon('status')}
          </button>
          <div className="col-span-2 text-center">Actions</div>
        </div>
      </div>

      {/* Events List */}
      <div className="space-y-2">
        <AnimatePresence>
          {filteredAndSortedEvents.map((event: RendezvousEvent, index: number) => {
            const EventIcon = getEventTypeIcon(event.type)
            const isExpanded = expandedEvent === event.id
            const isUpdated = event.createdAt || event.updatedAt || event.status !== 'ACTIVE'
            const isCancelled = event.status === 'CANCELLED'

            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
                className={`
                  bg-gray-700/20 border border-gray-600/30 rounded-lg transition-all duration-200 hover:border-gray-500/50
                  ${isUpdated ? 'ring-1 ring-cyan-400/40' : ''}
                  ${isCancelled ? 'opacity-70' : ''}
                `}
              >
                <div className="grid sm:grid-cols-12 gap-4 p-4 items-center">
                  {/* Date & Time */}
                  <div className="col-span-3">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-400 shrink-0" />
                      <div>
                        <div
                          className={`text-sm font-medium ${isCancelled ? 'line-through text-gray-400' : 'text-white'}`}
                        >
                          {formatDateTime(event.startTime)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(event.endTime).toLocaleTimeString('en-US', {
                            hour: 'numeric',
                            minute: '2-digit',
                            hour12: true
                          })}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Title */}
                  <div className="col-span-3">
                    <div className="flex items-center space-x-2">
                      <div className={`p-1.5 rounded ${getEventTypeColor(event.type)}`}>
                        <EventIcon className="w-3 h-3" />
                      </div>
                      <div>
                        <div className={`font-medium text-sm ${isCancelled ? 'text-gray-400' : 'text-white'}`}>
                          {event.title}
                        </div>
                        {isUpdated && <div className="text-xs text-cyan-400">Modified</div>}
                      </div>
                    </div>
                  </div>

                  {/* Type */}
                  <div className="col-span-2">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getEventTypeColor(event.type)}`}
                    >
                      {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                    </span>
                  </div>

                  {/* Status */}
                  <div className="col-span-2">
                    <span className={getStatusBadge(event.status)}>{event.status}</span>
                  </div>

                  {/* Actions */}
                  <div className="col-span-2 flex items-center justify-center space-x-2">
                    <button
                      onClick={() => setExpandedEvent(isExpanded ? null : event.id)}
                      className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-600/30 rounded transition-colors"
                      title="View details"
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>

                    {event.status === 'ACTIVE' && onRemoveEvent && (
                      <button
                        onClick={() => onRemoveEvent(event.id)}
                        className="px-2 py-1 bg-red-500/20 text-red-400 border border-red-500/30 text-xs rounded hover:bg-red-500/30 transition-colors"
                      >
                        Remove
                      </button>
                    )}

                    {event.status === 'REMOVED' && onRestoreEvent && (
                      <button
                        onClick={() => onRestoreEvent(event.id)}
                        className="px-2 py-1 bg-green-500/20 text-green-400 border border-green-500/30 text-xs rounded hover:bg-green-500/30 transition-colors"
                      >
                        Restore
                      </button>
                    )}
                  </div>
                </div>

                {/* Expanded Details */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="border-t border-gray-600/30 p-4"
                    >
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="text-gray-400 mb-1">Description</div>
                          <div className="text-white">{event.description || 'No description'}</div>
                        </div>
                        <div>
                          <div className="text-gray-400 mb-1">Recurrence</div>
                          <div className="text-white">
                            {event.isRecurring ? `${event.recurrencePattern} recurring` : 'One-time event'}
                          </div>
                        </div>
                        {event.createdAt && (
                          <div>
                            <div className="text-gray-400 mb-1">Created</div>
                            <div className="text-white text-xs">{new Date(event.createdAt).toLocaleString()}</div>
                          </div>
                        )}
                        {event.updatedAt && (
                          <div>
                            <div className="text-gray-400 mb-1">Last Updated</div>
                            <div className="text-white text-xs">{new Date(event.updatedAt).toLocaleString()}</div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {filteredAndSortedEvents.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="w-12 h-12 text-gray-500 mx-auto mb-4" />
          <div className="text-gray-400">No events found matching your filters</div>
        </div>
      )}
    </div>
  )
}

export default RendezvousListView
