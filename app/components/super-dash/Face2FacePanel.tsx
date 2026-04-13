import { SuperUserParley } from '@/app/lib/actions/super-user/superUserActions'
import { useState } from 'react'
import { Panel } from '../common/Panel'
import { motion } from 'framer-motion'
import { SectionLabel } from '../common/SectionLabel'
import { fmtDate } from '@/app/lib/utils/date.utils'
import { SuperDashStatusBadge } from './SuperDashStatusBadge'
import { InlineActionBtn } from './InlineActionButton'
import { timeAgo } from '@/app/lib/utils/time.utils'
import { deleteFace2Face } from '@/app/lib/actions/super-user/deleteFace2Face'
import { useRouter } from 'next/navigation'
import useSoundEffect from '@/hooks/useSoundEffect'

export function Face2FacePanel({ parleys: face2faces }: { parleys: SuperUserParley[] }) {
  const router = useRouter()
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [confirmId, setConfirmId] = useState<string | null>(null)
  const { play } = useSoundEffect('/sound-effects/droplet.mp3', true)

  async function handleDelete(id: string) {
    setLoadingId(id)
    const res = await deleteFace2Face(id)
    if (res.success) {
      play()
      router.refresh()
      setLoadingId(null)
      setConfirmId(null)
    }
  }

  return (
    <Panel>
      <div className="px-4 py-3 border-b border-border-light dark:border-border-dark">
        <SectionLabel>Face-2-Face Meetings</SectionLabel>
      </div>
      <div className="divide-y divide-border-light dark:divide-border-dark max-h-105 overflow-y-auto">
        {face2faces?.length === 0 && (
          <p className="px-4 py-6 text-sm font-nunito text-muted-light dark:text-muted-dark text-center">
            No meetings yet
          </p>
        )}
        {face2faces?.map((f, i) => (
          <motion.div
            key={f?.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: i * 0.025 }}
            className="px-4 py-3 hover:bg-surface-light dark:hover:bg-surface-dark transition-colors"
          >
            <div className="flex items-start justify-between gap-3 mb-1.5">
              <div className="min-w-0">
                <p className="text-[13px] font-sora font-bold text-text-light dark:text-text-dark leading-snug truncate">
                  {f?.requester.name}
                  <span className="font-normal text-muted-light dark:text-muted-dark mx-1.5">→</span>
                  {f?.recipient.name}
                </p>
                <p className="text-[11.5px] font-nunito text-muted-light dark:text-muted-dark truncate">
                  {f?.requester.company} · {fmtDate(f?.scheduledAt)}
                </p>
              </div>
              <SuperDashStatusBadge status={f?.status} />
            </div>
            {f?.notes && (
              <p className="text-[11.5px] font-nunito text-muted-light dark:text-muted-dark mb-2 line-clamp-1 italic">
                "{f?.notes}"
              </p>
            )}
            <div className="flex items-center gap-1">
              {confirmId === f?.id ? (
                <>
                  <InlineActionBtn variant="delete" onClick={() => handleDelete(f?.id)} disabled={loadingId === f?.id}>
                    Confirm delete
                  </InlineActionBtn>
                  <InlineActionBtn variant="neutral" onClick={() => setConfirmId(null)} disabled={loadingId === f?.id}>
                    Cancel
                  </InlineActionBtn>
                </>
              ) : (
                <InlineActionBtn variant="delete" onClick={() => setConfirmId(f?.id)} disabled={loadingId === f?.id}>
                  Delete
                </InlineActionBtn>
              )}
              <span className="ml-auto text-f10 font-mono text-muted-light dark:text-muted-dark">
                {timeAgo(f?.createdAt)}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </Panel>
  )
}
