import React, { FC } from 'react'
import { DollarSign, Anchor, Layers3, Scroll } from 'lucide-react'
import StatCard from '../bridge/StatCard'

const MemberBridgeStatsGrid: FC<{ data: any }> = ({ data }) => {
  const stats = [
    {
      title: 'TOTAL REVENUE',
      value: `$${Number(data?.totalRevenue).toLocaleString()}`,
      change: `+${data?.totalRevenueChange}%`,
      icon: DollarSign,
      color: 'from-emerald-500 to-emerald-600',
      tooltip: `Total Revenue represents the sum of all business values from this member's anchors across all time periods. The monthly change shows the percentage difference between this month's revenue and last month's revenue. If there was no revenue last month, the change is shown as 100% for the current month's performance.`
    },
    {
      title: 'TOTAL PARLEYS',
      value: data?.totalParleys,
      change: `${data?.parleysChangePercent}%`,
      icon: Scroll,
      color: 'from-cyan-500 to-cyan-600',
      tooltip: `Total Parleys represents the count of all parley meetings this member has participated in across all time periods. The monthly change shows the percentage difference between parleys this member participated in this month compared to last month, indicating whether their parley activity is increasing or decreasing.`
    },
    {
      title: 'TOTAL TREASURE MAPS',
      value: data?.totalTreasureMaps,
      change: `${data?.treasureMapsChangePercent}%`,
      icon: Layers3,
      color: 'from-blue-500 to-blue-600',
      tooltip: `Total Treasure Maps represents the count of all treasure maps this member has been involved with across all time periods. The monthly change shows the percentage difference between treasure maps this member was involved with this month compared to last month, indicating whether their treasure map activity is increasing or decreasing.`
    },
    {
      title: 'TOTAL ANCHORS',
      value: data?.totalAnchors,
      change: `${data?.anchorsChangePercent}%`,
      icon: Anchor,
      color: 'from-violet-500 to-violet-600',
      tooltip: `Total Anchors represents the count of all anchors this member has been involved with across all time periods. The monthly change shows the percentage difference between anchors this member was involved with this month compared to last month, indicating whether their anchor activity is increasing or decreasing.`
    }
  ]
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 2xl:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, i) => (
        <StatCard
          key={i}
          title={stat.title}
          value={stat.value}
          change={stat.change}
          icon={stat.icon}
          color={stat.color}
          tooltip={stat.tooltip}
        />
      ))}
    </div>
  )
}

export default MemberBridgeStatsGrid
