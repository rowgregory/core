'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { AttendanceMember, AttendanceRow } from '@/app/lib/actions/attendance/getAttendanceHistory'
import { MeetingRow } from '@/app/components/super-dash/MeetingRow'

interface AttendanceHistoryClientProps {
  members: AttendanceMember[]
  rows: AttendanceRow[]
}

export default function AttendanceHistoryClient({ members, rows }: AttendanceHistoryClientProps) {
  return (
    <div className="min-h-screen bg-bg-light dark:bg-bg-dark">
      <div className="max-w-480 mx-auto px-5 sm:px-8 pb-16">
        {/* ── Header ── */}
        <div className="pt-8 pb-6 border-b border-border-light dark:border-border-dark">
          <Link
            href="/super"
            className="inline-flex items-center gap-2 text-f10 font-mono tracking-widest uppercase text-muted-light dark:text-muted-dark hover:text-primary-light dark:hover:text-primary-dark transition-colors mb-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
          >
            <ArrowLeft size={11} />
            Back
          </Link>
          <div className="flex items-center gap-3">
            <span className="block w-5 h-px bg-primary-light dark:bg-primary-dark shrink-0" aria-hidden="true" />
            <p className="text-f10 font-mono tracking-[0.2em] uppercase text-primary-light dark:text-primary-dark">
              Super Dashboard
            </p>
          </div>
          <h1 className="font-sora font-black text-3xl text-text-light dark:text-text-dark tracking-tight mt-2">
            Attendance History
          </h1>
          <p className="font-nunito text-sm text-muted-light dark:text-muted-dark mt-1">
            {rows.length} {rows.length === 1 ? 'meeting' : 'meetings'} recorded · {members.length} active members
          </p>
        </div>

        {/* ── Member legend ── */}
        <div className="py-4 border-b border-border-light dark:border-border-dark">
          <div className="flex flex-wrap gap-2">
            {members.map((m) => (
              <div key={m.id} className="flex items-center gap-1.5">
                <span className="text-f10 font-mono text-muted-light dark:text-muted-dark">{m.name.split(' ')[0]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Attendance rows ── */}
        {rows.length === 0 ? (
          <div className="py-16 text-center">
            <p className="font-nunito text-sm text-muted-light dark:text-muted-dark">
              No meetings recorded yet. First check-in will appear here.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border-light dark:divide-border-dark">
            {rows.map((row, i) => (
              <MeetingRow key={i} members={members} index={i} row={row} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
