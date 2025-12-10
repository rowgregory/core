import React, { FC } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Crown, Shield, ShipWheel } from 'lucide-react'
import Link from 'next/link'
import { itemVariants } from '../drawers/MobileNavigationDrawer'
import { RootState, useAppDispatch, useAppSelector } from '@/app/redux/store'
import { setIsNavigationCollapsed } from '@/app/redux/features/appSlice'

interface IFixedLeftNavigationPanel {
  selectedPage: string
  links: any
  data: any
}

const FixedLeftNavigationPanel: FC<IFixedLeftNavigationPanel> = ({ selectedPage, links, data }) => {
  const { isNavigationCollapsed } = useAppSelector((state: RootState) => state.app)
  const dispatch = useAppDispatch()

  return (
    <motion.div
      initial={false}
      animate={{
        width: isNavigationCollapsed ? '80px' : '280px'
      }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="lg:fixed left-0 top-0 h-full bg-gray-900 border-r border-gray-800 z-20 hidden lg:flex flex-col"
    >
      {/* Navigation Header */}
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center justify-between">
          {!isNavigationCollapsed ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center space-x-3"
            >
              <Link
                href="/"
                className="bg-linear-to-r from-cyan-400 via-blue-400 to-teal-400 bg-clip-text text-transparent uppercase text-2xl font-bold cursor-pointer hover:bg-linear-to-r hover:from-teal-400 hover:via-blue-400 hover:to-cyan-400 flex items-center"
              >
                C
                <span>
                  <ShipWheel className="text-white w-5 h-5 shipwheel-storm" />
                </span>
                RE
              </Link>
            </motion.div>
          ) : (
            <Link href="/">
              <ShipWheel className="text-white w-5 h-5 shipwheel-storm flex shrink-0" />
            </Link>
          )}
          <button
            onClick={() => dispatch(setIsNavigationCollapsed(!isNavigationCollapsed))}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
          >
            {isNavigationCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Navigation Items */}
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-2 px-3">
          {links.map((item: any, index: number) => (
            <Link href={item.linkKey} key={item.id}>
              <motion.div
                key={index}
                variants={itemVariants}
                initial="closed"
                animate="open"
                custom={index}
                className={`
                  w-full flex items-center justify-center space-x-3 px-3 py-3 rounded-xl transition-all
                  ${
                    selectedPage === item.id
                      ? 'bg-linear-to-r from-cyan-600/20 to-violet-600/20 text-cyan-400 border border-cyan-600/30'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  }
                `}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <item.icon className="w-5 h-5 shrink-0" />
                {!isNavigationCollapsed && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex-1"
                  >
                    <div className="font-medium">{item.label}</div>
                    {item.description && (
                      <div className={`${selectedPage === item.id ? 'text-cyan-700' : 'text-gray-400'} text-xs mt-0.5`}>
                        {item.description}
                      </div>
                    )}
                  </motion.div>
                )}
              </motion.div>
            </Link>
          ))}
        </nav>
      </div>

      {/* Navigation Footer */}
      {!isNavigationCollapsed ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="p-4 border-t border-gray-800"
        >
          <div className="flex items-center space-x-3 p-3 bg-gray-800/50 rounded-xl">
            <div className="w-8 h-8 bg-linear-to-r from-teal-400 via-cyan-400 to-blue-400 rounded-full flex items-center justify-center text-white font-bold">
              {data?.user?.isSuperUser ? (
                <Crown className="w-4 h-4" />
              ) : data?.user?.isAdmin ? (
                <Shield className="w-4 h-4" />
              ) : (
                data?.user?.name?.charAt(0)
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium truncate">{data?.user?.name}</p>
              <p className="text-gray-400 text-xs truncate">{data?.user?.email}</p>
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="p-4 border-t border-gray-800"
        >
          <div className="py-3 flex items-center justify-center bg-gray-800/50 rounded-xl">
            <div className="w-8 h-8 bg-linear-to-r from-teal-400 via-cyan-400 to-blue-400 rounded-full flex items-center justify-center text-white font-bold">
              {data?.user?.isSuperUser ? (
                <Crown className="w-4 h-4" />
              ) : data?.user?.isAdmin ? (
                <Shield className="w-4 h-4" />
              ) : (
                data?.user?.name?.charAt(0)
              )}
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}

export default FixedLeftNavigationPanel
