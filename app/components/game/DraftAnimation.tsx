'use client'

// The "cool animation" the host triggers: member names shuffle in the center,
// then fly left (Team A) or right (Team B) into their columns. Runs once when
// `players` arrives, then calls onDone so the TV swaps to the live board.

import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import type { SerializedPlayer } from '@/types/game.types'

interface DraftAnimationProps {
  players: SerializedPlayer[]
  onDone: () => void
}

export default function DraftAnimation({ players, onDone }: DraftAnimationProps) {
  const [phase, setPhase] = useState<'shuffle' | 'split'>('shuffle')

  // Random scatter positions for the shuffle phase (stable across renders).
  const scatter = useMemo(
    () =>
      players.map(() => ({
        x: (Math.random() - 0.5) * 280,
        y: (Math.random() - 0.5) * 160,
        rot: (Math.random() - 0.5) * 30
      })),
    [players]
  )

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('split'), 1400)
    const t2 = setTimeout(onDone, 3200)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [onDone])

  return (
    <div className="relative h-72 w-full overflow-hidden">
      {/* Team labels fade in during the split */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: phase === 'split' ? 1 : 0 }}
        className="absolute inset-0 flex justify-between px-10 items-start pt-2"
      >
        <span className="font-mono text-[11px] tracking-[0.2em]" style={{ color: '#3DDC97' }}>
          TEAM A
        </span>
        <span className="font-mono text-[11px] tracking-[0.2em]" style={{ color: '#FF6B6B' }}>
          TEAM B
        </span>
      </motion.div>

      {players.map((p, i) => {
        const isA = p.team === 'A'
        const target =
          phase === 'shuffle'
            ? scatter[i]
            : {
                x: isA ? -180 : 180,
                y: -110 + Math.floor(i / 2) * 34,
                rot: 0
              }
        return (
          <motion.div
            key={p.id}
            initial={{ x: 0, y: 0, opacity: 0, scale: 0.7 }}
            animate={{
              x: target.x,
              y: target.y,
              rotate: target.rot,
              opacity: 1,
              scale: phase === 'split' ? 1 : 1.05
            }}
            transition={{
              duration: phase === 'shuffle' ? 0.6 : 0.9,
              delay: phase === 'shuffle' ? i * 0.04 : i * 0.05,
              ease: [0.34, 1.4, 0.64, 1]
            }}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          >
            <span
              className="inline-block px-3 py-1.5 font-nunito font-bold text-sm border"
              style={{
                color: phase === 'split' ? (isA ? '#3DDC97' : '#FF6B6B') : '#fff',
                borderColor: phase === 'split' ? (isA ? '#3DDC97' : '#FF6B6B') : 'rgba(255,255,255,0.2)',
                background: 'rgba(8,20,32,0.9)'
              }}
            >
              {p.name}
            </span>
          </motion.div>
        )
      })}
    </div>
  )
}
