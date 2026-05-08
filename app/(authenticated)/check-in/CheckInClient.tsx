'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Calendar, CheckCircle, Clock } from 'lucide-react'

interface CheckInClientProps {
  result: {
    success: boolean
    alreadyCheckedIn?: boolean
    error?: string
  }
  userName: string
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function CheckInClient({ result, userName }: CheckInClientProps) {
  const firstName = userName.split(' ')[0]
  const isWindowError = result.error?.includes('7:00 AM')

  const isSuccess = result.success
  const isAlready = result.alreadyCheckedIn

  // Gradient based on state
  const gradient = isSuccess
    ? isAlready
      ? 'from-[#0c1e2e] via-[#0d2d47] to-[#0284c7]'
      : 'from-[#052e16] via-[#14532d] to-[#16a34a]'
    : isWindowError
      ? 'from-[#1c1100] via-[#3d2000] to-[#b45309]'
      : 'from-[#1c0a0a] via-[#3d0f0f] to-[#dc2626]'

  return (
    <div
      className={`h-dvh overflow-hidden bg-linear-to-br ${gradient} flex flex-col relative`}
      style={{ paddingTop: 'env(safe-area-inset-top)', paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      {/* Header */}
      <div className="px-7 pt-12 shrink-0">
        <div className="flex items-center gap-2.5">
          <span className="block w-4 h-px bg-white/40 shrink-0" aria-hidden="true" />
          <p className="text-f10 font-mono tracking-[0.2em] uppercase text-white/50">Coastal Referral Exchange</p>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col justify-between px-7 pt-12 pb-10 relative z-10">
        {/* Icon + message */}
        <div className="flex flex-col gap-8">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            {isSuccess ? (
              <CheckCircle size={64} strokeWidth={1.5} className="text-white" />
            ) : isWindowError ? (
              <Calendar size={64} strokeWidth={1.5} className="text-white" />
            ) : (
              <Clock size={64} strokeWidth={1.5} className="text-white" />
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="flex flex-col gap-3"
          >
            <p className="text-f10 font-mono tracking-[0.2em] uppercase text-white/60">
              {isSuccess
                ? isAlready
                  ? 'Already Checked In'
                  : 'Checked In'
                : isWindowError
                  ? 'Not Available'
                  : 'Check-In Failed'}
            </p>
            <h1 className="font-sora font-black text-[2.75rem] text-white leading-[1.05] tracking-tight">
              {isSuccess
                ? isAlready
                  ? `Welcome\nback, ${firstName}`
                  : `Good\nmorning,\n${firstName}!`
                : isWindowError
                  ? `See you\nThursday!`
                  : `Something\nwent wrong`}
            </h1>
            <p className="font-nunito text-base text-white/70 leading-relaxed max-w-xs">
              {isSuccess
                ? isAlready
                  ? "You're already checked in for today's meeting."
                  : "You're checked in. Grab some food and get settled!"
                : isWindowError
                  ? 'Check-in is only available on Thursdays between 7:00 AM and 8:30 AM EST.'
                  : (result.error ?? 'Please try again or see the organizer.')}
            </p>
          </motion.div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.35 }}
        >
          <Link
            href="/dashboard"
            className="w-full h-14 bg-white/15 backdrop-blur-sm border border-white/20 text-white font-sora font-bold text-base flex items-center justify-center hover:bg-white/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
          >
            Go to Dashboard →
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
