'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { LinkedRecord } from '@/types/common'
import { useRouter } from 'next/navigation'
import { formatPhone } from '@/app/lib/utils/phone.utils'

export default function LinkedRecordModal({ record, setOpen, open }: { record: LinkedRecord; setOpen: any; open }) {
  const router = useRouter()

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
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
              className="w-full max-w-170 bg-bg-light dark:bg-surface-dark border-t-[3px] border-t-primary-light dark:border-t-primary-dark px-5 pt-7"
              style={{ paddingBottom: 'max(2rem, env(safe-area-inset-bottom))' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-5">
                <div>
                  <p className="text-f10 font-mono tracking-[0.22em] uppercase text-primary-light dark:text-primary-dark mb-1.5">
                    {record?.type === 'referral'
                      ? '02 · Referral'
                      : record?.type === 'f2f'
                        ? '01 · Meeting'
                        : '03 · Closed Business'}
                  </p>
                  <h2 className="font-sora font-black text-[22px] text-text-light dark:text-text-dark tracking-tight leading-none">
                    {record?.type === 'referral'
                      ? 'New Referral'
                      : record?.type === 'f2f'
                        ? 'New Meeting'
                        : 'Closed Business'}
                  </h2>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="mt-0.5 p-1 text-muted-light dark:text-muted-dark hover:text-text-light dark:hover:text-text-dark transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark rounded-sm"
                  aria-label="Close"
                >
                  <X size={18} />
                </button>
              </div>

              {/* referral */}
              {record?.type === 'referral' && (
                <div className="flex flex-col gap-4">
                  <Row label="From" value={record?.data.giver.name} />
                  <Row label="Client" value={record?.data.clientName} />
                  <Row label="Phone" value={record?.data.clientPhone} />
                  <Row label="Service Needed" value={record?.data.serviceNeeded} />
                  {record?.data.notes && <Row label="Notes" value={record?.data.notes} />}
                </div>
              )}

              {/* f2f */}
              {record?.type === 'f2f' && (
                <div className="flex flex-col gap-4">
                  <Row label="With" value={record?.data.requester.name} />
                  <Row
                    label="Date"
                    value={new Date(record?.data.scheduledAt).toLocaleDateString('en-US', {
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  />
                  {record?.data.notes && <Row label="Notes" value={record?.data.notes} />}
                </div>
              )}

              {/* closed */}
              {record?.type === 'closed' && (
                <div className="flex flex-col gap-4">
                  <Row label="From" value={record?.data.giver?.name ?? 'External'} />
                  <Row label="Amount" value={`$${Number(record?.data.businessValue).toLocaleString()}`} />
                  <Row label="Description" value={record?.data.description} />
                  {record?.data.notes && <Row label="Notes" value={record?.data.notes} />}
                </div>
              )}

              <button
                onClick={() => {
                  setOpen(false)
                  router.replace('/dashboard')
                }}
                className="mt-6 h-12 w-full border border-slate-300 dark:border-border-dark text-muted-light dark:text-muted-dark font-nunito text-sm hover:bg-surface-light dark:hover:bg-surface-dark transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
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

function Row({ label, value }: { label: string; value: string }) {
  const isPhone = label.toLowerCase() === 'phone'
  const formatted = isPhone ? formatPhone(value) : value
  const digits = value.replace(/\D/g, '')

  return (
    <div>
      <p className="text-f10 font-mono tracking-[0.15em] uppercase text-muted-light dark:text-muted-dark mb-0.5">
        {label}
      </p>
      {isPhone ? (
        <div className="flex items-center gap-3">
          <p className="text-[14px] font-nunito text-text-light dark:text-text-dark">{formatted}</p>

          <a
            href={`tel:${digits}`}
            className="text-f10 font-mono tracking-widest uppercase text-primary-light dark:text-primary-dark hover:opacity-70 transition-opacity"
          >
            Call
          </a>

          <a
            href={`sms:${digits}`}
            className="text-f10 font-mono tracking-widest uppercase text-primary-light dark:text-primary-dark hover:opacity-70 transition-opacity"
          >
            Text
          </a>
        </div>
      ) : (
        <p className="text-[14px] font-nunito text-text-light dark:text-text-dark">{formatted}</p>
      )}
    </div>
  )
}
