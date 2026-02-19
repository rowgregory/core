import { FC } from 'react'
import { motion } from 'framer-motion'
import { useAppDispatch } from '@/app/lib/redux/store'
import { setInputs } from '@/app/lib/redux/features/formSlice'
import { setOpenAddUserDrawer } from '@/app/lib/redux/features/userSlice'
import { User } from '@/types/user'
import { Crown, Edit, Mail, Phone } from 'lucide-react'
import { formatDate } from '@/app/lib/utils/date/formatDate'
import { getNavigatorStatusIcon } from '@/app/lib/utils/navigator/getNavigatorStatusIcon'
import getNavigatorStatusColor from '@/app/lib/utils/navigator/getNavigatorStatusColor'
import Picture from '../common/Picture'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
}

const getDaysUntilExpiration = (expiresAt: string | number | Date) => {
  const today = new Date()
  const expiration = new Date(expiresAt)
  const diffTime = +expiration - +today
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}

const NavigatorCard: FC<{ navigator: User; index: number; viewMode: string }> = ({ navigator, index, viewMode }) => {
  const dispatch = useAppDispatch()
  const daysUntilExpiration = getDaysUntilExpiration(navigator.expiresAt ?? '')
  const isExpiringSoon = daysUntilExpiration <= 30 && daysUntilExpiration > 0
  const { push } = useRouter()
  const session = useSession()
  const isAdmin = session.data?.user?.isAdmin
  const isSuperUser = session.data?.user?.isSuperUser
  const isMembership = session.data?.user?.isMembership
  const isMember = session.data?.user?.role === 'MEMBER'
  const status = navigator?.membershipStatus

  const handleCardClick = () => {
    if (isAdmin && (status === 'ACTIVE' || status === 'INACTIVE')) {
      dispatch(setInputs({ formName: 'navigatorForm', data: { ...navigator, isUpdating: true } }))
      dispatch(setOpenAddUserDrawer())
    } else if ((isAdmin || isMembership) && status === 'PENDING') {
      push(isMember ? '/member/applications' : '/admin/applications')
    } else if (status === 'FLAGGED') {
      push(isMember ? '/member/stowaways' : '/admin/stowaways')
    }
  }

  return (
    <motion.div
      onClick={handleCardClick}
      key={navigator.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ delay: index * 0.05 }}
      className={`bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 transition-all ${
        viewMode === 'list' ? 'flex items-center space-x-6' : ''
      } ${isAdmin ? 'cursor-pointer hover:bg-gray-800/60 hover:border-gray-600' : ''}`}
    >
      {/* Navigator Info */}
      <div className={`${viewMode === 'list' ? 'flex items-center space-x-4 flex-1' : 'space-y-4'}`}>
        {/* Avatar and Basic Info */}
        <div className={`${viewMode === 'list' ? 'flex items-center space-x-4' : 'flex items-center space-x-4'}`}>
          <div className="relative">
            {navigator?.profileImage ? (
              <Picture src={navigator?.profileImage} priority={false} className="w-12 h-12 rounded-full object-cover" />
            ) : (
              <div className="w-12 h-12 bg-linear-to-r from-blue-500 to-sky-500 rounded-full flex items-center justify-center text-white font-semibold">
                {getInitials(navigator.name)}
              </div>
            )}
            {status === 'ACTIVE' && navigator.isActive && (
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-gray-800 rounded-full"></div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="font-semibold text-white truncate">{navigator.name}</h3>
              {status === 'ACTIVE' && isExpiringSoon && <Crown className="w-4 h-4 text-yellow-400" />}
            </div>
            <p className="text-sm text-gray-400 truncate">{navigator.company}</p>
            <p className="text-xs text-gray-500">{navigator.industry}</p>

            {/* Badges Row */}
            <div className="flex items-center gap-1.5 mt-2">
              {navigator.isPublic && (
                <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded text-xs font-medium">
                  Public
                </span>
              )}
              {navigator.isMembership && (
                <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded text-xs font-medium">
                  Memberhip
                </span>
              )}
              {navigator.isAdmin && (
                <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded text-xs font-medium">
                  Admin
                </span>
              )}
            </div>
          </div>
        </div>

        {viewMode === 'grid' && (
          <div>
            {/* Contact Info */}
            <div className="pb-3 space-y-2">
              <div className="flex items-center space-x-2 text-gray-300 text-sm">
                <Mail className="w-4 h-4 text-violet-400" />
                <span className="truncate">{navigator.email}</span>
              </div>
              {navigator.phone && (
                <div className="flex items-center space-x-2 text-gray-300 text-sm">
                  <Phone className="w-4 h-4 text-violet-400" />
                  <span>{navigator.phone}</span>
                </div>
              )}
            </div>

            {/* Navigatorship Info */}
            <div className={`py-3 border-t border-gray-700`}>
              <div className="flex items-center justify-between mb-2">
                <div
                  className={`px-2 py-1 rounded-full text-xs font-medium border flex items-center space-x-1 ${getNavigatorStatusColor(status)}`}
                >
                  {getNavigatorStatusIcon(status)}
                  <span className="capitalize">{status.toLowerCase()}</span>
                </div>
                {isExpiringSoon && <span className="text-xs text-yellow-400">{daysUntilExpiration} days left</span>}
              </div>

              <div className="text-xs text-gray-500">Joined: {formatDate(navigator.joinedAt ?? '')}</div>
              <div className="text-xs text-gray-500">Expires: {formatDate(navigator.expiresAt ?? '')}</div>

              {isSuperUser && navigator.lastLoginAt && (
                <div className="text-xs text-gray-500">Last active: {formatDate(navigator.lastLoginAt) ?? ''}</div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className={`${viewMode === 'list' ? 'flex space-x-2' : 'flex justify-between items-center pt-4'}`}>
        {viewMode === 'list' && (
          <div className="flex items-center space-x-4 text-sm text-gray-400">
            <div
              className={`px-2 py-1 rounded-full text-xs font-medium border flex items-center space-x-1 ${getNavigatorStatusColor(status)}`}
            >
              {getNavigatorStatusIcon(status)}
              <span className="capitalize">{status.toLowerCase()}</span>
            </div>
            <span>Joined {formatDate(navigator.joinedAt ?? '')}</span>
            {isExpiringSoon && <span className="text-yellow-400">Expires in {daysUntilExpiration} days</span>}
          </div>
        )}
      </div>
    </motion.div>
  )
}
export default NavigatorCard
