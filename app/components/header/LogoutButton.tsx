import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { LogOut } from 'lucide-react'

const LogoutButton = () => {
  const { push } = useRouter()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const handleLogout = async (e: { preventDefault: () => void }) => {
    e.preventDefault()

    try {
      setIsLoading(true)
      await signOut({
        callbackUrl: '/auth/login' // Optional: specify where to redirect after signout
      })

      push('/auth/login')
      setIsLoading(false)
    } catch {}
  }

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleLogout}
      className="relative p-2 bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-700 transition-all"
    >
      {isLoading ? (
        <div className="w-5 h-5 border-2 border-t-0 border-cyan-400 animate-spin rounded-full" />
      ) : (
        <LogOut className="w-5 h-5 text-gray-400" />
      )}
    </motion.button>
  )
}

export default LogoutButton
