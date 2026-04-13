import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { motion } from 'framer-motion'

export function StatTile({
  value,
  label,
  icon: Icon,
  delay
}: {
  value: string | number
  label: string
  icon: React.ElementType
  delay: number
}) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-16px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 12 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="flex items-center gap-4 px-5 py-4 border-r border-border-light dark:border-border-dark last:border-r-0"
    >
      <div className="w-9 h-9 flex items-center justify-center bg-primary-light/8 dark:bg-primary-dark/10 shrink-0">
        <Icon size={16} className="text-primary-light dark:text-primary-dark" aria-hidden="true" />
      </div>
      <div>
        <p className="font-sora font-black text-xl text-primary-light dark:text-primary-dark tabular-nums leading-none mb-0.5">
          {value}
        </p>
        <p className="text-f10 font-mono tracking-[0.15em] uppercase text-muted-light dark:text-muted-dark">{label}</p>
      </div>
    </motion.div>
  )
}
