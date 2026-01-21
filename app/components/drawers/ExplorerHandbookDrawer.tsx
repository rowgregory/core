import { setCloseHandbookDrawer } from '@/app/lib/redux/features/appSlice'
import { RootState, useAppDispatch, useAppSelector } from '@/app/lib/redux/store'
import { AnimatePresence, motion } from 'framer-motion'
import React from 'react'

const ExplorerHandbookDrawer = () => {
  const dispatch = useAppDispatch()
  const { handbookDrawer } = useAppSelector((state: RootState) => state.app)
  const onClose = () => dispatch(setCloseHandbookDrawer())

  return (
    <AnimatePresence>
      {handbookDrawer && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-4xl bg-gray-900 shadow-2xl z-50 overflow-hidden flex flex-col"
            style={{ backgroundColor: '#1A1A1A' }}
          ></motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default ExplorerHandbookDrawer
