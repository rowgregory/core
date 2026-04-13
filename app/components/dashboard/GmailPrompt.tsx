'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { updateProfile } from '@/app/lib/actions/updateProfile'
import { useRouter } from 'next/navigation'
import useSoundEffect from '@/hooks/useSoundEffect'

export function GmailPrompt() {
  const [username, setUsername] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { play } = useSoundEffect('/sound-effects/se-3.mp3', true)

  async function handleSave() {
    if (!username.trim()) return
    setIsLoading(true)
    const res = await updateProfile({ secondaryEmail: `${username.trim()}@gmail.com` })
    setIsLoading(false)
    if (res.success) {
      play()
      router.refresh()
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.3 }}
        className="relative overflow-hidden border border-border-light dark:border-border-dark bg-bg-light dark:bg-bg-dark px-4 py-3"
      >
        {/* G watermark */}
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 text-slate-200 dark:text-slate-700 pointer-events-none select-none"
          fill="currentColor"
        >
          <path d="M12.545 10.239v3.821h5.445c-.712 2.315-2.647 3.972-5.445 3.972a6.033 6.033 0 1 1 0-12.064 5.96 5.96 0 0 1 4.123 1.632l2.913-2.913A9.969 9.969 0 0 0 12.545 2C7.021 2 2.543 6.477 2.543 12s4.478 10 10.002 10c8.396 0 10.249-7.85 9.426-11.748l-9.426-.013z" />
        </svg>

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-f10 font-mono tracking-[0.15em] uppercase shrink-0">
              <span className="text-blue-500">G</span>
              <span className="text-red-500">m</span>
              <span className="text-yellow-500">a</span>
              <span className="text-blue-500">i</span>
              <span className="text-green-500">l</span>
            </span>
            <span className="text-border-light dark:text-border-dark" aria-hidden="true">
              ·
            </span>
            <p className="text-[12px] font-nunito text-muted-light dark:text-muted-dark truncate">
              Add your Gmail to sign in with Google — no more waiting for a magic link.
            </p>
          </div>

          <div className="flex items-stretch gap-2">
            <div className="flex flex-1 items-stretch">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value.replace(/[@\s]/g, ''))}
                placeholder="yourusername"
                autoCapitalize="off"
                spellCheck={false}
                className="flex-1 h-9 px-3 bg-white dark:bg-bg-dark border border-slate-300 dark:border-border-dark border-r-0 font-nunito text-[13px] text-text-light dark:text-text-dark placeholder:text-slate-400 dark:placeholder:text-muted-dark/50 focus:outline-none focus:border-primary-light dark:focus:border-primary-dark transition-colors rounded-none"
              />
              <div className="h-9 px-2.5 flex items-center bg-surface-light dark:bg-surface-dark border border-slate-300 dark:border-border-dark font-mono text-[11px] text-muted-light dark:text-muted-dark select-none whitespace-nowrap">
                @gmail.com
              </div>
            </div>
            <button
              onClick={handleSave}
              disabled={!username.trim() || isLoading}
              className="h-9 px-4 bg-primary-light dark:bg-button-dark text-white font-sora font-bold text-[11px] tracking-wide hover:opacity-90 transition-opacity disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark shrink-0"
            >
              {isLoading ? 'Saving…' : 'Save'}
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
