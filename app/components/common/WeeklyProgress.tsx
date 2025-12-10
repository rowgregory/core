import React from 'react'
import { motion } from 'framer-motion'
import { MapPin, Anchor, MessageSquare, Check } from 'lucide-react'

interface WeeklyProgressProps {
  treasureMapCompleted: boolean
  anchorCompleted: boolean
  parleyCompleted: boolean
}

const WeeklyProgress: React.FC<WeeklyProgressProps> = ({ treasureMapCompleted, anchorCompleted, parleyCompleted }) => {
  const completedCount = [treasureMapCompleted, anchorCompleted, parleyCompleted].filter(Boolean).length
  const progressPercentage = (completedCount / 3) * 100

  const activities = [
    {
      name: 'Treasure Map',
      icon: MapPin,
      completed: treasureMapCompleted,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/30',
      textColor: 'text-purple-400'
    },
    {
      name: 'Anchor',
      icon: Anchor,
      completed: anchorCompleted,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/30',
      textColor: 'text-blue-400'
    },
    {
      name: 'Parley',
      icon: MessageSquare,
      completed: parleyCompleted,
      color: 'from-emerald-500 to-green-500',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/30',
      textColor: 'text-emerald-400'
    }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full bg-gray-800/40 border border-gray-700/50 rounded-2xl p-6 backdrop-blur-sm mb-8"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-white">Weekly Progress</h3>
          <p className="text-gray-400 text-sm mt-1">Complete at least one of each activity this week</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-white">{completedCount}/3</div>
          <div className="text-sm text-gray-400">completed</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-400">Overall Progress</span>
          <span className="text-sm font-medium text-white">{Math.round(progressPercentage)}%</span>
        </div>
        <div className="w-full bg-gray-700/50 rounded-full h-3 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
            className="h-full bg-linear-to-r from-purple-500 via-blue-500 to-emerald-500 rounded-full"
          />
        </div>
      </div>

      {/* Activity Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {activities.map((activity, index) => {
          const Icon = activity.icon
          return (
            <motion.div
              key={activity.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.1 * index }}
              className={`relative p-4 rounded-xl border transition-all duration-300 ${
                activity.completed
                  ? `${activity.bgColor} ${activity.borderColor} shadow-lg`
                  : 'bg-gray-700/20 border-gray-600/50 hover:border-gray-500/50'
              }`}
            >
              {/* Completion Badge */}
              {activity.completed && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.3 + 0.1 * index }}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg"
                >
                  <Check className="w-3 h-3 text-white" />
                </motion.div>
              )}

              <div className="flex items-center space-x-3">
                <div className={`p-2.5 rounded-lg bg-gradient-to-br ${activity.color} shadow-lg`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className={`font-semibold text-sm ${activity.completed ? activity.textColor : 'text-gray-400'}`}>
                    {activity.name}
                  </h4>
                  <p className="text-xs text-gray-500 mt-0.5">{activity.completed ? 'Completed' : 'Pending'}</p>
                </div>
              </div>

              {/* Subtle animation for incomplete items */}
              {!activity.completed && (
                <motion.div
                  animate={{ opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 rounded-xl border border-gray-500/30 pointer-events-none"
                />
              )}
            </motion.div>
          )
        })}
      </div>

      {/* Motivational Message */}
      {completedCount === 3 ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 bg-linear-to-r from-emerald-500/10 to-green-500/10 border border-emerald-500/30 rounded-xl"
        >
          <p className="text-emerald-400 text-sm font-medium text-center">
            🎉 Excellent work! You&apos;ve completed all weekly activities!
          </p>
        </motion.div>
      ) : completedCount > 0 ? (
        <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
          <p className="text-blue-400 text-sm font-medium text-center">
            Great progress! {3 - completedCount} more to go this week.
          </p>
        </div>
      ) : (
        <div className="mt-6 p-4 bg-gray-700/30 border border-gray-600/50 rounded-xl">
          <p className="text-gray-400 text-sm text-center">Get started by completing your first activity this week!</p>
        </div>
      )}
    </motion.div>
  )
}

export default WeeklyProgress

// Usage example:
/*
<WeeklyProgress 
  treasureMapCompleted={true}
  anchorCompleted={false}
  parleyCompleted={true}
/>
*/
