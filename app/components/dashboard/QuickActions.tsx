'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { Users, Activity, DollarSign, ChevronDown } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { createAnchor } from '@/app/lib/actions/createAnchor'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { createFace2Face } from '@/app/lib/actions/createFace2Face'
import { createReferral } from '@/app/lib/actions/referral/createReferral'
import useSoundEffect from '@/hooks/useSoundEffect'
import { formatPhone } from '@/app/lib/utils/phone.utils'
import { formatAmountInput } from '@/app/lib/utils/currency.utils'
import { Modal } from '../common/Modal'

// ─── Types ─────────────────────────────────────────────────────────────────────
export interface Member {
  id: string
  name: string
  industry: string | null
}

export interface QuickActionsProps {
  members: Member[]
  variant: 'card' | 'compact'
}

type ModalKey = 'f2f' | 'referral' | 'closed' | null

// ─── Action metadata ───────────────────────────────────────────────────────────
const ACTIONS = [
  {
    key: 'f2f' as const,
    icon: Users,
    tag: '01 · Meeting',
    tagShort: 'Meeting',
    label: 'Face-2-Face',
    desc: 'Log a 1-on-1 with a member',
    accentHex: '#38bdf8',
    tagColor: '#0284c7',
    submitLabel: 'Log Meeting',
    colors: {
      bg: 'bg-sky-50 dark:bg-sky-400/8',
      border: 'border-sky-200 dark:border-sky-400/20',
      hover: 'hover:bg-sky-100 dark:hover:bg-sky-400/15',
      tag: 'text-sky-500 dark:text-[#38bdf8]',
      title: 'text-sky-900 dark:text-text-dark',
      desc: 'text-sky-600 dark:text-sky-400'
    }
  },
  {
    key: 'referral' as const,
    icon: Activity,
    tag: '02 · Referral',
    tagShort: 'Referral',
    label: 'Give a Referral',
    desc: 'Pass business to a member',
    accentHex: '#22d3ee',
    tagColor: '#0891b2',
    submitLabel: 'Send Referral',
    colors: {
      bg: 'bg-cyan-50 dark:bg-cyan-400/8',
      border: 'border-cyan-200 dark:border-cyan-400/20',
      hover: 'hover:bg-cyan-100 dark:hover:bg-cyan-400/15',
      tag: 'text-cyan-500 dark:text-[#22d3ee]',
      title: 'text-cyan-900 dark:text-text-dark',
      desc: 'text-cyan-600 dark:text-cyan-400'
    }
  },
  {
    key: 'closed' as const,
    icon: DollarSign,
    tag: '03 · Thank You',
    tagShort: 'Thank You',
    label: 'Closed Business',
    desc: 'Thank a member for a closed deal',
    accentHex: '#34d399',
    tagColor: '#059669',
    submitLabel: 'Submit',
    colors: {
      bg: 'bg-emerald-50 dark:bg-emerald-400/8',
      border: 'border-emerald-200 dark:border-emerald-400/20',
      hover: 'hover:bg-emerald-100 dark:hover:bg-emerald-400/15',
      tag: 'text-emerald-500 dark:text-[#34d399]',
      title: 'text-emerald-900 dark:text-text-dark',
      desc: 'text-emerald-600 dark:text-emerald-400'
    }
  }
] as const

// ─── Shared classes ────────────────────────────────────────────────────────────
const inputCls =
  'w-full h-12 bg-white dark:bg-bg-dark border border-slate-300 dark:border-border-dark px-3.5 font-nunito text-[15px] text-text-light dark:text-text-dark placeholder:text-slate-400 dark:placeholder:text-muted-dark/50 focus:outline-none focus:border-primary-light dark:focus:border-primary-dark focus:ring-1 focus:ring-primary-light/20 dark:focus:ring-primary-dark/20 transition-colors rounded-none'

const selectCls =
  'w-full h-12 bg-white dark:bg-bg-dark border border-slate-300 dark:border-border-dark px-3.5 font-nunito text-[15px] text-text-light dark:text-text-dark focus:outline-none focus:border-primary-light dark:focus:border-primary-dark focus:ring-1 focus:ring-primary-light/20 dark:focus:ring-primary-dark/20 transition-colors rounded-none appearance-none cursor-pointer'

// ─── Sub-components ────────────────────────────────────────────────────────────
function Field({
  label,
  htmlFor,
  optional,
  children
}: {
  label: string
  htmlFor: string
  optional?: boolean
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={htmlFor}
        className="text-f10 font-mono tracking-[0.18em] uppercase text-muted-light dark:text-muted-dark"
      >
        {label}
        {optional && <span className="ml-2 text-f9 normal-case tracking-normal opacity-60">optional</span>}
      </label>
      {children}
    </div>
  )
}

function SelectField({
  id,
  value,
  onChange,
  children
}: {
  id: string
  value: string
  onChange: (v: string) => void
  children: React.ReactNode
}) {
  return (
    <div className="relative">
      <select id={id} value={value} onChange={(e) => onChange(e.target.value)} className={selectCls} required>
        {children}
      </select>
      <ChevronDown
        size={16}
        className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-light dark:text-muted-dark"
        aria-hidden="true"
      />
    </div>
  )
}

