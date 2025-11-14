import { useDashboardSelector } from '@/app/redux/store'
import { AnimatePresence, motion } from 'framer-motion'
import { TrendingDown, TrendingUp } from 'lucide-react'
import HorizontalLoader from '../common/HorizontalLoader'
import TooltipWrapper from '../common/TooltipWrapper'

const StatCard = ({ title, value, change, icon: Icon, color, tooltip, isFetching }: any) => {
  const { loading } = useDashboardSelector()

  return (
    <TooltipWrapper tooltip={tooltip}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-800/40 border border-gray-700/50 rounded-2xl p-4 sm:p-6 hover:border-gray-600/50 transition-all duration-300 backdrop-blur-sm"
      >
        {/* Mobile-first header with icon and change indicator */}
        <div className="flex items-start justify-between mb-3 sm:mb-4">
          <div className={`p-2 sm:p-2.5 rounded-lg bg-gradient-to-br ${color} shadow-lg`}>
            <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>

          <AnimatePresence>
            {!loading && !isFetching && change !== undefined && (
              <motion.span
                key="change-indicator"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className={`${
                  parseFloat(change) >= 0 ? 'text-green-400' : 'text-red-400'
                } text-sm font-medium flex items-center`}
              >
                {parseFloat(change) >= 0 ? (
                  <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                ) : (
                  <TrendingDown className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                )}
                {change}
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* Content section optimized for mobile grid */}
        <div className="space-y-2">
          <p className="text-gray-400 text-xs sm:text-sm font-medium leading-tight line-clamp-2 truncate">{title}</p>
          <div className="h-6">
            {loading || isFetching ? (
              <HorizontalLoader />
            ) : (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="text-white text-xl sm:text-2xl font-bold tracking-tight leading-none"
              >
                {value}
              </motion.p>
            )}
          </div>
        </div>

        {/* Subtle mobile enhancement - bottom accent */}
        <div className={`mt-4 h-1 rounded-full bg-gradient-to-r ${color} opacity-60`} />
      </motion.div>
    </TooltipWrapper>
  )
}

export default StatCard
