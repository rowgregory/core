'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { useAppDispatch, useFormSelector, useTreasureMapSelector, useUserSelector } from '@/app/redux/store'
import Backdrop from '../common/Backdrop'
import Drawer from '../common/Drawer'
import {
  addTreasureMapToState,
  setCloseTreasureMapDrawer,
  updateTreasureMapInState
} from '@/app/redux/features/treasureMapSlice'
import TreasureMapForm from '../forms/TreasureMapForm'
import { createFormActions, resetForm } from '@/app/redux/features/formSlice'
import { showToast } from '@/app/redux/features/toastSlice'
import { chapterId } from '@/app/lib/constants/api/chapterId'
import { useCreateTreasureMapMutation, useUpdateTreasureMapMutation } from '@/app/redux/services/treasureMapApi'
import validateTreasureMapForm from '../forms/validations/validateTreasureMapForm'
import { recomputeTreasureMapCard } from '@/app/redux/features/dashboardSlice'
import { recomputeDashboardStats } from '@/app/lib/utils/common/recomputeDashboardStats'

const TreasureMapDrawer = () => {
  const dispatch = useAppDispatch()
  const onClose = () => dispatch(setCloseTreasureMapDrawer())
  const { treasureMapForm } = useFormSelector()
  const { user } = useUserSelector()
  const inputs = treasureMapForm?.inputs
  const errors = treasureMapForm?.errors
  const { handleInput, setErrors } = createFormActions('treasureMapForm', dispatch)
  const [createTreasureMap, { isLoading: isCreating }] = useCreateTreasureMapMutation()
  const [updateTreasureMap, { isLoading: isUpdating }] = useUpdateTreasureMapMutation()
  const isLoading = isCreating || isUpdating
  const { treasureMapDrawer } = useTreasureMapSelector()

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault()

    if (!validateTreasureMapForm(treasureMapForm?.inputs, setErrors)) return

    try {
      const treasureMapData = {
        ...treasureMapForm?.inputs,
        chapterId,
        userId: user?.id
      }

      if (inputs?.isUpdating) {
        const updated = await updateTreasureMap({ ...treasureMapData, treasureMapId: inputs?.id }).unwrap()
        dispatch(updateTreasureMapInState({ id: inputs?.id, data: updated?.treasureMap }))
      } else {
        const created = await createTreasureMap({ ...treasureMapData }).unwrap()
        dispatch(addTreasureMapToState(created?.treasureMap))
        dispatch(recomputeTreasureMapCard())
      }
      recomputeDashboardStats({ id: user?.id, isAdmin: user?.isAdmin })

      dispatch(resetForm('treasureMapForm'))
      onClose()

      dispatch(
        showToast({
          type: 'success',
          message: `Treasure Map ${isUpdating ? 'Updated' : 'Created'}`,
          description: `The treasure map has been ${isUpdating ? 'updated' : 'added'} to the log successfully.`
        })
      )
    } catch (error: any) {
      dispatch(
        showToast({
          type: 'error',
          message: `Treasure Map ${isUpdating ? 'Update' : 'Create'} Failed`,
          description: error?.data?.message || 'There was an issue charting the map. Try again.'
        })
      )
    }
  }

  return (
    <AnimatePresence>
      {treasureMapDrawer && (
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
                  {treasureMapForm?.inputs?.isUpdating ? 'Update Treasure Map' : 'Send Treasure Map'}
                </h2>
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
            {/* TreasureMap Form */}
            <TreasureMapForm
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

export default TreasureMapDrawer
