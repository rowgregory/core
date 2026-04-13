'use client'

import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import QuickActions from '../common/QuickActions'
import Link from 'next/link'
import { Check, LayoutDashboard, UserCircle } from 'lucide-react'
import PresenterSchedule from '../PresentersSchedule'
import { ScheduledPresenter } from '@/types/presenter-queue'
import { MemberList } from '../dashboard/MemberList'
import { useSession } from 'next-auth/react'
import { LinkedRecord } from '@/types/common'
import LinkedRecordModal from '../modals/LinkedRecordModal'
import { HistoryTabs } from '../dashboard/HistoryTabs'
import { GmailPrompt } from '../dashboard/GmailPrompt'

export interface ActivityItem {
  id: string
  type: 'MEETING' | 'REFERRAL' | 'CLOSED'
  label: string
  timeAgo: string
  clientPhone?: string
  businessValue?: number
}

interface DashboardStats {
  parleyThisWeek: number
  treasureMapsThisWeek: number
  anchorsThisWeek: number
  totalParleys: number
  totalTreasureMaps: number
  totalAnchors: number
  closedAmountThisWeek: string
  totalClosedAmount: string
}

export interface MemberDashboardProps {
  currentUser: {
    name: string
    initials: string
    secondaryEmail?: string
    id?: string
  }
  members: any
  stats: DashboardStats
  recentActivity: ActivityItem[]
  schedule: ScheduledPresenter[]
  linkedRecord: LinkedRecord
}

const sharedCls = `flex items-center gap-2 h-9 px-4 border border-border-light dark:border-border-dark text-muted-light dark:text-muted-dark hover:text-primary-light dark:hover:text-primary-dark hover:border-primary-light dark:hover:border-primary-dark transition-colors text-f10 font-mono tracking-[0.15em] uppercase focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark`

// ─── Fade up ───────────────────────────────────────────────────────────────────
function FadeUp({
  children,
  delay = 0,
  className = ''
}: {
  children: React.ReactNode
  delay?: number
  className?: string
}) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-48px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// ─── Section label ─────────────────────────────────────────────────────────────
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <span className="block w-6 h-px bg-primary-light dark:bg-primary-dark shrink-0" aria-hidden="true" />
      <p className="text-f10 font-mono tracking-[0.2em] uppercase text-primary-light dark:text-primary-dark">
        {children}
      </p>
    </div>
  )
}

