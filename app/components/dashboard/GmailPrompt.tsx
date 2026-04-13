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
        className="border border-border-light dark:border-border-dark border-l-2 border-l-primary-light dark:border-l-primary-dark bg-primary-light/5 dark:bg-primary-dark/5 px-4 py-3"
      >
        <div className="flex items-start justify-between gap-3 mb-2">
          <div>
            <p className="text-f10 font-mono tracking-[0.15em] uppercase text-primary-light dark:text-primary-dark mb-0.5">
              New — Sign In with Google
            </p>
            <p className="text-[12.5px] font-nunito text-text-light dark:text-text-dark">
              Add your Gmail to sign in with Google — no more waiting for a magic link.
            </p>
          </div>
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
      </motion.div>
    </AnimatePresence>
  )
}
