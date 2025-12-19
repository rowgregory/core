import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Calendar, ChevronDown, Package } from 'lucide-react'
import { CHANGELOG_DATA, ChangelogEntry } from '@/app/lib/constants/changelog/changelog-data'
import { CATEGORY_CONFIG } from '@/app/lib/constants/changelog/changelog-category-configs'
import InfoBanner from '../common/InfoBanner'

const ChangelogContent = () => {
  const [expandedVersion, setExpandedVersion] = useState<string | null>('1.2.0')

  // Group by version
  const groupedByVersion = useMemo(() => {
    const grouped: Record<string, ChangelogEntry[]> = {}
    CHANGELOG_DATA.forEach((entry) => {
      if (!grouped[entry.version]) {
        grouped[entry.version] = []
      }
      grouped[entry.version].push(entry)
    })
    return grouped
  }, [])

  // Stats
  const stats = useMemo(() => {
    const categoryCounts = CHANGELOG_DATA.reduce(
      (acc, entry) => {
        acc[entry.category] = (acc[entry.category] || 0) + 1
        return acc
      },
      {} as Record<string, number>
    )

    return {
      totalUpdates: CHANGELOG_DATA.length,
      versions: Object.keys(groupedByVersion).length,
      features: categoryCounts.feature || 0,
      security: categoryCounts.security || 0,
      improvements: categoryCounts.improvement || 0,
      bugfixes: categoryCounts.bugfix || 0
    }
  }, [groupedByVersion])
  return (
    <div className="min-h-[calc(100vh-68px)] bg-gray-900">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex-1 px-3 py-6 sm:p-6 overflow-y-auto space-y-6"
      >
        {/* Changelog Info Banner */}
        <InfoBanner
          type="changelog"
          description="is a record of updates, changes, or improvements made in the system, so you can see what’s new or has been modified."
        />
        {/* Stats Summary */}
        <div className="bg-gray-800/40 border border-gray-700/50 rounded-xl p-4 xs:p-6 mb-6 xs:mb-8">
          <h4 className="text-white font-semibold mb-3 xs:mb-4 text-sm xs:text-base">Overview</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 xs:gap-6">
            <div>
              <span className="text-gray-400 text-xs xs:text-sm block mb-1">Total Updates</span>
              <span className="text-white text-xl xs:text-2xl font-bold">{stats.totalUpdates}</span>
            </div>
            <div>
              <span className="text-gray-400 text-xs xs:text-sm block mb-1">Versions</span>
              <span className="text-white text-xl xs:text-2xl font-bold">{stats.versions}</span>
            </div>
            <div>
              <span className="text-gray-400 text-xs xs:text-sm block mb-1">Features</span>
              <span className="text-violet-400 text-xl xs:text-2xl font-bold">{stats.features}</span>
            </div>
            <div>
              <span className="text-gray-400 text-xs xs:text-sm block mb-1">Security</span>
              <span className="text-red-400 text-xl xs:text-2xl font-bold">{stats.security}</span>
            </div>
            <div>
              <span className="text-gray-400 text-xs xs:text-sm block mb-1">Improvements</span>
              <span className="text-purple-400 text-xl xs:text-2xl font-bold">{stats.improvements}</span>
            </div>
            <div>
              <span className="text-gray-400 text-xs xs:text-sm block mb-1">Bug Fixes</span>
              <span className="text-emerald-400 text-xl xs:text-2xl font-bold">{stats.bugfixes}</span>
            </div>
          </div>
        </div>

        {/* Versions */}
        <div className="space-y-3 xs:space-y-4">
          {Object.entries(groupedByVersion)
            .map(([version, entries]) => {
              const isExpanded = expandedVersion === version
              const versionDate = entries[0].date

              return (
                <motion.div
                  key={version}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gray-800/40 border border-gray-700/50 rounded-xl overflow-hidden"
                >
                  {/* Version Header */}
                  <button
                    onClick={() => setExpandedVersion(isExpanded ? null : version)}
                    className="w-full p-4 xs:p-6 flex items-center justify-between hover:bg-gray-800/60 transition-colors gap-3"
                  >
                    <div className="flex items-center gap-3 xs:gap-4 min-w-0 flex-1">
                      <div className="w-8 h-8 xs:w-10 xs:h-10 bg-violet-500/20 rounded-lg flex items-center justify-center shrink-0">
                        <Package className="w-4 h-4 xs:w-5 xs:h-5 text-violet-400" />
                      </div>
                      <div className="text-left min-w-0 flex-1">
                        <h3 className="text-lg xs:text-xl font-semibold text-white truncate">Version {version}</h3>
                        <p className="text-xs xs:text-sm text-gray-400 flex items-center gap-1.5 xs:gap-2 flex-wrap">
                          <Calendar className="w-3 h-3 shrink-0" />
                          <span className="truncate">
                            {new Date(versionDate).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </span>
                          <span className="hidden xs:inline">•</span>
                          <span className="whitespace-nowrap">
                            {entries.length} {entries.length === 1 ? 'update' : 'updates'}
                          </span>
                        </p>
                      </div>
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 xs:w-5 xs:h-5 text-gray-400 transition-transform shrink-0 ${isExpanded ? 'rotate-180' : ''}`}
                    />
                  </button>

                  {/* Version Content */}
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-gray-700/50"
                    >
                      <div className="p-4 xs:p-6 space-y-3 xs:space-y-4">
                        {entries.map((entry, i) => {
                          const config = CATEGORY_CONFIG[entry.category]
                          const Icon = config.icon

                          return (
                            <div key={i} className="bg-gray-800/60 border border-gray-700/50 rounded-lg p-3 xs:p-4">
                              <div className="flex items-start gap-2.5 xs:gap-3">
                                <div className="w-7 h-7 xs:w-8 xs:h-8 bg-gray-700/50 rounded-lg flex items-center justify-center shrink-0">
                                  <Icon className={`w-3.5 h-3.5 xs:w-4 xs:h-4 ${config.color}`} />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1.5 xs:mb-2">
                                    <span
                                      className={`text-[10px] xs:text-xs font-medium px-2 py-0.5 xs:py-1 rounded-full bg-gray-700/50 ${config.color} whitespace-nowrap`}
                                    >
                                      {config.label}
                                    </span>
                                  </div>
                                  <h4 className="text-white font-medium mb-1 text-sm xs:text-base leading-tight">
                                    {entry.title}
                                  </h4>
                                  <p className="text-xs xs:text-sm text-gray-400 leading-relaxed">
                                    {entry.description}
                                  </p>
                                  <div className="mt-1.5 xs:mt-2 flex items-center gap-2 text-[10px] xs:text-xs text-gray-500">
                                    <span>By {entry.author}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              )
            })
            .reverse()}
        </div>
      </motion.div>
    </div>
  )
}

export default ChangelogContent
