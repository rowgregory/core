'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus, Users } from 'lucide-react'
import { getUpcomingMeetingDates } from '@/app/lib/utils/presenter-engine'
import { fmtDate } from '@/app/lib/utils/date.utils'
import { useRouter } from 'next/navigation'
import { addVisitorDay } from '@/app/lib/actions/visitor-day/addVisitorDay'
import { removeVisitorDay } from '@/app/lib/actions/visitor-day/removeVisitorDay'

type TVisitorDaysPanel = {
  visitorDays: { id: string; date: string }[]
  cancelledDates: string[]
}

export default function VisitorDaysPanel({ visitorDays: initial, cancelledDates }: TVisitorDaysPanel) {
  const [visitorDays, setVisitorDays] = useState(initial)
  const [showAdd, setShowAdd] = useState(false)
  const [selectedDate, setSelectedDate] = useState('')
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    setVisitorDays(initial)
  }, [initial])

  // Upcoming Thursdays not already cancelled or marked as visitor day
  const visitorSet = new Set(
    visitorDays.map((v) => {
      const d = new Date(v.date)
      return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
    })
  )

  const upcomingDates = getUpcomingMeetingDates(cancelledDates, [], 20)
  const availableDates = upcomingDates.filter((d) => {
    const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
    return !visitorSet.has(key)
  })

  async function handleAdd() {
    if (!selectedDate) return

    const res = await addVisitorDay(selectedDate)
    if (res.success) {
      router.refresh()
      setSelectedDate('')
      setShowAdd(false)
    }
  }

  async function handleRemove(id: string) {
    setLoadingId(id)

    const res = await removeVisitorDay(id)
    if (res.success) {
      router.refresh()
    }
    setLoadingId(null)
  }

  return (
    <div className="border border-border-light dark:border-border-dark">
      {/* ── Header ── */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border-light dark:border-border-dark">
        <div className="flex items-center gap-3">
          <span className="block w-5 h-px bg-primary-light dark:bg-primary-dark shrink-0" aria-hidden="true" />
          <p className="text-f10 font-mono tracking-[0.2em] uppercase text-primary-light dark:text-primary-dark">
            Visitor Days
          </p>
        </div>
        <button
          onClick={() => setShowAdd((v) => !v)}
          className="flex items-center gap-1.5 h-7 px-3 border border-border-light dark:border-border-dark text-muted-light dark:text-muted-dark hover:text-text-light dark:hover:text-text-dark hover:border-primary-light dark:hover:border-primary-dark transition-colors text-f10 font-mono tracking-widest uppercase focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
        >
          <Plus size={11} aria-hidden="true" />
          Add
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
                  htmlFor="visitor-date"
                  className="text-f10 font-mono tracking-[0.18em] uppercase text-muted-light dark:text-muted-dark"
                >
                  Select Thursday
                </label>
                <div className="relative">
                  <select
                    id="visitor-date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full h-11 bg-white dark:bg-bg-dark border border-slate-300 dark:border-border-dark px-3.5 font-nunito text-[14px] text-text-light dark:text-text-dark focus:outline-none focus:border-primary-light dark:focus:border-primary-dark transition-colors rounded-none appearance-none cursor-pointer"
                  >
                    <option value="" disabled>
                      Select a date…
                    </option>
                    {availableDates.map((d) => (
                      <option key={d.toISOString()} value={d.toISOString()}>
                        {d.toLocaleDateString('en-US', {
                          weekday: 'long',
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setShowAdd(false)
                    setSelectedDate('')
                  }}
                  className="h-10 px-4 border border-slate-300 dark:border-border-dark text-muted-light dark:text-muted-dark font-nunito text-sm hover:bg-bg-light dark:hover:bg-bg-dark transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAdd}
                  disabled={!selectedDate}
                  className="flex-1 h-10 bg-amber-500 dark:bg-amber-600 text-white font-sora font-bold text-sm hover:opacity-90 active:opacity-80 transition-opacity disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2"
                >
                  Mark as Visitor Day
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── List ── */}
      <div className="divide-y divide-border-light dark:divide-border-dark max-h-105 overflow-y-auto">
        {visitorDays.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-2 px-4 py-8 text-center">
            <Users size={20} className="text-muted-light dark:text-muted-dark" aria-hidden="true" />
            <p className="text-[12.5px] font-nunito text-muted-light dark:text-muted-dark">
              No visitor days scheduled.
            </p>
          </div>
        )}
        {visitorDays.map((v, i) => (
          <motion.div
            key={v.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, delay: i * 0.03 }}
            className="flex items-center gap-3 px-4 py-3 hover:bg-surface-light dark:hover:bg-surface-dark transition-colors"
          >
            {/* amber dot */}
            <span className="w-2 h-2 rounded-full bg-amber-500 dark:bg-amber-400 shrink-0" aria-hidden="true" />

            {/* date */}
            <p className="flex-1 text-[13px] font-sora font-bold text-text-light dark:text-text-dark">
              {fmtDate(v.date)}
            </p>

            {/* remove */}
            <button
              onClick={() => handleRemove(v.id)}
              disabled={loadingId === v.id}
              className="w-6 h-6 flex items-center justify-center text-muted-light dark:text-muted-dark hover:text-red-500 dark:hover:text-red-400 disabled:opacity-40 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
              aria-label="Remove visitor day"
            >
              <X size={12} />
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
