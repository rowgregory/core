import { useState } from 'react'
import { Panel } from '../common/Panel'
import { SectionLabel } from '../common/SectionLabel'
import { motion } from 'framer-motion'
import { SuperDashStatusBadge } from './SuperDashStatusBadge'
import { InlineActionBtn } from './InlineActionButton'
import { useRouter } from 'next/navigation'
import { deleteReferral } from '@/app/lib/actions/referral/deleteReferral'
import { useSounds } from '@/app/lib/hooks/useSounds'
import { SuperUserReferral } from '@/types/super.types'
import { timeAgo } from '@/app/lib/utils/date.utils'

export function ReferralsPanel({ referrals }: { referrals: SuperUserReferral[] }) {
  const router = useRouter()
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [confirmId, setConfirmId] = useState<string | null>(null)
  const { play } = useSounds({ enabled: true, volume: 0.4 })

  async function handleDelete(id: string) {
    setLoadingId(id)
    const res = await deleteReferral(id)
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
        <SectionLabel>Referrals</SectionLabel>
      </div>
      <div className="divide-y divide-border-light dark:divide-border-dark max-h-105 overflow-y-auto">
        {referrals?.length === 0 && (
          <p className="px-4 py-6 text-sm font-nunito text-muted-light dark:text-muted-dark text-center">
            No referrals yet
          </p>
        )}
        {referrals?.map((r, i) => (
          <motion.div
            key={r.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: i * 0.025 }}
            className="px-4 py-3 hover:bg-surface-light dark:hover:bg-surface-dark transition-colors"
          >
            <div className="flex items-start justify-between gap-3 mb-1">
              <div className="min-w-0">
                <p className="text-[13px] font-sora font-bold text-text-light dark:text-text-dark leading-snug">
                  {r.giver.name}
                  <span className="font-normal text-muted-light dark:text-muted-dark mx-1.5">→</span>
                  {r.receiver.name}
                </p>
                <p className="text-[11.5px] font-nunito text-muted-light dark:text-muted-dark truncate">
                  {r.clientName} · {r.serviceNeeded}
                </p>
              </div>
              <SuperDashStatusBadge status={r.status} />
            </div>
            <div className="flex items-center gap-1 mt-1.5">
              {confirmId === r.id ? (
                <>
                  <InlineActionBtn variant="delete" onClick={() => handleDelete(r.id)} disabled={loadingId === r.id}>
                    Confirm delete
                  </InlineActionBtn>
                  <InlineActionBtn variant="neutral" onClick={() => setConfirmId(null)} disabled={loadingId === r.id}>
                    Cancel
                  </InlineActionBtn>
                </>
              ) : (
                <InlineActionBtn variant="delete" onClick={() => setConfirmId(r.id)} disabled={loadingId === r.id}>
                  Delete
                </InlineActionBtn>
              )}
              <span className="ml-auto text-f10 font-mono text-muted-light dark:text-muted-dark">
                {timeAgo(r.createdAt)}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </Panel>
  )
}
