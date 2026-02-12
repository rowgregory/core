'use client'

import { MoreHorizontal } from 'lucide-react'
import CircularProgress from '@/app/components/common/CircularProgress'
import AdminBridgeStatsGrid from '@/app/components/admin/bridge/AdminBridgeStatsGrid'
import WeeklyActivityChart from '@/app/components/bridge/WeeklyActivityChart'
import IndustrySlots from '@/app/components/admin/bridge/IndustrySlots'
import AdminOuputSummary from '@/app/components/admin/bridge/AdminOuputSummary'
import MemberEngagement from '@/app/components/admin/bridge/MemberEngagement'
import TopPerformers from '@/app/components/admin/bridge/TopPerformers'
import TooltipWrapper from '@/app/components/common/TooltipWrapper'
import QuickActionButtons from '@/app/components/admin/bridge/QuackActionButtons'

const AdminBridgeClient = ({ data }) => {
  return (
    <div className="bg-gray-900">
      {/* Main Layout */}
      <div className="flex flex-col md:flex-row min-h-[calc(100vh-68px)]">
        {/* Main Content Area */}
        <div className="flex-1 py-6 px-3 md:p-6 md:overflow-y-auto">
          {/* Stats Grid */}
          <AdminBridgeStatsGrid data={data} />
          {/* Weekly Activity Chart */}
          <WeeklyActivityChart weeklyActivity={data?.weeklyActivity} />

          {/* Industry Slots */}
          <IndustrySlots industrySlots={data?.industrySlots} capacityPercent={data?.capacityPercent} />

          {/* Quick Actions */}
          <QuickActionButtons />
        </div>

        {/* Right Sidebar */}
        <div className="block w-full md:w-80 bg-gray-800/30 border-l border-gray-700/50 p-6 overflow-y-auto">
          {/* Session Info */}
          <div className="mb-8">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-white font-semibold">Participation</h3>
              <TooltipWrapper
                tooltip={`Participation measures how well active members are meeting expected weekly activity levels across treasure maps, anchors, and parleys. Each member gets a compliance score for each activity type (capped at 100% if they exceed expectations), and these three scores are averaged together. The final percentage represents the average compliance rate across all active members, showing overall community engagement relative to expected participation levels.`}
              >
                <MoreHorizontal className="text-gray-400 text-sm font-medium" />
              </TooltipWrapper>
            </div>
            <CircularProgress
              percentage={data?.participationPercent}
              value={data?.participationPercent}
              color="rgb(34, 197, 94)"
            />
          </div>

          {/* Member Engagement */}
          <MemberEngagement buckets={data?.buckets} />

          {/* Top Performers */}
          <TopPerformers topPerformers={data?.topPerformers} />

          {/* Output Summary */}
          <AdminOuputSummary
            activeMembers={data?.totalMembers}
            totalRevenue={data?.totalRevenue}
            newApplicationsCount={data?.newApplicationsCount}
            parleyRequestsCount={data?.parleyRequestsCount}
          />
        </div>
      </div>
    </div>
  )
}

export default AdminBridgeClient
