'use client'

import { useState } from 'react'
import QuickActions from '../dashboard/QuickActions'
import Link from 'next/link'
import PresenterSchedule from '../PresentersSchedule'
import { ScheduledPresenter } from '@/types/presenter-queue'
import { MemberList } from '../dashboard/MemberList'
import { LinkedRecord } from '@/types/common'
import LinkedRecordModal from '../modals/LinkedRecordModal'
import { HistoryTabs } from '../dashboard/HistoryTabs'
import { GmailPrompt } from '../dashboard/GmailPrompt'
import MembershipSetup from '../dashboard/MembershipSetup'
import FadeUp from '../common/FadeUp'
import { SectionLabel } from '../common/SectionLabel'
import { Greeting } from '../dashboard/Greeting'
import { GmailConfirmation } from '../dashboard/GmailConfirmation'
import { ActivityStats } from '../dashboard/ActivityStats'

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
    id?: string
    name: string
    initials: string
    email: string
    secondaryEmail?: string
    hasAnnualSubscription?: boolean
    hasQuarterlySubscription?: boolean
  }
  members: any
  stats: DashboardStats
  recentActivity: ActivityItem[]
  schedule: ScheduledPresenter[]
  linkedRecord: LinkedRecord
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
  const [open, setOpen] = useState(linkedRecord ? true : false)

  return (
    <div className="min-h-screen bg-bg-light dark:bg-bg-dark">
      <LinkedRecordModal record={linkedRecord} setOpen={setOpen} open={open} />
      <main className="max-w-170 mx-auto px-4 pb-12">
        {/* ── Greeting ── */}
        <FadeUp className="pt-7 pb-5">
          <Greeting currentUser={currentUser} />
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
            <GmailConfirmation />
          </FadeUp>
        )}

        {/* ── Quick actions ── */}
        <FadeUp delay={0.1} className="pt-6">
          <SectionLabel>Quick Actions</SectionLabel>
          <QuickActions members={members} variant="card" />
        </FadeUp>

        {/* Activity Stats */}
        <FadeUp delay={0.2} className="pt-6">
          <SectionLabel>Your Activity</SectionLabel>
          <ActivityStats stats={stats} />
        </FadeUp>

        {/* ── Membership setup ── */}
        <FadeUp delay={0.3} className="pt-6">
          <MembershipSetup
            hasAnnual={currentUser.hasAnnualSubscription}
            hasQuarterly={currentUser.hasQuarterlySubscription}
          />
        </FadeUp>

        {/* ── Onboarding preview ── */}
        <FadeUp delay={0.4} className="pt-6">
          <div className="border border-border-light dark:border-border-dark px-4 py-4 flex items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="text-f10 font-mono tracking-[0.15em] uppercase text-primary-light dark:text-primary-dark mb-0.5">
                Coming Soon
              </p>
              <p className="text-[13px] font-sora font-bold text-text-light dark:text-text-dark leading-tight">
                New Member Setup — Preview
              </p>
              <p className="text-[12px] font-nunito text-muted-light dark:text-muted-dark mt-0.5">
                See what the new member payment flow will look like once online payments go live.
              </p>
            </div>
            <Link
              href="/onboarding"
              className="shrink-0 h-9 px-4 border border-border-light dark:border-border-dark text-muted-light dark:text-muted-dark hover:text-primary-light dark:hover:text-primary-dark hover:border-primary-light dark:hover:border-primary-dark transition-colors text-f10 font-mono tracking-widest uppercase focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark inline-flex items-center"
            >
              Preview →
            </Link>
          </div>
        </FadeUp>

        {/* ── History ── */}
        <FadeUp delay={0.5} className="pt-6">
          <SectionLabel>History</SectionLabel>
          <HistoryTabs recentActivity={recentActivity} />
        </FadeUp>

        {/* ── Members ── */}
        <FadeUp delay={0.6} className="pt-6">
          <SectionLabel>Members</SectionLabel>
          <MemberList members={members} />
        </FadeUp>

        {/* Presenter Schedle */}
        <FadeUp delay={0.7} className="pt-6">
          <PresenterSchedule schedule={schedule ?? []} className="pt-6" />
        </FadeUp>
      </main>
    </div>
  )
}
