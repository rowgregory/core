import { FC, FormEvent } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { AlertCircle, ArrowRight, Loader2, Mail } from 'lucide-react'
import SailboatSVG from '@/public/svg/SailboatSVG'

interface ILoginCard {
  isEmailSent: boolean
  handleSubmit: (e: FormEvent) => void
  email: string
  setEmail: (email: string) => void
  isLoading: boolean
  error: string
  setIsEmailSent: (isEmailSent: boolean) => void
  setError: (error: string) => void
}

const LoginCard: FC<ILoginCard> = ({
  isEmailSent,
  handleSubmit,
  email,
  setEmail,
  isLoading,
  error,
  setIsEmailSent,
  setError
}) => {
  const handleTryAgain = () => {
    setIsEmailSent(false)
    setEmail('')
    setError('')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-4 sm:p-8 shadow-2xl"
      style={{ boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)' }}
    >
      <AnimatePresence mode="wait">
        {!isEmailSent ? (
          <motion.div
            key="login-form"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mb-6">
              <h2 className="text-center sm:text-left text-xl font-semibold text-white mb-2">Sign in to The Bridge</h2>
              <p className="text-center sm:text-left text-gray-400 text-sm">
                Enter your email to receive a secure magic link
              </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="refer_sqysh@sqysh.io"
                    disabled={isLoading}
                    className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 focus:outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
              </div>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center space-x-2 text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg p-3"
                >
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </motion.div>
              )}
              <motion.button
                type="submit"
                disabled={isLoading || !email}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full px-6 py-3 bg-linear-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:from-blue-500 hover:to-cyan-500 transition-all flex items-center justify-center space-x-2 font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 cursor-pointer"
                style={{ boxShadow: '0 0 20px rgba(139, 92, 246, 0.4)' }}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Sending Magic Link...</span>
                  </>
                ) : (
                  <>
                    <span>Send Magic Link</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </motion.button>
            </form>
            <div className="mt-6 pt-6 border-t border-gray-700">
              <p className="text-xs text-gray-500 text-center">
                Only registered Core chapter members can access this system.
                <br />
                Contact your chapter admin if you need access.
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="email-sent"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="text-center"
          >
            <SailboatSVG />
            <h2 className="text-xl font-semibold text-white mb-3">Check your email</h2>
            <p className="text-gray-400 mb-2">We&apos;ve sent a secure magic link to:</p>
            <p className="text-violet-400 font-medium mb-6">{email}</p>
            <div className="bg-gray-700/30 border border-gray-600 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-300 leading-relaxed">
                Click the link in your email to sign in securely. The link will expire in 15 minutes for your security.
              </p>
            </div>
            <motion.button
              onClick={handleTryAgain}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full px-6 py-3 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 hover:text-white transition-all font-medium"
            >
              Try a different email
            </motion.button>

            <p className="text-xs text-gray-500 mt-4">
              Didn&apos;t receive the email? Check your spam folder or try again.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default LoginCard
