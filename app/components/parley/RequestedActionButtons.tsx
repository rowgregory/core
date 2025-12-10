import React, { FC } from 'react'
import { motion } from 'framer-motion'
import { Check, XCircle } from 'lucide-react'
import { IParley } from '@/types/parley'

const RequestedActionButtons: FC<{ handleStatusUpdate: any; parley: IParley; isUpdating: boolean }> = ({
  handleStatusUpdate,
  parley,
  isUpdating
}) => {
  return (
    <div className="pt-4 border-t border-gray-700">
      <p className="text-xs text-gray-400 uppercase tracking-wide mb-3">Action Required</p>
      <div className="flex flex-wrap gap-3">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleStatusUpdate(parley.id, 'CONFIRMED')}
          disabled={isUpdating}
          className="flex items-center space-x-2 px-4 py-2 bg-linear-to-r from-emerald-600 to-green-600 text-white rounded-lg hover:from-emerald-500 hover:to-green-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
        >
          <Check className="w-4 h-4" />
          <span>Confirm</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleStatusUpdate(parley.id, 'CANCELLED')}
          disabled={isUpdating}
          className="flex items-center space-x-2 px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-800 hover:border-gray-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
        >
          <XCircle className="w-4 h-4" />
          <span>Decline Meeting</span>
        </motion.button>
      </div>
    </div>
  )
}

export default RequestedActionButtons
