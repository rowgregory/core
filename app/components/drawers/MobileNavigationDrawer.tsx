import { adminNavLinks } from '@/app/lib/constants/navigation/adminNavLinks'
import getCurrentPageId from '@/app/lib/utils/common/getCurrentPageId'
import { setCloseMobileNavigation } from '@/app/redux/features/appSlice'
import { RootState, useAppDispatch, useAppSelector } from '@/app/redux/store'
import useCustomPathname from '@/hooks/useCustomPathname'
import { motion, AnimatePresence } from 'framer-motion'
import { X, User, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { FC } from 'react'

const drawerVariants = {
  closed: {
    x: '-100%',
    transition: {
      type: 'spring' as const,
      stiffness: 400,
      damping: 40
    }
  },
  open: {
    x: 0,
    transition: {
      type: 'spring' as const,
      stiffness: 400,
      damping: 40
    }
  }
}

export const overlayVariants = {
  closed: {
    opacity: 0,
    transition: {
      duration: 0.3
    }
  },
  open: {
    opacity: 1,
    transition: {
      duration: 0.3
    }
  }
}

export const itemVariants = {
  closed: {
    x: -20,
    opacity: 0
  },
  open: (i: number) => ({
    x: 0,
    opacity: 1,
    transition: {
      delay: 0.1 + i * 0.05,
      duration: 0.4,
      ease: 'easeOut' as const
    }
  })
}

const MobileNavigationDrawer: FC<{ links: any }> = ({ links }) => {
  const dispatch = useAppDispatch()
  const close = () => dispatch(setCloseMobileNavigation())
  const { mobileNavigation } = useAppSelector((state: RootState) => state.app)
  const path = useCustomPathname()
  const selectedPage = getCurrentPageId(path, adminNavLinks)

  return (
    <AnimatePresence>
      {mobileNavigation && (
        <>
          {/* Backdrop Overlay */}
          <motion.div
            variants={overlayVariants}
            initial="closed"
            animate="open"
            exit="closed"
            onClick={close}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />

          {/* Drawer */}
          <motion.div
            variants={drawerVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="fixed left-0 top-0 h-full w-80 bg-gray-900/95 backdrop-blur-xl border-r border-gray-700/50 z-50 flex flex-col shadow-2xl"
            style={{
              backgroundColor: 'rgba(26, 26, 26, 0.98)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)'
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-700/50">
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.4 }}
              >
                <h2 className="text-xl font-bold bg-linear-to-r from-cyan-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                  Admin Panel
                </h2>
                <p className="text-xs text-gray-500 mt-1">Modern Chapter Management</p>
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
                  <Link key={item.id} href={item.linkKey}>
                    <motion.div
                      key={item.id}
                      custom={index}
                      variants={itemVariants}
                      initial="closed"
                      animate="open"
                      whileHover={{
                        x: 8,
                        transition: { duration: 0.2 }
                      }}
                      whileTap={{ scale: 0.98 }}
                      className={`group w-full flex items-center justify-between p-4 rounded-xl font-medium transition-all duration-300 text-left ${
                        selectedPage === item.id
                          ? 'bg-linear-to-r from-violet-600/20 to-fuchsia-600/20 text-white border border-violet-500/30 shadow-lg'
                          : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        <div
                          className={`p-2 rounded-lg transition-all ${
                            selectedPage === item.id
                              ? 'bg-violet-500/20 text-violet-400'
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
                              selectedPage === item.id ? 'text-violet-300' : 'text-gray-500 group-hover:text-gray-400'
                            }`}
                          >
                            {item.description}
                          </div>
                        </div>
                      </div>

                      <ChevronRight
                        className={`w-4 h-4 transition-all ${
                          selectedPage === item.id
                            ? 'text-violet-400 transform translate-x-1'
                            : 'text-gray-600 group-hover:text-gray-400 group-hover:transform group-hover:translate-x-1'
                        }`}
                      />
                    </motion.div>
                  </Link>
                ))}
              </div>
            </nav>

            {/* Footer */}
            <motion.div
              className="p-4 border-t border-gray-700/50"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.4 }}
            >
              <div className="flex items-center space-x-3 p-3 bg-gray-800/30 rounded-lg">
                <div className="w-10 h-10 bg-linear-to-r from-violet-500 to-fuchsia-500 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-white">Admin User</div>
                  <div className="text-xs text-gray-400">Chapter Administrator</div>
                </div>
              </div>

              <div className="text-xs text-gray-500 text-center mt-3 pt-3 border-t border-gray-800">
                Coastal Referral Exchange Admin Dashboard v2.0
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default MobileNavigationDrawer

// Directors report
