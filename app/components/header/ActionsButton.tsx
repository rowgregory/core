import { motion } from 'framer-motion'
import { useAppDispatch, useApplicationSelector } from '@/app/redux/store'
import useSoundEffect from '@/hooks/useSoundEffect'
import { setOpenActionDropdown } from '@/app/redux/features/appSlice'
import { Plus, ChevronDown } from 'lucide-react'

const ActionsButton = () => {
  const dispatch = useAppDispatch()
  const { actionDropdown } = useApplicationSelector()
  const { play } = useSoundEffect('/sound-effects/action-menu.mp3', true)

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          play()
          dispatch(setOpenActionDropdown())
        }}
        className="px-4 py-2 bg-linear-to-r from-blue-600 via-cyan-600 to-teal-600 text-white rounded-lg hover:from-cyan-500 hover:to-cyan-500 transition-all flex items-center space-x-2 font-medium shadow-lg text-sm"
      >
        <Plus className="w-5 h-5" />
        <span className="hidden sm:block">Actions</span>
        <ChevronDown className={`w-5 h-5 transition-transform ${actionDropdown ? 'rotate-180' : ''}`} />
      </motion.button>
    </div>
  )
}

export default ActionsButton
