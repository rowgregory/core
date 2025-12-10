'use client'

import React from 'react'
import { MessageSquare, MoreHorizontal, Users } from 'lucide-react'
import CircularProgress from '@/app/components/common/CircularProgress'
import { formatDate } from '@/app/lib/utils/date/formatDate'
import { IParley } from '@/types/parley'
import MemberBridgeStatsGrid from '@/app/components/member/MemberBridgeStatsGrid'
import WeeklyActivityChart from '@/app/components/bridge/WeeklyActivityChart'
import TooltipWrapper from '@/app/components/common/TooltipWrapper'
import { useDashboardSelector } from '@/app/redux/store'
import MemberQuickActions from '@/app/components/member/MemberQuickActions'

const MemberBridge = () => {
  const data = useDashboardSelector()

  return (
    <div className="bg-gray-900">
      {/* Main Layout */}
      <div className="flex flex-col md:flex-row min-h-[calc(100vh-66px)]">
        {/* Main Content Area */}
        <div className="flex-1 p-6 md:overflow-y-auto">
          <MemberBridgeStatsGrid data={data} />
          {/* Weekly Activity Chart */}
          <WeeklyActivityChart weeklyActivity={data?.weeklyActivity} />

          {/* Quick Actions */}
          <MemberQuickActions />
        </div>

        {/* Right Sidebar */}
        <div className="block w-full md:w-80 bg-gray-800/30 border-l border-gray-700/50 p-6 overflow-y-auto">
          {/* My Activity */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-400 text-sm font-medium">My Activity</span>
              <TooltipWrapper
                tooltip={`Participation is calculated based on this member's activity over the past 7 days across three key areas: Treasure Maps given, Anchors provided, and Parleys requested. Each member is expected to complete one of each activity per week. The system calculates what percentage of the weekly expectation was met for each category, then averages the three percentages. If a member exceeds expectations (does more than 1 of any activity), that category is still counted as 100% maximum. For example, if a member completed 1 Treasure Map (100%), 0 Anchors (0%), and 2 Parleys (100%, not 200%) this week, their participation would be 67%.`}
              >
                <MoreHorizontal className="w-4 h-4 text-gray-500" />
              </TooltipWrapper>
            </div>
            <CircularProgress
              percentage={data?.participationPercent}
              value={data?.participationPercent}
              color="rgb(139, 92, 246)"
            />
          </div>

          {/* Upcoming Parleys */}
          <div className="mb-8">
            <h3 className="text-white font-semibold mb-4">Upcoming Parleys</h3>
            <div className="space-y-3">
              {data?.parleys?.length > 0 ? (
                data?.parleys?.map((parley: IParley, index: number) => (
                  <div key={index} className="bg-gray-800/40 border border-gray-700/50 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white text-sm font-medium">
                          {parley.recipient.name || parley.requester.name}
                        </p>
                        <p className="text-gray-400 text-xs">{formatDate(parley.scheduledAt)}</p>
                      </div>
                      <div className="text-xs text-violet-400">{parley.meetingType}</div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No upcoming parleys scheduled</p>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mb-8">
            <h3 className="text-white font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button className="w-full flex items-center space-x-3 p-3 bg-gray-800/40 border border-gray-700/50 rounded-lg hover:bg-gray-700/30 transition-all text-left">
                <MessageSquare className="w-4 h-4 text-violet-400" />
                <span className="text-gray-300 text-sm">Signal Quartermaster</span>
              </button>
              <button className="w-full flex items-center space-x-3 p-3 bg-gray-800/40 border border-gray-700/50 rounded-lg hover:bg-gray-700/30 transition-all text-left">
                <Users className="w-4 h-4 text-cyan-400" />
                <span className="text-gray-300 text-sm">Report Suspicious Activity</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MemberBridge
