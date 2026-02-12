import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { useAppDispatch, useFormSelector, useUserSelector } from '@/app/lib/redux/store'
import Backdrop from '../common/Backdrop'
import Drawer from '../common/Drawer'
import { setCloseSwabbieDrawer } from '@/app/lib/redux/features/userSlice'
import SwabbieForm from '../forms/SwabbieForm'
import { createFormActions, resetForm } from '@/app/lib/redux/features/formSlice'
import { showToast } from '@/app/lib/redux/features/toastSlice'
import { useSession } from 'next-auth/react'
import { chapterId } from '@/app/lib/constants/api/chapterId'
import validateSwabbieForm from '../forms/validations/validateSwabbieForm'
import { useState } from 'react'
import { updateUser } from '@/app/lib/actions/updateUser'
import { createUser } from '@/app/lib/actions/createUser'
import { useRouter } from 'next/navigation'

const SwabbieDrawer = () => {
  const router = useRouter()
  const session = useSession()
  const dispatch = useAppDispatch()
  const onClose = () => dispatch(setCloseSwabbieDrawer())
  const { swabbieForm } = useFormSelector()
  const inputs = swabbieForm?.inputs
  const errors = swabbieForm?.errors
  const { handleInput, setErrors, handleToggle } = createFormActions('swabbieForm', dispatch)
  const [isLoading, setIsLoading] = useState(false)
  const user = session?.data?.user
  const { swabbieDrawer } = useUserSelector()
  const isUpdating = inputs?.isUpdating

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault()

    if (!validateSwabbieForm(swabbieForm?.inputs, setErrors)) return

    try {
      setIsLoading(true)
      const swabbieData = {
        ...swabbieForm?.inputs,
        chapterId,
        userId: user?.id,
        hasCompletedApplication: true,
        isAddedByAdmin: true,
        membershipStatus: 'PENDING'
      }

      if (inputs?.isUpdating) {
        await updateUser(inputs?.id, swabbieData)
      } else {
        await createUser(swabbieData)
      }

      router.refresh()

      dispatch(resetForm('swabbieForm'))
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
    } finally {
      setIsLoading(false)
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
