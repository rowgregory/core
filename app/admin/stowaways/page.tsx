'use client'

import React, { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Search } from 'lucide-react'
import getApplicationStatusOptions from '@/app/lib/utils/application/getApplicationStatusOptions'
import getApplicationStatusColor from '@/app/lib/utils/application/getApplicationStatusColor'
import getApplicationStatusIcon from '@/app/lib/utils/application/getApplicationStatusIcon'
import EmptyState from '@/app/components/common/EmptyState'
import { setOpenStowawayDrawer } from '@/app/redux/features/userSlice'
import StowawayCard from '@/app/components/stowaway/StowawayCard'
import { useUserSelector } from '@/app/redux/store'
import InfoBanner from '@/app/components/common/InfoBanner'

const Stowaways = () => {
  const { users } = useUserSelector()
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const filteredStowaways = users
    ?.filter((user) => {
      const matchesSearch = searchQuery === '' || user.name.toLowerCase().includes(searchQuery.toLowerCase())

      const isStowaway = user.membershipStatus === 'FLAGGED' || user?.membershipStatus === 'REJECTED'

      const matchesStatus = statusFilter === 'all' || user.membershipStatus === statusFilter

      return isStowaway && matchesSearch && matchesStatus
    })
    .sort((a, b) => {
      // Sort by creation date (newest first)
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })

  return (
    <div className="bg-gray-900 min-h-[calc(100vh-68px)]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex-1 p-6 overflow-y-auto space-y-6"
      >
        {/* Stowaway Info Banner */}
        <InfoBanner
          type="stowaway"
          description="is a visitor with unknown joining status
              into the system for tracking and review."
        />
        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 xs:gap-3 sm:gap-4">
          {getApplicationStatusOptions(users)
            .filter((_, i, arr) => i === 1 || i === arr.length - 1)
            .map((status, index) => (
              <motion.div
                key={status.value}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="text-gray-400 text-[10px] xs:text-xs sm:text-sm truncate">{status.label}</p>
                    <p className="text-lg xs:text-xl sm:text-2xl font-bold text-white">{status.count}</p>
                  </div>
                  <div
                    className={`p-1.5 xs:p-2 sm:p-3 rounded-lg shrink-0
                     ${getApplicationStatusColor(status.value)}`}
                  >
                    <div className="w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-5 sm:h-5">
                      {getApplicationStatusIcon(status.value)}
                    </div>
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
              placeholder="Search by navigator name..."
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
              {getApplicationStatusOptions(filteredStowaways)
                .filter((_, i, arr) => i === 0 || i === 1 || i === arr.length - 1)
                .map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label} ({option.count})
                  </option>
                ))}
            </select>
          </div>
        </div>

        {/* Application List */}
        <div className="grid grid-cols-1 2xl:grid-cols-2 3xl:grid-cols-3 gap-7">
          <AnimatePresence>
            {filteredStowaways?.map((stowaway, index) => (
              <StowawayCard key={index} stowaway={stowaway} />
            ))}
          </AnimatePresence>
        </div>
        {/* Empty State */}
        {filteredStowaways?.length === 0 && (
          <EmptyState
            searchQuery={searchQuery}
            statusFilter={statusFilter}
            typeFilter={''}
            title="Stowaway'"
            advice="No Stowaways yet — til the next crew arrives."
            func={setOpenStowawayDrawer}
            action="Stowaway"
            formName="stowawayForm"
          />
        )}
      </motion.div>
    </div>
  )
}

export default Stowaways
