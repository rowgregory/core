import React, { FC } from 'react'
import Picture from '../common/Picture'
import { User } from '@/types/user'

const HeaderCoverPhoto: FC<{ user: User | null }> = ({ user }) => {
  return (
    <div className="relative h-48 sm:h-64 md:h-80 bg-linear-to-r from-teal-600 via-cyan-600 to-blue-600">
      {user?.coverImage && (
        <Picture priority={true} src={user?.coverImage || ''} alt="Cover" className="w-full h-full object-cover" />
      )}
      <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent" />

      {/* Profile Picture */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
        <div className="w-32 h-32 sm:w-40 sm:h-40 md:w-52 md:h-52 lg:w-60 lg:h-60 rounded-full overflow-hidden">
          <Picture
            priority={true}
            src={user?.profileImage || ''}
            alt={user?.name || 'Profile'}
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  )
}

export default HeaderCoverPhoto
