import React from 'react'
import { motion } from 'framer-motion'
import { MessageSquare, Zap } from 'lucide-react'
import useSoundEffect from '@/hooks/useSoundEffect'

const StormWatchSupport = ({ setOpen }: { setOpen: (open: boolean) => void }) => {
  const { play } = useSoundEffect('/sound-effects/ships-bell.mp3', true)
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.5 }}
      className="bg-linear-to-r from-amber-800/20 to-orange-700/20 backdrop-blur-md rounded-2xl border border-amber-500/30 p-4 sm:p-6 shadow-xl shadow-orange-900/50"
    >
      <div className="flex items-center space-x-3 mb-4">
        <Zap className="h-6 w-6 text-amber-400" />
        <h3 className="text-xl font-semibold text-white">Storm Watch Support</h3>
      </div>

      <p className="text-slate-200 text-sm mb-4">
        Our Quartermaster is ready to help with any questions about your swabbie application or crew operations.
      </p>

      <motion.button
        onClick={() => {
          play()
          setOpen(true)
        }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full bg-linear-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white py-3 rounded-xl font-medium transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg shadow-amber-900/50"
      >
        <MessageSquare className="h-4 w-4" />
        <span>Signal Quartermaster</span>
      </motion.button>
    </motion.div>
  )
}

export default StormWatchSupport