function MemberOptions({ members, showOutOfChapterMember }: { members: Member[]; showOutOfChapterMember?: boolean }) {
  return (
    <>
      <option value="" disabled>
        Select a member…
      </option>
      {showOutOfChapterMember && <option value="external">Out of chaper member</option>}
      {members.map((m) => (
        <option key={m.id} value={m.id}>
          {m.name}
          {m.industry ? ` · ${m.industry}` : ''}
        </option>
      ))}
    </>
  )
}

function QuickActionButton({ action, onClick }: { action: (typeof ACTIONS)[number]; onClick: () => void }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-32px' })
  const { icon: Icon, colors, tagShort, label, desc } = action

  return (
    <motion.button
      ref={ref}
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : {}}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      onClick={onClick}
      style={{ WebkitTapHighlightColor: 'transparent' }}
      className={`w-full text-left flex items-center gap-4 px-5 py-5 ${colors.bg} ${colors.border} border ${colors.hover} active:scale-[0.985] transition-[transform,background-color] duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark focus-visible:ring-offset-2`}
      aria-label={`Open ${label} form`}
    >
      <Icon size={22} className={`${colors.tag} shrink-0`} strokeWidth={1.75} aria-hidden="true" />
      <div className="flex-1 min-w-0">
        <p className={`text-f10 font-mono tracking-[0.2em] uppercase mb-1 ${colors.tag}`}>{tagShort}</p>
        <p className={`font-sora font-bold text-[17px] leading-tight tracking-tight mb-0.5 ${colors.title}`}>{label}</p>
        <p className={`text-[12.5px] font-nunito ${colors.desc}`}>{desc}</p>
      </div>
    </motion.button>
  )
}

