'use client'

import Spline from '@splinetool/react-spline'

import { useState } from 'react'
import { Moon, Sun } from 'lucide-react'

interface VisitorDayTVProps {
  date: string
  presenterName?: string | null
  presenterCompany?: string | null
  presenterBio?: string | null
  stats?: {
    totalRevenue: number
    totalParleys: number
    totalReferrals: number
  } | null
}

const SCHEDULE = [
  { time: '7:00 AM', label: 'Arrive', note: 'Grab food, grab a seat.' },
  { time: '7:00–7:15', label: 'Open Networking', note: 'Mingle before the meeting starts.' },
  {
    time: '7:15 AM',
    label: 'Meeting Starts',
    note: `Brendan opens up. Leadership introductions, Guiding Light's memorable moment, Education Moment from Page.`
  },
  {
    time: 'Commercials',
    label: '60-Second Commercials',
    note: `Members intro themselves. Visitors go after — you'll have a moment to introduce yourself.`
  },
  { time: 'Feature', label: 'Feature Presentation', note: 'Our keynote speaker takes the floor.' },
  {
    time: 'Events',
    label: 'Member Announcements',
    note: 'Members share upcoming events from other groups they belong to.'
  },
  {
    time: 'Round Up',
    label: 'Group Round-Up',
    note: 'We share recent referrals, face-to-face meetings, and closed business thank-yous.'
  }
]

function formatCurrency(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`
  return `$${n}`
}

export default function VisitorDayTV({
  date = 'Thursday, May 7th',
  presenterName,
  presenterCompany,
  presenterBio,
  stats
}: VisitorDayTVProps) {
  const [dark, setDark] = useState(true)

  const t = {
    bg: dark ? 'bg-bg-dark' : 'bg-bg-light',
    surface: dark ? 'bg-surface-dark' : 'bg-surface-light',
    border: dark ? 'border-border-dark' : 'border-border-light',
    divide: dark ? 'divide-border-dark' : 'divide-border-light',
    text: dark ? 'text-text-dark' : 'text-text-light',
    muted: dark ? 'text-muted-dark' : 'text-muted-light',
    primary: dark ? 'text-primary-dark' : 'text-primary-light',
    primaryBg: dark ? 'bg-primary-dark/10' : 'bg-primary-light/10',
    primaryBorder: dark ? 'border-primary-dark/40' : 'border-primary-light/40'
  }

  return (
    <div
      className={`h-screen w-screen overflow-hidden ${t.bg} ${t.text} flex flex-col transition-colors duration-300 relative overflow-hidden`}
    >
      {/* Globe — behind everything */}
      <div className="absolute right-[-15%] top-1/2 -translate-y-1/2 z-0 pointer-events-none w-[1000px] h-[1000px]">
        {/* Left fade overlay */}
        <div
          className={`absolute inset-0 z-1 pointer-events-none bg-linear-to-r ${
            dark ? 'from-bg-dark via-bg-dark/70 to-transparent' : 'from-bg-light via-bg-light/80 to-transparent'
          }`}
        />
        <Spline
          scene="https://prod.spline.design/nSlEQFeacYQgy4hm/scene.splinecode"
          style={{ background: 'transparent' }}
        />
      </div>
      {/* ── Top bar ── */}
      <div className={`flex items-center justify-between px-10 py-4 border-b ${t.border} shrink-0 relative z-10`}>
        <div className="flex items-center gap-4">
          <span
            className={`block w-6 h-px ${dark ? 'bg-primary-dark' : 'bg-primary-light'} shrink-0`}
            aria-hidden="true"
          />
          <p className={`text-f10 font-mono tracking-[0.25em] uppercase ${t.primary}`}>Coastal Referral Exchange</p>
        </div>
        <div className="flex items-center gap-6">
          <p className={`text-f10 font-mono tracking-[0.25em] uppercase ${t.muted}`}>25 N Common St · Lynn, MA 01902</p>
          <button
            onClick={() => setDark((d) => !d)}
            aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
            className={`w-7 h-7 flex items-center justify-center border ${t.border} ${t.muted} hover:${t.primary} transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-${dark ? 'dark' : 'light'}`}
          >
            {dark ? <Sun size={13} /> : <Moon size={13} />}
          </button>
        </div>
      </div>

      {/* ── Main content ── */}
      <div className="flex flex-1 min-h-0 relative z-10">
        {/* ── Left column ── */}
        <div className={`flex flex-col justify-between px-10 py-8 flex-1 border-r ${t.border}`}>
          {/* Title */}
          <div>
            <h1 className={`font-sora font-black text-6xl ${t.text} leading-[1] tracking-tight mb-1`}>Visitor Day</h1>
            <p className={`font-sora font-semibold text-2xl ${t.primary} mb-6`}>{date}</p>
            <p className={`font-nunito text-base ${t.muted} leading-relaxed max-w-sm`}>
              A local business networking group on Boston's North Shore. One seat per industry.
            </p>
          </div>

          {/* Stats */}
          {stats && (
            <div className="flex items-end gap-10">
              {[
                { value: formatCurrency(stats.totalRevenue), label: 'Closed Business' },
                { value: stats.totalParleys, label: 'Meetings' },
                { value: stats.totalReferrals, label: 'Referrals' }
              ].map(({ value, label }) => (
                <div key={label}>
                  <p className={`font-sora font-black text-5xl ${t.text} leading-none`}>{value}</p>
                  <p className={`text-f10 font-mono tracking-widest uppercase ${t.muted} mt-1.5`}>{label}</p>
                </div>
              ))}
            </div>
          )}

          {/* Food note */}
          <p className={`text-f10 font-mono tracking-widest uppercase ${t.muted}`}>
            ✦ Food & refreshments provided · 7:00 AM – 8:30 AM
          </p>
        </div>

        {/* ── Right column ── */}
        <div className="flex flex-col px-10 py-8 w-[380px] shrink-0">
          {/* Schedule */}
          <div className="flex items-center gap-3 mb-4">
            <span
              className={`block w-4 h-px ${dark ? 'bg-primary-dark' : 'bg-primary-light'} shrink-0`}
              aria-hidden="true"
            />
            <p className={`text-f10 font-mono tracking-[0.2em] uppercase ${t.primary}`}>Today's Schedule</p>
          </div>

          <div className={`flex-1 divide-y ${t.divide}`}>
            {SCHEDULE.map(({ time, label }) => (
              <div key={label} className="flex items-center gap-4 py-2.5">
                <p className={`text-f10 font-mono tracking-wide ${t.primary} w-16 shrink-0`}>{time}</p>
                <p className={`font-sora font-semibold text-sm ${t.text} leading-tight`}>{label}</p>
              </div>
            ))}
          </div>

          {/* Presenter */}
          {presenterName && (
            <div className={`border ${t.primaryBorder} mt-6`}>
              <div className={`px-4 py-2 border-b ${t.primaryBorder} ${t.primaryBg}`}>
                <p className={`text-f10 font-mono tracking-[0.2em] uppercase ${t.primary}`}>Feature Presentation</p>
              </div>
              <div className="px-4 py-3">
                <p className={`font-sora font-black text-xl ${t.text} leading-tight`}>{presenterName}</p>
                {presenterCompany && (
                  <p className={`font-sora font-semibold text-sm ${t.primary} mt-0.5`}>{presenterCompany}</p>
                )}
                {presenterBio && (
                  <p className={`font-nunito text-xs ${t.muted} leading-relaxed mt-2`}>{presenterBio}</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
