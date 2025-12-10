import { AnimatePresence, motion } from 'framer-motion'
import React from 'react'
import Backdrop from '../common/Backdrop'
import Drawer from '../common/Drawer'
import { useAppDispatch, useGrogSelector, useFormSelector, useUserSelector } from '@/app/redux/store'
import { X } from 'lucide-react'
import { clearInputs, createFormActions } from '@/app/redux/features/formSlice'
import GrogForm from '../forms/GrogForm'
import { setCloseGrogDrawer } from '@/app/redux/features/grogSlice'
import { useCreateGrogMutation, useUpdateGrogMutation } from '@/app/redux/services/grogApi'
import { chapterId } from '@/app/lib/constants/api/chapterId'
import { showToast } from '@/app/redux/features/toastSlice'
import validateGrogForm from '../forms/validations/validateGrogForm'

const GrogDrawer = () => {
  const dispatch = useAppDispatch()
  const onClose = () => dispatch(setCloseGrogDrawer())
  const { handleInput, setErrors } = createFormActions('grogForm', dispatch)
  const { grogDrawer } = useGrogSelector()
  const { grogForm } = useFormSelector()
  const inputs = grogForm?.inputs
  const errors = grogForm?.errors
  const [createGrog, { isLoading: isCreating }] = useCreateGrogMutation()
  const [updateGrog, { isLoading: isUpdating }] = useUpdateGrogMutation()
  const isLoading = isCreating || isUpdating
  const { user } = useUserSelector()

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault()

    if (!validateGrogForm(grogForm?.inputs, setErrors)) return

    try {
      const submitData = {
        ...grogForm?.inputs,
        chapterId,
        userId: user?.id
      }

      if (inputs?.isUpdating) {
        await updateGrog({ ...submitData, grogId: grogForm?.inputs?.id }).unwrap()
      } else {
        await createGrog(submitData).unwrap()
      }

      onClose()

      dispatch(clearInputs({ formName: 'grogForm' }))

      dispatch(
        showToast({
          type: 'success',
          message: `${isUpdating ? 'Update' : 'Create'} Grog Success`,
          description: `Grog ${isUpdating ? 'updated' : 'created'} successfully.`
        })
      )
    } catch (error: any) {
      dispatch(
        showToast({
          type: 'error',
          message: `${isUpdating ? 'Update' : 'Create'} Grog Failed`,
          description: error.message || 'Unable to process request.'
        })
      )
    }
  }

  return (
    <AnimatePresence>
      {grogDrawer && (
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
                  Launch Grog
                </h2>
                <p className="text-sm text-gray-500 mt-1">Plan a Grog for your crew and set sail for adventure</p>
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

            <GrogForm
              inputs={inputs}
              errors={errors}
              handleInput={handleInput}
              handleSubmit={handleSubmit}
              isLoading={isLoading}
              user={user}
              isUpdating={inputs?.isUpdating}
              onClose={onClose}
            />
          </Drawer>
        </>
      )}
    </AnimatePresence>
  )
}

export default GrogDrawer
