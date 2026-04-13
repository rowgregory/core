'use client'

import { useRouter } from 'next/navigation'
import { CreditCard, Lock } from 'lucide-react'
import FadeUp from '../common/FadeUp'
import { getQuarterlyDates } from '@/app/lib/utils/date.utils'

interface OnboardingClientProps {
  firstName: string
}

export default function OnboardingClient({ firstName }: OnboardingClientProps) {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-bg-light dark:bg-bg-dark">
      {/* ── Header ── */}
      <header className="border-b border-border-light dark:border-border-dark">
        <div className="max-w-160 mx-auto px-4 xs:px-6 h-12 flex items-center justify-between">
          <span className="font-sora font-black text-[18px] tracking-tight">
            <span className="text-text-light dark:text-text-dark">CORE</span>
            <span className="text-primary-light dark:text-primary-dark">.</span>
          </span>
          <span className="text-f10 font-mono tracking-widest uppercase text-muted-light dark:text-muted-dark border border-border-light dark:border-border-dark px-2.5 py-1">
            Preview Only
          </span>
        </div>
      </header>

      <div className="max-w-160 mx-auto px-4 xs:px-6 pb-16">
        {/* ── Hero ── */}
        <FadeUp className="pt-10 pb-8 border-b border-border-light dark:border-border-dark">
          <p className="text-f10 font-mono tracking-[0.2em] uppercase text-primary-light dark:text-primary-dark mb-2">
            Welcome to the chapter
          </p>
          <h1 className="font-sora font-black text-[28px] xs:text-[34px] text-text-light dark:text-text-dark tracking-tight leading-tight mb-3">
            One last step, {firstName}.
          </h1>
          <p className="font-nunito text-[14px] text-muted-light dark:text-muted-dark leading-relaxed">
            Set up your membership below. Your card will be saved for automatic renewal — you will not need to do
            anything after this.
          </p>
        </FadeUp>

        {/* ── What you're paying ── */}
        <FadeUp delay={0.08} className="pt-8 pb-8 border-b border-border-light dark:border-border-dark">
          {/* Annual */}
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="font-sora font-bold text-[14px] text-text-light dark:text-text-dark">Annual Admission</p>
              <p className="text-[12px] font-nunito text-muted-light dark:text-muted-dark">
                Due today · renews every year
              </p>
            </div>
            <p className="font-sora font-black text-[22px] text-primary-light dark:text-primary-dark tabular-nums">
              $365
            </p>
          </div>

          {/* Room dues */}
          <div className="flex items-center justify-between pb-6 border-b border-border-light dark:border-border-dark">
            <div>
              <p className="font-sora font-bold text-[14px] text-muted-light dark:text-muted-dark">Room Dues</p>
              <p className="text-[12px] font-nunito text-muted-light dark:text-muted-dark">
                Starts {getQuarterlyDates()[0]} · every 3 months after that
              </p>
            </div>
            <p className="font-sora font-bold text-[16px] text-muted-light dark:text-muted-dark tabular-nums">$60</p>
          </div>

          {/* Note */}
          <div className="border-l-2 border-violet-500 dark:border-violet-400 bg-violet-50 dark:bg-violet-400/5 px-4 py-3 mt-6">
            <p className="text-[12.5px] font-nunito text-text-light dark:text-text-dark leading-relaxed">
              <strong>Only $365 is charged today.</strong> Room dues begin automatically on {getQuarterlyDates()[0]} —
              nothing else is due right now.
            </p>
          </div>
        </FadeUp>

        {/* ── Payment preview ── */}
        <FadeUp delay={0.18} className="pt-8">
          <p className="text-f10 font-mono tracking-[0.2em] uppercase text-muted-light dark:text-muted-dark mb-4">
            Payment Details
          </p>

          <div className="border border-slate-300 dark:border-border-dark bg-white dark:bg-bg-dark px-3.5 py-3.5 mb-5 flex items-center gap-3">
            <CreditCard size={16} className="text-muted-light dark:text-muted-dark shrink-0" aria-hidden="true" />
            <span className="font-nunito text-[15px] text-slate-400 dark:text-muted-dark/50">
              Card number will go here
            </span>
          </div>

          <div className="w-full h-14 bg-primary-light/20 dark:bg-button-dark/30 text-primary-light/40 dark:text-primary-dark/30 font-sora font-black text-[15px] tracking-wide flex items-center justify-center gap-2.5 cursor-not-allowed select-none mb-4">
            <Lock size={15} aria-hidden="true" />
            Start Membership — $365
          </div>

          <p className="text-f10 font-mono text-muted-light dark:text-muted-dark text-center">
            Secured by Stripe · Card saved for automatic renewal
          </p>
        </FadeUp>

        {/* ── Back ── */}
        <FadeUp delay={0.25} className="pt-8">
          <button
            onClick={() => router.back()}
            className="text-f10 font-mono tracking-widest uppercase text-muted-light dark:text-muted-dark hover:text-primary-light dark:hover:text-primary-dark transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
          >
            ← Back
          </button>
        </FadeUp>
      </div>
    </div>
  )
}
