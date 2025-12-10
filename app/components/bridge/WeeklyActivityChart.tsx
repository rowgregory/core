import React, { FC } from 'react'
import { motion } from 'framer-motion'
import { Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import TooltipWrapper from '../common/TooltipWrapper'
import { MoreHorizontal } from 'lucide-react'

const WeeklyActivityChart: FC<{ weeklyActivity: any[] }> = ({ weeklyActivity }) => {
  return (
    <motion.div
      className="lg:col-span-2 bg-gray-800/50 rounded-xl p-6 border border-gray-700 mb-8"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
    >
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-2xl font-bold text-white">Weekly Activity Overview</h3>
        <TooltipWrapper
          tooltip={`Weekly Activity Chart displays daily counts of all three core community activities over the current week (Monday through Sunday). Each day shows the number of parleys, treasure maps, and anchors created, providing a visual breakdown of when your community is most active and which activities are being used most frequently throughout the week.`}
        >
          <MoreHorizontal className="text-gray-400 text-sm font-medium" />
        </TooltipWrapper>
      </div>
      <ResponsiveContainer width="100%" height={400}>
        <AreaChart data={weeklyActivity}>
          <defs>
            {/* Parleys gradient (teal-400 → teal-600) */}
            <linearGradient id="gradientParleys" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2DD4BF" /> {/* teal-400 */}
              <stop offset="100%" stopColor="#0D9488" /> {/* teal-600 */}
            </linearGradient>

            {/* Treasure Maps gradient (blue-400 → blue-600) */}
            <linearGradient id="gradientTreasureMaps" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#60A5FA" /> {/* blue-400 */}
              <stop offset="100%" stopColor="#2563EB" /> {/* blue-600 */}
            </linearGradient>

            {/* Anchors gradient (cyan-400 → cyan-600) */}
            <linearGradient id="gradientAnchors" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#22D3EE" /> {/* cyan-400 */}
              <stop offset="100%" stopColor="#0891B2" /> {/* cyan-600 */}
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="day" stroke="#9CA3AF" />
          <YAxis stroke="#9CA3AF" />
          <Tooltip
            content={({ active, payload, label }) => {
              if (!active || !payload || !payload.length) return null

              // Map the series keys to display names
              const displayNames: Record<string, string> = {
                parleys: 'Parleys',
                treasureMaps: 'Treasure Maps',
                anchors: 'Anchors'
              }

              return (
                <div className="bg-gray-900 border border-gray-700 rounded-lg p-3 text-white text-sm min-w-[180px]">
                  {/* Day and Date */}
                  <div className="mb-2 text-white">
                    <div className="font-semibold">{label}</div>
                  </div>
                  {payload.map((entry: any, index: number) => {
                    const textColor =
                      entry.dataKey === 'parleys'
                        ? 'text-teal-400'
                        : entry.dataKey === 'treasureMaps'
                          ? 'text-blue-400'
                          : 'text-cyan-400'
                    return (
                      <div key={index} className="flex justify-between mb-1">
                        <span className="capitalize">{displayNames[entry.name] || entry.name}</span>
                        <span className={`${textColor} font-bold`}>{entry.value}</span>
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
    </motion.div>
  )
}

export default WeeklyActivityChart
