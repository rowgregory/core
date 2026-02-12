'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { motion } from 'framer-motion'

const AuthCustomCallback = () => {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return

    if (session?.user) {
      const { role } = session.user

      if (role === 'ADMIN' || role === 'SUPERUSER') {
        router.push('/admin/bridge')
      } else {
        router.push('/member/bridge')
      }
    } else {
      router.push('/auth/login')
    }
  }, [session, status, router])

  return (
    <div className="min-h-screen bg-[#121212] flex items-center justify-center p-6">
      {/* Optional: Loading dots animation */}
      <motion.div
        className="flex justify-center space-x-1 mt-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-2 h-2 bg-cyan-400 rounded-full"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 1, 0.3]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.2
            }}
          />
        ))}
      </motion.div>
    </div>
  )
}

export default AuthCustomCallback