// ─── Main dashboard ────────────────────────────────────────────────────────────
export default function DashboardClient({
  currentUser,
  members,
  stats,
  recentActivity,
  schedule,
  linkedRecord
}: MemberDashboardProps) {
  const session = useSession()
  const [open, setOpen] = useState(linkedRecord ? true : false)

  const firstName = currentUser.name.split(' ')[0]

  const greeting = (() => {
    const h = new Date().getHours()
    if (h < 12) return 'Good morning'
    if (h < 17) return 'Good afternoon'
    return 'Good evening'
  })()
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })

  const isAdmin = session.data.user.isAdmin ?? false

  return (
    <div className="min-h-screen bg-bg-light dark:bg-bg-dark">
      <LinkedRecordModal record={linkedRecord} setOpen={setOpen} open={open} />
      <main className="max-w-170 mx-auto px-4 pb-12">
        {/* ── Greeting ── */}
        <FadeUp className="pt-7 pb-5">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="text-f10 font-mono tracking-[0.18em] uppercase text-primary-light dark:text-primary-dark mb-1.5">
                {today}
              </p>
              <h1 className="font-sora font-black text-[22px] xs:text-[30px] text-text-light dark:text-text-dark tracking-tight leading-[1.1] truncate">
                {greeting}, {firstName}.
              </h1>
            </div>
            <div className="flex items-center gap-1.5 shrink-0 mt-1">
              {isAdmin && (
                <Link href="/admin" className={sharedCls}>
                  <LayoutDashboard size={12} aria-hidden="true" />
                  <span className="hidden xs-2:inline">Admin</span>
                </Link>
              )}
              <Link href="/profile" className={sharedCls}>
                <UserCircle size={12} aria-hidden="true" />
                <span className="hidden xxs:inline">Profile</span>
              </Link>
            </div>
          </div>
        </FadeUp>

        <FadeUp delay={0.05}>
          <div className="h-px bg-border-light dark:bg-border-dark" role="separator" />
        </FadeUp>
        {/* ── Gmail prompt ── */}
        {!currentUser.secondaryEmail ? (
          <FadeUp delay={0.08} className="pt-4">
            <GmailPrompt />
          </FadeUp>
        ) : (
          <FadeUp delay={0.08} className="pt-4">
            <div className="relative overflow-hidden border border-border-light dark:border-border-dark border-l-2 border-l-emerald-500 bg-emerald-50 dark:bg-emerald-400/5 px-4 py-2 flex items-center justify-between gap-4">
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 text-emerald-500/10 dark:text-emerald-400/8 pointer-events-none select-none"
                fill="currentColor"
              >
                <path d="M12.545 10.239v3.821h5.445c-.712 2.315-2.647 3.972-5.445 3.972a6.033 6.033 0 1 1 0-12.064 5.96 5.96 0 0 1 4.123 1.632l2.913-2.913A9.969 9.969 0 0 0 12.545 2C7.021 2 2.543 6.477 2.543 12s4.478 10 10.002 10c8.396 0 10.249-7.85 9.426-11.748l-9.426-.013z" />
              </svg>
              <div className="relative z-10 flex items-center gap-3 min-w-0">
                <p className="text-f10 font-mono tracking-[0.15em] uppercase text-emerald-600 dark:text-emerald-400">
                  Gmail Added
                </p>
                <span className="text-border-light dark:text-border-dark" aria-hidden="true">
                  ·
                </span>
                <p className="text-[12px] font-nunito text-muted-light dark:text-muted-dark truncate">
                  You can now sign in with Google
                </p>
              </div>
              <Link
                href="/profile"
                className="text-f10 font-mono tracking-widest uppercase text-primary-light dark:text-primary-dark hover:opacity-70 transition-opacity whitespace-nowrap shrink-0 relative z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
              >
                Update →
              </Link>
            </div>
          </FadeUp>
        )}

        {/* ── Quick actions ── */}
        <FadeUp delay={0.1} className="pt-6">
          <SectionLabel>Quick Actions</SectionLabel>
          <QuickActions members={members} variant="card" />
        </FadeUp>

        <FadeUp delay={0.2} className="pt-6">
          <SectionLabel>Your Activity</SectionLabel>
          <div className="grid grid-cols-1 xs:grid-cols-3 gap-2">
            {/* Meetings */}
            <div className="border border-border-light dark:border-border-dark px-4 py-4 flex xs:flex-col gap-4 xs:gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-f10 font-mono tracking-[0.15em] uppercase text-muted-light dark:text-muted-dark mb-2 xs:mb-3">
                  Face-2-Faces
                </p>
                <p className="font-sora font-black text-[32px] xs:text-[36px] text-primary-light dark:text-primary-dark tabular-nums leading-none">
                  {stats.parleyThisWeek}
                </p>
                <p className="text-f10 font-mono text-muted-light dark:text-muted-dark mt-0.5">this week</p>
              </div>
              <div className="flex xs:mt-auto xs:pt-3 xs:border-t xs:border-border-light xs:dark:border-border-dark items-center justify-end shrink-0 xs:shrink xs:justify-end">
                <p className="text-f10 font-mono text-text-light dark:text-text-dark font-bold">
                  {stats.totalParleys} total
                </p>
              </div>
            </div>

            {/* Referrals */}
            <div className="border border-border-light dark:border-border-dark px-4 py-4 flex xs:flex-col gap-4 xs:gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-f10 font-mono tracking-[0.15em] uppercase text-muted-light dark:text-muted-dark mb-2 xs:mb-3">
                  Referrals
                </p>
                <p className="font-sora font-black text-[32px] xs:text-[36px] text-primary-light dark:text-primary-dark tabular-nums leading-none">
                  {stats.treasureMapsThisWeek}
                </p>
                <p className="text-f10 font-mono text-muted-light dark:text-muted-dark mt-0.5">this week</p>
              </div>
              <div className="flex xs:mt-auto xs:pt-3 xs:border-t xs:border-border-light xs:dark:border-border-dark items-center justify-end shrink-0 xs:shrink xs:justify-end">
                <p className="text-f10 font-mono text-text-light dark:text-text-dark font-bold">
                  {stats.totalTreasureMaps} total
                </p>
              </div>
            </div>

            {/* Closed */}
            <div className="border border-border-light dark:border-border-dark px-4 py-4 flex xs:flex-col gap-4 xs:gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-f10 font-mono tracking-[0.15em] uppercase text-muted-light dark:text-muted-dark mb-2 xs:mb-3">
                  Closed Business
                </p>
                <p className="font-sora font-black text-[32px] xs:text-[36px] text-primary-light dark:text-primary-dark tabular-nums leading-none">
                  {stats.anchorsThisWeek}
                </p>
                <p className="text-f10 font-mono text-muted-light dark:text-muted-dark mt-0.5">
                  {stats.closedAmountThisWeek} this week
                </p>
              </div>
              <div className="flex xs:mt-auto xs:pt-3 xs:border-t xs:border-border-light xs:dark:border-border-dark items-center justify-between space-x-2 xs:space-x-auto shrink-0 xs:shrink">
                <p className="text-f10 font-mono text-muted-light dark:text-muted-dark">{stats.totalClosedAmount}</p>
                <p className="text-f10 font-mono text-text-light dark:text-text-dark font-bold">
                  {stats.totalAnchors} total
                </p>
              </div>
            </div>
          </div>
        </FadeUp>

        {/* ── History ── */}
        <FadeUp delay={0.3} className="pt-6">
          <SectionLabel>History</SectionLabel>
          <HistoryTabs recentActivity={recentActivity} />
        </FadeUp>

        {/* ── Members ── */}
        <FadeUp delay={0.4} className="pt-6">
          <SectionLabel>Members</SectionLabel>
          <MemberList members={members} />
        </FadeUp>

        <FadeUp delay={0.5} className="pt-6">
          <PresenterSchedule schedule={schedule ?? []} className="pt-6" />
        </FadeUp>
      </main>
    </div>
  )
}
