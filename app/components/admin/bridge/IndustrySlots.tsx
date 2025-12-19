import { useState, useMemo, FC } from 'react'
import { motion } from 'framer-motion'
import { ArrowUpDown, Users, Circle } from 'lucide-react'
import industryList from '@/app/lib/constants/navigator/industryList'

const IndustrySlots: FC<{ industrySlots: any[]; capacityPercent: number }> = ({ industrySlots, capacityPercent }) => {
  const [sortFilledFirst, setSortFilledFirst] = useState(true)

  const industryListCount = industryList.length
  const filledSlots = industrySlots?.filter((p) => p.filled)?.length

  const sortedSlots = useMemo(() => {
    if (!industrySlots) return []

    if (sortFilledFirst) {
      return [...industrySlots].sort((a, b) => {
        // Filled slots first (true > false)
        if (a.filled && !b.filled) return -1
        if (!a.filled && b.filled) return 1
        return 0
      })
    }

    return industrySlots
  }, [industrySlots, sortFilledFirst])

  return (
    <motion.div
      className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.5 }}
    >
      <div className="flex flex-col gap-y-2 xl:gap-y-0 xl:flex-row xl:items-center xl:justify-between mb-6">
        <h3 className="text-2xl font-bold text-white">Industry Slots</h3>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setSortFilledFirst(!sortFilledFirst)}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
              sortFilledFirst
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'bg-gray-700/50 text-gray-400 border border-gray-600/50 hover:bg-gray-700/70 hover:text-gray-300'
            }`}
          >
            <ArrowUpDown className="w-4 h-4" />
            <span>Filled First</span>
          </button>
          <div className="text-sm text-gray-400">
            {filledSlots} of {industrySlots?.length} filled
          </div>
        </div>
      </div>

      <div className="space-y-2 sm:space-y-3 max-h-96 overflow-y-auto">
        {sortedSlots?.map((slot, index) => (
          <motion.div
            key={`${slot.industry}-${index}`}
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="flex items-center justify-between p-2 sm:p-3 bg-gray-700/30 rounded-lg hover:bg-gray-700/40 transition-colors"
          >
            <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0 mr-2">
              <div
                className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full flex items-center justify-center shrink-0 ${
                  slot.filled ? '' : 'border-2 border-dashed border-gray-500'
                }`}
                style={{ backgroundColor: slot.filled ? slot.color : 'transparent' }}
              >
                {slot.filled && <Circle className="w-1.5 h-1.5 sm:w-2 sm:h-2 text-white fill-current" />}
              </div>
              <span
                className={`font-medium white text-xs sm:text-sm ${slot.filled ? 'text-white' : 'text-gray-400'}`}
                title={slot.industry}
              >
                {slot.industry}
              </span>
            </div>
            <div className="text-right flex items-center space-x-1.5 sm:space-x-2 shrink-0">
              {slot.filled ? (
                <>
                  <Users className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-400 shrink-0" />
                  <span
                    className="text-emerald-400 text-[10px] sm:text-sm font-medium truncate max-w-[60px] xs:max-w-20 sm:max-w-none"
                    title={slot.member}
                  >
                    {slot.member}
                  </span>
                </>
              ) : (
                <span className="text-gray-500 text-[10px] sm:text-sm italic whitespace-nowrap">Available</span>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-4 bg-gray-700/30 rounded-lg h-2">
        <div
          className="bg-linear-to-r from-pink-500 via-amber-500 to-lime-500 h-2 rounded-lg transition-all duration-300"
          style={{ width: `${capacityPercent}%` }}
        ></div>
      </div>
      <p className="text-gray-400 text-sm mt-2">
        Chapter Capacity: {filledSlots}/{industryListCount} ({capacityPercent}%)
      </p>
    </motion.div>
  )
}

export default IndustrySlots
