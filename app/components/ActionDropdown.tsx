import { AnimatePresence, motion } from 'framer-motion'
import { useAppDispatch, useApplicationSelector, useSettingsSelector, useUserSelector } from '../redux/store'
import { Users, Calendar, Anchor, Layers3, Sailboat, Beer, LifeBuoy, Coins, ChevronRight, Flag } from 'lucide-react'
import { initialParleyFormState } from '@/app/lib/constants/entities/initialParleyFormState'
import { setOpenAnchorDrawer } from '@/app/redux/features/anchorSlice'
import { initialAnchorFormState } from '@/app/lib/constants/anchor'
import { setOpenTreasureMapDrawer } from '@/app/redux/features/treasureMapSlice'
import { initialTreasureMapFormState } from '@/types/treasure-map'
import { setOpenGrogDrawer } from '@/app/redux/features/grogSlice'
import { setOpenParleyDrawer } from '@/app/redux/features/parleySlice'
import { setOpenAddUserDrawer, setOpenStowawayDrawer, setOpenSwabbieDrawer } from '@/app/redux/features/userSlice'
import { navigatorInputs, setInputs } from '@/app/redux/features/formSlice'
import { useRouter } from 'next/navigation'
import {
  setCloseActionDropdown,
  setCloseActionDropdownSubmenu,
  setOpenActionDropdownSubmenu
} from '../redux/features/appSlice'
import Backdrop from './common/Backdrop'

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
    description: 'Schedule a meeting or conversation with another member.',
    icon: Calendar,
    open: setOpenParleyDrawer,
    formName: 'parleyForm',
    initial: { ...initialParleyFormState, requesterId: userId },
    isUnlocked: true
  },
  {
    action: 'create-treasure-map',
    label: 'Send Treasure Map',
    description: 'Send a referral connecting two members for business.',
    icon: Layers3,
    open: setOpenTreasureMapDrawer,
    formName: 'treasureMapForm',
    initial: { ...initialTreasureMapFormState, giverId: userId },
    isUnlocked: true
  },
  {
    action: 'anchor',
    label: 'Drop Anchor',
    description: 'Send a thank-you for successfully closed business.',
    icon: Anchor,
    open: setOpenAnchorDrawer,
    formName: 'anchorForm',
    initial: { ...initialAnchorFormState, giverId: userId },
    isUnlocked: true
  },
  {
    action: 'crew-management',
    label: 'Crew Management',
    description: 'Manage crew members and user access.',
    icon: Users,
    hasSubmenu: true,
    submenu: [
      {
        action: 'flag-stowaway',
        label: 'Flag Stowaway',
        description: 'Add a visitor with unknown joining status into the system for tracking and review.',
        icon: Flag,
        open: setOpenStowawayDrawer,
        formName: 'stowawayForm',
        initial: {},
        isUnlocked: true
      },
      {
        action: 'add-swabbie',
        label: 'Draft Swabbie',
        description: 'Quickly add a new member who wants to join the crew—no action needed from them.',
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
              description: 'Add existing member to chapter.',
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
          description: 'Create and manage events for the chapter.',
          icon: Beer,
          open: setOpenGrogDrawer,
          formName: 'grogForm',
          initial: {},
          isUnlocked: isGrogUnlocked,
          lockKey: 'grog',
          linkKey: '/admin/grogs'
        },
        {
          action: 'call-muster',
          label: 'Call Muster',
          description: 'Track attendance and participation for meetings and events.',
          icon: LifeBuoy,
          open: () => {},
          formName: 'musterForm',
          initial: {},
          isUnlocked: isMusterUnlocked,
          lockKey: 'muster',
          linkKey: '/admin/muster'
        },
        {
          action: 'collect-booty',
          label: 'Collect Booty',
          description: 'Record or manage collected revenue or rewards.',
          icon: Coins,
          open: () => {},
          formName: 'bootyForm',
          initial: {},
          isUnlocked: isBootyUnlocked,
          lockKey: 'booty',
          linkKey: '/admin/booty'
        }
      ]
    : [])
]

const ActionDropdown = () => {
  const { actionDropdown, itemAction } = useApplicationSelector()
  const { settings } = useSettingsSelector()
  const { user } = useUserSelector()
  const { push } = useRouter()
  const dispatch = useAppDispatch()
  const chapter = settings
  const isAdmin = user?.isAdmin ?? false

  const onClose = () => {
    dispatch(setCloseActionDropdown())
    dispatch(setCloseActionDropdownSubmenu(null))
  }

  const handleActionClick = (item: any) => {
    if (item.hasSubmenu) {
      dispatch(setOpenActionDropdownSubmenu(itemAction === item.action ? null : item.action))
      return
    }

    if (item.isUnlocked) {
      onClose()
      dispatch(item.open())
      dispatch(setInputs({ formName: item.formName, data: item.initial }))
    } else {
      onClose()
      push(item.linkKey)
    }
  }

  const handleSubmenuClick = (submenuItem: any) => {
    if (submenuItem.isUnlocked) {
      onClose()
      dispatch(submenuItem.open())
      dispatch(setInputs({ formName: submenuItem.formName, data: submenuItem.initial }))
    } else {
      push('/admin/hidden-cove')
    }
  }

  return (
    <AnimatePresence>
      {actionDropdown && (
        <>
          <Backdrop onClose={onClose} />
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed xs:right-16 -translate-x-1/2 left-1/2 sm:left-auto sm:translate-x-0 w-[90%] sm:right-20 top-14 sm:w-68 bg-gray-800 border border-gray-700 rounded-lg shadow-xl overflow-hidden z-100 "
          >
            <div className="py-2 overflow-y-scroll h-[calc(100vh-150px)]">
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
                      item.hasSubmenu && itemAction === item.action ? 'bg-cyan-600/20' : ''
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <item.icon className="w-4 h-4 mt-0.5 text-cyan-400" />
                      <div className="flex flex-col">
                        <span className="font-medium text-sm">{item.label}</span>
                        {item.description && (
                          <span className="text-xs text-gray-400 leading-tight">{item.description}</span>
                        )}
                      </div>
                    </div>

                    {item.hasSubmenu && (
                      <ChevronRight
                        className={`w-4 h-4 text-gray-400 transition-transform ${
                          itemAction === item.action ? 'rotate-90' : ''
                        }`}
                      />
                    )}
                  </motion.button>

                  {/* Submenu */}
                  <AnimatePresence>
                    {item.hasSubmenu && itemAction === item.action && (
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
                            className="w-full pl-10 pr-4 py-2 text-left text-gray-300 hover:text-white transition-all flex items-start space-x-3 hover:bg-cyan-600/10"
                          >
                            <div className="flex flex-col">
                              <span className="text-sm">{submenuItem.label}</span>
                              {submenuItem.description && (
                                <span className="text-xs text-gray-500 leading-tight">{submenuItem.description}</span>
                              )}
                            </div>
                          </motion.button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default ActionDropdown
