import { FC } from 'react'
import StatCard from '../../bridge/StatCard'
import { Users, DollarSign, Target, Activity, UserCheck, Anchor, Layers3, Scroll } from 'lucide-react'

interface IAdminBridgeStatsGrid {
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

const AdminBridgeStatsGrid: FC<IAdminBridgeStatsGrid> = ({ data }) => {
  const stats = [
    {
      title: 'TOTAL MEMBERS',
      value: data?.totalMembers,
      change: data?.totalMembersChange,
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      tooltip:
        'Total Members shows the count of all registered users in your system, including active members, trial users, and those with suspended, expired, or cancelled memberships. The monthly change represents the net difference for the current month, calculated by subtracting members who left from new members who joined.'
    },
    {
      title: 'TOTAL REVENUE',
      value: `$${data?.totalRevenue.toLocaleString()}`,
      change: `${data?.totalRevenueChange.toFixed(0)}%`,
      icon: DollarSign,
      color: 'from-emerald-500 to-emerald-600',
      tooltip:
        "Total Revenue represents the sum of all business values from your anchors across all time periods. The monthly change shows the percentage difference between this month's revenue and last month's revenue."
    },
    {
      title: 'CONVERSION RATE',
      value: `${data?.conversionRate.toFixed(2)}%`,
      change: `${data?.conversionChangePercent.toFixed(0)}%`,
      icon: Target,
      color: 'from-purple-500 to-purple-600',
      tooltip: 'Conversion Rate measures the percentage of active users who have sent at least one treasure map.'
    },
    {
      title: 'CHAPTER HEALTH',
      value: `${data?.chapterHealth.toFixed(2)}%`,
      change: `${data?.healthChangePercent.toFixed(0)}%`,
      icon: Activity,
      color: 'from-pink-500 to-pink-600',
      tooltip: 'Chapter Health measures overall community engagement across key activity types over the last 7 days.'
    },
    {
      title: 'TOTAL PARLEYS',
      value: data?.totalParleys,
      change: `${data?.parleysChangePercent.toFixed(0)}%`,
      icon: Scroll,
      color: 'from-cyan-500 to-cyan-600',
      tooltip: 'Total Parleys represents the count of all parley meetings created across all time periods.'
    },
    {
      title: 'TOTAL TREASURE MAPS',
      value: data?.totalTreasureMaps,
      change: `${data?.treasureMapsChangePercent.toFixed(0)}%`,
      icon: Layers3,
      color: 'from-blue-500 to-blue-600',
      tooltip: 'Total Treasure Maps represents the count of all treasure maps created across all time periods.'
    },
    {
      title: 'TOTAL ANCHORS DROPPED',
      value: data?.totalAnchors,
      change: `${data?.anchorsChangePercent.toFixed(0)}%`,
      icon: Anchor,
      color: 'from-violet-500 to-violet-600',
      tooltip: 'Total Anchors represents the count of all anchors created across all time periods.'
    },
    {
      title: 'MEMBER RETENTION',
      value: `${data?.memberRetention.toFixed(2)}%`,
      change: `${data?.retentionChangePercent.toFixed(0)}%`,
      icon: UserCheck,
      color: 'from-green-500 to-green-600',
      tooltip: 'Member Retention shows the percentage of users who currently have active membership status.'
    }
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-2 2xl:grid-cols-4 gap-1.5 xs:gap-2 sm:gap-4 lg:gap-6 mb-8">
      {stats.map((stat) => (
        <StatCard
          key={stat.title}
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

export default AdminBridgeStatsGrid
