import { User } from '@/types/user'
import React, { FC } from 'react'
import { Heart, MessageCircle, Share2, Play, Star } from 'lucide-react'
import { motion } from 'framer-motion'
import Picture from '../common/Picture'

const posts = [
  {
    id: 2,
    time: '7 hours ago',
    content:
      'Check out the latest project we just launched at Sqysh! Custom networking platforms that make tracking networking analytics fun!',
    link: {
      title: 'Sqysh | Custom Networking Platform Demo',
      description:
        'Take a look at how Sqysh can create a tailored online networking experience to fit any organization’s needs.',
      thumbnail: '',
      domain: 'SQYSH.IO'
    },
    likes: 22,
    comments: 3,
    shares: 10
  }
]

const MainSection: FC<{ user: User | null; session: any }> = ({ user, session }) => {
  return (
    <div className="lg:col-span-2">
      <div className="space-y-6">
        {/* Weekly Treasure Wishlist */}
        {user?.weeklyTreasureWishlist && (
          <div className="bg-linear-to-r from-emerald-500/20 to-green-500/20 border border-emerald-400/30 rounded-xl p-6 shadow-lg">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-linear-to-br from-emerald-500 to-green-500 rounded-lg shrink-0">
                <Star className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-emerald-200 text-sm uppercase tracking-wide mb-2">
                  Weekly Treasure Wishlist
                </h3>
                <p className="text-white text-lg leading-relaxed">{user.weeklyTreasureWishlist}</p>
              </div>
            </div>
          </div>
        )}

        {/* Services Offered */}
        {user?.servicesOffered && user.servicesOffered.length > 0 && (
          <div className="bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-700 mb-6">
            <h3 className="font-semibold text-white text-lg mb-4">Services Offered</h3>

            <div className="grid gap-3">
              {user.servicesOffered.map((service: any, index: number) => (
                <motion.div
                  key={index}
                  whileHover={{ x: 4 }}
                  className="p-4 rounded-lg hover:bg-slate-700/50 transition-colors border border-slate-600/30"
                >
                  <div className="space-y-2">
                    <h4 className="font-semibold text-white text-base">{service.name}</h4>
                    {service.description && (
                      <p className="text-slate-400 text-sm leading-relaxed">{service.description}</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Career Achievements */}
        {user?.careerAchievements && Array.isArray(user.careerAchievements) && user.careerAchievements.length > 0 && (
          <div className="bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-700 mb-6">
            <h3 className="font-semibold text-white text-lg mb-4">Career Achievements</h3>

            <div className="space-y-3">
              {(user.careerAchievements as Array<{ title: string; year: string }>).map((careerAchievement, index) => (
                <motion.div
                  key={index}
                  whileHover={{ x: 4 }}
                  className="flex items-start justify-between p-3 rounded-lg hover:bg-slate-700/50 transition-colors border border-slate-600/30"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-white text-sm">{careerAchievement.title}</p>
                    <p className="text-slate-400 text-xs mt-1">{careerAchievement.year}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Future feature - timeline */}
        {session.data?.user?.id &&
          posts.map((post) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-800/50 rounded-xl p-6 shadow-lg border border-slate-700/50 opacity-60 pointer-events-none"
            >
              {/* Post Header */}
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-10 h-10 rounded-full overflow-hidden grayscale">
                  <Picture
                    priority={false}
                    src={user?.profileImage || ''}
                    alt={user?.name || 'User'}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-500">{user?.name}</h4>
                  <p className="text-xs text-slate-500">{post.time}</p>
                </div>
              </div>

              {/* Coming Soon Badge */}
              <span className="inline-block bg-slate-600 text-slate-400 text-xs font-bold px-2 py-1 rounded mb-2">
                Coming Soon
              </span>

              {/* Post Content */}
              <p className="text-slate-500 leading-relaxed mb-4">{post.content}</p>

              {/* Link Preview */}
              {post.link && (
                <div className="bg-slate-700/50 rounded-lg overflow-hidden mb-4">
                  <div className="h-40 bg-linear-to-br from-slate-600 to-slate-700 flex items-center justify-center">
                    <div className="text-center text-slate-400">
                      <div className="text-2xl font-bold">Sqysh</div>
                      <Play className="w-12 h-12 mx-auto mt-2" />
                      <div className="text-sm mt-2">
                        DEMO
                        <br />
                        ONLINE PLATFORM
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <h5 className="font-semibold text-slate-500 mb-1">{post.link.title}</h5>
                    <p className="text-sm text-slate-500 mb-2">{post.link.description}</p>
                    <span className="text-xs text-slate-600 uppercase">{post.link.domain}</span>
                  </div>
                </div>
              )}

              {/* Post Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-700/50">
                <div className="flex items-center space-x-2 text-slate-500 cursor-not-allowed">
                  <Heart className="w-4 h-4" />
                  <span className="text-sm">{post.likes}</span>
                </div>
                <div className="flex items-center space-x-2 text-slate-500 cursor-not-allowed">
                  <MessageCircle className="w-4 h-4" />
                  <span className="text-sm">{post.comments}</span>
                </div>
                <div className="flex items-center space-x-2 text-slate-500 cursor-not-allowed">
                  <Share2 className="w-4 h-4" />
                  <span className="text-sm">{post.shares}</span>
                </div>
              </div>
            </motion.div>
          ))}
      </div>
    </div>
  )
}

export default MainSection
