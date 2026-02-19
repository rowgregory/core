import { FC, useState } from 'react'
import { IParley } from '@/types/parley'
import { motion } from 'framer-motion'
import { XCircle } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { store } from '@/app/lib/redux/store'
import { showToast } from '@/app/lib/redux/features/toastSlice'
import Header from '../parley/Header'
import ParticipantsWithDirectionArrow from '../parley/ParticipantsWithDirectionArrow'
import MeetingDetails from '../parley/MeetingDetails'
import OutcomesForCompoletedMeetings from '../parley/OutcomesForCompoletedMeetings'
import RequestedActionButtons from '../parley/RequestedActionButtons'
import ConfirmedActionButtons from '../parley/ConfirmedActionButtons'
import { setInputs } from '@/app/lib/redux/features/formSlice'
import { setOpenParleyDrawer } from '@/app/lib/redux/features/parleySlice'
import { updateParleyStatus } from '@/app/lib/actions/updateParleyStatus'
import { useRouter } from 'next/navigation'

const ParleyCard: FC<{ parley: IParley; index: number }> = ({ parley, index }) => {
  const router = useRouter()
  const session = useSession()
  const userId = session.data?.user?.id
  const [isUpdating, setIsUpdating] = useState(false)

  const handleStatusUpdate = async (id: string, status) => {
    try {
      setIsUpdating(true)

      await updateParleyStatus(id, status)

      router.refresh()

      store.dispatch(
        showToast({
          message: `Parley is Confirmed`,
          type: 'success',
          description: `Parley status update failed`
        })
      )
    } catch {
      store.dispatch(
        showToast({
          message: `Failed to Update`,
          type: 'error',
          description: `Parley status update failed`
        })
      )
    } finally {
      setIsUpdating(false)
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
            ? 'bg-violet-800/20 border-violet-600/50'
            : parley.status === 'CANCELLED'
              ? 'bg-red-800/20 border-red-600/50'
              : parley.status === 'REQUESTED'
                ? 'bg-cyan-800/20 border-cyan-600/50'
                : parley.status === 'COMPLETED'
                  ? 'bg-emerald-800/20 border-emerald-600/50'
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
                  store.dispatch(
                    setInputs({
                      formName: 'parleyForm',
                      data: { ...parley, isUpdating: true, isReceiving: isUserReceiving }
                    })
                  )
                  store.dispatch(setOpenParleyDrawer())
                }}
                userId={session.data?.user?.id}
              />
            )}

          {/* Status message for CANCELLED meetings */}
          {parley.status === 'CANCELLED' && (
            <div className="pt-3 xs:pt-4 border-t border-gray-700">
              <div className="flex items-start gap-2 xs:gap-3 px-3 xs:px-4 py-2.5 xs:py-3 bg-red-600/10 border border-red-600/30 rounded-lg">
                <XCircle className="w-4 h-4 xs:w-5 xs:h-5 text-red-400 shrink-0 mt-0.5" />
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
