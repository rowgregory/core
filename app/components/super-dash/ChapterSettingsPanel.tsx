'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { updateChapter } from '@/app/lib/actions/updateChapter'
import { Panel } from '../common/Panel'
import { SectionLabel } from '../common/SectionLabel'

const inputCls =
  'w-full h-10 bg-white dark:bg-bg-dark border border-slate-300 dark:border-border-dark px-3 font-nunito text-[13px] text-text-light dark:text-text-dark focus:outline-none focus:border-primary-light dark:focus:border-primary-dark transition-colors rounded-none'

export function ChapterSettingsPanel({
  chapter
}: {
  chapter: {
    name: string
    location: string
    meetingDay: string
    meetingTime: string
    meetingFrequency: string
    hasUnlockedBooty: boolean
    hasUnlockedGrog: boolean
    hasUnlockedMuster: boolean
  }
}) {
  const router = useRouter()
  const [form, setForm] = useState(chapter)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [, startTransition] = useTransition()

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setSaved(false)
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function handleSave() {
    setSaving(true)
    startTransition(async () => {
      const res = await updateChapter(form)
      setSaving(false)
      if (res.success) {
        setSaved(true)
        router.refresh()
        setTimeout(() => setSaved(false), 3000)
      }
    })
  }

  return (
    <Panel>
      <div className="flex items-center justify-between px-4 py-3 border-b border-border-light dark:border-border-dark">
        <SectionLabel>Chapter Settings</SectionLabel>
        <button
          onClick={handleSave}
          disabled={saving}
          className="h-7 px-4 bg-primary-light dark:bg-button-dark text-white font-sora font-bold text-f10 tracking-wide hover:opacity-90 transition-opacity disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
        >
          {saving ? 'Saving…' : saved ? 'Saved ✓' : 'Save'}
        </button>
      </div>

      <div className="px-4 py-4 flex flex-col gap-4">
        {/* Basic info */}
        <div className="grid grid-cols-1 xs:grid-cols-2 gap-3">
          <div>
            <p className="text-f10 font-mono tracking-[0.15em] uppercase text-muted-light dark:text-muted-dark mb-1.5">
              Chapter Name
            </p>
            <input className={inputCls} value={form.name} onChange={(e) => set('name', e.target.value)} />
          </div>
          <div>
            <p className="text-f10 font-mono tracking-[0.15em] uppercase text-muted-light dark:text-muted-dark mb-1.5">
              Location
            </p>
            <input className={inputCls} value={form.location} onChange={(e) => set('location', e.target.value)} />
          </div>
          <div>
            <p className="text-f10 font-mono tracking-[0.15em] uppercase text-muted-light dark:text-muted-dark mb-1.5">
              Meeting Day
            </p>
            <input
              className={inputCls}
              value={form.meetingDay}
              onChange={(e) => set('meetingDay', e.target.value)}
              placeholder="Thursday"
            />
          </div>
          <div>
            <p className="text-f10 font-mono tracking-[0.15em] uppercase text-muted-light dark:text-muted-dark mb-1.5">
              Meeting Time
            </p>
            <input
              className={inputCls}
              value={form.meetingTime}
              onChange={(e) => set('meetingTime', e.target.value)}
              placeholder="7:00 AM"
            />
          </div>
        </div>
      </div>
    </Panel>
  )
}
