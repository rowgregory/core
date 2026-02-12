'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search } from 'lucide-react'
import { setOpenParleyDrawer } from '@/app/lib/redux/features/parleySlice'
import { useSession } from 'next-auth/react'
import getStatusColor from '@/app/lib/utils/parley/getParleyStatusColor'
import getStatusIcon from '@/app/lib/utils/parley/getParleyStatusIcon'
import ParleyCard from '@/app/components/cards/ParleyCard'
import EmptyState from '@/app/components/common/EmptyState'
import statusOptions from '@/app/lib/utils/parley/getParleyStatusOptions'
import InfoBanner from '@/app/components/common/InfoBanner'

const MemberParleysClient = ({ data }) => {
  const session = useSession()
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')

  const filteredParleys = data
    ?.filter((parley) => {
      const matchesSearch =
        searchQuery === '' ||
        parley.requester.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        parley.recipient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        parley.requester.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        parley.recipient.company.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesStatus = statusFilter === 'all' || parley.status === statusFilter
      const matchesType = typeFilter === 'all' || parley.meetingType === typeFilter

      return matchesSearch && matchesStatus && matchesType
    })
    .sort((a, b) => {
      // Get current user ID
      const currentUserId = session.data?.user?.id

      // Check if user is recipient in each parley
      const aIsRecipient = a.recipientId === currentUserId
      const bIsRecipient = b.recipientId === currentUserId

      // If one is recipient and other isn't, prioritize the recipient one
      if (aIsRecipient && !bIsRecipient) return -1
      if (!aIsRecipient && bIsRecipient) return 1

      // If both or neither are recipient, sort by creation date (newest first)
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })

  return (
    <div className="bg-gray-900 min-h-[calc(100vh-68px)]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex-1 px-3 py-6 sm:p-6 overflow-y-auto space-y-6"
      >
        {/* Parley Info Banner */}
        <InfoBanner
          type="parley"
          description="is a face to face meeting between members to share updates, collaborate, or build connections"
        />

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 xs:gap-3 sm:gap-4">
          {statusOptions(data)
            .slice(1)
            .map((status, index) => (
              <motion.div
                key={status.value}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg xs:rounded-xl p-3 xs:p-4 sm:p-6"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="text-gray-400 text-[10px] xs:text-xs sm:text-sm truncate">{status.label}</p>
                    <p className="text-lg xs:text-xl sm:text-2xl font-bold text-white">{status.count}</p>
                  </div>
                  <div className={`p-1.5 xs:p-2 sm:p-3 rounded-lg shrink-0 ${getStatusColor(status.value)}`}>
                    <div className="w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-5 sm:h-5">{getStatusIcon(status.value)}</div>
                  </div>
                </div>
              </motion.div>
            ))}
        </div>

        {/* Filters and Search */}
        <div className="sticky top-0 z-20 flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by member name or company..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-violet-400 focus:border-violet-400 transition-all"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-violet-400 focus:border-violet-400 transition-all w-full md:w-fit"
            >
              {statusOptions(data).map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label} ({option.count})
                </option>
              ))}
            </select>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-violet-400 focus:border-violet-400 transition-all w-full md:w-fit"
            >
              <option value="all">All Types</option>
              <option value="DECK_TO_DECK">Deck-to-Deck</option>
              <option value="VOYAGE_CALL">Voyage Call</option>
              <option value="MESSAGE_IN_A_BOTTLE">Message In a Bottle</option>
              <option value="LANTERN_LIGHT">Lantern Light</option>
            </select>
          </div>
        </div>

        {/* Parley List */}
        <div className="grid grid-cols-1 2xl:grid-cols-2 3xl:grid-cols-3 gap-7">
          <AnimatePresence>
            {filteredParleys?.map((parley, index) => (
              <ParleyCard key={index} parley={parley} index={index} />
            ))}
          </AnimatePresence>
        </div>
        {/* Empty State */}
        {filteredParleys?.length === 0 && (
          <EmptyState
            searchQuery={searchQuery}
            statusFilter={statusFilter}
            typeFilter={typeFilter}
            title="Parley"
            advice="Schedule your first parley to get started"
            func={setOpenParleyDrawer}
            action="Schedule Parley"
            formName="parleyForm"
          />
        )}
      </motion.div>
    </div>
  )
}

export default MemberParleysClient
