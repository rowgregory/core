import { deleteAnchor, SuperUserAnchor } from '@/app/lib/actions/super-user/superUserActions'
import { useState } from 'react'
import { Panel } from '../common/Panel'
import { SectionLabel } from '../common/SectionLabel'
import { motion } from 'framer-motion'
import { fmtCurrency } from '@/app/lib/utils/currency.utils'
import { SuperDashStatusBadge } from './SuperDashStatusBadge'
import { fmtDate } from '@/app/lib/utils/date.utils'
import { InlineActionBtn } from './InlineActionButton'
import { timeAgo } from '@/app/lib/utils/time.utils'
import { useRouter } from 'next/navigation'
import useSoundEffect from '@/hooks/useSoundEffect'

export function AnchorsPanel({ anchors }: { anchors: SuperUserAnchor[] }) {
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)
  const router = useRouter()
  const { play } = useSoundEffect('/sound-effects/droplet.mp3', true)

  async function remove(id: string) {
    setLoadingId(id)

    const res = await deleteAnchor(id)
    if (res.success) {
      play()
      router.refresh()
      setLoadingId(null)
      setConfirmDelete(null)
    }
  }

  return (
    <Panel>
      <div className="px-4 py-3 border-b border-border-light dark:border-border-dark">
        <SectionLabel>Closed Business</SectionLabel>
      </div>
      <div className="divide-y divide-border-light dark:divide-border-dark max-h-105 overflow-y-auto">
        {anchors.length === 0 && (
          <p className="px-4 py-6 text-sm font-nunito text-muted-light dark:text-muted-dark text-center">
            No closed business yet
          </p>
        )}
        {anchors.map((a, i) => (
          <motion.div
            key={a.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: i * 0.025 }}
            className="px-4 py-3 hover:bg-surface-light dark:hover:bg-surface-dark transition-colors"
          >
            <div className="flex items-start justify-between gap-3 mb-1">
              <div className="min-w-0">
                <div className="flex items-baseline gap-2">
                  <p className="font-sora font-black text-[15px] text-primary-light dark:text-primary-dark tabular-nums">
                    {fmtCurrency(a.businessValue)}
                  </p>
                  <SuperDashStatusBadge status={a.status} />
                </div>
                <p className="text-[13px] font-nunito text-text-light dark:text-text-dark truncate mt-0.5">
                  {a.giver?.name ?? 'External'}
                  <span className="text-muted-light dark:text-muted-dark mx-1.5">→</span>
                  {a.receiver?.name ?? 'External'}
                </p>
                <p className="text-[11.5px] font-nunito text-muted-light dark:text-muted-dark truncate">
                  {a.description} · closed {fmtDate(a.closedDate)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 mt-1.5">
              {confirmDelete === a.id ? (
                <>
                  <InlineActionBtn variant="delete" onClick={() => remove(a.id)} disabled={loadingId === a.id}>
                    Confirm delete
                  </InlineActionBtn>
                  <InlineActionBtn
                    variant="neutral"
                    onClick={() => setConfirmDelete(null)}
                    disabled={loadingId === a.id}
                  >
                    No
                  </InlineActionBtn>
                </>
              ) : (
                <InlineActionBtn variant="delete" onClick={() => setConfirmDelete(a.id)} disabled={loadingId === a.id}>
                  Delete
                </InlineActionBtn>
              )}
              <span className="ml-auto text-f10 font-mono text-muted-light dark:text-muted-dark">
                {timeAgo(a.createdAt)}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </Panel>
  )
}
