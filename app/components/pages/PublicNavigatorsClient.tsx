'use client'

import { useState } from 'react'
import { Search, Users, Award } from 'lucide-react'
import NavigatorCard from '@/app/components/cards/NavigatorCard'

const PublicNavigatorsClient = ({ data }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedIndustry, setSelectedIndustry] = useState('All')
  const [expandedMember, setExpandedMember] = useState(null) as any
  const navigators = data?.filter((user) => user.membershipStatus === 'ACTIVE') ?? []

  const industries: any = ['All', ...new Set(navigators?.map?.((navigator) => navigator.industry))]

  const filteredNavigators = navigators?.filter?.((navigator) => {
    const matchesSearch =
      navigator.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      navigator.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      navigator.interests.some((specialty) => specialty.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesIndustry = selectedIndustry === 'All' || navigator.industry === selectedIndustry
    return matchesSearch && matchesIndustry
  })

  return (
    <div className="min-h-dvh bg-gray-900 pb-20">
      {/* Header Section */}
      <div className="bg-linear-to-r from-blue-600 to-teal-600 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 md:mb-4 leading-tight">
            Our Professional Network
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-blue-100 mb-6 md:mb-8 max-w-3xl mx-auto leading-relaxed">
            Connect with trusted professionals in the Coastal Referral Exchange. Each member has been vetted for
            excellence and is committed to providing exceptional service to our shared client network.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 text-blue-100 text-sm md:text-base">
            <div className="flex items-center">
              <Users className="w-4 h-4 md:w-5 md:h-5 mr-2 shrink-0" />
              <span>{navigators?.length} Professional Members</span>
            </div>
            <div className="flex items-center">
              <Award className="w-4 h-4 md:w-5 md:h-5 mr-2 shrink-0" />
              <span>Vetted & Certified</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name, company, or specialty..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none"
            />
          </div>
          <select
            value={selectedIndustry}
            onChange={(e) => setSelectedIndustry(e.target.value)}
            className="h-12.5 px-4 bg-slate-800 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {industries.map((industry, i) => (
              <option key={i} value={industry}>
                {industry}
              </option>
            ))}
          </select>
        </div>

        {/* Results Counter */}
        <div className="mb-6">
          <p className="text-gray-300">
            Showing {filteredNavigators?.length} of {navigators?.length} navigators
          </p>
        </div>

        {/* Members Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredNavigators?.map(
            (navigator, i) =>
              navigator.isPublic && (
                <NavigatorCard
                  key={i}
                  navigator={navigator}
                  setExpandedMember={setExpandedMember}
                  expandedMember={expandedMember}
                />
              )
          )}
        </div>

        {filteredNavigators?.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Users className="w-16 h-16 mx-auto mb-4" />
              <p className="text-xl">No members found matching your criteria</p>
              <p className="text-sm mt-2">Try adjusting your search terms or filters</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default PublicNavigatorsClient
