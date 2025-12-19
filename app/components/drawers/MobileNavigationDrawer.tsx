import getCurrentPageId from '@/app/lib/utils/common/getCurrentPageId'
import { setCloseMobileNavigation } from '@/app/redux/features/appSlice'
import { RootState, useAppDispatch, useAppSelector, useUserSelector } from '@/app/redux/store'
import useCustomPathname from '@/hooks/useCustomPathname'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Crown, Shield } from 'lucide-react'
import Link from 'next/link'
import { FC } from 'react'
import Drawer from '../common/Drawer'
import Backdrop from '../common/Backdrop'
import { itemVariants } from '@/app/lib/constants/motion'

const MobileNavigationDrawer: FC<{ links: any }> = ({ links }) => {
  const dispatch = useAppDispatch()
  const close = () => dispatch(setCloseMobileNavigation())
  const { mobileNavigation } = useAppSelector((state: RootState) => state.app)
  const path = useCustomPathname()
  const selectedPage = getCurrentPageId(path, links)
  const { user } = useUserSelector()

  return (
    <AnimatePresence>
      {mobileNavigation && (
        <>
          {/* Backdrop Overlay */}
          <Backdrop onClose={close} />

          {/* Drawer */}
          <Drawer>
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-700/50">
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.4 }}
              >
                <h2 className="text-xl font-bold bg-linear-to-r from-cyan-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  Navigation
                </h2>
                <p className="text-xs text-gray-500 mt-1">Core Chapter Management</p>
              </motion.div>

              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={close}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-all"
                initial={{ opacity: 0, rotate: -90 }}
                animate={{ opacity: 1, rotate: 0 }}
                transition={{ delay: 0.3, duration: 0.4 }}
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Navigation Items */}
            <nav className="flex-1 overflow-y-auto py-4 px-2">
              <div className="space-y-1">
                {links.map((item: any, index: number) => (
                  <Link key={item.id} href={item.linkKey} onClick={close}>
                    <motion.div
                      key={item.id}
                      custom={index}
                      variants={itemVariants}
                      initial="closed"
                      animate="open"
                      className={`group w-full flex items-center justify-between p-4 rounded-xl font-medium transition-all duration-300 text-left ${
                        selectedPage === item.id
                          ? 'bg-linear-to-r from-cyan-600/20 to-blue-600/20 text-white border border-cyan-500/30 shadow-lg'
                          : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center space-x-4">
                        <div
                          className={`p-2 rounded-lg transition-all ${
                            selectedPage === item.id
                              ? 'bg-cyan-500/20 text-cyan-400'
                              : 'bg-gray-800/50 text-gray-500 group-hover:bg-gray-700/50 group-hover:text-gray-300'
                          }`}
                        >
                          <item.icon className="w-5 h-5" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div
                            className={`font-semibold transition-colors ${
                              selectedPage === item.id ? 'text-white' : 'text-gray-300 group-hover:text-white'
                            }`}
                          >
                            {item.label}
                          </div>
                          <div
                            className={`text-xs transition-colors ${
                              selectedPage === item.id ? 'text-cyan-300' : 'text-gray-500 group-hover:text-gray-400'
                            }`}
                          >
                            {item.description}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                ))}
              </div>
            </nav>

            {/* Footer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-4 border-t border-gray-800"
            >
              <div className="flex items-center space-x-3 p-3 bg-gray-800/50 rounded-xl">
                <div className="w-8 h-8 bg-linear-to-r from-teal-400 via-cyan-400 to-blue-400 rounded-full flex items-center justify-center text-white font-bold">
                  {user?.isSuperUser ? (
                    <Crown className="w-4 h-4" />
                  ) : user?.isAdmin ? (
                    <Shield className="w-4 h-4" />
                  ) : (
                    user?.name?.charAt(0)
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">{user?.name}</p>
                  <p className="text-gray-400 text-xs truncate">{user?.email}</p>
                </div>
              </div>
            </motion.div>
          </Drawer>
        </>
      )}
    </AnimatePresence>
  )
}

export default MobileNavigationDrawer
