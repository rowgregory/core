'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sun, Moon } from 'lucide-react'
import Pusher from 'pusher-js'
import Marquee from 'react-fast-marquee'
import { QRCodeSVG } from 'qrcode.react'
import useSoundEffect from '@/hooks/useSoundEffect'

// ─── Types ────────────────────────────────────────────────────────────────────

interface FloatingEmoji {
  id: string
  emoji: string
  x: number
}

interface Member {
  id: string
  name: string
  company: string
}

interface AttendanceTVProps {
  date?: string
  members: Member[]
  initialAttendees: string[]
  initialReactionCount?: number
}

// ─── Constants ────────────────────────────────────────────────────────────────

const TICKER_MESSAGES = [
  "⚓ Scan the QR code to check in for today's meeting",
  '📋 Attendance is recorded every Thursday',
  '✦ Check in to keep your membership in good standing',
  '👋 Welcome — grab some food and find a seat',
  '📱 Open your camera and point it at the QR code'
]

// ─── Floating emoji ───────────────────────────────────────────────────────────

function FloatingEmojiEl({ emoji, x, onDone }: { emoji: string; x: number; onDone: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 1, y: 0, scale: 0.8, x: 0 }}
      animate={{
        opacity: [1, 1, 1, 0],
        y: typeof window !== 'undefined' ? -window.innerHeight : -900,
        scale: [0.8, 1.4, 1.2, 1],
        x: [0, 30, -25, 20, -15, 0]
      }}
      transition={{
        duration: 5,
        ease: 'easeOut',
        x: { duration: 5, ease: 'easeInOut', times: [0, 0.25, 0.5, 0.75, 0.9, 1] },
        opacity: { duration: 5, times: [0, 0.6, 0.8, 1] }
      }}
      onAnimationComplete={onDone}
      className="fixed bottom-32 z-50 pointer-events-none select-none text-4xl"
      style={{ left: `${x}%` }}
    >
      {emoji}
    </motion.div>
  )
}

// ─── Name tile ────────────────────────────────────────────────────────────────

