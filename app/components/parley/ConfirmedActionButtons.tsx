import { IParley } from '@/types/parley'
import React, { FC } from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle, CheckCircle, Edit3, XCircle } from 'lucide-react'
import { useDeleteParleyMutation } from '@/app/lib/redux/services/parleyApi'
import { chapterId } from '@/app/lib/constants/api/chapterId'
import { useAppDispatch } from '@/app/lib/redux/store'
import { deleteParleyFromState } from '@/app/lib/redux/features/parleySlice'
import { showToast } from '@/app/lib/redux/features/toastSlice'

const ConfirmedActionButtons: FC<{
  parley: IParley
  handleStatusUpdate: any
  isUpdating: boolean
  onEdit: () => void
  userId: string
}> = ({ parley, handleStatusUpdate, isUpdating, onEdit, userId }) => {
  const [deleteParley, { isLoading: isDeleting }] = useDeleteParleyMutation()
  const dispatch = useAppDispatch()

  const handleDelete = async () => {
    try {
      await deleteParley({ chapterId, userId, parleyId: parley.id }).unwrap()
      dispatch(deleteParleyFromState(parley.id))
      dispatch(
        showToast({
          type: 'success',
          message: 'Parley Deleted',
          description: 'The parley has been successfully removed.'
        })
      )
    } catch (error: any) {
      dispatch(
        showToast({
          type: 'error',
          message: 'Delete Failed',
          description: error.data?.error || 'Failed to delete parley'
        })
      )
    }
  }

  return (
    <div className="pt-4 border-t border-gray-700">
      <p className="text-xs text-gray-400 uppercase tracking-wide mb-3">Meeting Confirmed</p>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleStatusUpdate(parley.id, 'COMPLETED')}
            disabled={isUpdating}
            className="flex items-center space-x-2 px-4 py-2 border border-green-600 text-green-400 rounded-lg hover:bg-green-600/10 hover:border-green-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium cursor-pointer"
          >
            <CheckCircle className="w-4 h-4" />
            <span>Mark as Completed</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleStatusUpdate(parley.id, 'CANCELLED')}
            disabled={isUpdating}
            className="flex items-center space-x-2 px-4 py-2 border border-red-600 text-red-400 rounded-lg hover:bg-red-600/10 hover:border-red-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium cursor-pointer"
          >
            <XCircle className="w-4 h-4" />
            <span>Cancel Meeting</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={(e) => {
              e.stopPropagation()
              onEdit()
            }}
            disabled={isUpdating}
            className="flex items-center space-x-2 px-4 py-2 border border-cyan-600 text-cyan-300 rounded-lg hover:bg-cyan-600/10 hover:border-cyan-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium cursor-pointer"
          >
            <Edit3 className="w-4 h-4" />
            <span>Edit Details</span>
          </motion.button>
        </div>

        {/* Delete Button - Only show if user is the requester */}
        {parley.requesterId === userId && parley.status === 'REQUESTED' && (
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex items-center space-x-2 px-4 py-2 border border-red-600 text-red-400 rounded-lg hover:bg-red-600 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
            title="Delete parley"
          >
            <AlertTriangle className="w-4 h-4" />
            <span>Delete Parley</span>
          </button>
        )}
      </div>
    </div>
  )
}

export default ConfirmedActionButtons
