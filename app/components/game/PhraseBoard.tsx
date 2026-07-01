'use client'

// The Wheel-of-Fortune tile board. Shows one tile per letter; spaces break
// words. Revealed letters flip face-up. On the TV pass `phrase` (the real
// answer). On phones, the phrase is also known (it's not a secret from
// players — only the turn gates input), so the same component works for both.

import { motion } from 'framer-motion'

interface PhraseBoardProps {
  phrase: string
  revealed: string[]
  /** Smaller tiles for phone; default is TV-sized. */
  compact?: boolean
}

export default function PhraseBoard({ phrase, revealed, compact }: PhraseBoardProps) {
  const revealedSet = new Set(revealed)
  const words = phrase.split(' ')

  const tile = compact ? 'w-7 h-9 text-lg' : 'w-12 h-16 text-3xl md:w-14 md:h-20 md:text-4xl'
  const gap = compact ? 'gap-1' : 'gap-1.5 md:gap-2'

  return (
    <div className={`flex flex-wrap items-center justify-center ${compact ? 'gap-y-1.5' : 'gap-y-3'}`}>
      {words.map((word, wi) => (
        <div key={wi} className={`flex ${gap} mx-1.5`}>
          {word.split('').map((ch, ci) => {
            const open = revealedSet.has(ch)
            return (
              <div
                key={ci}
                className={`${tile} flex items-center justify-center font-quicksand font-black border ${
                  open ? 'bg-white text-slate-900 border-white' : 'bg-white/5 text-transparent border-white/15'
                }`}
                style={{ perspective: 600 }}
              >
                <motion.span
                  initial={false}
                  animate={{ rotateX: open ? 0 : 90, opacity: open ? 1 : 0 }}
                  transition={{ duration: 0.35, ease: [0.34, 1.56, 0.64, 1] }}
                  style={{ display: 'inline-block' }}
                >
                  {ch}
                </motion.span>
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )
}
