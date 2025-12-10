import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { useAppDispatch, useFormSelector, useUserSelector } from '@/app/redux/store'
import Backdrop from '../common/Backdrop'
import Drawer from '../common/Drawer'
import { addUserToState, setCloseSwabbieDrawer, updateUserInState } from '@/app/redux/features/userSlice'
import SwabbieForm from '../forms/SwabbieForm'
import { createFormActions } from '@/app/redux/features/formSlice'
import { showToast } from '@/app/redux/features/toastSlice'
import { useSession } from 'next-auth/react'
import { chapterId } from '@/app/lib/constants/api/chapterId'
import { useCreateUserMutation, useUpdateUserMutation } from '@/app/redux/services/userApi'
import validateSwabbieForm from '../forms/validations/validateSwabbieForm'

const SwabbieDrawer = () => {
  const session = useSession()
  const dispatch = useAppDispatch()
  const onClose = () => dispatch(setCloseSwabbieDrawer())
  const { swabbieForm } = useFormSelector()
  const inputs = swabbieForm?.inputs
  const errors = swabbieForm?.errors
  const { handleInput, setErrors, handleToggle } = createFormActions('swabbieForm', dispatch)
  const [createSwabbie, { isLoading: isCreating }] = useCreateUserMutation()
  const [updateSwabbie, { isLoading: isUpdating }] = useUpdateUserMutation()
  const isLoading = isCreating || isUpdating
  const user = session?.data?.user
  const { swabbieDrawer } = useUserSelector()

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault()

    if (!validateSwabbieForm(swabbieForm?.inputs, setErrors)) return

    try {
      const swabbieData = {
        ...swabbieForm?.inputs,
        chapterId,
        userId: user?.id,
        hasCompletedApplication: true,
        isAddedByAdmin: true,
        membershipStatus: 'PENDING'
      }

      if (inputs?.isUpdating) {
        const updated = await updateSwabbie({ swabbieId: inputs?.id, ...swabbieData }).unwrap()
        dispatch(updateUserInState({ id: inputs.id, data: updated?.user }))
      } else {
        const created = await createSwabbie({ ...swabbieData }).unwrap()
        dispatch(addUserToState(created?.user))
      }

      onClose()

      dispatch(
        showToast({
          type: 'success',
          message: `${isUpdating ? 'Update' : 'Create'} Swabbie Success`,
          description: `Swabbie ${isUpdating ? 'updated' : 'created'} successfully.`
        })
      )
    } catch (error: any) {
      dispatch(
        showToast({
          type: 'error',
          message: `${isUpdating ? 'Update' : 'Create'} Swabbie Failed`,
          description: error.data.message || 'Unable to process request.'
        })
      )
    }
  }

  return (
    <AnimatePresence>
      {swabbieDrawer && (
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
                  {inputs?.isUpdating ? 'Update Swabbie' : 'Draft Swabbie'}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Sends email to Swabbie upon submission where they can view their application from the portal. This is
                  the same as if they were to fill out the application themselves — this represents a user who knows
                  they want to join and are ready for the team to start the process.
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
            {/* Swabbie Form */}
            <SwabbieForm
              inputs={inputs}
              errors={errors}
              handleInput={handleInput}
              isLoading={isLoading}
              handleSubmit={handleSubmit}
              isUpdating={inputs?.isUpdating}
              onClose={onClose}
              handleToggle={handleToggle}
            />
          </Drawer>
        </>
      )}
    </AnimatePresence>
  )
}

export default SwabbieDrawer
