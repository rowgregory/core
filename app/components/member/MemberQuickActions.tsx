import { setOpenAnchorDrawer } from '@/app/lib/redux/features/anchorSlice'
import { setOpenParleyDrawer } from '@/app/lib/redux/features/parleySlice'
import { useAppDispatch } from '@/app/lib/redux/store'
import { setOpenTreasureMapDrawer } from '@/app/lib/redux/features/treasureMapSlice'
import { setOpenSwabbieDrawer } from '@/app/lib/redux/features/userSlice'
import { Anchor, Layers3, Sailboat, Scroll } from 'lucide-react'
import QuickActionButton from '@/app/components/bridge/QuickActionButton'

const MemberQuickActions = () => {
  const dispatch = useAppDispatch()
  const quickActions = [
    {
      title: 'Schedule Parley',
      description: 'Log a new parley meeting between crew members to track interactions and engagement.',
      icon: Scroll,
      color: 'from-teal-500 to-teal-600 text-white rounded-lg hover:from-teal-400 hover:to-teal-500',
      onClick: () => dispatch(setOpenParleyDrawer())
    },
    {
      title: 'Send Treasure Map',
      description: 'Create and send a treasure map to other crew members, keeping track of adventures and progress.',
      icon: Layers3,
      color: 'from-cyan-500 to-cyan-600 text-white rounded-lg hover:from-cyan-400 hover:to-cyan-500',
      onClick: () => dispatch(setOpenTreasureMapDrawer())
    },
    {
      title: 'Drop Anchor',
      description: 'Record an anchor that signifies thank you for closed business from a crew member.',
      icon: Anchor,
      color: 'from-sky-500 to-sky-600 text-white rounded-lg hover:from-sky-400 hover:to-sky-500',
      onClick: () => dispatch(setOpenAnchorDrawer())
    },
    {
      title: 'Draft Swabbie',
      description: 'Quickly add a new swabbie (potential crew member) to the system without them filling out a form.',
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
            description={action.description}
          />
        ))}
      </div>
    </div>
  )
}

export default MemberQuickActions
