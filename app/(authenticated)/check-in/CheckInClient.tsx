'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { CheckCircle, Clock } from 'lucide-react'

interface CheckInClientProps {
  result: {
    success: boolean
    alreadyCheckedIn?: boolean
    error?: string
  }
  userName: string
}

// ─── Confetti particle ────────────────────────────────────────────────────────

function Particle({ delay }: { delay: number }) {
  const x = -50 + Math.random() * 100
  const color = ['#0284c7', '#38bdf8', '#7dd3fc', '#ffffff', '#0ea5e9'][Math.floor(Math.random() * 5)]
  const size = 4 + Math.random() * 6

  return (
    <motion.div
      initial={{ opacity: 1, y: 0, x: 0, rotate: 0, scale: 1 }}
      animate={{ opacity: 0, y: 200 + Math.random() * 100, x, rotate: 360 * (Math.random() > 0.5 ? 1 : -1), scale: 0 }}
      transition={{ duration: 1.2 + Math.random() * 0.8, delay, ease: 'easeOut' }}
      className="absolute top-1/3 left-1/2 pointer-events-none"
      style={{ width: size, height: size, backgroundColor: color, borderRadius: Math.random() > 0.5 ? '50%' : '0' }}
    />
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function CheckInClient({ result, userName }: CheckInClientProps) {
  const [particles] = useState(() => Array.from({ length: 40 }, (_, i) => i))
  const [showParticles, setShowParticles] = useState(false)
  const firstName = userName.split(' ')[0]

  useEffect(() => {
    if (result.success && !result.alreadyCheckedIn) {
      setShowParticles(true)
      const t = setTimeout(() => setShowParticles(false), 2500)
      return () => clearTimeout(t)
    }
  }, [result])

  return (
    <div className="min-h-screen bg-bg-light dark:bg-bg-dark flex flex-col items-center justify-center px-5 relative overflow-hidden">
      {/* Confetti */}
      <AnimatePresence>{showParticles && particles.map((i) => <Particle key={i} delay={i * 0.02} />)}</AnimatePresence>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-sm border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark relative z-10"
      >
        {/* Top accent */}
        <div className="h-1 bg-primary-light dark:bg-primary-dark w-full" />

        <div className="px-6 py-8 flex flex-col items-center text-center gap-4">
          {result.success ? (
            <>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.4, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              >
                <CheckCircle
                  size={48}
                  className={result.alreadyCheckedIn ? 'text-muted-light dark:text-muted-dark' : 'text-green-500'}
                />
              </motion.div>

              <div>
                <p className="text-f10 font-mono tracking-[0.2em] uppercase text-primary-light dark:text-primary-dark mb-1">
                  {result.alreadyCheckedIn ? 'Already Checked In' : 'Checked In'}
                </p>
                <h1 className="font-sora font-black text-2xl text-text-light dark:text-text-dark leading-tight">
                  {result.alreadyCheckedIn ? `Welcome back, ${firstName}` : `Good morning, ${firstName}!`}
                </h1>
                <p className="font-nunito text-sm text-muted-light dark:text-muted-dark mt-2 leading-relaxed">
                  {result.alreadyCheckedIn
                    ? "You're already checked in for today's meeting."
                    : "You're checked in for today's meeting. Grab some food and get settled!"}
                </p>
              </div>
            </>
          ) : (
            <>
              <Clock size={48} className="text-muted-light dark:text-muted-dark" />
              <div>
                <p className="text-f10 font-mono tracking-[0.2em] uppercase text-red-500 mb-1">Check-In Failed</p>
                <h1 className="font-sora font-black text-2xl text-text-light dark:text-text-dark leading-tight">
                  Something went wrong
                </h1>
                <p className="font-nunito text-sm text-muted-light dark:text-muted-dark mt-2">
                  {result.error ?? 'Please try again or see the organizer.'}
                </p>
              </div>
            </>
          )}

          <Link
            href="/dashboard"
            className="mt-2 w-full h-11 bg-primary-light dark:bg-primary-dark text-white font-sora font-bold text-sm flex items-center justify-center hover:opacity-90 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
          >
            Go to Dashboard →
          </Link>
        </div>
      </motion.div>

      {/* Branding */}
      <p className="mt-6 text-f10 font-mono tracking-[0.2em] uppercase text-muted-light dark:text-muted-dark">
        Coastal Referral Exchange
      </p>
    </div>
  )
}
