import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { useAppDispatch, useFormSelector, useUserSelector } from '@/app/lib/redux/store'
import Backdrop from '../common/Backdrop'
import Drawer from '../common/Drawer'
import { addUserToState, setCloseStowawayDrawer, updateUserInState } from '@/app/lib/redux/features/userSlice'
import StowawayForm from '../forms/StowawayForm'
import { createFormActions } from '@/app/lib/redux/features/formSlice'
import { showToast } from '@/app/lib/redux/features/toastSlice'
import { useSession } from 'next-auth/react'
import { chapterId } from '@/app/lib/constants/api/chapterId'
import { useCreateUserMutation, useUpdateStowawayMutation } from '@/app/lib/redux/services/userApi'
import validateStowawayForm from '../forms/validations/validateStowawayForm'

const StowawayDrawer = () => {
  const session = useSession()
  const user = session?.data?.user
  const dispatch = useAppDispatch()
  const onClose = () => dispatch(setCloseStowawayDrawer())
  const { stowawayForm } = useFormSelector()
  const inputs = stowawayForm?.inputs
  const { handleInput, setErrors, handleToggle } = createFormActions('stowawayForm', dispatch)
  const [createStowaway, { isLoading: isCreating }] = useCreateUserMutation()
  const [updateStowaway, { isLoading: isUpdating }] = useUpdateStowawayMutation()
  const isLoading = isCreating || isUpdating
  const { stowawayDrawer } = useUserSelector()

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault()

    if (!validateStowawayForm(stowawayForm?.inputs, setErrors)) return

    try {
      const stowawayData = {
        ...stowawayForm?.inputs,
        chapterId,
        userId: user?.id,
        hasCompletedApplication: false,
        isAddedByAdmin: user?.isAdmin,
        membershipStatus: 'FLAGGED'
      }

      if (inputs?.isUpdating) {
        const updated = await updateStowaway({ stowawayId: inputs?.id, ...stowawayData }).unwrap()
        dispatch(updateUserInState({ id: inputs.id, data: updated?.user }))
      } else {
        const created = await createStowaway(stowawayData).unwrap()
        dispatch(addUserToState(created.user))
      }

      onClose()

      dispatch(
        showToast({
          type: 'success',
          message: `${isUpdating ? 'Update' : 'Create'} Stowaway Flagged`,
          description: `The Stowaway has been ${isUpdating ? 'updated' : 'created'} and successfully flagged. They are now in the system and can be followed up with regarding Visitor Day.`
        })
      )
    } catch (error: any) {
      dispatch(
        showToast({
          type: 'error',
          message: `${isUpdating ? 'Update' : 'Create'} Stowaway Failed`,
          description:
            error.message ||
            `Failed to ${isUpdating ? 'update' : 'create'} the Stowaway. Please check the details and try again.`
        })
      )
    }
  }

  return (
    <AnimatePresence>
      {stowawayDrawer && (
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
                <h2 className="text-xl font-bold bg-linear-to-r from-cyan-400 via-blue-400 to-teal-400 bg-clip-text text-transparent">
                  {stowawayForm?.inputs?.isUpdating ? 'Update Stowaway' : 'Flag Stowaway'}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  A stowaway is a visitor whose interest in joining is unknown, but we keep their record for follow-up.
                </p>
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
            {/* Stowaway Form */}
            <StowawayForm
              inputs={stowawayForm?.inputs}
              handleInput={handleInput}
              isLoading={isLoading}
              handleSubmit={handleSubmit}
              isUpdating={stowawayForm?.inputs?.isUpdating}
              onClose={onClose}
              handleToggle={handleToggle}
            />
          </Drawer>
        </>
      )}
    </AnimatePresence>
  )
}

export default StowawayDrawer
