import { User } from '@/types/user'
import React, { FC } from 'react'
import { motion } from 'framer-motion'
import Picture from '../common/Picture'
import { useUserSelector } from '@/app/redux/store'
import { MotionLink } from '@/app/components/common/MotionLink'

const RightSidebar: FC<{ user: User | null; setSelectedIndex: any; setLightboxOpen: any }> = ({
  user,
  setSelectedIndex,
  setLightboxOpen
}) => {
  const { users } = useUserSelector()
  const openLightbox = (index: number) => {
    setSelectedIndex(index)
    setLightboxOpen(true)
  }
  const totalUsers = users?.length
  return (
    <div className="lg:col-span-1">
      {/* Collage */}
      {user?.collage?.length !== undefined && user?.collage?.length > 0 && (
        <div className="bg-slate-800 rounded-xl p-6 mb-6 shadow-lg border border-slate-700">
          <h3 className="font-bold text-lg mb-4">Snapshot Vibes</h3>
          <div className="grid grid-cols-3 gap-2">
            {user?.collage?.map((photo: { fileUrl: string }, index: number) => (
              <motion.div
                onClick={() => openLightbox(index)}
                key={index}
                whileHover={{ scale: 1.05 }}
                className="aspect-square bg-slate-700 rounded-lg overflow-hidden cursor-pointer"
              >
                <Picture
                  priority={false}
                  src={photo.fileUrl}
                  alt={`Photo ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </motion.div>
            ))}
          </div>
        </div>
      )}
      {/* Professional Associations */}
      {user?.professionalAssociations && user.professionalAssociations.length > 0 && (
        <div className="bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-700 mb-6">
          <h3 className="font-semibold text-white text-lg mb-4">Professional Associations</h3>

          <div className="space-y-3">
            {user.professionalAssociations.map((association: any, index: number) => (
              <motion.div
                key={index}
                whileHover={{ x: 4 }}
                className="flex items-start justify-between p-3 rounded-lg hover:bg-slate-700/50 transition-colors border border-slate-600/30"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-white text-sm">{association.name}</p>
                  <p className="text-slate-400 text-xs mt-1">{association.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Professional Books */}
      {user?.professionalBooks && user.professionalBooks.length > 0 && (
        <div className="bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-700 mb-6">
          <h3 className="font-semibold text-white text-lg mb-4">Professional Books</h3>

          <div className="space-y-3">
            {user.professionalBooks.map((association: any, index: number) => (
              <motion.div
                key={index}
                whileHover={{ x: 4 }}
                className="flex items-start justify-between p-3 rounded-lg hover:bg-slate-700/50 transition-colors border border-slate-600/30"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-white text-sm">{association.title}</p>
                  <p className="text-slate-400 text-xs mt-1">{association.author}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Side Projects */}
      {user?.sideProjects && user.sideProjects.length > 0 && (
        <div className="bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-700 mb-6">
          <h3 className="font-semibold text-white text-lg mb-4">Side Projects</h3>

          <div className="space-y-3">
            {user.sideProjects.map((sideProject: any, index: number) => (
              <motion.div
                key={index}
                whileHover={{ x: 4 }}
                className="flex items-start justify-between p-3 rounded-lg hover:bg-slate-700/50 transition-colors border border-slate-600/30"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-white text-sm">{sideProject.name}</p>
                  <p className="text-slate-400 text-xs mt-1">{sideProject.details}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Ask Me About */}
      {user?.askMeAbout && user.askMeAbout.length > 0 && (
        <div className="bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-700 mb-6">
          <h3 className="font-semibold text-white text-lg mb-4">Ask Me About</h3>

          <div className="space-y-3">
            {user.askMeAbout.map((askMeAbout: any, index: number) => (
              <motion.div
                key={index}
                whileHover={{ x: 4 }}
                className="flex items-start justify-between p-3 rounded-lg hover:bg-slate-700/50 transition-colors border border-slate-600/30"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-white text-sm">{askMeAbout.topic}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Navigators */}
      <div className="bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-700">
        <h3 className="font-bold text-lg mb-4">Navigators ({totalUsers})</h3>
        <div className="grid grid-cols-6 gap-2">
          {users?.map((friend) => (
            <MotionLink
              href={`/navigators/${friend.id}`}
              key={friend.id}
              whileHover={{ scale: 1.1 }}
              className="w-8 h-8 rounded-full overflow-hidden cursor-pointer"
            >
              <Picture
                priority={false}
                src={friend?.profileImage || ''}
                alt={friend.name}
                className="w-full h-full object-cover"
              />
            </MotionLink>
          ))}
        </div>
      </div>
    </div>
  )
}

export default RightSidebar
