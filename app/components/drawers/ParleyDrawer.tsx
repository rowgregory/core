import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { setCloseParleyDrawer } from '@/app/lib/redux/features/parleySlice'
import { useAppDispatch, useFormSelector, useParleySelector } from '@/app/lib/redux/store'
import Backdrop from '../common/Backdrop'
import { createFormActions, resetForm } from '@/app/lib/redux/features/formSlice'
import Drawer from '../common/Drawer'
import { showToast } from '@/app/lib/redux/features/toastSlice'
import validateParleyForm from '../forms/validations/validateParleyForm'
import { chapterId } from '@/app/lib/constants/api/chapterId'
import ParleyForm from '../forms/ParleyForm'
import { useRef, useState } from 'react'
import { useSession } from 'next-auth/react'
import { updateParley } from '@/app/lib/actions/updateParley'
import { createParley } from '@/app/lib/actions/createParley'
import { useRouter } from 'next/navigation'

const ParleyDrawer = ({ users }) => {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const onClose = () => dispatch(setCloseParleyDrawer())
  const { parleyDrawer } = useParleySelector()
  const { parleyForm } = useFormSelector()
  const inputs = parleyForm?.inputs
  const errors = parleyForm?.errors
  const { handleInput, setErrors } = createFormActions('parleyForm', dispatch)
  const [isLoading, setIsLoading] = useState(false)
  const drawerRef = useRef(null) as any
  const session = useSession()
  const user = session.data?.user

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault()

    if (!validateParleyForm(parleyForm?.inputs, setErrors))
      return drawerRef.current.scrollTo({ behavior: 'smooth', top: 0 })

    try {
      setIsLoading(true)

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
        await updateParley(inputs?.id, parleyData)
      } else {
        await createParley(parleyData)
      }

      router.refresh()

      dispatch(resetForm('parleyForm'))
      onClose()

      dispatch(
        showToast({
          type: 'success',
          message: `${inputs?.isUpdating ? 'Parley Updated!' : 'New Parley Set Sail!'}`,
          description: inputs?.isUpdating
            ? 'Your parley has been successfully updated and is ready to proceed.'
            : 'Your parley has been successfully created and is ready to chart its course!'
        })
      )
    } catch (error) {
      dispatch(
        showToast({
          type: 'error',
          message: `${inputs?.isUpdating ? 'Update' : 'Create'} Parley Failed`,
          description: error.data.message || 'Unable to process request.'
        })
      )
    } finally {
      setIsLoading(false)
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
                <h2 className="text-xl font-bold bg-linear-to-r from-teal-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  {inputs?.isUpdating ? 'Update' : 'Schedule'} Parley
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  {inputs?.isUpdating ? 'Updating your existing meeting' : 'Create a new meeting between crew members'}
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
          </Drawer>
        </>
      )}
    </AnimatePresence>
  )
}

export default ParleyDrawer
