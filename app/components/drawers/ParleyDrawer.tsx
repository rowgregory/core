import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { addParleyToState, setCloseParleyDrawer, updateParleyInState } from '@/app/redux/features/parleySlice'
import { useAppDispatch, useFormSelector, useParleySelector, useUserSelector } from '@/app/redux/store'
import Backdrop from '../common/Backdrop'
import { clearErrors, clearInputs, createFormActions } from '@/app/redux/features/formSlice'
import Drawer from '../common/Drawer'
import { useCreateParleyMutation, useUpdateParleyMutation } from '@/app/redux/services/parleyApi'
import { showToast } from '@/app/redux/features/toastSlice'
import validateParleyForm from '../forms/validations/validateParleyForm'
import { chapterId } from '@/app/lib/constants/api/chapterId'
import ParleyForm from '../forms/ParleyForm'
import { useRef } from 'react'

const ParleyDrawer = () => {
  const dispatch = useAppDispatch()
  const onClose = () => dispatch(setCloseParleyDrawer())
  const { parleyDrawer } = useParleySelector()
  const { parleyForm } = useFormSelector()
  const inputs = parleyForm?.inputs
  const errors = parleyForm?.errors
  const { handleInput, setErrors } = createFormActions('parleyForm', dispatch)
  const [createParley, { isLoading: isCreating }] = useCreateParleyMutation()
  const [updateParley, { isLoading: isUpdating }] = useUpdateParleyMutation()
  const isLoading = isCreating || isUpdating
  const { user, users } = useUserSelector()
  const drawerRef = useRef(null) as any

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault()

    if (!validateParleyForm(parleyForm?.inputs, setErrors))
      return drawerRef.current.scrollTo({ behavior: 'smooth', top: 0 })

    try {
      // Combine date and time into scheduledAt
      const scheduledAt = new Date(inputs?.scheduledAt)

      const parleyData = {
        ...parleyForm?.inputs,
        scheduledAt: scheduledAt.toISOString(),
        duration: parseInt(inputs?.duration),
        chapterId,
        userId: user?.id,
        status: inputs?.status
      }

      if (inputs?.isUpdating) {
        const updated = await updateParley({ parleyId: inputs?.id, ...parleyData }).unwrap()
        dispatch(updateParleyInState({ id: inputs?.id, data: updated?.parley }))
      } else {
        const created = await createParley(parleyData).unwrap()
        dispatch(addParleyToState(created?.parley))
      }

      onClose()

      dispatch(clearInputs({ formName: 'parleyForm' }))
      dispatch(clearErrors({ formName: 'parleyForm' }))

      dispatch(
        showToast({
          type: 'success',
          message: `${inputs?.isUpdating ? 'Parley Updated!' : 'New Parley Set Sail!'}`,
          description: inputs?.isUpdating
            ? 'Your parley has been successfully updated and is ready to proceed.'
            : 'Your parley has been successfully created and is ready to chart its course!'
        })
      )
    } catch (error: any) {
      dispatch(
        showToast({
          type: 'error',
          message: `${inputs?.isUpdating ? 'Update' : 'Create'} Parley Failed`,
          description: error.data.message || 'Unable to process request.'
        })
      )
    }
  }

  return (
    <AnimatePresence>
      {parleyDrawer && (
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
                <h2 className="text-xl font-bold bg-gradient-to-r from-teal-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  {inputs?.isUpdating ? 'Update' : 'Schedule'} Parley
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  {inputs?.isUpdating ? 'Updating yer existing parley' : 'Create a new parley between crew members'}
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

            {/* Form */}
            {/* <div ref={drawerRef} className="flex-1 overflow-y-auto"> */}
            <ParleyForm
              errors={errors}
              handleInput={handleInput}
              handleSubmit={handleSubmit}
              inputs={inputs}
              isLoading={isLoading}
              onClose={onClose}
              user={user}
              users={users}
              isUpdating={inputs?.isUpdating}
              ref={drawerRef}
            />
            {/* </div> */}
          </Drawer>
        </>
      )}
    </AnimatePresence>
  )
}

export default ParleyDrawer
