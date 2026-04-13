'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronUp, ChevronDown, X, Plus, ArrowLeftRight } from 'lucide-react'
import { fmtDate } from '@/app/lib/utils/date.utils'
import { useRouter } from 'next/navigation'
import { QueueMember } from '@/types/presenter-queue'
import { moveQueueMember } from '@/app/lib/actions/presenter-queue/moveQueueMember'
import { removeFromQueue } from '@/app/lib/actions/presenter-queue/removeFromQueue'
import { swapQueuePositions } from '@/app/lib/actions/presenter-queue/swapQueuePositions'
import { addToQueue } from '@/app/lib/actions/presenter-queue/addToQueue'

// ─── Types ─────────────────────────────────────────────────────────────────────
interface Props {
  initialQueue: QueueMember[]
  availableMembers: { id: string; name: string; company: string }[]
  cancelledDates: string[]
  dates: any
}

// ─── Helpers ───────────────────────────────────────────────────────────────────
function initials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

// ─── Main ──────────────────────────────────────────────────────────────────────
export default function PresenterQueueManager({ initialQueue, availableMembers, cancelledDates, dates }: Props) {
  const [queue, setQueue] = useState([...initialQueue].sort((a, b) => a.position - b.position))
  const [available, setAvailable] = useState(availableMembers)
  const [swapA, setSwapA] = useState<string | null>(null)
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [showAdd, setShowAdd] = useState(false)
  const router = useRouter()

  // Compute upcoming Thursdays skipping cancelled dates

  function getDateForIndex(i: number) {
    return dates[i] ? fmtDate(dates[i]) : '—'
  }

  // ── Move up/down ──────────────────────────────────────────────────────────────
  async function move(id: string, direction: 'up' | 'down') {
    setLoadingId(id)

    const res = await moveQueueMember(id, direction)
    if (res.success) {
      router.refresh()
    }
    setLoadingId(null)
  }

  // ── Remove ────────────────────────────────────────────────────────────────────
  async function remove(id: string) {
    setLoadingId(id)

    const res = await removeFromQueue(id)
    if (res.success) {
      router.refresh()
    }
    setLoadingId(null)
  }

  // ── Swap ──────────────────────────────────────────────────────────────────────
  async function handleSwap(id: string) {
    if (!swapA) {
      setSwapA(id)
      return
    }
    if (swapA === id) {
      setSwapA(null)
      return
    }

    const idA = swapA
    setSwapA(null)
    setLoadingId(id)

    const res = await swapQueuePositions(idA, id)
    if (res.success) {
      router.refresh()
    }
    setLoadingId(null)
  }

  // ── Add ───────────────────────────────────────────────────────────────────────
  async function add(memberId: string, name: string, company: string) {
    const res = await addToQueue(memberId)
    if (res.success) {
      router.refresh()
    }
    setShowAdd(false)
  }

  return (
    <div className="border border-border-light dark:border-border-dark">
      {/* ── Header ── */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border-light dark:border-border-dark">
        <div className="flex items-center gap-3">
          <span className="block w-5 h-px bg-primary-light dark:bg-primary-dark shrink-0" aria-hidden="true" />
          <p className="text-f10 font-mono tracking-[0.2em] uppercase text-primary-light dark:text-primary-dark">
            Presenter Queue
          </p>
        </div>
        <div className="flex items-center gap-2">
          {swapA && (
            <span className="text-f10 font-mono tracking-[0.08em] text-amber-500 dark:text-amber-400">
              Select who to swap with
            </span>
          )}
          <button
            onClick={() => setShowAdd((v) => !v)}
            className="flex items-center gap-1.5 h-7 px-3 border border-border-light dark:border-border-dark text-muted-light dark:text-muted-dark hover:text-text-light dark:hover:text-text-dark hover:border-primary-light dark:hover:border-primary-dark transition-colors text-f10 font-mono tracking-widest uppercase focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
          >
            <Plus size={11} aria-hidden="true" />
            Add
          </button>
        </div>
      </div>

      {/* ── Add member dropdown ── */}
      <AnimatePresence>
        {showAdd && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-b border-border-light dark:border-border-dark"
          >
            <div className="px-4 py-3 bg-surface-light dark:bg-surface-dark">
              <p className="text-f10 font-mono tracking-[0.15em] uppercase text-muted-light dark:text-muted-dark mb-2">
                Add to end of queue
              </p>
              {available.length === 0 ? (
                <p className="text-[12.5px] font-nunito text-muted-light dark:text-muted-dark py-1">
                  All active members are already in the queue.
                </p>
              ) : (
                <div className="flex flex-col divide-y divide-border-light dark:divide-border-dark max-h-48 overflow-y-auto border border-border-light dark:border-border-dark">
                  {available.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => add(m.id, m.name, m.company)}
                      className="flex items-center justify-between px-3 py-2.5 text-left bg-bg-light dark:bg-bg-dark hover:bg-primary-light/5 dark:hover:bg-primary-dark/5 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
                    >
                      <span className="text-[13px] font-sora font-bold text-text-light dark:text-text-dark">
                        {m.name}
                      </span>
                      <span className="text-f10 font-mono text-muted-light dark:text-muted-dark">{m.company}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Queue list ── */}
      <div className="divide-y divide-border-light dark:divide-border-dark max-h-130 overflow-y-auto">
        {queue.length === 0 && (
          <p className="px-4 py-6 text-sm font-nunito text-muted-light dark:text-muted-dark text-center">
            No members in queue — initialize or add members above.
          </p>
        )}

        {queue.map((m, i) => {
          const isSwapSelected = swapA === m.id
          const isLoading = loadingId === m.id

          return (
            <motion.div
              key={m.id}
              layout
              transition={{ duration: 0.18 }}
              className={`flex items-center gap-3 px-4 py-3 transition-colors ${
                isSwapSelected
                  ? 'bg-amber-50 dark:bg-amber-400/8 border-l-2 border-amber-400'
                  : 'bg-bg-light dark:bg-bg-dark hover:bg-surface-light dark:hover:bg-surface-dark'
              }`}
            >
              {/* position number */}
              <span className="w-5 text-center font-mono text-[11px] text-muted-light dark:text-muted-dark shrink-0">
                {i + 1}
              </span>

              {/* avatar */}
              <div className="w-7 h-7 shrink-0 flex items-center justify-center bg-primary-light/10 dark:bg-primary-dark/10 border border-primary-light/20 dark:border-primary-dark/20 text-f10 font-mono font-bold text-primary-light dark:text-primary-dark">
                {initials(m.name)}
              </div>

              {/* name + company */}
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-sora font-bold text-text-light dark:text-text-dark truncate">{m.name}</p>
                <p className="text-f10 font-mono text-muted-light dark:text-muted-dark truncate">{m.company}</p>
              </div>

              {/* scheduled date */}
              <span className="text-[11px] font-mono text-muted-light dark:text-muted-dark shrink-0 hidden xs:block">
                {getDateForIndex(i)}
              </span>

              {/* action buttons */}
              <div className="flex items-center gap-0.5 shrink-0">
                <button
                  onClick={() => move(m.id, 'up')}
                  disabled={i === 0 || isLoading}
                  className="w-6 h-6 flex items-center justify-center text-muted-light dark:text-muted-dark hover:text-text-light dark:hover:text-text-dark disabled:opacity-25 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
                  aria-label={`Move ${m.name} up`}
                >
                  <ChevronUp size={13} />
                </button>
                <button
                  onClick={() => move(m.id, 'down')}
                  disabled={i === queue.length - 1 || isLoading}
                  className="w-6 h-6 flex items-center justify-center text-muted-light dark:text-muted-dark hover:text-text-light dark:hover:text-text-dark disabled:opacity-25 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
                  aria-label={`Move ${m.name} down`}
                >
                  <ChevronDown size={13} />
                </button>
                <button
                  onClick={() => handleSwap(m.id)}
                  disabled={isLoading}
                  className={`w-6 h-6 flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark disabled:opacity-25 ${
                    isSwapSelected
                      ? 'text-amber-500 dark:text-amber-400'
                      : 'text-muted-light dark:text-muted-dark hover:text-primary-light dark:hover:text-primary-dark'
                  }`}
                  aria-label={isSwapSelected ? 'Cancel swap' : `Swap ${m.name}'s position`}
                >
                  <ArrowLeftRight size={12} />
                </button>
                <button
                  onClick={() => remove(m.id)}
                  disabled={isLoading}
                  className="w-6 h-6 flex items-center justify-center text-muted-light dark:text-muted-dark hover:text-red-500 dark:hover:text-red-400 disabled:opacity-25 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
                  aria-label={`Remove ${m.name} from queue`}
                >
                  <X size={12} />
                </button>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
