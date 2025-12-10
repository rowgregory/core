import React, { FC } from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle, X } from 'lucide-react'

const DatabaseBanner: FC<{ handleDismiss: () => void }> = ({ handleDismiss }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="relative bg-linear-to-r from-amber-900/20 to-orange-900/20 backdrop-blur-sm border border-amber-700/30 rounded-xl mb-8"
    >
      <div className="px-6 py-4">
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div className="shrink-0 mt-0.5">
            <div className="w-10 h-10 bg-amber-500/20 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold t2ext-amber-300 mb-2">Quick Heads Up</h3>
            <p className="text-sm text-gray-300 leading-relaxed mb-3">
              We had to perform a system reset during some database maintenance. All user accounts have been restored,
              but historical activity data was unfortunately lost. The good news: we caught this early and only about
              half the crew had logged activity, so the impact is minimal. We&apos;re really sorry for any
              inconvenience! Everything is back up and running smoothly now. 🚢
            </p>
            <p className="text-xs text-gray-400">
              Thanks for your patience and understanding as we continue improving the platform!
            </p>
          </div>

          {/* Close Button */}
          <button
            onClick={handleDismiss}
            className="shrink-0 p-1.5 hover:bg-amber-500/10 rounded-lg transition-colors"
            aria-label="Dismiss message"
          >
            <X className="w-4 h-4 text-gray-400 hover:text-gray-300" />
          </button>
        </div>
      </div>
    </motion.div>
  )
}

export default DatabaseBanner
