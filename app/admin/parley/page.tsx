'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Users2, User2Icon } from 'lucide-react'
import { setOpenParleyDrawer } from '@/app/redux/features/parleySlice'
import { useSession } from 'next-auth/react'
import EmptyState from '@/app/components/common/EmptyState'
import ParleyCard from '@/app/components/parley/ParleyCard'
import statusOptions from '@/app/lib/utils/parley/getParleyStatusOptions'
import getParleyStatusIcon from '@/app/lib/utils/parley/getParleyStatusIcon'
import getParleyStatusColor from '@/app/lib/utils/parley/getParleyStatusColor'
import { useParleySelector } from '@/app/redux/store'

const AdminParleys = () => {
  const session = useSession()
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const { parleys } = useParleySelector()
  const [showMyParleysOnly, setShowMyParleysOnly] = useState(false)

  const filteredParleys = parleys
    ?.filter((parley) => {
      const matchesSearch =
        searchQuery === '' ||
        parley.requester.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        parley.recipient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        parley.requester.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        parley.recipient.company.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesStatus = statusFilter === 'all' || parley.status === statusFilter
      const matchesType = typeFilter === 'all' || parley.meetingType === typeFilter

      if (showMyParleysOnly) {
        return parley.requesterId === session?.data?.user.id || parley.recipientId === session.data?.user.id
      }

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
    <div className="bg-gray-900">
      <div className="flex h-[calc(100vh-66px)]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex-1 p-6 overflow-y-auto space-y-6"
        >
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {statusOptions(parleys)
              .slice(1)
              .map((status, index) => (
                <motion.div
                  key={status.value}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">{status.label}</p>
                      <p className="text-2xl font-bold text-white">{status.count}</p>
                    </div>
                    <div className={`p-3 rounded-lg ${getParleyStatusColor(status.value)}`}>
                      {getParleyStatusIcon(status.value)}
                    </div>
                  </div>
                </motion.div>
              ))}
          </div>

          {/* Filters and Search */}
          <div className="sticky top-0 z-20 flex flex-col sm:flex-row gap-4">
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
                className="px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-violet-400 transition-all"
              >
                {statusOptions(parleys).map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label} ({option.count})
                  </option>
                ))}
              </select>

              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-violet-400 transition-all"
              >
                <option value="all">All Types</option>
                <option value="DECK_TO_DECK">Deck-to-Deck</option>
                <option value="VOYAGE_CALL">Voyage Call</option>
                <option value="MESSAGE_IN_A_BOTTLE">Message In a Bottle</option>
                <option value="LANTERN_LIGHT">Lantern Light</option>
              </select>

              <button
                onClick={() => setShowMyParleysOnly(!showMyParleysOnly)}
                className={`px-4 py-3 border rounded-lg transition-all flex items-center space-x-2 ${
                  showMyParleysOnly
                    ? 'bg-violet-500/10 border-violet-500 text-violet-300'
                    : 'bg-gray-800/50 border-gray-700 text-gray-300 hover:border-gray-600 hover:text-white'
                }`}
              >
                {showMyParleysOnly ? <User2Icon className="w-4 h-4" /> : <Users2 className="w-4 h-4" />}
                <span>{showMyParleysOnly ? 'My Parleys Only' : 'Show All Parleys'}</span>
              </button>
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
              title="Parleys"
              advice="Schedule your first parley to get started"
              func={setOpenParleyDrawer}
              action="Schedule Parley"
              formName="parleyForm"
            />
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default AdminParleys