// ─── Main ──────────────────────────────────────────────────────────────────────
export default function QuickActions({ members, variant }: QuickActionsProps) {
  const session = useSession()
  const [activeModal, setActiveModal] = useState<ModalKey>(null)
  const [isPending, setIsPending] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const [f2fMember, setF2fMember] = useState('')
  const [f2fDate, setF2fDate] = useState(new Date().toISOString().split('T')[0])
  const [f2fNotes, setF2fNotes] = useState('')

  const [refTo, setRefTo] = useState('')
  const [refClient, setRefClient] = useState('')
  const [refPhone, setRefPhone] = useState('')
  const [refService, setRefService] = useState('')

  const [closedFrom, setClosedFrom] = useState('')
  const [closedAmount, setClosedAmount] = useState('')
  const [closedDesc, setClosedDesc] = useState('')
  const [closedDate, setClosedDate] = useState(new Date().toISOString().split('T')[0])

  const searchParams = useSearchParams()

  useEffect(() => {
    const action = searchParams.get('action')
    if (action === 'f2f' || action === 'referral' || action === 'closed') {
      setActiveModal(action)
    }
  }, [searchParams])

  const router = useRouter()

  const { play } = useSoundEffect('/sound-effects/se-2.mp3', true)

  function openModal(key: ModalKey) {
    setFormError(null)
    setActiveModal(key)
  }

  function closeModal() {
    if (isPending) return
    setActiveModal(null)
    setFormError(null)
  }

  async function handleSubmit() {
    setFormError(null)

    if (activeModal === 'f2f') {
      if (!f2fMember) return setFormError('Please select a member.')
      setIsPending(true)
      const res = await createFace2Face({
        recipientId: f2fMember,
        scheduledAt: new Date(f2fDate),
        notes: f2fNotes
      })
      setIsPending(false)
      if (!res.success) return setFormError(res.error ?? 'Something went wrong.')
      play()
      router.refresh()
      setF2fMember('')
      setF2fNotes('')
      setF2fDate(new Date().toISOString().split('T')[0])
      closeModal()
    }

    if (activeModal === 'referral') {
      if (!refTo) return setFormError('Please select a member.')
      if (!refClient) return setFormError('Please enter the contact name.')
      if (!refPhone) return setFormError('Please enter the contact phone number.')
      if (!refService) return setFormError('Please describe the service needed.')
      setIsPending(true)
      const res = await createReferral({
        receiverId: refTo,
        clientName: refClient,
        clientPhone: refPhone,
        serviceNeeded: refService,
        giverId: session.data.user.id
      })
      setIsPending(false)
      if (!res.success) return setFormError(res.error ?? 'Something went wrong.')
      play()
      router.refresh()
      setRefTo('')
      setRefClient('')
      setRefPhone('')
      setRefService('')
      closeModal()
    }

    if (activeModal === 'closed') {
      if (!closedFrom) return setFormError('Please select a member.')
      if (!closedAmount) return setFormError('Please enter the amount.')
      if (!closedDesc) return setFormError('Please add a brief description.')

      setIsPending(true)
      const res = await createAnchor({
        businessValue: Number(closedAmount),
        description: closedDesc,
        closedDate: new Date(closedDate),
        giverId: closedFrom
      })
      setIsPending(false)
      if (!res.success) return setFormError(res.error ?? 'Something went wrong.')
      play()
      router.refresh()
      setClosedFrom('')
      setClosedAmount('')
      setClosedDesc('')
      setClosedDate(new Date().toISOString().split('T')[0])
      closeModal()
    }
  }

  const activeAction = ACTIONS.find((a) => a.key === activeModal)

  return (
    <>
      {/* ── Buttons ── */}
      <div className={variant === 'card' ? 'flex flex-col gap-3' : 'grid grid-cols-1 xs:grid-cols-3 gap-3 mb-6'}>
        {ACTIONS.map((a) => (
          <QuickActionButton key={a.key} action={a} onClick={() => openModal(a.key)} />
        ))}
      </div>

      {/* ── Modals ── */}
      {activeAction && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={closeModal}
            className="fixed inset-0 z-40 backdrop-blur-sm"
            style={{ backgroundColor: 'rgba(0,0,0,0.65)' }}
          />
          <Modal
            open={activeModal === 'f2f'}
            onClose={closeModal}
            accentColor="#38bdf8"
            tag="01 · Meeting"
            tagColor="#0284c7"
            title="Face-2-Face"
            submitLabel="Log Meeting"
            onSubmit={handleSubmit}
            pending={isPending}
            error={formError}
          >
            <Field label="Member" htmlFor="f2f-member">
              <SelectField id="f2f-member" value={f2fMember} onChange={setF2fMember}>
                <MemberOptions members={members} />
              </SelectField>
            </Field>
            <Field label="Date" htmlFor="f2f-date">
              <input
                id="f2f-date"
                type="date"
                value={f2fDate}
                onChange={(e) => setF2fDate(e.target.value)}
                className={inputCls}
                required
              />
            </Field>
            <Field label="Notes" htmlFor="f2f-notes" optional>
              <input
                id="f2f-notes"
                type="text"
                value={f2fNotes}
                onChange={(e) => setF2fNotes(e.target.value)}
                placeholder="What did you discuss?"
                className={inputCls}
              />
            </Field>
          </Modal>

          <Modal
            open={activeModal === 'referral'}
            onClose={closeModal}
            accentColor="#22d3ee"
            tag="02 · Referral"
            tagColor="#0891b2"
            title="Give a Referral"
            submitLabel="Send Referral"
            onSubmit={handleSubmit}
            pending={isPending}
            error={formError}
          >
            <Field label="Referring to" htmlFor="ref-to">
              <SelectField id="ref-to" value={refTo} onChange={setRefTo}>
                <MemberOptions members={members} />
              </SelectField>
            </Field>
            <Field label="Contact name" htmlFor="ref-client">
              <input
                id="ref-client"
                type="text"
                value={refClient}
                onChange={(e) => setRefClient(e.target.value)}
                placeholder="Who are you referring?"
                className={inputCls}
                required
              />
            </Field>
            <Field label="Contact phone" htmlFor="ref-phone">
              <input
                id="ref-phone"
                type="tel"
                value={formatPhone(refPhone)}
                onChange={(e) => setRefPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                placeholder="(555) 000-0000"
                className={inputCls}
              />
            </Field>
            <Field label="Service needed" htmlFor="ref-service">
              <input
                id="ref-service"
                type="text"
                value={refService}
                onChange={(e) => setRefService(e.target.value)}
                placeholder="What do they need?"
                className={inputCls}
                required
              />
            </Field>
          </Modal>

          <Modal
            open={activeModal === 'closed'}
            onClose={closeModal}
            accentColor="#34d399"
            tag="Thank You for"
            tagColor="#059669"
            title="Closed Business"
            submitLabel="Submit"
            onSubmit={handleSubmit}
            pending={isPending}
            error={formError}
          >
            <Field label="Thank you to" htmlFor="closed-from">
              <SelectField id="closed-from" value={closedFrom} onChange={setClosedFrom}>
                <MemberOptions members={members} showOutOfChapterMember />
              </SelectField>
            </Field>
            <Field label="Amount closed" htmlFor="closed-amount">
              <input
                id="closed-amount"
                type="text"
                value={formatAmountInput(closedAmount)}
                onChange={(e) => setClosedAmount(e.target.value.replace(/[^0-9.]/g, ''))}
                placeholder="0.00"
                inputMode="decimal"
                className={inputCls}
                required
              />
            </Field>
            <Field label="Description" htmlFor="closed-desc">
              <input
                id="closed-desc"
                type="text"
                value={closedDesc}
                onChange={(e) => setClosedDesc(e.target.value)}
                placeholder="Brief description of the business"
                className={inputCls}
                required
              />
            </Field>
            <Field label="Date closed" htmlFor="closed-date">
              <input
                id="closed-date"
                type="date"
                value={closedDate}
                onChange={(e) => setClosedDate(e.target.value)}
                className={inputCls}
                required
              />
            </Field>
          </Modal>
        </>
      )}
    </>
  )
}
