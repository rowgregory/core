import { ShipWheel } from 'lucide-react'
import { motion } from 'framer-motion'
import Link from 'next/link'

const LoginHeader = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="hidden sm:block text-center mb-6 sm:mb-8"
    >
      {/* Hide wheel on mobile, show from sm+ */}
      <Link href="/" className="flex items-center justify-center mb-4 sm:mb-6">
        <div className="w-16 h-16 bg-linear-to-r from-teal-500 via-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center">
          <ShipWheel className="w-9 h-9 text-white shipwheel-storm" />
        </div>
      </Link>

      <h1 className="text-2xl sm:text-3xl font-bold bg-linear-to-r from-teal-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent mb-1 sm:mb-2">
        Step Aboard
      </h1>

      <p className="text-gray-400 text-base sm:text-lg">Access The Bridge to navigate your chapter dashboard</p>
    </motion.div>
  )
}

export default LoginHeader
