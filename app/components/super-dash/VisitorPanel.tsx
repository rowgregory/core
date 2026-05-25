import { Visitor } from '@/types/visitor.types'
import { Panel } from '../common/Panel'
import { SectionLabel } from '../common/SectionLabel'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { deleteVisitor } from '@/app/lib/actions/super-user/deleteVisitor'
import { useRouter } from 'next/navigation'
import { InlineActionBtn } from './InlineActionButton'
import { useSounds } from '@/app/lib/hooks/useSounds'
import { timeAgo, toDateKey } from '@/app/lib/utils/date.utils'

export function VisitorPanel({ visitors }: { visitors: Visitor[] }) {
  const router = useRouter()
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [confirmId, setConfirmId] = useState<string | null>(null)
  const { play } = useSounds({ enabled: true, volume: 0.4 })

  async function handleDelete(id: string) {
    setLoadingId(id)
    const res = await deleteVisitor({ id })
    if (res.success) {
      router.refresh()
      play('se7')
      setLoadingId(null)
      setConfirmId(null)
    }
  }

  return (
    <Panel>
      <div className="px-4 py-3 border-b border-border-light dark:border-border-dark">
        <SectionLabel>Visitors</SectionLabel>
      </div>
      <div className="divide-y divide-border-light dark:divide-border-dark max-h-105 overflow-y-auto">
        {visitors?.length === 0 && (
          <p className="px-4 py-6 text-sm font-nunito text-muted-light dark:text-muted-dark text-center">
            No visitors logged yet
          </p>
        )}
        {visitors?.map((v, i) => (
          <motion.div
            key={v.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: i * 0.025 }}
            className="px-4 py-3 hover:bg-surface-light dark:hover:bg-surface-dark transition-colors"
          >
            <div className="flex items-start justify-between gap-3 mb-1">
              <div className="min-w-0">
                <p className="text-[13px] font-sora font-bold text-text-light dark:text-text-dark leading-snug">
                  {v.firstName} {v.lastName}
                </p>
                <p className="text-[11.5px] font-nunito text-muted-light dark:text-muted-dark truncate">
                  {v.email} {v.company && `· ${v.company}`} {v.industry && `· ${v.industry}`}
                </p>
              </div>
              <span className="text-f10 font-mono tracking-widest uppercase text-primary-light dark:text-primary-dark shrink-0">
                {toDateKey(v.visitDate)}
              </span>
            </div>
            <div className="flex items-center gap-1 mt-1.5">
              {confirmId === v.id ? (
                <>
                  <InlineActionBtn variant="delete" onClick={() => handleDelete(v.id)} disabled={loadingId === v.id}>
                    Confirm delete
                  </InlineActionBtn>
                  <InlineActionBtn variant="neutral" onClick={() => setConfirmId(null)} disabled={loadingId === v.id}>
                    Cancel
                  </InlineActionBtn>
                </>
              ) : (
                <InlineActionBtn variant="delete" onClick={() => setConfirmId(v.id)} disabled={loadingId === v.id}>
                  Delete
                </InlineActionBtn>
              )}
              {v.invitedBy && (
                <span className="text-f10 font-mono text-muted-light dark:text-muted-dark">via {v.invitedBy.name}</span>
              )}
              <span className="ml-auto text-f10 font-mono text-muted-light dark:text-muted-dark">
                {timeAgo(v.createdAt)}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </Panel>
  )
}
