import { cancelMeeting } from '@/app/lib/actions/cancelled-meeting/cancel-meeting'
import { restoreMeeting } from '@/app/lib/actions/cancelled-meeting/restoreMeeting'
import { fmtDate } from '@/app/lib/utils/date.utils'
import { getUpcomingMeetingDates } from '@/app/lib/utils/presenter-engine'
import { toDateKey } from '@/app/lib/utils/time.utils'
import { CancelledMeeting } from '@/types/cancelled-meeting'
import { AnimatePresence, motion } from 'framer-motion'
import { CalendarX, Plus, RotateCcw } from 'lucide-react'
import { useState } from 'react'

export function CancelledMeetingsPanel({ cancelledMeetings: initial }: { cancelledMeetings: CancelledMeeting[] }) {
  const [cancelled, setCancelled] = useState(initial)
  const [showAdd, setShowAdd] = useState(false)
  const [selectedDate, setSelectedDate] = useState('')
  const [reason, setReason] = useState('')
  const [loadingId, setLoadingId] = useState<string | null>(null)

  // Generate next 20 upcoming Thursdays for the picker
  const upcomingDates = getUpcomingMeetingDates([], [], 20) // all thursdays, no skips for picker

  async function handleCancel() {
    if (!selectedDate) return

    const res = await cancelMeeting({ date: selectedDate, reason })
    if (res.success) {
      // optimistic — real id will come on next fetch but good enough
      setCancelled((prev) =>
        [
          ...prev,
          { id: 'optimistic-' + selectedDate, date: new Date(selectedDate).toISOString(), reason: reason || null }
        ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      )
      setSelectedDate('')
      setReason('')
      setShowAdd(false)
    }
  }

  async function handleRestore(id: string) {
    setLoadingId(id)

    const res = await restoreMeeting(id)
    if (res.success) setCancelled((prev) => prev.filter((c) => c.id !== id))
    setLoadingId(null)
  }

  const cancelledSet = new Set(
    cancelled?.map((c) => {
      const d = new Date(c.date)
      return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
    })
  )

  const availableDates = upcomingDates.filter((d) => {
    const key = toDateKey(new Date(d))
    return !cancelledSet.has(key)
  })

  return (
    <div className="border border-border-light dark:border-border-dark">
      {/* ── Header ── */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border-light dark:border-border-dark">
        <div className="flex items-center gap-3">
          <span className="block w-5 h-px bg-primary-light dark:bg-primary-dark shrink-0" aria-hidden="true" />
          <p className="text-f10 font-mono tracking-[0.2em] uppercase text-primary-light dark:text-primary-dark">
            Cancelled Meetings
          </p>
        </div>
        <button
          onClick={() => setShowAdd((v) => !v)}
          className="flex items-center gap-1.5 h-7 px-3 border border-border-light dark:border-border-dark text-muted-light dark:text-muted-dark hover:text-text-light dark:hover:text-text-dark hover:border-primary-light dark:hover:border-primary-dark transition-colors text-f10 font-mono tracking-widest uppercase focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
        >
          <Plus size={11} aria-hidden="true" />
          Cancel Meeting
        </button>
      </div>

      {/* ── Add form ── */}
      <AnimatePresence>
        {showAdd && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-b border-border-light dark:border-border-dark"
          >
            <div className="px-4 py-4 bg-surface-light dark:bg-surface-dark flex flex-col gap-3">
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="cancel-date"
                  className="text-f10 font-mono tracking-[0.18em] uppercase text-muted-light dark:text-muted-dark"
                >
                  Select Thursday
                </label>
                <div className="relative">
                  <select
                    id="cancel-date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full h-11 bg-white dark:bg-bg-dark border border-slate-300 dark:border-border-dark px-3.5 font-nunito text-[14px] text-text-light dark:text-text-dark focus:outline-none focus:border-primary-light dark:focus:border-primary-dark transition-colors rounded-none appearance-none cursor-pointer"
                  >
                    <option value="" disabled>
                      Select a date…
                    </option>
                    {availableDates.map((d) => (
                      <option key={d} value={d}>
                        {new Date(d).toLocaleDateString('en-US', {
                          weekday: 'long',
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric',
                          timeZone: 'America/New_York'
                        })}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="cancel-reason"
                  className="text-f10 font-mono tracking-[0.18em] uppercase text-muted-light dark:text-muted-dark"
                >
                  Reason <span className="text-f9 normal-case tracking-normal opacity-60">optional</span>
                </label>
                <input
                  id="cancel-reason"
                  type="text"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g. Snow day, Holiday, Venue unavailable"
                  className="w-full h-11 bg-white dark:bg-bg-dark border border-slate-300 dark:border-border-dark px-3.5 font-nunito text-[14px] text-text-light dark:text-text-dark placeholder:text-slate-400 dark:placeholder:text-muted-dark/50 focus:outline-none focus:border-primary-light dark:focus:border-primary-dark transition-colors rounded-none"
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setShowAdd(false)
                    setSelectedDate('')
                    setReason('')
                  }}
                  className="h-10 px-4 border border-slate-300 dark:border-border-dark text-muted-light dark:text-muted-dark font-nunito text-sm hover:bg-bg-light dark:hover:bg-bg-dark transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCancel}
                  disabled={!selectedDate}
                  className="flex-1 h-10 bg-red-500 dark:bg-red-600 text-white font-sora font-bold text-sm hover:opacity-90 active:opacity-80 transition-opacity disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                >
                  Cancel This Meeting
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── List ── */}
      <div className="divide-y divide-border-light dark:divide-border-dark max-h-105 overflow-y-auto">
        {cancelled.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-2 px-4 py-8 text-center">
            <CalendarX size={20} className="text-muted-light dark:text-muted-dark" aria-hidden="true" />
            <p className="text-[12.5px] font-nunito text-muted-light dark:text-muted-dark">
              No cancelled meetings — all Thursdays are active.
            </p>
          </div>
        )}
        {cancelled.map((c, i) => (
          <motion.div
            key={c.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, delay: i * 0.03 }}
            className="flex items-center gap-3 px-4 py-3 hover:bg-surface-light dark:hover:bg-surface-dark transition-colors"
          >
            {/* red dot */}
            <span className="w-2 h-2 rounded-full bg-red-500 dark:bg-red-400 shrink-0" aria-hidden="true" />

            {/* date + reason */}
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-sora font-bold text-text-light dark:text-text-dark">{fmtDate(c.date)}</p>
              {c.reason && (
                <p className="text-[11.5px] font-nunito text-muted-light dark:text-muted-dark truncate">{c.reason}</p>
              )}
            </div>

            {/* restore */}
            <button
              onClick={() => handleRestore(c.id)}
              disabled={loadingId === c.id}
              className="flex items-center gap-1.5 h-7 px-2.5 border border-border-light dark:border-border-dark text-muted-light dark:text-muted-dark hover:text-emerald-600 dark:hover:text-emerald-400 hover:border-emerald-400 dark:hover:border-emerald-400 transition-colors text-f10 font-mono tracking-widest uppercase disabled:opacity-40 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
              aria-label="Restore this meeting"
            >
              <RotateCcw size={11} aria-hidden="true" />
              Restore
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
