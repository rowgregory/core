import React, { FC } from 'react'
import StatCard from '../../bridge/StatCard'
import { Users, DollarSign, Target, Activity, UserCheck, Anchor, Layers3, Scroll } from 'lucide-react'

interface IdminBridgeStatsGrid {
  data: {
    totalMembers: number
    totalMembersChange: number
    totalRevenue: number
    totalRevenueChange: number
    conversionRate: number
    conversionChangePercent: number
    chapterHealth: number
    healthChangePercent: number
    totalParleys: number
    parleysChangePercent: number
    totalTreasureMaps: number
    treasureMapsChangePercent: number
    totalAnchors: number
    anchorsChangePercent: number
    memberRetention: number
    retentionChangePercent: number
  }
}

const AdminBridgeStatsGrid: FC<IdminBridgeStatsGrid> = ({ data }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
      <StatCard
        title="TOTAL MEMBERS"
        value={data?.totalMembers}
        change={data?.totalMembersChange}
        icon={Users}
        color="from-blue-500 to-blue-600"
        tooltip={`Total Members shows the count of all registered users in your system, including active members, trial users, and those with suspended, expired, or cancelled memberships. The monthly change represents the net difference for the current month, calculated by subtracting members who left (those whose status changed to suspended, expired, or cancelled) from new members who joined this month.`}
      />
      <StatCard
        title="TOTAL REVENUE"
        value={`$${data?.totalRevenue.toLocaleString()}`}
        change={`${data?.totalRevenueChange.toFixed(0)}%`}
        icon={DollarSign}
        color="from-emerald-500 to-emerald-600"
        tooltip={`Total Revenue represents the sum of all business values from your anchors across all time periods. The monthly change shows the percentage difference between this month's revenue and last month's revenue. If there was no revenue last month, the change is shown as 100% for the current month's performance.`}
      />
      <StatCard
        title="CONVERSION RATE"
        value={`${data?.conversionRate.toFixed(2)}%`}
        change={`${data?.conversionChangePercent.toFixed(0)}%`}
        icon={Target}
        color="from-purple-500 to-purple-600"
        tooltip={`Conversion Rate measures the percentage of active users who have sent at least one treasure map. It's calculated by dividing users who sent maps by total active users, then multiplying by 100. The monthly change compares this month's conversion rate to last month's rate, showing the percentage improvement or decline in user engagement`}
      />
      <StatCard
        title="CHAPTER HEALTH"
        value={`${data?.chapterHealth.toFixed(2)}%`}
        change={`${data?.healthChangePercent.toFixed(0)}%`}
        icon={Activity}
        color="from-pink-500 to-pink-600"
        tooltip={`Chapter Health measures overall community engagement by tracking users who participated in any activity (sending/receiving treasure maps, giving/receiving anchors, or requesting/receiving parleys) within the last 7 days. The score averages engagement rates across all three activity types, with equal weighting given to anchor activity, treasure map activity, and parley activity. The monthly change compares this month's engagement percentage to last month's, showing how community participation is trending.`}
      />
      <StatCard
        title="TOTAL PARLEYS"
        value={data?.totalParleys}
        change={`${data?.parleysChangePercent.toFixed(0)}%`}
        icon={Scroll}
        color="from-cyan-500 to-cyan-600"
        tooltip={`Total Parleys represents the count of all parley meetings created in the system across all time periods. The monthly change shows the percentage difference between parleys created this month compared to last month, indicating whether parley activity is increasing or decreasing within the community.`}
      />
      <StatCard
        title="TOTAL TREASURE MAPS"
        value={data?.totalTreasureMaps}
        change={`${data?.treasureMapsChangePercent.toFixed(0)}%`}
        icon={Layers3}
        color="from-blue-500 to-blue-600"
        tooltip={`Total Treasure Maps represents the count of all treasure maps created in the system across all time periods. The monthly change shows the percentage difference between treasure maps created this month compared to last month, indicating whether treasure map activity is increasing or decreasing within the community.`}
      />
      <StatCard
        title="TOTAL ANCHORS DROPPED"
        value={data?.totalAnchors}
        change={`${data?.anchorsChangePercent.toFixed(0)}%`}
        icon={Anchor}
        color="from-violet-500 to-violet-600"
        tooltip={`Total Anchors represents the count of all anchors created in the system across all time periods. The monthly change shows the percentage difference between anchors created this month compared to last month, indicating whether treasure map activity is increasing or decreasing within the community.`}
      />
      <StatCard
        title="MEMBER RETENTION"
        value={`${data?.memberRetention.toFixed(2)}%`}
        change={`${data?.retentionChangePercent.toFixed(0)}%`}
        icon={UserCheck}
        color="from-green-500 to-green-600"
        tooltip={`Member Retention shows the percentage of all registered users who currently have active membership status, indicating how well the community retains its members over time. The monthly change tracks how many users who signed up before the current month are still active, compared to the same metric from last month, revealing whether member retention is improving or declining.`}
      />
    </div>
  )
}

export default AdminBridgeStatsGrid
