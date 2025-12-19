'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Search, Users2, User2Icon } from 'lucide-react'
import { useSession } from 'next-auth/react'
import EmptyState from '@/app/components/common/EmptyState'
import AnchorCard from '@/app/components/anchor/AnchorCard'
import getAnchorStatusIcon from '@/app/lib/utils/anchor/getAnchorStatusIcon'
import getAnchorStatusOptions from '@/app/lib/utils/anchor/getAnchorStatusOptions'
import getAnchorStatusColor from '@/app/lib/utils/anchor/getAnchorStatusColor'
import { setOpenAnchorDrawer } from '@/app/redux/features/anchorSlice'
import { useAnchorSelector } from '@/app/redux/store'
import InfoBanner from '@/app/components/common/InfoBanner'

const AdminAnchors = () => {
  const session = useSession()
  const [searchQuery, setSearchQuery] = useState('')
  const { anchors } = useAnchorSelector()
  const [showMyAnchorsOnly, setShowMyAnchorsOnly] = useState(false)

  const filteredAnchors = anchors
    ?.filter((anchor) => {
      const matchesSearch =
        searchQuery === '' ||
        anchor.giver.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        anchor.receiver.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        anchor.giver.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        anchor.receiver.company.toLowerCase().includes(searchQuery.toLowerCase())

      if (showMyAnchorsOnly) {
        return anchor.giverId === session?.data?.user.id || anchor.receiverId === session.data?.user.id
      }

      return matchesSearch
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {getAnchorStatusOptions(anchors)
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
                  <div className={`p-3 rounded-lg ${getAnchorStatusColor(status.value)}`}>
                    {getAnchorStatusIcon(status.value)}
                  </div>
                </div>
              </motion.div>
            ))}
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4">
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
            <button
              onClick={() => setShowMyAnchorsOnly(!showMyAnchorsOnly)}
              className={`px-4 py-3 border rounded-lg transition-all flex items-center space-x-2 w-full md:w-fit ${
                showMyAnchorsOnly
                  ? 'bg-violet-500/10 border-violet-500 text-violet-300'
                  : 'bg-gray-800/50 border-gray-700 text-gray-300 hover:border-gray-600 hover:text-white'
              }`}
            >
              {showMyAnchorsOnly ? <User2Icon className="w-4 h-4" /> : <Users2 className="w-4 h-4" />}
              <span>{showMyAnchorsOnly ? 'My Anchors Only' : 'Show All Anchors'}</span>
            </button>
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
            statusFilter=""
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

export default AdminAnchors