function NameTile({
  member,
  checkedIn,
  justCheckedIn,
  t
}: {
  member: Member
  checkedIn: boolean
  justCheckedIn: boolean
  t: Record<string, string>
}) {
  const firstName = member.name.split(' ')[0]
  const lastName = member.name.split(' ').slice(1).join(' ')

  return (
    <motion.div
      layout
      animate={
        justCheckedIn
          ? {
              scale: [1, 1.06, 0.98, 1]
            }
          : { scale: 1 }
      }
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={`relative flex items-center justify-center overflow-hidden transition-all duration-500 border ${
        checkedIn ? 'border-green-500/50 bg-green-500/10' : `${t.border} opacity-25`
      }`}
    >
      {/* Shimmer sweep */}
      <AnimatePresence>
        {justCheckedIn && (
          <motion.div
            key="shimmer"
            initial={{ x: '-100%', opacity: 0.9 }}
            animate={{ x: '200%', opacity: 0 }}
            exit={{}}
            transition={{ duration: 0.7, ease: 'easeInOut' }}
            className="absolute inset-0 z-20 pointer-events-none"
            style={{
              background: 'linear-gradient(105deg, transparent 30%, rgba(134,239,172,0.6) 50%, transparent 70%)',
              width: '100%'
            }}
          />
        )}
      </AnimatePresence>

      {/* Green flash overlay */}
      <AnimatePresence>
        {justCheckedIn && (
          <motion.div
            key="flash"
            initial={{ opacity: 0.5 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
            className="absolute inset-0 bg-green-400/30 pointer-events-none z-10"
          />
        )}
      </AnimatePresence>

      {/* Ripple */}
      <AnimatePresence>
        {justCheckedIn && (
          <motion.div
            key="ripple"
            initial={{ scale: 0, opacity: 0.6 }}
            animate={{ scale: 3, opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="absolute inset-0 m-auto w-8 h-8 rounded-full bg-green-400 pointer-events-none z-10"
          />
        )}
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-30 text-center px-2 py-3">
        <p
          className={`font-sora font-black leading-none transition-colors duration-500 ${
            checkedIn ? 'text-white' : t.text
          }`}
          style={{ fontSize: 'clamp(1.25rem, 2.5vw, 2.25rem)' }}
        >
          {firstName}
        </p>
        <p
          className={`font-sora font-black leading-none transition-colors duration-500 ${
            checkedIn ? 'text-green-400' : t.muted
          }`}
          style={{ fontSize: 'clamp(1rem, 2vw, 1.75rem)' }}
        >
          {lastName}
        </p>

        {checkedIn && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="mt-1.5 flex justify-center"
          >
            <motion.div
              animate={justCheckedIn ? { scale: [1, 2, 1], opacity: [1, 0.3, 1] } : {}}
              transition={{ duration: 0.8, repeat: justCheckedIn ? 3 : 0 }}
              className="w-2 h-2 rounded-full bg-green-500"
            />
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function AttendanceTVPage({
  date = 'Thursday',
  members,
  initialAttendees = [],
  initialReactionCount = 0
}: AttendanceTVProps) {
  const [dark] = useState(true)
  const [floaters, setFloaters] = useState<FloatingEmoji[]>([])
  const [totalReactions, setTotalReactions] = useState(initialReactionCount)
  const [checkedInIds, setCheckedInIds] = useState<Set<string>>(new Set(initialAttendees))
  const [justCheckedInId, setJustCheckedInId] = useState<string | null>(null)
  const { play } = useSoundEffect('/images/portal.mp3', true)

  const t = {
    bg: dark ? 'bg-bg-dark' : 'bg-bg-light',
    border: dark ? 'border-border-dark' : 'border-border-light',
    text: dark ? 'text-text-dark' : 'text-text-light',
    muted: dark ? 'text-muted-dark' : 'text-muted-light',
    primary: dark ? 'text-primary-dark' : 'text-primary-light',
    primaryBar: dark ? 'bg-primary-dark' : 'bg-primary-light'
  }

  useEffect(() => {
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!
    })

    const attendanceChannel = pusher.subscribe('meeting-attendance')
    attendanceChannel.bind('check-in', (data: { userId: string }) => {
      setCheckedInIds((prev) => new Set([...prev, data.userId]))
      setJustCheckedInId(data.userId)
      play()
      setTimeout(() => setJustCheckedInId(null), 3000)
    })

    const reactionChannel = pusher.subscribe('visitor-reactions')
    reactionChannel.bind('reaction', (data: { emoji: string; count: number }) => {
      const id = `${Date.now()}-${Math.random()}`
      const x = 10 + Math.random() * 80
      setFloaters((prev) => [...prev, { id, emoji: data.emoji, x }])
      setTotalReactions(data.count)
    })

    return () => {
      attendanceChannel.unbind_all()
      reactionChannel.unbind_all()
      pusher.unsubscribe('meeting-attendance')
      pusher.unsubscribe('visitor-reactions')
      pusher.disconnect()
    }
  }, [])

  function removeFloater(id: string) {
    setFloaters((prev) => prev.filter((f) => f.id !== id))
  }

  const sortedMembers = [...members].sort((a, b) => a.name.localeCompare(b.name))
  const checkedInCount = checkedInIds.size

  return (
    <div
      className={`h-screen w-screen overflow-hidden ${t.bg} ${t.text} flex flex-col transition-colors duration-300 relative`}
    >
      {/* ── Floating emojis ── */}
      <AnimatePresence>
        {floaters.map((f) => (
          <FloatingEmojiEl key={f.id} emoji={f.emoji} x={f.x} onDone={() => removeFloater(f.id)} />
        ))}
      </AnimatePresence>

      {/* ── Top bar ── */}
      <div
        className={`flex items-center justify-between px-5 lg:px-10 py-3 border-b ${t.border} shrink-0 relative z-10`}
      >
        <div className="flex items-center gap-3 lg:gap-4">
          <span className={`block w-5 lg:w-6 h-px ${t.primaryBar} shrink-0`} aria-hidden="true" />
          <p className={`text-xs lg:text-sm font-mono tracking-[0.25em] uppercase ${t.primary}`}>
            Coastal Referral Exchange
          </p>
        </div>
        <div className="flex items-center gap-3 lg:gap-6">
          <p className={`text-xs lg:text-sm font-mono tracking-[0.15em] uppercase ${t.muted} hidden sm:block`}>
            {date} · 25 N Common St · Lynn, MA 01902
          </p>
        </div>
      </div>

      {/* ── Main content ── */}
      <div className="flex flex-1 min-h-0 relative z-10">
        {/* ── Left — name grid ── */}
        <div className="flex flex-col flex-1 min-h-0">
          <div className={`flex items-center justify-between px-5 lg:px-8 py-2 border-b ${t.border} shrink-0`}>
            <div className="flex items-center gap-3">
              <span className={`block w-4 h-px ${t.primaryBar} shrink-0`} aria-hidden="true" />
              <p className={`text-xs font-mono tracking-[0.2em] uppercase ${t.primary}`}>Attendance</p>
            </div>
            <p className={`text-xs font-mono tracking-widest uppercase ${t.muted}`}>
              {checkedInCount} / {members.length}
            </p>
          </div>

          {/* Name grid — 4 or 5 cols depending on count */}
          <div
            className="flex-1 grid p-3 gap-2"
            style={{ gridTemplateColumns: `repeat(${members.length <= 12 ? 4 : 5}, 1fr)` }}
          >
            {sortedMembers.map((member) => (
              <NameTile
                key={member.id}
                member={member}
                checkedIn={checkedInIds.has(member.id)}
                justCheckedIn={justCheckedInId === member.id}
                t={t}
              />
            ))}
          </div>
        </div>

        {/* ── Right — instructions + QR ── */}
        <div className={`hidden lg:flex flex-col justify-between px-6 py-5 w-72 xl:w-80 shrink-0 border-l ${t.border}`}>
          <div>
            <div className="flex items-center gap-3 mb-5">
              <span className={`block w-4 h-px ${t.primaryBar} shrink-0`} aria-hidden="true" />
              <p className={`text-xs font-mono tracking-[0.2em] uppercase ${t.primary}`}>How to Check In</p>
            </div>

            <div className="flex flex-col gap-4">
              {[
                { step: '01', text: 'Open your phone camera' },
                { step: '02', text: 'Point it at the QR code' },
                { step: '03', text: 'Tap the link that appears' },
                { step: '04', text: 'Sign in if prompted' },
                { step: '05', text: 'Watch your name light up!' }
              ].map(({ step, text }) => (
                <div key={step} className="flex items-start gap-3">
                  <span className={`text-xs font-mono ${t.primary} shrink-0`}>{step}</span>
                  <p className={`font-nunito text-sm lg:text-base ${t.text} leading-snug`}>{text}</p>
                </div>
              ))}
            </div>

            {totalReactions > 0 && (
              <div className="mt-6">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={totalReactions}
                    initial={{ opacity: 0, y: -8, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                    className={`font-sora font-black text-4xl xl:text-5xl ${t.primary} leading-none`}
                  >
                    {totalReactions}
                  </motion.p>
                </AnimatePresence>
                <p className={`text-xs font-mono tracking-widest uppercase ${t.muted} mt-1`}>
                  {totalReactions === 1 ? 'reaction' : 'reactions'} in the room
                </p>
              </div>
            )}
          </div>

          {/* QR Code */}
          <div className={`border ${t.border} p-3 flex flex-col items-center gap-2`}>
            <QRCodeSVG
              value="https://coastal-referral-exchange.com/check-in"
              size={200}
              bgColor="transparent"
              fgColor={dark ? '#f8fafc' : '#0f172a'}
            />
            <p className={`text-xs font-mono tracking-[0.2em] uppercase ${t.primary} text-center`}>Scan to check in</p>
          </div>
        </div>
      </div>

      {/* ── Ticker ── */}
      <div
        className={`shrink-0 relative z-10 border-t-2 ${dark ? 'border-primary-dark bg-primary-dark/10' : 'border-primary-light bg-primary-light/10'} overflow-hidden`}
      >
        <div className="flex items-center">
          <div
            className={`shrink-0 flex items-center gap-2 px-4 py-2 border-r-2 ${dark ? 'border-primary-dark bg-primary-dark text-white' : 'border-primary-light bg-primary-light text-white'}`}
          >
            <span className="w-2 h-2 rounded-full bg-white animate-pulse shrink-0" />
            <p className="text-xs font-mono tracking-[0.2em] uppercase whitespace-nowrap">CORE</p>
          </div>
          <div className="overflow-hidden flex-1">
            <Marquee speed={40} gradientWidth={0} pauseOnHover={false}>
              {TICKER_MESSAGES.map((msg, i) => (
                <span
                  key={i}
                  className={`mx-16 text-xs font-mono tracking-[0.15em] uppercase ${t.text} py-2 inline-block`}
                >
                  {msg}
                </span>
              ))}
            </Marquee>
          </div>
        </div>
      </div>
    </div>
  )
}
