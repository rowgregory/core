import React, { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { initialParleyFormState } from '@/app/lib/constants/entities/initialParleyFormState'
import { setOpenAnchorDrawer } from '@/app/redux/features/anchorSlice'
import { initialAnchorFormState } from '@/app/lib/constants/anchor'
import { setOpenTreasureMapDrawer } from '@/app/redux/features/treasureMapSlice'
import { initialTreasureMapFormState } from '@/types/treasure-map'
import { setOpenGrogDrawer } from '@/app/redux/features/grogSlice'
import {
  Users,
  Calendar,
  Anchor,
  Layers3,
  Sailboat,
  Beer,
  Plus,
  ChevronDown,
  LifeBuoy,
  Coins,
  ChevronRight,
  Flag
} from 'lucide-react'
import { setOpenParleyDrawer } from '@/app/redux/features/parleySlice'
import { setOpenAddUserDrawer, setOpenStowawayDrawer, setOpenSwabbieDrawer } from '@/app/redux/features/userSlice'
import { useAppDispatch, useSettingsSelector, useUserSelector } from '@/app/redux/store'
import { navigatorInputs, setInputs } from '@/app/redux/features/formSlice'
import { useRouter } from 'next/navigation'
import useSoundEffect from '@/hooks/useSoundEffect'

const actionItems = (
  isAdmin: boolean,
  isGrogUnlocked: boolean | undefined,
  isMusterUnlocked: boolean | undefined,
  isBootyUnlocked: boolean | undefined,
  userId: string
) => [
  {
    action: 'schedule-parley',
    label: 'Schedule Parley',
    icon: Calendar,
    open: setOpenParleyDrawer,
    formName: 'parleyForm',
    initial: { ...initialParleyFormState, requesterId: userId },
    isUnlocked: true
  },
  {
    action: 'create-treasure-map',
    label: 'Send Treasure Map',
    icon: Layers3,
    open: setOpenTreasureMapDrawer,
    formName: 'treasureMapForm',
    initial: { ...initialTreasureMapFormState, giverId: userId },
    isUnlocked: true
  },
  {
    action: 'anchor',
    label: 'Drop Anchor',
    icon: Anchor,
    open: setOpenAnchorDrawer,
    formName: 'anchorForm',
    initial: { ...initialAnchorFormState, giverId: userId },
    isUnlocked: true
  },
  // Nested user creation actions
  {
    action: 'crew-management',
    label: 'Crew Management',
    icon: Users,
    hasSubmenu: true,
    submenu: [
      {
        action: 'flag-stowaway',
        label: 'Flag Stowaway',
        icon: Flag,
        open: setOpenStowawayDrawer,
        formName: 'stowawayForm',
        initial: {},
        isUnlocked: true
      },
      {
        action: 'add-swabbie',
        label: 'Draft Swabbie',
        icon: Sailboat,
        open: setOpenSwabbieDrawer,
        formName: 'swabbieForm',
        initial: {},
        isUnlocked: true
      },
      ...(isAdmin
        ? [
            {
              action: 'add-navigator',
              label: 'Add Navigator',
              icon: Users,
              open: setOpenAddUserDrawer,
              formName: 'navigatorForm',
              initial: navigatorInputs,
              isUnlocked: true
            }
          ]
        : [])
    ],
    isUnlocked: true
  },
  ...(isAdmin
    ? [
        {
          action: 'launch-grog',
          label: 'Launch Grog',
          icon: Beer,
          open: setOpenGrogDrawer,
          formName: 'grogForm',
          initial: {},
          isUnlocked: isGrogUnlocked,
          lockKey: 'grog'
        },
        {
          action: 'call-muster',
          label: 'Call Muster',
          icon: LifeBuoy,
          open: () => {},
          formName: 'musterForm',
          initial: {},
          isUnlocked: isMusterUnlocked,
          lockKey: 'muster'
        },
        {
          action: 'collect-booty',
          label: 'Collect Booty',
          icon: Coins,
          open: () => {},
          formName: 'bootyForm',
          initial: {},
          isUnlocked: isBootyUnlocked,
          lockKey: 'booty'
        }
      ]
    : [])
]

const ActionButtonWithDropdown = () => {
  const [isActionsOpen, setIsActionsOpen] = useState(false)
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null)
  const dispatch = useAppDispatch()
  const { user } = useUserSelector()
  const { settings } = useSettingsSelector()
  const chapter = settings
  const isAdmin = user?.isAdmin ?? false
  const { push } = useRouter()
  const { play } = useSoundEffect('/sound-effects/action-menu.mp3', true)

  const handleActionClick = (item: any) => {
    if (item.hasSubmenu) {
      setActiveSubmenu(activeSubmenu === item.action ? null : item.action)
      return
    }

    if (item.isUnlocked) {
      setIsActionsOpen(false)
      setActiveSubmenu(null)
      dispatch(item.open())
      dispatch(setInputs({ formName: item.formName, data: item.initial }))
    } else {
      push('/admin/hidden-cove')
    }
  }

  const handleSubmenuClick = (submenuItem: any) => {
    if (submenuItem.isUnlocked) {
      setIsActionsOpen(false)
      setActiveSubmenu(null)
      dispatch(submenuItem.open())
      dispatch(setInputs({ formName: submenuItem.formName, data: submenuItem.initial }))
    } else {
      push('/admin/hidden-cove')
    }
  }

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          play()
          setIsActionsOpen(!isActionsOpen)
          setActiveSubmenu(null)
        }}
        className="px-4 py-2 bg-linear-to-r from-blue-600 via-cyan-600 to-teal-600 text-white rounded-lg hover:from-cyan-500 hover:to-cyan-500 transition-all flex items-center space-x-2 font-medium shadow-lg text-sm"
      >
        <Plus className="w-4 h-4" />
        <span>Actions</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isActionsOpen ? 'rotate-180' : ''}`} />
      </motion.button>

      <AnimatePresence>
        {isActionsOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-56 bg-gray-800 border border-gray-700 rounded-lg shadow-xl overflow-hidden"
          >
            <div className="py-2">
              {actionItems(
                isAdmin,
                chapter?.hasUnlockedGrog,
                chapter?.hasUnlockedMuster,
                chapter?.hasUnlockedBooty,
                user?.id ?? ''
              )?.map((item, i) => (
                <div key={i} className="relative">
                  <motion.button
                    onClick={() => handleActionClick(item)}
                    className={`w-full px-4 py-3 text-left text-gray-200 hover:text-white transition-all flex items-center justify-between hover:bg-cyan-600/10 ${
                      item.hasSubmenu && activeSubmenu === item.action ? 'bg-cyan-600/20' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <item.icon className="w-4 h-4 text-cyan-400" />
                      <span className="font-medium text-sm">{item.label}</span>
                    </div>
                    {item.hasSubmenu && (
                      <ChevronRight
                        className={`w-4 h-4 text-gray-400 transition-transform ${
                          activeSubmenu === item.action ? 'rotate-90' : ''
                        }`}
                      />
                    )}
                  </motion.button>

                  {/* Submenu */}
                  <AnimatePresence>
                    {item.hasSubmenu && activeSubmenu === item.action && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="bg-gray-900/50 border-t border-gray-700/50"
                      >
                        {item.submenu?.map((submenuItem: any, subIndex: number) => (
                          <motion.button
                            key={subIndex}
                            onClick={() => handleSubmenuClick(submenuItem)}
                            className="w-full pl-8 pr-4 py-2 text-left text-gray-300 hover:text-white transition-all flex items-center space-x-3 hover:bg-cyan-600/10 text-sm"
                          >
                            <submenuItem.icon className="w-3 h-3 text-cyan-300" />
                            <span>{submenuItem.label}</span>
                          </motion.button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ActionButtonWithDropdown
