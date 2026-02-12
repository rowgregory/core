import { AnimatePresence, motion } from 'framer-motion'
import Backdrop from '../common/Backdrop'
import Drawer from '../common/Drawer'
import { X } from 'lucide-react'
import { useAnchorSelector, useAppDispatch, useFormSelector } from '@/app/lib/redux/store'
import { setCloseAnchorDrawer } from '@/app/lib/redux/features/anchorSlice'
import { createFormActions, resetForm } from '@/app/lib/redux/features/formSlice'
import AnchorForm from '../forms/AnchorForm'
import { chapterId } from '@/app/lib/constants/api/chapterId'
import { showToast } from '@/app/lib/redux/features/toastSlice'
import validateAnchorForm from '../forms/validations/validateAnchorForm'
import { createAnchor } from '@/app/lib/actions/createAnchor'
import { useRouter } from 'next/navigation'
import { updateAnchor } from '@/app/lib/actions/updateAnchor'
import { useSession } from 'next-auth/react'
import { useState } from 'react'

const AnchorDrawer = ({ users }) => {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const onClose = () => dispatch(setCloseAnchorDrawer())
  const { anchorDrawer } = useAnchorSelector()
  const { anchorForm } = useFormSelector()
  const inputs = anchorForm?.inputs
  const errors = anchorForm?.errors
  const session = useSession()
  const userId = session.data?.user?.id
  const [isLoading, setIsLoading] = useState(false)

  const { handleInput, setErrors } = createFormActions('anchorForm', dispatch)

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault()

    if (!validateAnchorForm(anchorForm?.inputs, setErrors)) return

    try {
      setIsLoading(true)
      const isExternalGiver = anchorForm?.inputs?.giverId === 'external'
      const isExternalReceiver = anchorForm?.inputs?.receiverId === 'external'

      // Prepare data for submission
      const submitData = {
        ...anchorForm?.inputs,
        businessValue: parseFloat(anchorForm?.inputs?.businessValue),
        closedDate: new Date(anchorForm?.inputs?.closedDate).toISOString(),
        chapterId,
        userId,

        // External giver attributes
        externalGiverName: anchorForm?.inputs?.externalGiverName || null,
        externalGiverEmail: anchorForm?.inputs?.externalGiverEmail || null,
        externalGiverCompany: anchorForm?.inputs?.externalGiverCompany || null,

        // External receiver attributes
        externalReceiverName: anchorForm?.inputs?.externalReceiverName || null,
        externalReceiverEmail: anchorForm?.inputs?.externalReceiverEmail || null,
        externalReceiverCompany: anchorForm?.inputs?.externalReceiverCompany || null,

        // Ensure proper handling of internal vs external participants
        giverId: isExternalGiver ? null : anchorForm?.inputs?.giverId,
        receiverId: isExternalReceiver ? null : anchorForm?.inputs?.receiverId
      }

      // Clean up data - remove empty external fields for internal participants
      if (!isExternalGiver) {
        delete submitData.externalGiverName
        delete submitData.externalGiverEmail
        delete submitData.externalGiverCompany
      }

      if (!isExternalReceiver) {
        delete submitData.externalReceiverName
        delete submitData.externalReceiverEmail
        delete submitData.externalReceiverCompany
      }

      if (inputs?.isUpdating) {
        await updateAnchor(anchorForm?.inputs?.id, submitData)
      } else {
        await createAnchor(submitData)
      }

      router.refresh()

      dispatch(resetForm('anchorForm'))
      onClose()

      // Determine participant types for success message
      const giverType = isExternalGiver ? 'external' : 'internal'
      const receiverType = isExternalReceiver ? 'external' : 'internal'
      const participantInfo =
        giverType === 'external' || receiverType === 'external'
          ? ` (${giverType} giver → ${receiverType} receiver)`
          : ''

      dispatch(
        showToast({
          type: 'success',
          message: `${inputs?.isUpdating ? 'Update' : 'Create'} Anchor Success`,
          description: `Anchor ${inputs?.isUpdating ? 'updated' : 'created'} successfully${participantInfo}.`
        })
      )
    } catch (error) {
      dispatch(
        showToast({
          type: 'error',
          message: `${inputs?.isUpdating ? 'Update' : 'Create'} Anchor Failed`,
          description: error.data.message || 'Unable to process request.'
        })
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AnimatePresence>
      {anchorDrawer && (
        <>
          {/* Backdrop Overlay */}
          <Backdrop onClose={onClose} />

          {/* Drawer */}
          <Drawer>
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-700/50">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.4 }}
              >
                <h2 className="text-xl font-bold bg-linear-to-r from-teal-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  Drop Anchor
                </h2>
                <p className="text-sm text-gray-500 mt-1">Thank a fellow navigator for their successful treasure map</p>
              </motion.div>

              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-all"
                initial={{ opacity: 0, rotate: -90 }}
                animate={{ opacity: 1, rotate: 0 }}
                transition={{ delay: 0.3, duration: 0.4 }}
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>

            <AnchorForm
              inputs={inputs}
              errors={errors}
              handleInput={handleInput}
              handleSubmit={handleSubmit}
              isLoading={isLoading}
              user={session.data?.user}
              isUpdating={inputs?.isUpdating}
              onClose={onClose}
              users={users}
            />
          </Drawer>
        </>
      )}
    </AnimatePresence>
  )
}

export default AnchorDrawer
