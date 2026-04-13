import { User } from '@/types/user'
import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown, MessageSquare, Phone } from 'lucide-react'

export function MemberList({ members }: { members: User[] }) {
  const [activeId, setActiveId] = useState<string | null>(null)

  return (
    <ul className="border border-border-light dark:border-border-dark divide-y divide-border-light dark:divide-border-dark">
      {members.map((m, i) => {
        const isOpen = activeId === m.id
        const initials = m.name
          .split(' ')
          .map((n: string) => n[0])
          .slice(0, 2)
          .join('')
          .toUpperCase()

        return (
          <motion.li
            key={m.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.54 + i * 0.03, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {/* ── Row ── */}
            <button
              onClick={() => setActiveId(isOpen ? null : m.id)}
              className="w-full flex items-center gap-3 px-4 py-3.5 bg-bg-light dark:bg-bg-dark hover:bg-surface-light dark:hover:bg-surface-dark transition-colors text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark focus-visible:ring-inset"
              aria-expanded={isOpen}
              aria-label={`${m.name} — tap to see contact options`}
            >
              <div className="w-8 h-8 shrink-0 bg-primary-light/10 dark:bg-primary-dark/10 border border-primary-light/20 dark:border-primary-dark/20 flex items-center justify-center">
                <span className="text-f10 font-mono font-bold text-primary-light dark:text-primary-dark">
                  {initials}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13.5px] font-sora font-bold text-text-light dark:text-text-dark truncate">
                  {m.name}
                </p>
                {m.industry && (
                  <p className="text-f10 font-mono tracking-[0.08em] text-muted-light dark:text-muted-dark truncate">
                    {m.industry}
                  </p>
                )}
              </div>
              <ChevronDown
                size={14}
                className={`shrink-0 text-muted-light dark:text-muted-dark transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                aria-hidden="true"
              />
            </button>

            {/* ── Contact actions ── */}
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="overflow-hidden"
                >
                  <div className="flex gap-2 px-4 py-3 bg-surface-light dark:bg-surface-dark border-t border-border-light dark:border-border-dark">
                    {m.phone ? (
                      <>
                        <a
                          href={`tel:${m.phone}`}
                          className="flex-1 h-10 flex items-center justify-center gap-2 border border-primary-light/30 dark:border-primary-dark/30 text-primary-light dark:text-primary-dark hover:bg-primary-light/5 dark:hover:bg-primary-dark/5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
                        >
                          <Phone size={13} aria-hidden="true" />
                          <span className="text-f10 font-mono tracking-[0.15em] uppercase">Call</span>
                        </a>

                        <a
                          href={`sms:${m.phone}`}
                          className="flex-1 h-10 flex items-center justify-center gap-2 border border-primary-light/30 dark:border-primary-dark/30 text-primary-light dark:text-primary-dark hover:bg-primary-light/5 dark:hover:bg-primary-dark/5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
                        >
                          <MessageSquare size={13} aria-hidden="true" />
                          <span className="text-f10 font-mono tracking-[0.15em] uppercase">Text</span>
                        </a>
                      </>
                    ) : (
                      <p className="text-f10 font-mono tracking-widest text-muted-light dark:text-muted-dark py-1">
                        No phone number on file
                      </p>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.li>
        )
      })}
    </ul>
  )
}
