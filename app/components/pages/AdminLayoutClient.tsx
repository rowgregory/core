'use client'

import { FC, ReactNode } from 'react'
import useCustomPathname from '@/hooks/useCustomPathname'
import { useSession } from 'next-auth/react'
import getCurrentPageId from '../../lib/utils/common/getCurrentPageId'
import { adminNavLinks } from '../../lib/constants/navigation/adminNavLinks'
import MobileNavigationDrawer from '../drawers/MobileNavigationDrawer'
import FixedLeftNavigationPanel from '../admin/FixedLeftNavigationPanel'
import FixedHeader from '../admin/FixedHeader'
import { motion } from 'framer-motion'
import { useApplicationSelector } from '../../lib/redux/store'

const AdminLayoutClient: FC<{ children: ReactNode }> = ({ children }) => {
  const path = useCustomPathname()
  const session = useSession()
  const selectedPage = getCurrentPageId(path, adminNavLinks)
  const { isNavigationCollapsed } = useApplicationSelector()

  return (
    <>
      <MobileNavigationDrawer links={adminNavLinks} />
      <div className="min-h-screen bg-gray-950 flex">
        {/* Fixed Left Navigation Panel */}
        <FixedLeftNavigationPanel selectedPage={selectedPage} links={adminNavLinks} user={session?.data?.user} />

        {/* Main Content Area */}
        <div
          className={`${isNavigationCollapsed ? 'lg:ml-20' : 'lg:ml-70'} flex-1 flex flex-col`}
          style={{
            transition: 'margin-left 0.3s ease-in-out'
          }}
        >
          {/* Fixed Header */}
          <FixedHeader selectedPage={selectedPage} links={adminNavLinks} />

          {/* Content Area */}
          <main className="flex-1 pt-16 overflow-hidden">
            <motion.div
              key={selectedPage}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="h-full overflow-y-auto"
            >
              {children}
            </motion.div>
          </main>
        </div>
      </div>
    </>
  )
}

export default AdminLayoutClient
