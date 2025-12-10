'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { motion } from 'framer-motion'
import LoginCard from '@/app/components/auth/LoginCard'
import LoginFeatures from '@/app/components/auth/LoginFeatures'
import LoginHeader from '@/app/components/auth/LoginHeader'
import { useSearchParams } from 'next/navigation'
import { ShieldX } from 'lucide-react'
import getAuthErrorMessage from '@/app/lib/utils/auth/getAuthErrorMessage'

const LoginPage = () => {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isEmailSent, setIsEmailSent] = useState(false)
  const [error, setError] = useState('')
  const searchParams = useSearchParams()
  const urlError = searchParams.get('error')
  const errorInfo = urlError ? getAuthErrorMessage(urlError) : null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const result = await signIn('email', {
        email,
        redirect: false,
        callbackUrl: '/auth/custom-callback'
      })

      if (result?.error) {
        setError('Failed to send magic link. Please try again.')
      } else {
        setIsEmailSent(true)
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100dvh-74px)] bg-gray-900 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Header */}
        <LoginHeader />

        {urlError && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl backdrop-blur-sm"
          >
            <div className="flex items-start space-x-3">
              <div className="shrink-0">
                <ShieldX className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <h3 className="text-red-400 font-semibold text-sm mb-1">{errorInfo?.title}</h3>
                <p className="text-red-300 text-sm leading-relaxed">{errorInfo?.message}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Login Card */}
        <LoginCard
          email={email}
          error={error}
          handleSubmit={handleSubmit}
          isEmailSent={isEmailSent}
          isLoading={isLoading}
          setEmail={setEmail}
          setError={setError}
          setIsEmailSent={setIsEmailSent}
        />

        {/* Features */}
        <LoginFeatures />

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mt-8"
        >
          <p className="text-xs text-gray-500">Coastal Referral Exchange Management System</p>
        </motion.div>
      </div>
    </div>
  )
}

export default LoginPage
