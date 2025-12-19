import { FC, ReactNode } from 'react'
import { motion } from 'framer-motion'
import { drawerVariants } from '@/app/lib/constants/motion'

const Drawer: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <motion.div
      variants={drawerVariants}
      initial="closed"
      animate="open"
      exit="closed"
      className="fixed right-0 top-0 h-full w-full max-w-2xl bg-gray-900 backdrop-blur-xl border-l border-gray-700/50 z-50 flex flex-col shadow-2xl overflow-hidden"
    >
      {children}
    </motion.div>
  )
}

export default Drawer
