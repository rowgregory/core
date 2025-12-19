import { FC, useState } from 'react'
import { motion } from 'framer-motion'
import { Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import TooltipWrapper from '../common/TooltipWrapper'
import { MoreHorizontal } from 'lucide-react'

const WeeklyActivityChart: FC<{ weeklyActivity: any[] }> = ({ weeklyActivity }) => {
  const [selectedMetric, setSelectedMetric] = useState<'all' | 'parleys' | 'treasureMaps' | 'anchors'>('all')

  const metrics = [
    { key: 'parleys', label: 'Parleys', color: 'teal', gradient: 'from-teal-400 to-teal-600' },
    { key: 'treasureMaps', label: 'Treasure Maps', color: 'blue', gradient: 'from-blue-400 to-blue-600' },
    { key: 'anchors', label: 'Anchors', color: 'cyan', gradient: 'from-cyan-400 to-cyan-600' }
  ]

  const getColorClasses = (color: string) => {
    const colors: Record<string, { text: string; bg: string; border: string }> = {
      teal: { text: 'text-teal-400', bg: 'bg-teal-500/20', border: 'border-teal-500/30' },
      blue: { text: 'text-blue-400', bg: 'bg-blue-500/20', border: 'border-blue-500/30' },
      cyan: { text: 'text-cyan-400', bg: 'bg-cyan-500/20', border: 'border-cyan-500/30' }
    }
    return colors[color]
  }

  const totals = weeklyActivity.reduce(
    (acc, day) => ({
      parleys: acc.parleys + day.parleys,
      treasureMaps: acc.treasureMaps + day.treasureMaps,
      anchors: acc.anchors + day.anchors
    }),
    { parleys: 0, treasureMaps: 0, anchors: 0 }
  )

  return (
    <motion.div
      className="lg:col-span-2 bg-gray-800/50 rounded-xl p-4 sm:p-6 border border-gray-700 mb-8"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
    >
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h3 className="text-xl sm:text-2xl font-bold text-white">Weekly Activity</h3>
        <TooltipWrapper
          tooltip={`Weekly Activity displays daily counts of parleys, treasure maps, and anchors over the current week.`}
        >
          <MoreHorizontal className="text-gray-400" />
        </TooltipWrapper>
      </div>

      {/* Mobile: Metric Selector */}
      <div className="sm:hidden mb-6 flex flex-col sm:flex-row gap-y-2 sm:gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setSelectedMetric('all')}
          className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
            selectedMetric === 'all' ? 'bg-gray-700 text-white' : 'bg-gray-800/50 text-gray-400'
          }`}
        >
          All
        </button>
        {metrics.map((metric) => {
          const colors = getColorClasses(metric.color)
          return (
            <button
              key={metric.key}
              onClick={() => setSelectedMetric(metric.key as any)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                selectedMetric === metric.key
                  ? `${colors.bg} ${colors.text} border ${colors.border}`
                  : 'bg-gray-800/50 text-gray-400'
              }`}
            >
              {metric.label}
            </button>
          )
        })}
      </div>

      {/* Mobile: Card View */}
      <div className="sm:hidden md:block xl:hidden space-y-3">
        {weeklyActivity.map((day, index) => (
          <motion.div
            key={day.day}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-gray-900/50 border border-gray-700 rounded-lg p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-white font-semibold">{day.day}</span>
              <span className="text-gray-400 text-sm">{day.date}</span>
            </div>

            <div className="space-y-2">
              {(selectedMetric === 'all' || selectedMetric === 'parleys') && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">Parleys</span>
                  <span className="text-teal-400 font-bold">{day.parleys}</span>
                </div>
              )}
              {(selectedMetric === 'all' || selectedMetric === 'treasureMaps') && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">Treasure Maps</span>
                  <span className="text-blue-400 font-bold">{day.treasureMaps}</span>
                </div>
              )}
              {(selectedMetric === 'all' || selectedMetric === 'anchors') && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">Anchors</span>
                  <span className="text-cyan-400 font-bold">{day.anchors}</span>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Desktop: Chart View */}
      <div className="hidden sm:block md:hidden xl:block">
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart data={weeklyActivity}>
            <defs>
              <linearGradient id="gradientParleys" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2DD4BF" />
                <stop offset="100%" stopColor="#0D9488" />
              </linearGradient>
              <linearGradient id="gradientTreasureMaps" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#60A5FA" />
                <stop offset="100%" stopColor="#2563EB" />
              </linearGradient>
              <linearGradient id="gradientAnchors" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#22D3EE" />
                <stop offset="100%" stopColor="#0891B2" />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="day" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip
              content={({ active, payload, label }) => {
                if (!active || !payload || !payload.length) return null

                const displayNames: Record<string, string> = {
                  parleys: 'Parleys',
                  treasureMaps: 'Treasure Maps',
                  anchors: 'Anchors'
                }

                return (
                  <div className="bg-gray-900 border border-gray-700 rounded-lg p-3 text-white text-sm min-w-[180px]">
                    <div className="mb-2 font-semibold">{label}</div>
                    {payload.map((entry: any, index: number) => {
                      const textColor =
                        entry.dataKey === 'parleys'
                          ? 'text-teal-400'
                          : entry.dataKey === 'treasureMaps'
                            ? 'text-blue-400'
                            : 'text-cyan-400'
                      return (
                        <div key={index} className="flex justify-between mb-1">
                          <span>{displayNames[entry.name] || entry.name}</span>
                          <span className={`${textColor} font-bold ml-4`}>{entry.value}</span>
                        </div>
                      )
                    })}
                  </div>
                )
              }}
            />
            <Legend
              verticalAlign="top"
              height={36}
              iconType="square"
              formatter={(value) => {
                const names = {
                  parleys: 'Parleys',
                  treasureMaps: 'Treasure Maps',
                  anchors: 'Anchors'
                }
                return names[value as keyof typeof names] || value
              }}
            />
            <Area type="monotone" dataKey="parleys" stroke="#0D9488" fill="url(#gradientParleys)" fillOpacity={0.6} />
            <Area
              type="monotone"
              dataKey="treasureMaps"
              stroke="#2563EB"
              fill="url(#gradientTreasureMaps)"
              fillOpacity={0.6}
            />
            <Area type="monotone" dataKey="anchors" stroke="#0891B2" fill="url(#gradientAnchors)" fillOpacity={0.6} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Weekly Totals */}
      <div className="mt-6 grid sm:grid-cols-3 gap-3">
        {metrics.map((metric) => {
          const colors = getColorClasses(metric.color)
          return (
            <div key={metric.key} className={`${colors.bg} border ${colors.border} rounded-lg p-3 sm:p-4 text-center`}>
              <div className={`text-xl sm:text-2xl font-bold ${colors.text}`}>
                {totals[metric.key as keyof typeof totals]}
              </div>
              <div className="text-gray-400 text-xs sm:text-sm mt-1">{metric.label}</div>
            </div>
          )
        })}
      </div>
    </motion.div>
  )
}

export default WeeklyActivityChart
