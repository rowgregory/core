'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { X, CreditCard, Lock } from 'lucide-react'
import { SectionLabel } from '../common/SectionLabel'
import { getQuarterlyDates } from '@/app/lib/utils/date.utils'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

function PaymentModal({ open, onClose, type }: { open: boolean; onClose: () => void; type: 'annual' | 'quarterly' }) {
  const isAnnual = type === 'annual'
  const price = isAnnual ? 365 : 60

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={onClose}
            className="fixed inset-0 z-40 backdrop-blur-sm"
            style={{ backgroundColor: 'rgba(0,0,0,0.65)' }}
          />
          <motion.div
            initial={{ y: 28, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 28, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="fixed inset-x-0 bottom-0 z-50 flex justify-center"
          >
            <div
              className="w-full max-w-170 bg-bg-light dark:bg-surface-dark border-t-[3px] border-t-primary-light dark:border-t-primary-dark px-5 pt-6"
              style={{ paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom))' }}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-5">
                <div>
                  <p className="text-f10 font-mono tracking-widest uppercase text-primary-light dark:text-primary-dark mb-1">
                    {isAnnual ? 'Annual Admission' : 'Room Dues'}
                  </p>
                  <h2 className="font-sora font-black text-[22px] text-text-light dark:text-text-dark tracking-tight leading-none">
                    ${price} {isAnnual ? 'per year' : 'every 3 months'}
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  aria-label="Close"
                  className="mt-0.5 p-1 text-muted-light dark:text-muted-dark hover:text-text-light dark:hover:text-text-dark transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark rounded-sm"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Key info */}
              <p className="text-[13px] font-nunito text-muted-light dark:text-muted-dark leading-relaxed mb-5">
                {isAnnual
                  ? 'Your renewal date is set to the day you complete this form and renews automatically every year.'
                  : `First charge on ${getQuarterlyDates()[0]}, then every 3 months after that automatically.`}
              </p>

              {/* Mock card */}
              <div className="border border-slate-300 dark:border-border-dark bg-white dark:bg-bg-dark px-3.5 py-3.5 mb-4 flex items-center gap-3">
                <CreditCard size={15} className="text-muted-light dark:text-muted-dark shrink-0" aria-hidden="true" />
                <span className="font-nunito text-[14px] text-slate-400 dark:text-muted-dark/40">
                  Card number will go here
                </span>
              </div>

              {/* Mock submit */}
              <div className="w-full h-12 bg-primary-light/20 dark:bg-button-dark/20 text-primary-light/40 dark:text-primary-dark/30 font-sora font-bold text-[13px] tracking-wide flex items-center justify-center gap-2 cursor-not-allowed select-none mb-3">
                <Lock size={13} aria-hidden="true" />
                Pay ${price}
              </div>

              <button
                onClick={onClose}
                className="w-full h-10 border border-border-light dark:border-border-dark text-muted-light dark:text-muted-dark font-nunito text-sm hover:bg-surface-light dark:hover:bg-surface-dark transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
              >
                Close
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

// ─── Main ──────────────────────────────────────────────────────────────────────
export default function MembershipSetup({ hasAnnual, hasQuarterly }: { hasAnnual: boolean; hasQuarterly: boolean }) {
  const [openModal, setOpenModal] = useState<'annual' | 'quarterly' | null>(null)
  const [annualDone] = useState(hasAnnual)
  const [quarterlyDone] = useState(hasQuarterly)

  // Hide section entirely once both are done
  if (annualDone && quarterlyDone) return null

  return (
    <Elements stripe={stripePromise}>
      <div>
        <SectionLabel>Membership Setup</SectionLabel>
        <div className="flex flex-col gap-2">
          {!quarterlyDone && (
            <motion.button
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setOpenModal('quarterly')}
              className="w-full flex items-center justify-between gap-3 px-4 py-3 border border-border-light dark:border-border-dark border-l-2 border-l-secondary-light dark:border-l-secondary-dark bg-bg-light dark:bg-bg-dark hover:bg-surface-light dark:hover:bg-surface-dark transition-colors text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <CreditCard size={13} className="text-muted-light dark:text-muted-dark shrink-0" aria-hidden="true" />
                <div className="min-w-0">
                  <p className="font-sora font-bold text-[13px] text-text-light dark:text-text-dark leading-tight truncate">
                    Room Dues
                  </p>
                  <p className="text-f10 font-mono text-muted-light dark:text-muted-dark">$60/qtr</p>
                </div>
              </div>
              <span className="text-f10 font-mono tracking-widest uppercase text-primary-light dark:text-primary-dark shrink-0">
                Learn More →
              </span>
            </motion.button>
          )}

          {!annualDone && (
            <motion.button
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.05 }}
              onClick={() => setOpenModal('annual')}
              className="w-full flex items-center justify-between gap-3 px-4 py-3 border border-border-light dark:border-border-dark border-l-2 border-l-primary-light dark:border-l-primary-dark bg-bg-light dark:bg-bg-dark hover:bg-surface-light dark:hover:bg-surface-dark transition-colors text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <CreditCard size={13} className="text-muted-light dark:text-muted-dark shrink-0" aria-hidden="true" />
                <div className="min-w-0">
                  <p className="font-sora font-bold text-[13px] text-text-light dark:text-text-dark leading-tight truncate">
                    Annual Admission
                  </p>
                  <p className="text-f10 font-mono text-muted-light dark:text-muted-dark">$365/yr</p>
                </div>
              </div>
              <span className="text-f10 font-mono tracking-widest uppercase text-primary-light dark:text-primary-dark shrink-0">
                Learn More →
              </span>
            </motion.button>
          )}
        </div>
      </div>

      {/* Modals */}
      <PaymentModal open={openModal === 'quarterly'} onClose={() => setOpenModal(null)} type="quarterly" />
      <PaymentModal open={openModal === 'annual'} onClose={() => setOpenModal(null)} type="annual" />
    </Elements>
  )
}
