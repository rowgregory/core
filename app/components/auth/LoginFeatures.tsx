import { motion } from 'framer-motion'
import { Building2, Shield, Users } from 'lucide-react'

const LoginFeatures = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.3 }}
      className="mt-6 grid grid-cols-3 border border-border-light dark:border-border-dark"
    >
      {[
        { icon: Shield, label: 'Secure Access' },
        { icon: Users, label: 'Member Portal' },
        { icon: Building2, label: 'Chapter Tools' }
      ].map(({ icon: Icon, label }) => (
        <div
          key={label}
          className="flex flex-col items-center justify-center gap-2 py-4 border-r border-border-light dark:border-border-dark last:border-r-0"
        >
          <Icon className="w-4 h-4 text-primary-light dark:text-primary-dark" aria-hidden="true" />
          <p className="text-f10 font-mono tracking-[0.12em] uppercase text-muted-light dark:text-muted-dark">
            {label}
          </p>
        </div>
      ))}
    </motion.div>
  )
}

export default LoginFeatures
