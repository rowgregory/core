import React from 'react'
import { setOpenAnchorDrawer } from '@/app/redux/features/anchorSlice'
import { setOpenParleyDrawer } from '@/app/redux/features/parleySlice'
import { useAppDispatch } from '@/app/redux/store'
import { setOpenTreasureMapDrawer } from '@/app/redux/features/treasureMapSlice'
import { setOpenSwabbieDrawer } from '@/app/redux/features/userSlice'
import { Anchor, Layers3, Sailboat, Scroll } from 'lucide-react'
import QuickActionButton from '@/app/components/bridge/QuickActionButton'

const MemberQuickActions = () => {
  const dispatch = useAppDispatch()
  const quickActions = [
    {
      title: 'Schedule Parley',
      icon: Scroll,
      color: 'from-teal-500 to-teal-600 text-white rounded-lg hover:from-teal-400 hover:to-teal-500',
      onClick: () => dispatch(setOpenParleyDrawer())
    },
    {
      title: 'Send Treasure Map',
      icon: Layers3,
      color: 'from-cyan-500 to-cyan-600 text-white rounded-lg hover:from-cyan-400 hover:to-cyan-500',
      onClick: () => dispatch(setOpenTreasureMapDrawer())
    },
    {
      title: 'Drop Anchor',
      icon: Anchor,
      color: 'from-sky-500 to-sky-600 text-white rounded-lg hover:from-sky-400 hover:to-sky-500',
      onClick: () => dispatch(setOpenAnchorDrawer())
    },
    {
      title: 'Draft Swabbie',
      icon: Sailboat,
      color: 'from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-400 hover:to-blue-500',
      onClick: () => dispatch(setOpenSwabbieDrawer())
    }
  ]

  return (
    <div className="bg-gray-800/40 border border-gray-700/50 rounded-2xl p-6">
      <h3 className="text-xl font-semibold text-white mb-6">Quick Actions</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 2xl:grid-cols-4 gap-4">
        {quickActions.map((action, i) => (
          <QuickActionButton
            key={i}
            title={action.title}
            icon={action.icon}
            color={action.color}
            onClick={action.onClick}
          />
        ))}
      </div>
    </div>
  )
}

export default MemberQuickActions
