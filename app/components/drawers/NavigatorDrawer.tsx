import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { createFormActions, resetForm } from '@/app/lib/redux/features/formSlice'
import { useAppDispatch, useFormSelector, useUserSelector } from '@/app/lib/redux/store'
import { addUserToState, setCloseAddUserDrawer, updateUserInState } from '@/app/lib/redux/features/userSlice'
import { useCreateUserMutation, useUpdateUserMutation } from '@/app/lib/redux/services/userApi'
import { chapterId } from '@/app/lib/constants/api/chapterId'
import { showToast } from '@/app/lib/redux/features/toastSlice'
import NavigatorForm from '../forms/NavigatorForm'
import Backdrop from '../common/Backdrop'
import Drawer from '../common/Drawer'
import validateNavigatorForm from '../forms/validations/validateNavigatorForm'
import { recomputeMemberCard } from '@/app/lib/redux/features/dashboardSlice'
import { recomputeDashboardStats } from '@/app/lib/utils/common/recomputeDashboardStats'

const NavigatorDrawer = () => {
  const dispatch = useAppDispatch()
  const { handleInput, setErrors, handleToggle } = createFormActions('navigatorForm', dispatch)
  const { navigatorForm } = useFormSelector()
  const { addUserDrawer, user } = useUserSelector()
  const onClose = () => dispatch(setCloseAddUserDrawer())
  const [createUser, { isLoading: isCreating }] = useCreateUserMutation()
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation()
  const inputs = navigatorForm.inputs
  const errors = navigatorForm.errors
  const isLoading = isCreating || isUpdating
  const isUpdateMode = navigatorForm?.inputs?.isUpdating

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault()

    if (!validateNavigatorForm(inputs, setErrors)) return

    try {
      const memberData = {
        ...inputs,
        chapterId,
        joinedAt: new Date(inputs?.joinedAt),
        expiresAt: new Date(inputs?.expiresAt)
      }

      if (navigatorForm?.inputs?.isUpdating) {
        const updated = await updateUser({ ...memberData, userId: navigatorForm?.inputs?.id }).unwrap()
        dispatch(updateUserInState(updated?.user))
      } else {
        const created = await createUser(memberData).unwrap()
        dispatch(addUserToState(created?.user))
        dispatch(recomputeMemberCard())
      }
      recomputeDashboardStats({ id: user?.id, isAdmin: user?.isAdmin })

      dispatch(resetForm('navigatorForm'))
      onClose()

      dispatch(
        showToast({
          type: 'success',
          message: navigatorForm?.inputs?.isUpdating ? 'Navigator updated' : 'New Navigator Added',
          description: `${memberData.name} ${navigatorForm?.inputs?.isUpdating ? 'has been updated!' : 'is now part of the crew!'}`
        })
      )
    } catch {
      dispatch(
        showToast({
          type: 'error',
          message: `Error ${navigatorForm?.inputs?.isUpdating ? 'updating' : 'adding'} navigator`,
          description: `There was an error ${navigatorForm?.inputs?.isUpdating ? 'updating' : 'creating'} ${navigatorForm?.inputs?.name}`
        })
      )
    }
  }

  return (
    <AnimatePresence>
      {addUserDrawer && (
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
                  {navigatorForm?.inputs?.isUpdating ? 'Update Navigator' : 'Add Navigator'}
                </h2>
                <p className="text-sm text-gray-500 mt-1">Create a new navigator profile</p>
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

            {/* Form */}
            <NavigatorForm
              errors={errors}
              handleInput={handleInput}
              handleSubmit={handleSubmit}
              handleToggle={handleToggle}
              inputs={inputs}
              isLoading={isLoading}
              isUpdating={isUpdateMode}
              onClose={onClose}
            />
          </Drawer>
        </>
      )}
    </AnimatePresence>
  )
}

export default NavigatorDrawer
