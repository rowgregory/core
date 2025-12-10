'use client'

import { useAppDispatch } from '@/app/redux/store'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { ShipWheel } from 'lucide-react'

const AuthCustomCallback = () => {
  const { data: session, status } = useSession()
  const { push } = useRouter()
  const dispatch = useAppDispatch()

  useEffect(() => {
    const handlePostAuth = async () => {
      const user = session?.user
      if (status === 'authenticated' && user?.id) {
        try {
          if ((user?.isAdmin || user?.isSuperUser) && (user?.role === 'ADMIN' || user?.role === 'Super-User')) {
            push('/admin/bridge')
          } else {
            push('/member/bridge')
          }
        } catch {
          push('/auth/login?error=profile_load_failed')
        }
      } else if (status === 'unauthenticated') {
        push('/auth/login?error=auth_failed')
      }
    }

    if (status !== 'loading') {
      handlePostAuth()
    }
  }, [session, status, dispatch, push])

  return (
    <div className="min-h-screen bg-[#121212] flex items-center justify-center p-6">
      {/* Loading Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-8 shadow-2xl text-center max-w-md w-full relative z-10"
        style={{ boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)' }}
      >
        {/* Icon with nautical theme */}
        <motion.div
          className="w-16 h-16 bg-linear-to-br from-blue-600 to-cyan-600 rounded-full mx-auto mb-6 flex items-center justify-center relative"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        >
          {/* Nautical compass/anchor icon */}
          <ShipWheel className="text-white w-8 h-8" />

          {/* Animated spinner ring */}
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-white animate-spin"></div>
        </motion.div>

        {/* Title with coastal theme */}
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-2xl font-bold bg-linear-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-3"
        >
          Coastal Referral Exchange
        </motion.h2>

        {/* Loading text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-gray-300 mb-2"
        >
          Setting up your account...
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-sm text-gray-400"
        >
          Preparing your networking dashboard
        </motion.p>

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
      </motion.div>
    </div>
  )
}

export default AuthCustomCallback
