'use client'

import { useRouter } from 'next/navigation'
import QuickActionButton from '../../bridge/QuickActionButton'
import { Download, Scroll, Settings, Users } from 'lucide-react'

const QuickActionButtons = () => {
  const { push } = useRouter()
  const quickActions = [
    {
      title: 'Manage Navigators',
      description: 'View, edit, and manage all crew members and their roles',
      icon: Users,
      color: 'from-cyan-500 to-cyan-600 text-white rounded-lg hover:from-cyan-400 hover:to-cyan-500',
      link: '/admin/navigators'
    },
    {
      title: 'Call a Parley',
      description: 'Schedule and organize meetings with your crew',
      icon: Scroll,
      color: 'from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-400 hover:to-blue-500',
      link: '/admin/parley'
    },
    {
      title: 'Generate Report',
      description: 'Create detailed analytics and performance reports',
      icon: Download,
      color: 'from-violet-500 to-violet-600 text-white rounded-lg hover:from-violet-400 hover:to-violet-500',
      link: '/admin/reports'
    },
    {
      title: 'Rigging',
      description: 'Configure system settings and preferences',
      icon: Settings,
      color: 'from-pink-500 to-pink-600 text-white rounded-lg hover:from-pink-400 hover:to-pink-500',
      link: '/admin/rigging'
    }
  ]
  return (
    <div className="bg-gray-800/40 border border-gray-700/50 rounded-2xl p-6">
      <h3 className="text-xl font-semibold text-white mb-6">Quick Actions</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickActions.map((action) => (
          <QuickActionButton
            key={action.title}
            title={action.title}
            description={action.description}
            icon={action.icon}
            color={action.color}
            onClick={() => push(action.link)}
          />
        ))}
      </div>
    </div>
  )
}

export default QuickActionButtons
