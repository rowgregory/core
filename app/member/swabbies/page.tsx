'use client'

import React, { FC, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Search, Mail, Phone, MapPin, Building2, Briefcase, Calendar, Sailboat } from 'lucide-react'
import { useUserSelector } from '@/app/redux/store'
import { formatDate } from '@/app/lib/utils/date/formatDate'
import getApplicationStatusOptions from '@/app/lib/utils/application/getApplicationStatusOptions'
import getApplicationStatusColor from '@/app/lib/utils/application/getApplicationStatusColor'
import getApplicationStatusIcon from '@/app/lib/utils/application/getApplicationStatusIcon'
import { statusIcons } from '@/app/components/swabbie/SwabbieCard'
import { useSession } from 'next-auth/react'
import EmptyState from '@/app/components/common/EmptyState'
import { setOpenSwabbieDrawer } from '@/app/redux/features/userSlice'
import Link from 'next/link'
import { User as IUser } from '@/types/user'

const SwabbieCard: FC<{ swabbie: IUser; index: number }> = ({ swabbie, index }) => {
  const StatusIcon: any = statusIcons[swabbie.membershipStatus]
  const isRejected = swabbie.membershipStatus === 'SUSPENDED' || swabbie.membershipStatus === 'CANCELLED'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 * index, ease: 'easeInOut' }}
      className={`backdrop-blur-md rounded-xl border p-6 transition-all duration-300 shadow-lg ${
        isRejected
          ? 'bg-red-900/20 border-red-600/30 hover:border-red-400/50 shadow-red-900/50'
          : 'bg-gray-800/50 border-gray-700/30 hover:border-cyan-400/50 shadow-gray-900/50'
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div
            className={`h-12 w-12 rounded-full flex items-center justify-center shadow-lg ${
              isRejected
                ? 'bg-linear-to-r from-red-600 to-red-700 shadow-red-900/50'
                : 'bg-linear-to-r from-cyan-600 to-blue-700 shadow-cyan-900/50'
            }`}
          >
            <Sailboat className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className={`text-lg font-semibold ${isRejected ? 'text-red-200' : 'text-white'}`}>{swabbie.name}</h3>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium border flex items-center gap-1 ${getApplicationStatusColor(swabbie.membershipStatus)}`}
          >
            <StatusIcon className="h-3 w-3" />
            {swabbie.membershipStatus}
          </span>
        </div>
      </div>

      <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 ${isRejected ? 'opacity-75' : ''}`}>
        <div className="space-y-2">
          <div className="flex items-center text-sm text-gray-300">
            <Mail className="h-4 w-4 mr-2 text-gray-400" />
            {swabbie.email}
          </div>
          <div className="flex items-center text-sm text-gray-300">
            <Phone className="h-4 w-4 mr-2 text-gray-400" />
            {swabbie.phone}
          </div>
          <div className="flex items-center text-sm text-gray-300">
            <MapPin className="h-4 w-4 mr-2 text-gray-400" />
            {swabbie.location}
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center text-sm text-gray-300">
            <Building2 className="h-4 w-4 mr-2 text-gray-400" />
            {swabbie.company}
          </div>
          <div className="flex items-center text-sm text-gray-300">
            <Briefcase className="h-4 w-4 mr-2 text-gray-400" />
            {swabbie.industry}
          </div>
          <div className="flex items-center text-sm text-gray-300">
            <Calendar className="h-4 w-4 mr-2 text-gray-400" />
            Joined {formatDate(swabbie.createdAt)}
          </div>
        </div>
      </div>

      <div className={`mb-4 ${isRejected ? 'opacity-75' : ''}`}>
        <div className="text-xs text-gray-400 mb-2">Specialties</div>
        <div className="flex flex-wrap gap-1">
          {swabbie?.specialties?.map((specialty: string, index: number) => (
            <span
              key={index}
              className={`px-2 py-1 text-xs rounded-full border ${
                isRejected
                  ? 'bg-red-900/20 text-red-300 border-red-600/30'
                  : 'bg-cyan-900/20 text-cyan-300 border-cyan-600/30'
              }`}
            >
              {specialty}
            </span>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between py-4 border-y border-gray-600/30 mb-5">
        <div className="flex items-center space-x-2">
          <div className={`h-2 w-2 rounded-full ${swabbie.isLicensed ? 'bg-emerald-400' : 'bg-gray-400'}`} />
          <span className="text-xs text-gray-300">
            {swabbie.businessLicenseNumber ? `Licensed (${swabbie.businessLicenseNumber})` : 'No License'}
          </span>
        </div>
      </div>

      <Link
        href={`/swabbie/port?swabbieId=${swabbie.id}`}
        className="px-4 py-2 text-xs text-blue-400 border border-blue-500/30 rounded hover:bg-blue-600/10 transition-colors duration-200"
      >
        <span>Visit {swabbie.name}&apos;s Dockside Dashboard</span>
      </Link>
    </motion.div>
  )
}

const SwabbiesPage = () => {
  const session = useSession()
  const { users } = useUserSelector()
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const filteredSwabbies = users
    ?.filter((user) => {
      const isApplicationStatus = ['PENDING', 'INITIAL_REVIEW', 'BACKGROUND_CHECK', 'REJECTED'].includes(
        user.membershipStatus
      )

      const matchesSearch = searchQuery === '' || user.name.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesStatus = statusFilter === 'all' || user.membershipStatus === statusFilter

      return isApplicationStatus && matchesSearch && matchesStatus
    })
    .sort((a, b) => {
      // Get current user ID
      const currentUserId = session.data?.user?.id

      // Check if user is recipient in each user
      const aIsRecipient = a.id === currentUserId
      const bIsRecipient = b.id === currentUserId

      // If one is recipient and other isn't, prioritize the recipient one
      if (aIsRecipient && !bIsRecipient) return -1
      if (!aIsRecipient && bIsRecipient) return 1

      // If both or neither are recipient, sort by creation date (newest first)
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })

  return (
    <div className="bg-gray-900 flex h-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex-1 p-6 overflow-y-auto space-y-6"
      >
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {getApplicationStatusOptions(users)
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
                  <div className={`p-3 rounded-lg ${getApplicationStatusColor(status.value)}`}>
                    {getApplicationStatusIcon(status.value)}
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
              className="px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-violet-400 focus:border-violet-400 transition-all"
            >
              {getApplicationStatusOptions(filteredSwabbies).map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label} ({option.count})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Swabbies Grid */}
        <div className="grid grid-cols-1 2xl:grid-cols-2 3xl:grid-cols-3 gap-7">
          <AnimatePresence>
            {filteredSwabbies?.map((swabbie, index) => (
              <SwabbieCard key={swabbie.id} swabbie={swabbie} index={index} />
            ))}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {filteredSwabbies?.length === 0 && (
          <EmptyState
            searchQuery={searchQuery}
            statusFilter={statusFilter}
            typeFilter={''}
            title="Swabbie'"
            advice="No Swabbie yet — chart the course and find yer crew."
            func={setOpenSwabbieDrawer}
            action="Swabbie"
          />
        )}
      </motion.div>
    </div>
  )
}

export default SwabbiesPage
