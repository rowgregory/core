import { FC } from 'react'
import { User } from '@/types/user'

const ProfileInfo: FC<{ user: User | null }> = ({ user }) => {
  return (
    <div className="pt-20 sm:pt-24 md:pt-32 lg:pt-36 pb-4 md:pb-6 text-center px-4">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">{user?.name}</h1>
      {user?.website ? (
        <a
          href={user?.website?.startsWith('http') ? user.website : `https://${user.website}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-slate-400 hover:text-slate-300 transition-colors mt-1 inline-block text-sm sm:text-base"
        >
          {user?.company}
        </a>
      ) : (
        <div className="text-slate-400 mt-1 text-sm sm:text-base">{user?.company}</div>
      )}
      <p className="text-blue-400 text-xs sm:text-sm mt-1">{user?.industry}</p>
      {(user?.phone || user?.email) && (
        <div className="flex items-center justify-center gap-4 mt-2">
          {user?.phone && (
            <a
              href={`tel:${user.phone}`}
              className="text-slate-400 hover:text-slate-300 transition-colors text-xs sm:text-sm"
            >
              {user.phone}
            </a>
          )}
          {user?.email && (
            <a
              href={`mailto:${user.email}`}
              className="text-slate-400 hover:text-slate-300 transition-colors text-xs sm:text-sm"
            >
              {user.email}
            </a>
          )}
        </div>
      )}
    </div>
  )
}

export default ProfileInfo
