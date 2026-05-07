'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Pusher from 'pusher-js'

interface Attendee {
  name: string
  company: string
}

interface AttendanceListProps {
  initialAttendees: Attendee[]
  t: Record<string, string>
}

export function AttendanceList({ initialAttendees, t }: AttendanceListProps) {
  const [attendees, setAttendees] = useState<Attendee[]>(initialAttendees)

  useEffect(() => {
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!
    })

    const channel = pusher.subscribe('meeting-attendance')

    channel.bind('check-in', (data: Attendee) => {
      setAttendees((prev) => {
        // Avoid duplicates
        if (prev.some((a) => a.name === data.name)) return prev
        return [data, ...prev]
      })
    })

    return () => {
      channel.unbind_all()
      pusher.unsubscribe('meeting-attendance')
      pusher.disconnect()
    }
  }, [])

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-3 mb-2">
        <span className={`block w-4 h-px ${t.primaryBar} shrink-0`} aria-hidden="true" />
        <p className={`text-xs lg:text-sm font-mono tracking-[0.2em] uppercase ${t.primary}`}>
          In the Room · {attendees.length}
        </p>
      </div>

      <div className="flex flex-col gap-1.5 max-h-48 overflow-hidden">
        <AnimatePresence initial={false}>
          {attendees.map((a) => (
            <motion.div
              key={a.name}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className={`flex items-center gap-2 px-3 py-2 border ${t.border}`}
            >
              <div className={`w-1.5 h-1.5 rounded-full ${t.primaryBar} shrink-0 animate-pulse`} />
              <div className="min-w-0">
                <p className={`font-sora font-bold text-sm lg:text-base ${t.text} leading-tight truncate`}>{a.name}</p>
                <p className={`text-f10 lg:text-xs font-mono ${t.muted} truncate`}>{a.company}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}
