import { motion } from 'framer-motion'
import { AlertCircle } from 'lucide-react'
import { FC } from 'react'

const InfoBanner: FC<{ type: string; description: string }> = ({ type, description }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-amber-900/30 border border-amber-700 rounded-lg p-4 flex items-start gap-3"
    >
      <div className="shrink-0 text-amber-400">
        <AlertCircle className="w-4 h-4" />
      </div>
      <div>
        <h3 className="text-white font-semibold">
          What is a <span className="capitalize">{type}</span>?
        </h3>
        <p className="text-gray-300 text-sm mt-1">
          A <span className="text-amber-300 font-medium">{type}</span> {description}
        </p>
      </div>
    </motion.div>
  )
}

export default InfoBanner
