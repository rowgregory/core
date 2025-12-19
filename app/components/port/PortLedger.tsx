import React, { FC } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'

const PortLedger: FC<{
  handleOptionSelect: (optionSelect: string) => void
  showScuttleThePapersWarning: any
  setShowScuttleThePapersWarning: any
  isActive: boolean
}> = ({ handleOptionSelect, showScuttleThePapersWarning, setShowScuttleThePapersWarning, isActive }) => {
  const handleScuttleConfirm = () => {
    // Actually cancel the application
    handleOptionSelect('confirm-cancel-application')
  }

  const handleScuttleCancel = () => {
    // Go back to the options
    setShowScuttleThePapersWarning(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.3, duration: 0.6, type: 'spring' }}
      className="absolute left-6 right-6 lg:right-auto lg:left-[675px] lg:-translate-x-1/2 top-[524px] lg:top-1/2 lg:-translate-y-1/2 lg:w-80"
    >
      {showScuttleThePapersWarning ? (
        /* Warning Message */
        <div className="bg-black/40 backdrop-blur-xl rounded-2xl border border-red-600/40 shadow-2xl overflow-hidden">
          {/* Warning Header */}
          <div className="bg-red-900/20 border-b border-red-700/30 p-4 text-center">
            <div className="flex items-center justify-center space-x-2 mb-1">
              <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
              <h3 className="text-red-300 text-sm font-bold uppercase tracking-wider">Warning</h3>
              <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
            </div>
            <p className="text-slate-400 text-xs">This action cannot be undone</p>
          </div>

          {/* Warning Content */}
          <div className="p-6 text-center">
            <div className="mb-4">
              <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-3 border border-red-500/30">
                <span className="text-red-400 text-2xl">⚠</span>
              </div>
              <h4 className="text-white font-semibold mb-2">Scuttle Your Application?</h4>
              <p className="text-slate-300 text-sm leading-relaxed">
                Your application will be permanently sunk beneath the waves. All progress will be lost, and you&apos;ll
                need to start your voyage anew.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <button
                onClick={handleScuttleCancel}
                className="flex-1 px-4 py-2 text-slate-400 hover:text-white border border-slate-600/30 hover:border-slate-500/50 rounded-lg transition-colors text-sm"
              >
                Keep Sailing
              </button>
              <button
                onClick={handleScuttleConfirm}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm font-medium"
              >
                Scuttle Papers
              </button>
            </div>
          </div>
        </div>
      ) : isActive ? (
        // Active Menu
        <div className="bg-black/40 backdrop-blur-xl rounded-2xl border border-amber-600/30 shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-amber-900/20 border-b border-amber-700/30 p-4 text-center">
            <div className="flex items-center justify-center space-x-2 mb-1">
              <div className="w-2 h-2 bg-amber-400 rounded-full "></div>
              <h3 className="text-amber-300 text-sm font-bold uppercase tracking-wider">Bridge Ledger</h3>
              <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
            </div>
            <p className="text-slate-400 text-xs">As a Navigator, new duties and privileges await you here.</p>
          </div>

          {/* Options */}
          <div className="p-4 space-y-3">
            <Link
              href="/member/beacon"
              className="w-full flex items-center space-x-3 p-3 text-left hover:bg-slate-700/30 rounded-lg transition-colors group"
            >
              <div className="w-2 h-2 bg-amber-400 rounded-full flex shrink-0"></div>
              <div>
                <div className="text-white font-medium text-sm group-hover:text-amber-200">Locate the Beacon</div>
                <div className="text-slate-400 text-xs mt-0.5">
                  {' '}
                  Update your personal and contact details for the crew records.
                </div>
              </div>
            </Link>

            <Link
              href="/member/treasure-maps"
              className="w-full flex items-center space-x-3 p-3 text-left hover:bg-slate-700/30 rounded-lg transition-colors group"
            >
              <div className="w-2 h-2 bg-amber-400 rounded-full flex shrink-0"></div>
              <div>
                <div className="text-white font-medium text-sm group-hover:text-amber-200">Send Treasure Map</div>
                <div className="text-slate-400 text-xs mt-0.5">
                  Share a referral with the crew to guide them to new opportunities.
                </div>
              </div>
            </Link>

            <Link
              href="/member/parley"
              className="w-full flex items-center space-x-3 p-3 text-left hover:bg-slate-700/30 rounded-lg transition-colors group"
            >
              <div className="w-2 h-2 bg-amber-400 rounded-full flex shrink-0"></div>
              <div>
                <div className="text-white font-medium text-sm group-hover:text-amber-200">Call a Parley</div>
                <div className="text-slate-400 text-xs mt-0.5">
                  Arrange a meeting with another Navigator to discuss strategies and share insights.
                </div>
              </div>
            </Link>
          </div>
        </div>
      ) : (
        /* Normal Options Menu */
        <div className="bg-black/40 backdrop-blur-xl rounded-2xl border border-amber-600/30 shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-amber-900/20 border-b border-amber-700/30 p-4 text-center">
            <div className="flex items-center justify-center space-x-2 mb-1">
              <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
              <h3 className="text-amber-300 text-sm font-bold uppercase tracking-wider">Port Ledger</h3>
              <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
            </div>
            <p className="text-slate-400 text-xs">All actions at port be recorded here.</p>
          </div>

          {/* Options */}
          <div className="p-4 space-y-3">
            <button
              onClick={() => handleOptionSelect('message')}
              className="w-full flex items-center space-x-3 p-3 text-left hover:bg-slate-700/30 rounded-lg transition-colors group"
            >
              <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
              <div>
                <div className="text-white font-medium text-sm group-hover:text-amber-200">
                  Signal the Quartermaster
                </div>
                <div className="text-slate-400 text-xs mt-0.5"> Attach a message to your application</div>
              </div>
            </button>

            <button
              onClick={() => handleOptionSelect('ship-papers')}
              className="w-full flex items-center space-x-3 p-3 text-left hover:bg-slate-700/30 rounded-lg transition-colors group"
            >
              <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
              <div>
                <div className="text-white font-medium text-sm group-hover:text-amber-200">
                  Amend Ship&apos;s Papers
                </div>
                <div className="text-slate-400 text-xs mt-0.5">Make changes to your submitted details.</div>
              </div>
            </button>

            <button
              onClick={() => handleOptionSelect('scuttle-the-papers')}
              className="w-full flex items-center space-x-3 p-3 text-left hover:bg-slate-700/30 rounded-lg transition-colors group"
            >
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <div>
                <div className="text-white font-medium text-sm group-hover:text-amber-200">Scuttle the Papers</div>
                <div className="text-slate-400 text-xs mt-0.5">
                  One click, and your application sinks beneath the tide.
                </div>
              </div>
            </button>
          </div>
        </div>
      )}
    </motion.div>
  )
}

export default PortLedger
