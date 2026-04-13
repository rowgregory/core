'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Users, Activity, DollarSign, Clock, FileText, LayoutDashboard } from 'lucide-react'
import { AdminDashboardData } from '@/app/lib/actions/getAdminDashboardData'
import FadeUp from '../common/FadeUp'
import { timeAgo } from '@/app/lib/utils/time.utils'
import Link from 'next/link'

const DOT_COLOR = {
  MEETING: '#38bdf8',
  REFERRAL: '#22d3ee',
  CLOSED: '#34d399'
} as const

// ─── Stat tile ─────────────────────────────────────────────────────────────────
function StatTile({
  value,
  label,
  icon: Icon,
  delay
}: {
  value: string | number
  label: string
  icon: React.ElementType
  delay: number
}) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-16px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 12 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="flex flex-col gap-1 px-3 py-3 border-r border-b border-border-light dark:border-border-dark nth-[3n]:border-r-0"
    >
      <Icon size={13} className="text-primary-light dark:text-primary-dark" aria-hidden="true" />
      <p className="font-sora font-black text-[18px] xs:text-xl text-primary-light dark:text-primary-dark tabular-nums leading-none">
        {value}
      </p>
      <p className="text-f9 font-mono tracking-[0.12em] uppercase text-muted-light dark:text-muted-dark">{label}</p>
    </motion.div>
  )
}

// ─── Section label ─────────────────────────────────────────────────────────────
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <span className="block w-5 h-px bg-primary-light dark:bg-primary-dark shrink-0" aria-hidden="true" />
      <p className="text-f10 font-mono tracking-[0.2em] uppercase text-primary-light dark:text-primary-dark">
        {children}
      </p>
    </div>
  )
}

// ─── Main ──────────────────────────────────────────────────────────────────────
export default function AdminDashClient({ data }: { data: AdminDashboardData }) {
  const { stats, recentActivity } = data

  return (
    <div className="min-h-screen bg-bg-light dark:bg-bg-dark">
      <main className="max-w-170 mx-auto px-4 pb-12">
        {/* ── Header ── */}
        <FadeUp className="pt-7 pb-5 border-b border-border-light dark:border-border-dark mb-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-f10 font-mono tracking-[0.2em] uppercase text-primary-light dark:text-primary-dark mb-1">
                Admin
              </p>
              <h1 className="font-sora font-black text-[22px] xs:text-[28px] text-text-light dark:text-text-dark tracking-tight leading-none">
                Chapter Overview
              </h1>
            </div>
            <Link
              href="/dashboard"
              className="shrink-0 flex items-center gap-1.5 h-8 px-3 border border-border-light dark:border-border-dark text-muted-light dark:text-muted-dark hover:text-primary-light dark:hover:text-primary-dark hover:border-primary-light dark:hover:border-primary-dark transition-colors text-f10 font-mono tracking-widest uppercase focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
            >
              <LayoutDashboard size={12} aria-hidden="true" />
              <span className="hidden xs:inline">Dashboard</span>
            </Link>
          </div>
        </FadeUp>

        {/* ── Stats ── */}
        <FadeUp delay={0.05} className="mb-6">
          <div className="grid grid-cols-3 border-t border-l border-border-light dark:border-border-dark">
            <StatTile value={stats.totalRevenue} label="Revenue" icon={DollarSign} delay={0.06} />
            <StatTile value={stats.totalParleys} label="Meetings" icon={Users} delay={0.09} />
            <StatTile value={stats.totalReferrals} label="Referrals" icon={Activity} delay={0.12} />
            <StatTile value={stats.totalAnchors} label="Closed" icon={Clock} delay={0.15} />
            <StatTile value={stats.activeMembers} label="Members" icon={Users} delay={0.18} />
            <StatTile value={stats.pendingApps} label="Pending" icon={FileText} delay={0.21} />
          </div>
        </FadeUp>

        {/* ── Recent activity ── */}
        <FadeUp delay={0.25}>
          <SectionLabel>Recent Activity</SectionLabel>
          <ul className="border border-border-light dark:border-border-dark divide-y divide-border-light dark:divide-border-dark max-h-100 overflow-y-auto">
            {recentActivity.length === 0 && (
              <li className="px-4 py-6 text-center text-[12.5px] font-nunito text-muted-light dark:text-muted-dark">
                No activity yet
              </li>
            )}
            {recentActivity.map((item, i) => {
              return (
                <motion.li
                  key={item.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.27 + i * 0.04, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="flex items-center gap-3 px-4 py-3.5 bg-bg-light dark:bg-bg-dark hover:bg-surface-light dark:hover:bg-surface-dark transition-colors"
                >
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: DOT_COLOR[item.type] }}
                    aria-hidden="true"
                  />
                  <span className="flex-1 min-w-0 text-[13px] font-nunito font-medium text-text-light dark:text-text-dark truncate">
                    {item.label}
                  </span>
                  <span className="text-f10 font-mono text-muted-light dark:text-muted-dark whitespace-nowrap shrink-0">
                    {timeAgo(item.createdAt)}
                  </span>
                </motion.li>
              )
            })}
          </ul>
        </FadeUp>
      </main>
    </div>
  )
}
