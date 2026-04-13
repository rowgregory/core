import { SuperUserApplicant } from '@/app/lib/actions/super-user/superUserActions'
import { Panel } from '../common/Panel'
import { SectionLabel } from '../common/SectionLabel'
import { motion } from 'framer-motion'
import { timeAgo } from '@/app/lib/utils/time.utils'
import { ApplicantModal } from '../modals/ApplicantModal'
import { useState } from 'react'
import { SuperDashStatusBadge } from './SuperDashStatusBadge'

export function ApplicantsPanel({ applicants }: { applicants: SuperUserApplicant[] }) {
  const [selected, setSelected] = useState<SuperUserApplicant | null>(null)

  return (
    <Panel>
      <div className="px-4 py-3 border-b border-border-light dark:border-border-dark">
        <div className="flex items-center justify-between">
          <SectionLabel>Applications</SectionLabel>
          <span className="text-f10 font-mono tracking-widest text-amber-500 dark:text-amber-400">
            {applicants.length} {applicants.length === 1 ? 'application' : 'applications'}
          </span>
        </div>
      </div>

      <div className="divide-y divide-border-light dark:divide-border-dark">
        {applicants.map((a, i) => (
          <motion.button
            key={a.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: i * 0.04 }}
            onClick={() => setSelected(a)}
            className="w-full text-left px-4 py-3 hover:bg-surface-light dark:hover:bg-surface-dark transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
          >
            <div className="flex items-start justify-between gap-3 mb-1">
              <div className="min-w-0">
                <p className="text-[13px] font-sora font-bold text-text-light dark:text-text-dark truncate">{a.name}</p>
                <p className="text-[11.5px] font-nunito text-muted-light dark:text-muted-dark truncate">
                  {a.company}
                  {a.industry ? ` · ${a.industry}` : ''}
                </p>
              </div>
              <SuperDashStatusBadge status={a.membershipStatus} />
            </div>
            <div className="flex items-center gap-3 mt-1.5">
              <span className="text-f10 font-mono tracking-[0.08em] text-primary-light dark:text-primary-dark truncate">
                {a.email}
              </span>
              <span className="text-f10 font-mono text-muted-light dark:text-muted-dark shrink-0 ml-auto">
                {timeAgo(a.createdAt)}
              </span>
            </div>
          </motion.button>
        ))}
      </div>

      {/* ── Applicant modal ── */}
      <ApplicantModal selected={selected} setSelected={setSelected} />
    </Panel>
  )
}
