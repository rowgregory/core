import { AnimatePresence, motion } from 'framer-motion'
import { Trophy, X } from 'lucide-react'

export function OutingFundModal({
  open,
  onClose,
  raised = 0,
  goal = 3000
}: {
  open: boolean
  onClose: () => void
  raised?: number
  goal?: number
}) {
  const pct = goal > 0 ? Math.min(100, Math.round((raised / goal) * 100)) : 0

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={onClose}
            className="fixed inset-0 z-40 backdrop-blur-sm"
            style={{ backgroundColor: 'rgba(0,0,0,0.65)' }}
          />

          <motion.div
            initial={{ y: 28, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 28, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="fixed inset-x-0 bottom-0 z-50 flex justify-center max-h-[90vh]"
          >
            <div
              className="w-full max-w-170 bg-bg-light dark:bg-surface-dark border-t-[3px] border-t-primary-light dark:border-t-primary-dark overflow-y-auto overscroll-contain"
              style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}
            >
              {/* Header */}
              <div className="flex items-center justify-between gap-2 px-3 sm:px-5 py-3 sm:py-4 border-b border-border-light dark:border-border-dark">
                <div className="flex items-center gap-2 sm:gap-2.5 min-w-0 flex-1">
                  <div className="shrink-0 w-7 h-7 border border-amber-500/40 dark:border-amber-400/40 bg-amber-500/5 dark:bg-amber-400/5 flex items-center justify-center">
                    <Trophy size={13} className="text-amber-600 dark:text-amber-400" aria-hidden="true" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[9px] sm:text-f10 font-mono tracking-[0.18em] sm:tracking-[0.2em] uppercase text-amber-700 dark:text-amber-400 font-bold truncate">
                      Outing Fund
                    </p>
                    <h2
                      id="outing-fund-modal-title"
                      className="font-sora font-black text-base sm:text-lg text-text-light dark:text-text-dark leading-tight mt-0.5"
                    >
                      How The Fund Works
                    </h2>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  aria-label="Close"
                  className="shrink-0 w-8 h-8 border border-border-light dark:border-border-dark text-muted-light dark:text-muted-dark hover:text-primary-light dark:hover:text-primary-dark hover:border-primary-light dark:hover:border-primary-dark transition-colors flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
                >
                  <X size={14} aria-hidden="true" />
                </button>
              </div>

              {/* Body */}
              <div className="px-3 sm:px-5 py-4 sm:py-5 space-y-4 sm:space-y-5">
                {/* Progress callout */}
                <div className="border border-amber-500/30 dark:border-amber-400/30 bg-amber-500/5 dark:bg-amber-400/5 p-3 sm:p-4">
                  <p className="text-[9px] sm:text-f10 font-mono tracking-[0.18em] sm:tracking-[0.2em] uppercase text-amber-700 dark:text-amber-400 mb-1">
                    Current Total
                  </p>
                  <p className="font-sora font-black text-2xl sm:text-3xl text-amber-600 dark:text-amber-400 leading-none">
                    ${raised.toLocaleString()}
                  </p>
                  <p className="text-[11px] sm:text-xs font-nunito text-muted-light dark:text-muted-dark mt-2 leading-relaxed">
                    Raised so far for our annual chapter outing. Goal: ${goal.toLocaleString()}.
                  </p>

                  {/* Progress bar */}
                  <div className="mt-3 h-2 bg-border-light/40 dark:bg-border-dark/40 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
                      className="h-full bg-amber-500 dark:bg-amber-400"
                    />
                  </div>
                  <p className="text-[10px] font-mono tracking-[0.15em] uppercase text-muted-light dark:text-muted-dark mt-2">
                    {pct}% to goal
                  </p>
                </div>

                {/* How it works */}
                <div>
                  <p className="text-[9px] sm:text-f10 font-mono tracking-[0.18em] sm:tracking-[0.2em] uppercase text-primary-light dark:text-primary-dark mb-3">
                    How It Works
                  </p>
                  <ul className="space-y-2 sm:space-y-2.5">
                    {[
                      'Every Thursday meeting you check in counts toward your attendance record.',
                      'Miss a meeting? You can pay a $150 reinstatement fee to restore your attendance.',
                      'The full reinstatement fee goes directly into the chapter outing fund.',
                      'At the end of the year, we use the fund to pay for our annual chapter outing.'
                    ].map((item, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2.5 sm:gap-3 text-[13px] sm:text-sm font-nunito text-text-light dark:text-text-dark leading-relaxed"
                      >
                        <span className="shrink-0 mt-0.5 w-5 h-5 border border-border-light dark:border-border-dark bg-bg-light dark:bg-surface-dark flex items-center justify-center text-[10px] font-mono font-bold text-primary-light dark:text-primary-dark">
                          {i + 1}
                        </span>
                        <span className="min-w-0">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Stat strip */}
                <div className="grid grid-cols-1 xs:grid-cols-2 gap-2">
                  <div className="border border-border-light dark:border-border-dark bg-bg-light dark:bg-surface-dark p-3">
                    <p className="text-[9px] sm:text-f10 font-mono tracking-[0.15em] uppercase text-muted-light dark:text-muted-dark mb-1">
                      Reinstatement Fee
                    </p>
                    <p className="font-sora font-black text-sm text-text-light dark:text-text-dark">$150</p>
                  </div>
                  <div className="border border-border-light dark:border-border-dark bg-bg-light dark:bg-surface-dark p-3">
                    <p className="text-[9px] sm:text-f10 font-mono tracking-[0.15em] uppercase text-muted-light dark:text-muted-dark mb-1">
                      Where It Goes
                    </p>
                    <p className="font-sora font-black text-sm text-text-light dark:text-text-dark">Chapter Outing</p>
                  </div>
                </div>

                {/* Footer note */}
                <p className="text-[11px] font-nunito text-muted-light dark:text-muted-dark leading-relaxed border-t border-border-light dark:border-border-dark pt-4">
                  Members who attend every Thursday never pay a dime extra. The fund grows only when missed meetings are
                  reinstated.
                </p>
              </div>

              {/* Footer */}
              <div className="px-3 sm:px-5 py-3 sm:py-4 border-t border-border-light dark:border-border-dark flex justify-end">
                <button
                  onClick={onClose}
                  className="w-full xs:w-auto px-4 py-2.5 border border-primary-light dark:border-primary-dark bg-primary-light dark:bg-primary-dark text-bg-light dark:text-bg-dark text-f10 font-mono tracking-[0.2em] uppercase font-bold hover:opacity-90 transition-opacity"
                >
                  Got It
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
