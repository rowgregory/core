import { fmtSquareLabel } from '@/app/lib/utils/attendance.utils'
import { AttendanceSquare } from '@/types/attendance.types'
import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { useSounds } from '@/app/lib/hooks/useSounds'

export function YearHeatMap({ squares, setCorrectionRow }: { squares: AttendanceSquare[]; setCorrectionRow: any }) {
  // Group squares by month so we can label each month-row in the strip
  const grouped = useMemo(() => {
    const groups: { monthLabel: string; squares: AttendanceSquare[] }[] = []
    let current: { monthLabel: string; squares: AttendanceSquare[] } | null = null

    for (const sq of squares) {
      const d = new Date(`${sq.date}T12:00:00`)
      const label = d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
      if (!current || current.monthLabel !== label) {
        current = { monthLabel: label, squares: [] }
        groups.push(current)
      }
      current.squares.push(sq)
    }
    return groups
  }, [squares])

  // Tally totals to display alongside the map
  const totals = useMemo(() => {
    const counts = { attended: 0, reinstated: 0, missed: 0, excluded: 0, future: 0 }
    for (const sq of squares) counts[sq.status]++
    return counts
  }, [squares])

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3 mb-4">
        <p className="text-[9px] font-mono tracking-[0.18em] uppercase text-muted-light dark:text-muted-dark">
          Heat Map · 52 Thursdays
        </p>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] font-mono tracking-[0.12em] uppercase text-muted-light dark:text-muted-dark">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-green-500 dark:bg-green-400 shrink-0" aria-hidden="true" />
            Attended
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-amber-500 dark:bg-amber-400 shrink-0" aria-hidden="true" />
            Reinstated
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-red-500 dark:bg-red-400 shrink-0" aria-hidden="true" />
            Missed
          </span>
          <span className="flex items-center gap-1.5">
            <span
              className="w-2.5 h-2.5 border border-border-light dark:border-border-dark flex items-center justify-center shrink-0"
              aria-hidden="true"
            >
              <span className="w-0.5 h-0.5 bg-muted-light/60 dark:bg-muted-dark/60 rounded-full" />
            </span>
            Off
          </span>
        </div>
      </div>

      {/* Grouped strip with month axis */}
      <div className="flex flex-wrap gap-x-3 gap-y-3">
        {grouped.map((group) => (
          <div key={group.monthLabel} className="flex flex-col gap-1.5">
            <p className="text-[8px] font-mono tracking-[0.15em] uppercase text-muted-light dark:text-muted-dark">
              {group.monthLabel}
            </p>
            <div className="flex items-center gap-1">
              {group.squares.map((sq, i) => (
                <LargeHeatSquare key={`${sq.date}-${i}`} sq={sq} index={i} setCorrectionRow={setCorrectionRow} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Totals bar */}
      <div className="mt-5 pt-4 border-t border-border-light dark:border-border-dark grid grid-cols-2 sm:grid-cols-5 gap-3">
        <TotalCell color="green" label="Attended" count={totals.attended} />
        <TotalCell color="amber" label="Reinstated" count={totals.reinstated} />
        <TotalCell color="red" label="Missed" count={totals.missed} />
        <TotalCell color="muted" label="Off Weeks" count={totals.excluded} />
        <TotalCell color="muted" label="Upcoming" count={totals.future} />
      </div>
    </div>
  )
}

function LargeHeatSquare({
  sq,
  index,
  setCorrectionRow
}: {
  sq: AttendanceSquare
  index: number
  setCorrectionRow: any
}) {
  const label = fmtSquareLabel(sq)
  const { play } = useSounds({ enabled: true })

  const baseClasses =
    'w-4 h-4 sm:w-[18px] sm:h-[18px] shrink-0 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark'

  let stateClass = ''
  if (sq.status === 'attended') {
    stateClass = 'bg-green-500 dark:bg-green-400 hover:scale-110'
  } else if (sq.status === 'reinstated') {
    stateClass = 'bg-amber-500 dark:bg-amber-400 hover:scale-110'
  } else if (sq.status === 'missed') {
    stateClass = 'bg-red-500 dark:bg-red-400 hover:scale-110'
  } else if (sq.status === 'future') {
    stateClass = 'bg-muted-light/15 dark:bg-muted-dark/15'
  }

  const todayRing = sq.isToday
    ? 'ring-1 ring-primary-light dark:ring-primary-dark ring-offset-1 ring-offset-bg-light dark:ring-offset-bg-dark'
    : ''

  if (sq.status === 'excluded') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2, delay: Math.min(index * 0.01, 0.3) }}
        title={label}
        aria-label={label}
        className={`${baseClasses} ${todayRing} border border-border-light dark:border-border-dark flex items-center justify-center`}
      >
        <span className="w-1 h-1 rounded-full bg-muted-light/50 dark:bg-muted-dark/50" aria-hidden="true" />
      </motion.div>
    )
  }

  return (
    <motion.div
      onClick={() => {
        if (sq.status === 'missed') {
          play('se9')
          setCorrectionRow({ meetingId: sq.meetingId, date: sq.date })
        }
      }}
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2, delay: Math.min(index * 0.01, 0.3) }}
      title={label}
      aria-label={label}
      className={`${baseClasses} ${stateClass} ${todayRing}`}
    />
  )
}

function TotalCell({
  color,
  label,
  count
}: {
  color: 'green' | 'amber' | 'red' | 'muted'
  label: string
  count: number
}) {
  const dotColor =
    color === 'green'
      ? 'bg-green-500 dark:bg-green-400'
      : color === 'amber'
        ? 'bg-amber-500 dark:bg-amber-400'
        : color === 'red'
          ? 'bg-red-500 dark:bg-red-400'
          : 'bg-muted-light/40 dark:bg-muted-dark/40'

  const textColor =
    color === 'green'
      ? 'text-green-600 dark:text-green-400'
      : color === 'amber'
        ? 'text-amber-600 dark:text-amber-400'
        : color === 'red'
          ? 'text-red-600 dark:text-red-400'
          : 'text-muted-light dark:text-muted-dark'

  return (
    <div className="flex items-center gap-2.5">
      <span className={`w-2.5 h-2.5 shrink-0 ${dotColor}`} aria-hidden="true" />
      <div className="min-w-0">
        <p className={`font-sora font-black text-lg leading-none ${textColor}`}>{count}</p>
        <p className="text-[9px] font-mono tracking-[0.15em] uppercase text-muted-light dark:text-muted-dark mt-1">
          {label}
        </p>
      </div>
    </div>
  )
}
