'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import getAnchorStatusOptions from '@/app/lib/utils/anchor/getAnchorStatusOptions'
import getAnchorStatusIcon from '@/app/lib/utils/anchor/getAnchorStatusIcon'
import getAnchorStatusColor from '@/app/lib/utils/anchor/getAnchorStatusColor'
import { useSession } from 'next-auth/react'
import AnchorCard from '@/app/components/anchor/AnchorCard'
import EmptyState from '@/app/components/common/EmptyState'
import { Search } from 'lucide-react'
import { setOpenAnchorDrawer } from '@/app/lib/redux/features/anchorSlice'
import { useAnchorSelector } from '@/app/lib/redux/store'
import InfoBanner from '@/app/components/common/InfoBanner'

const MemberAnchors = () => {
  const session = useSession()
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const { anchors } = useAnchorSelector()

  const filteredAnchors = anchors
    ?.filter((anchor) => {
      const matchesSearch =
        searchQuery === '' ||
        anchor.giver.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        anchor.receiver.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        anchor.giver.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        anchor.receiver.company.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesStatus = statusFilter === 'all' || anchor.status === statusFilter

      return matchesSearch && matchesStatus
    })
    .sort((a, b) => {
      // Get current user ID
      const currentUserId = session.data?.user?.id

      // Check if user is recipient in each anchor
      const aIsRecipient = a.receiverId === currentUserId
      const bIsRecipient = b.receiverId === currentUserId

      // If one is recipient and other isn't, prioritize the recipient one
      if (aIsRecipient && !bIsRecipient) return -1
      if (!aIsRecipient && bIsRecipient) return 1

      // If both or neither are recipient, sort by creation date (newest first)
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })

  return (
    <div className="bg-gray-900 min-h-[calc(100vh-68px)]">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex-1 px-3 py-6 sm:p-6 overflow-y-auto space-y-6"
      >
        {/* Anchor Info Banner */}
        <InfoBanner
          type="anchor"
          description="is a way to recognize and thank a member for closed business they helped generate."
        />

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 xs:gap-3 sm:gap-4">
          {getAnchorStatusOptions(anchors)
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
                  <div className={`p-1.5 xs:p-2 sm:p-3 rounded-lg shrink-0 ${getAnchorStatusColor(status.value)}`}>
                    <div className="w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-5 sm:h-5">{getAnchorStatusIcon(status.value)}</div>
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
              {getAnchorStatusOptions(anchors).map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label} ({option.count})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Anchor List */}
        <div className="grid grid-cols-1 2xl:grid-cols-2 3xl:grid-cols-3 gap-7">
          <AnimatePresence>
            {filteredAnchors?.map((anchor, index) => (
              <AnchorCard key={index} anchor={anchor} index={index} />
            ))}
          </AnimatePresence>
        </div>
        {/* Empty State */}
        {filteredAnchors?.length === 0 && (
          <EmptyState
            searchQuery={searchQuery}
            statusFilter={statusFilter}
            typeFilter=""
            title="Anchor"
            advice="Drop your first anchor to get started"
            func={setOpenAnchorDrawer}
            action="Drop Anchor"
            formName="anchorForm"
          />
        )}
      </motion.div>
    </div>
  )
}

export default MemberAnchors
