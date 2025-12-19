import keyTerms from '@/app/lib/constants/lore-and-lingo/keyTerms'
import { motion } from 'framer-motion'
import { ArrowRight, Lightbulb } from 'lucide-react'
import Link from 'next/link'
import InfoBanner from '../common/InfoBanner'

const LoreAndLingoContent = () => {
  return (
    <div className="bg-gray-900 min-h-[calc(100vh-68px)]">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex-1 px-3 py-6 sm:p-6 overflow-y-auto space-y-6"
      >
        <InfoBanner
          type="lore and lingo"
          description="is understanding our terminology to help ensure clear communication in meetings and everyday business interactions. Each term represents a specific action or concept within the Core platform."
        />

        {/* Terms Grid */}
        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 xs:gap-6 sm:gap-8 mb-12 xs:mb-16 sm:mb-20">
          {keyTerms.map((term, index) => {
            const IconComponent = term.icon

            return (
              <motion.div
                key={term.label}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="border border-white/10 bg-white/2 rounded-xl xs:rounded-2xl p-4 xs:p-6 sm:p-8 shadow-lg backdrop-blur-sm hover:bg-white/5 transition-all duration-300 group cursor-pointer"
              >
                <div className="space-y-4 xs:space-y-6 flex flex-col h-full justify-between">
                  <div className="space-y-4 xs:space-y-6">
                    {/* Icon + Status */}
                    <div className="flex items-center justify-between">
                      <div
                        className={`p-2 xs:p-2.5 sm:p-3 rounded-lg xs:rounded-xl ${term.color} shadow-lg group-hover:scale-110 transition-transform duration-300`}
                      >
                        <IconComponent className="w-5 h-5 xs:w-5.5 xs:h-5.5 sm:w-6 sm:h-6 text-white" />
                      </div>
                      {term.status && (
                        <div className="px-2 xs:px-3 py-0.5 xs:py-1 border border-white/20 rounded-full text-[10px] xs:text-xs font-medium text-white/80 bg-white/5">
                          {term.status}
                        </div>
                      )}
                    </div>

                    {/* Title + Description */}
                    <div className="space-y-2 xs:space-y-3">
                      <h3 className="text-base xs:text-lg sm:text-xl font-semibold text-white group-hover:text-violet-300 transition-colors leading-tight">
                        {term.label}
                      </h3>
                      <p className="text-neutral-400 text-xs xs:text-sm leading-relaxed">{term.description}</p>
                    </div>
                  </div>

                  {/* Learn More Link */}
                  {term.linkKey && (
                    <Link
                      href={term.linkKey}
                      className="text-violet-400 text-xs xs:text-sm font-medium flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      Learn more
                      <ArrowRight className="w-3 h-3 xs:w-4 xs:h-4" />
                    </Link>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Usage Examples Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="border border-white/10 bg-white/2 rounded-2xl xs:rounded-3xl p-3 py-6 xs:p-8 sm:p-12 shadow-lg backdrop-blur-sm"
        >
          <div className="text-center mb-8 xs:mb-10 sm:mb-12">
            <h2 className="text-2xl xs:text-3xl sm:text-4xl font-bold text-white mb-3 xs:mb-4">
              How to Use These Terms in Meetings
            </h2>
            <p className="text-neutral-400 text-sm xs:text-base sm:text-lg max-w-2xl mx-auto px-4">
              Practical examples of how to incorporate these terms into your meeting conversations for clear and
              professional communication.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 xs:gap-6 sm:gap-8">
            {keyTerms.map((term, index) => {
              const IconComponent = term.icon

              return (
                <motion.div
                  key={term.label}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.08 }}
                  className="border border-white/10 bg-white/2 rounded-xl xs:rounded-2xl p-4 xs:p-5 sm:p-6 shadow-lg backdrop-blur-sm hover:bg-white/5 transition-all duration-300"
                >
                  <div className="space-y-3 xs:space-y-4">
                    {/* Icon + Title */}
                    <div className="flex items-center gap-2 xs:gap-3">
                      <div className={`p-1.5 xs:p-2 rounded-md xs:rounded-lg ${term.color}`}>
                        <IconComponent className="w-4 h-4 xs:w-5 xs:h-5 text-white" />
                      </div>
                      <h3 className="text-base xs:text-lg font-semibold text-white">{term.label}</h3>
                    </div>

                    {/* Quote */}
                    <div className="border border-white/10 bg-white/5 rounded-lg xs:rounded-xl p-3 xs:p-4">
                      <p className="text-neutral-300 text-xs xs:text-sm italic leading-relaxed">"{term.phrase}"</p>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* Pro Tip */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-8 xs:mt-10 sm:mt-12 border border-violet-500/20 bg-linear-to-r from-violet-500/5 to-purple-500/5 rounded-xl xs:rounded-2xl p-4 xs:p-6 sm:p-8 backdrop-blur-sm"
        >
          <div className="flex items-start gap-3 xs:gap-4">
            <div className="p-2 xs:p-2.5 sm:p-3 rounded-lg xs:rounded-xl bg-linear-to-br from-violet-500 to-purple-600 shadow-lg shrink-0">
              <Lightbulb className="w-5 h-5 xs:w-5.5 xs:h-5.5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div className="space-y-1.5 xs:space-y-2">
              <h3 className="text-base xs:text-lg sm:text-xl font-semibold text-white">Pro Tip</h3>
              <p className="text-neutral-400 text-xs xs:text-sm sm:text-base leading-relaxed">
                Consistent use of these terms helps maintain professionalism and clarity across all Member interactions.
                When in doubt, refer back to this guide to ensure you're using the correct terminology.
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default LoreAndLingoContent
