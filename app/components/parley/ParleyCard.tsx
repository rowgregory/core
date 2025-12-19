import { FC } from 'react'
import { IParley } from '@/types/parley'
import { motion } from 'framer-motion'
import { XCircle } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useUpdateParleyStatusMutation } from '@/app/redux/services/parleyApi'
import { chapterId } from '@/app/lib/constants/api/chapterId'
import { useAppDispatch } from '@/app/redux/store'
import { showToast } from '@/app/redux/features/toastSlice'
import Header from './Header'
import ParticipantsWithDirectionArrow from './ParticipantsWithDirectionArrow'
import MeetingDetails from './MeetingDetails'
import OutcomesForCompoletedMeetings from './OutcomesForCompoletedMeetings'
import RequestedActionButtons from './RequestedActionButtons'
import ConfirmedActionButtons from './ConfirmedActionButtons'
import { setInputs } from '@/app/redux/features/formSlice'
import { setOpenParleyDrawer, updateParleyInState } from '@/app/redux/features/parleySlice'

const ParleyCard: FC<{ parley: IParley; index: number }> = ({ parley, index }) => {
  const session = useSession()
  const [updateStatus, { isLoading: isUpdating }] = useUpdateParleyStatusMutation()
  const dispatch = useAppDispatch()
  const userId = session.data?.user?.id

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      const updated = await updateStatus({ chapterId, userId: userId, parleyId: id, status }).unwrap()
      dispatch(updateParleyInState({ id: parley?.id, data: updated?.parley }))

      dispatch(
        showToast({
          message: `Parley is Confirmed`,
          type: 'success',
          description: `Parley status update failed`
        })
      )
    } catch {
      dispatch(
        showToast({
          message: `Failed to Update`,
          type: 'error',
          description: `Parley status update failed`
        })
      )
    }
  }

  return (
    <motion.div
      key={parley.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ delay: index * 0.05 }}
      className={`backdrop-blur-sm border rounded-lg xs:rounded-xl p-3 xs:p-4 sm:p-6 hover:border-gray-600 transition-all ${
        parley.recipientId === userId && parley.status === 'REQUESTED'
          ? 'bg-cyan-800/20 border-cyan-400 border-2 shadow-lg shadow-cyan-500/20'
          : parley.status === 'CONFIRMED'
            ? 'bg-emerald-800/20 border-emerald-600/50'
            : parley.status === 'CANCELLED'
              ? 'bg-red-800/20 border-red-600/50'
              : parley.status === 'REQUESTED'
                ? 'bg-cyan-800/20 border-cyan-600/50'
                : parley.status === 'COMPLETED'
                  ? 'bg-violet-800/20 border-violet-600/50'
                  : 'bg-gray-800/50 border-gray-700'
      }`}
    >
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 xs:gap-4">
        {/* Main Info */}
        <div className="space-y-3 xs:space-y-4 w-full">
          {/* Header with Delete Button */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <Header parley={parley} />
            </div>
          </div>

          {/* Participants with direction arrow */}
          <ParticipantsWithDirectionArrow parley={parley} />

          {/* Meeting Details */}
          <MeetingDetails parley={parley} />

          {/* Outcomes (for completed meetings) */}
          {parley.completed && <OutcomesForCompoletedMeetings parley={parley} />}

          {/* Notes */}
          {parley.notes && (
            <div className="pt-2">
              <p className="text-xs xs:text-sm text-gray-400 italic line-clamp-3 xs:line-clamp-none">
                &quot;{parley.notes}&quot;
              </p>
            </div>
          )}

          {/* Action Buttons - Show below notes for recipients when status is REQUESTED */}
          {parley.recipientId === session.data?.user?.id && parley.status === 'REQUESTED' && (
            <RequestedActionButtons handleStatusUpdate={handleStatusUpdate} isUpdating={isUpdating} parley={parley} />
          )}

          {/* Actions for CONFIRMED meetings - Both parties can mark as completed */}
          {(parley.recipientId === session.data?.user?.id || parley.requesterId === session.data?.user?.id) &&
            parley.status === 'CONFIRMED' && (
              <ConfirmedActionButtons
                handleStatusUpdate={handleStatusUpdate}
                isUpdating={isUpdating}
                parley={parley}
                onEdit={() => {
                  const isUserReceiving = parley.recipientId === session.data?.user?.id
                  dispatch(
                    setInputs({
                      formName: 'parleyForm',
                      data: { ...parley, isUpdating: true, isReceiving: isUserReceiving }
                    })
                  )
                  dispatch(setOpenParleyDrawer())
                }}
                userId={session.data?.user?.id}
              />
            )}

          {/* Status message for CANCELLED meetings */}
          {parley.status === 'CANCELLED' && (
            <div className="pt-3 xs:pt-4 border-t border-gray-700">
              <div className="flex items-start gap-2 xs:gap-3 px-3 xs:px-4 py-2.5 xs:py-3 bg-red-600/10 border border-red-600/30 rounded-lg">
                <XCircle className="w-4 h-4 xs:w-5 xs:h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <p className="text-red-300 text-xs xs:text-sm font-medium">Meeting Cancelled</p>
                  <p className="text-red-400/80 text-[10px] xs:text-xs mt-0.5 xs:mt-1 leading-tight">
                    This parley has been cancelled by one of the participants
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default ParleyCard
