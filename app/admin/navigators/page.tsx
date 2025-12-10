'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Users, Plus } from 'lucide-react'
import { useUserSelector } from '@/app/redux/store'
import AdminNavigatorCard from '@/app/components/admin/AdminNavigatorCard'
import navigatorStatusOptions from '@/app/lib/utils/navigator/navigatorStatusOptions'
import { getNavigatorStatusIcon } from '@/app/lib/utils/navigator/getNavigatorStatusIcon'
import getNavigatorStatusColor from '@/app/lib/utils/navigator/getNavigatorStatusColor'

const Navigators = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [viewMode, setViewMode] = useState('grid') // 'grid' or 'list'
  const { users } = useUserSelector()

  const filteredNavigators = users?.filter((navigator) => {
    const matchesSearch =
      searchQuery === '' ||
      navigator.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      navigator.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      navigator.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      navigator.industry.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === 'all' || navigator.membershipStatus === statusFilter

    return matchesSearch && matchesStatus
  })

  return (
    <div className="bg-gray-900">
      <div className="flex h-[calc(100vh-66px)]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex-1 p-6 overflow-y-auto space-y-8"
        >
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-6 gap-4">
            {navigatorStatusOptions(users)
              .slice(1, 7)
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
                    <div className={`p-3 rounded-lg ${getNavigatorStatusColor(status.value)}`}>
                      {getNavigatorStatusIcon(status.value)}
                    </div>
                  </div>
                </motion.div>
              ))}
          </div>

          {/* Filters and Search */}
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name, email, company, or profession..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-violet-400 focus:border-violet-400 transition-all focus:outline-none"
              />
            </div>

            {/* Filters */}
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-violet-400 focus:border-violet-400 transition-all focus:outline-none"
              >
                {navigatorStatusOptions(users).map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label} {option.count !== undefined && `(${option.count})`}
                  </option>
                ))}
              </select>

              <button
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                className="px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-gray-300 hover:text-white hover:bg-gray-700 transition-all"
              >
                <Users className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Navigators Grid/List */}
          <div
            className={`${viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6' : 'space-y-4'}`}
          >
            <AnimatePresence>
              {filteredNavigators.map((navigator, i) => (
                <AdminNavigatorCard key={i} index={i} navigator={navigator} viewMode={viewMode} />
              ))}
            </AnimatePresence>

            {/* Empty State */}
            {filteredNavigators.length === 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="col-span-full text-center py-12">
                <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-400 mb-2">No Navigators Found</h3>
                <p className="text-gray-500 mb-6">
                  {searchQuery || statusFilter !== 'all'
                    ? 'Try adjusting your search or filters'
                    : 'Add your first chapter member to get started'}
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 bg-linear-to-r from-violet-600 to-fuchsia-600 text-white rounded-lg hover:from-violet-500 hover:to-fuchsia-500 transition-all flex items-center space-x-2 font-semibold mx-auto"
                >
                  <Plus className="w-5 h-5" />
                  <span>Add New Navigator</span>
                </motion.button>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Navigators
