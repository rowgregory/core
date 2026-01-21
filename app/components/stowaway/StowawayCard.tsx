import React from 'react'
import { motion } from 'framer-motion'
import { Mail, Building2, Briefcase, User, UserCheck, X } from 'lucide-react'
import { chapterId } from '@/app/lib/constants/api/chapterId'
import { useUpdateUserStatusMutation } from '@/app/lib/redux/services/userApi'
import { useAppDispatch, useUserSelector } from '@/app/lib/redux/store'
import { showToast } from '@/app/lib/redux/features/toastSlice'
import { setOpenStowawayDrawer } from '@/app/lib/redux/features/userSlice'
import { setInputs } from '@/app/lib/redux/features/formSlice'

interface StowawayCardProps {
  stowaway: {
    id: string
    name: string
    email: string
    company: string
    industry: string
    membershipStatus: string
    role: string
  }
  onClick?: () => void
  className?: string
}

const StowawayCard: React.FC<StowawayCardProps> = ({ stowaway, className = '' }) => {
  const [updateStowaway, { isLoading }] = useUpdateUserStatusMutation()
  const { user } = useUserSelector()
  const dispatch = useAppDispatch()

  const handleStatusUpdate = async (newStatus: string) => {
    try {
      await updateStowaway({
        chapterId,
        userId: user?.id,
        swabbieId: stowaway.id,
        membershipStatus: newStatus
      }).unwrap()
    } catch (error: any) {
      dispatch(
        showToast({
          type: 'error',
          message: 'Failed to update stowaway status.',
          description: error?.data?.message,
          duration: 10000
        })
      )
    }
  }

  const isRejected = stowaway.membershipStatus === 'REJECTED'
  const isSwabbie = stowaway.role === 'SWABBIE'

  return (
    <motion.div
      onClick={() => {
        dispatch(setOpenStowawayDrawer())
        dispatch(setInputs({ formName: 'stowawayForm', data: { ...stowaway, isUpdating: true } }))
      }}
      className={`rounded-xl p-6 transition-all cursor-pointer ${
        isRejected
          ? 'bg-red-900/20 border border-red-700/50 hover:border-red-500/50 opacity-75'
          : isSwabbie
            ? 'bg-yellow-900/20 border border-yellow-700/50 hover:border-yellow-500/50 opacity-75'
            : 'bg-gray-800 border border-gray-700 hover:border-cyan-500/50'
      } ${className}`}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header with avatar and name */}
      <div className="flex items-center space-x-4 mb-4">
        <div className="relative">
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center ${
              isRejected
                ? 'bg-gradient-to-br from-red-500 to-red-700'
                : isSwabbie
                  ? 'bg-gradient-to-br from-yellow-500 to-yellow-700'
                  : 'bg-gradient-to-br from-cyan-500 to-blue-600'
            }`}
          >
            <User className="w-6 h-6 text-white" />
          </div>
          {/* Status indicator badge */}
          <div
            className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-gray-800 flex items-center justify-center ${
              isRejected ? 'bg-red-500' : isSwabbie ? 'bg-yellow-500' : 'bg-yellow-500'
            }`}
          >
            <span className="text-xs text-gray-900 font-bold">{isRejected ? 'R' : isSwabbie ? 'W' : 'S'}</span>
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <h3 className={`text-lg font-semibold truncate ${isRejected || isSwabbie ? 'text-gray-400' : 'text-white'}`}>
            {stowaway.name}
          </h3>
          <p
            className={`text-sm font-medium ${
              isRejected ? 'text-red-400' : isSwabbie ? 'text-yellow-400' : 'text-cyan-400'
            }`}
          >
            {isRejected ? 'Walked the Plank' : isSwabbie ? 'Swabbie' : 'Stowaway'}
          </p>
        </div>
      </div>

      {/* Contact and business info */}
      <div className="space-y-3">
        <div className="flex items-center space-x-3 text-sm">
          <Mail className="w-4 h-4 text-gray-400 shrink-0" />
          <span className={`truncate ${isRejected || isSwabbie ? 'text-gray-500' : 'text-gray-300'}`}>
            {stowaway.email}
          </span>
        </div>

        <div className="flex items-center space-x-3 text-sm">
          <Building2 className="w-4 h-4 text-gray-400 shrink-0" />
          <span className={`truncate ${isRejected || isSwabbie ? 'text-gray-500' : 'text-gray-300'}`}>
            {stowaway.company}
          </span>
        </div>

        <div className="flex items-center space-x-3 text-sm">
          <Briefcase className="w-4 h-4 text-gray-400 shrink-0" />
          <span className={`truncate ${isRejected || isSwabbie ? 'text-gray-500' : 'text-gray-300'}`}>
            {stowaway.industry}
          </span>
        </div>
      </div>

      {/* Action buttons or status */}
      <div className="mt-4 pt-4 border-t border-gray-700/50">
        {isRejected || isSwabbie ? (
          <div className="text-center">
            <p className={`text-sm font-medium ${isRejected ? 'text-red-400' : 'text-yellow-400'}`}>
              {isRejected ? 'Rejected - Walked the Plank' : 'Converted to Swabbie'}
            </p>
            <p className="text-xs text-gray-500 mt-1">Click card to view full profile</p>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3 mb-5 ">
              <motion.button
                onClick={(e) => {
                  e.stopPropagation()
                  handleStatusUpdate('PENDING')
                }}
                disabled={isLoading}
                className="flex-1 flex items-center justify-center gap-x-2 px-4 py-2 border border-emerald-600 text-emerald-400 rounded-lg hover:bg-emerald-600/10 hover:border-emerald-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium cursor-pointer whitespace-nowrap"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <UserCheck className="w-4 h-4" />
                Make Swabbie
              </motion.button>

              <motion.button
                onClick={(e) => {
                  e.stopPropagation()
                  handleStatusUpdate('REJECTED')
                }}
                disabled={isLoading}
                className="flex-1 flex items-center justify-center gap-x-2 px-4 py-2 border border-red-600 text-red-400 rounded-lg hover:bg-red-600/10 hover:border-red-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium cursor-pointer whitespace-nowrap"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <X className="w-4 h-4" />
                Walk the Plank
              </motion.button>
            </div>

            <p className="text-xs text-gray-500 text-center mt-2">Click card to view full profile</p>
          </>
        )}
      </div>
    </motion.div>
  )
}

export default StowawayCard
