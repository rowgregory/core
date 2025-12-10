import React from 'react'
import { MotionLink } from '@/app/components/common/MotionLink'
import keyTerms from '@/app/lib/constants/lore-and-lingo/keyTerms'
import { motion } from 'framer-motion'

const LoreAndLingoContent = () => {
  return (
    <div className="bg-gray-900 min-h-screen">
      <div className="flex h-[calc(100vh-66px)]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex-1 p-6 overflow-y-auto space-y-6"
        >
          <h1 className="text-3xl font-bold text-white mb-4">Key Terms & Meanings</h1>

          <p className="text-gray-400 max-w-2xl">
            Here’s a quick guide to the Member Bridge terminology so you always know exactly what each action means in
            everyday business language.
          </p>

          {/* Animated Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            {keyTerms.map((term, index) => {
              const IconComponent = term.icon
              return (
                <MotionLink
                  key={term.label}
                  href={term.linkKey || '#'}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 cursor-pointer hover:shadow-lg hover:border-gray-500"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white text-lg font-semibold">{term.label}</h3>
                    <div className={`p-2.5 rounded-lg ${term.color}`}>
                      <IconComponent className="h-4 w-4 text-white" />
                    </div>
                  </div>

                  <p className="text-gray-300 text-sm">{term.description}</p>

                  {/* Status Badge */}
                  {term.status && (
                    <span className="inline-block mt-4 px-2 py-1 text-xs font-semibold rounded-full bg-gray-700 text-white">
                      {term.status}
                    </span>
                  )}
                </MotionLink>
              )
            })}
          </div>

          <div className="mt-12 max-w-4xl mx-auto space-y-6">
            <h2 className="text-2xl font-bold text-white mb-4">How to Use These Terms in Meetings</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {keyTerms.map((term, index) => (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  key={term.label}
                  className="bg-gray-800/50 border border-gray-700 rounded-xl p-4"
                >
                  <h3 className="text-lg font-semibold text-white">{term.label}</h3>
                  <p className="text-gray-300 mt-2">{term.phrase}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default LoreAndLingoContent
