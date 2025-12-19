import { motion } from 'framer-motion'
import { FC } from 'react'

interface QuickActionButtonProps {
  title: string
  description: string
  icon: any
  color: string
  onClick: () => void
}

const QuickActionButton: FC<QuickActionButtonProps> = ({ title, description, icon: Icon, color, onClick }) => {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`flex flex-col items-start p-4 bg-linear-to-br ${color} shadow-lg transition-all duration-300`}
    >
      <div className="flex items-center justify-between w-full mb-3">
        <Icon className="w-6 h-6" />
      </div>
      <h4 className="font-semibold text-base mb-1">{title}</h4>
      <p className="text-xs text-white/80 text-left leading-relaxed">{description}</p>
    </motion.button>
  )
}

export default QuickActionButton
