'use client'

import { FC } from 'react'
import getCurrentPageId from '../../lib/utils/common/getCurrentPageId'
import { memberNavLinks } from '../../lib/constants/navigation/memberNavLinks'
import { useApplicationSelector } from '../../lib/redux/store'
import MobileNavigationDrawer from '../drawers/MobileNavigationDrawer'
import FixedLeftNavigationPanel from '../admin/FixedLeftNavigationPanel'
import FixedHeader from '../admin/FixedHeader'
import { motion } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'

const MemberLayoutClient = ({ children }) => {
  const path = usePathname()
  const session = useSession()
  const user = session.data?.user
  const membershipLinksWithIsMembership = memberNavLinks(user?.isMembership)
  const selectedPage = getCurrentPageId(path, membershipLinksWithIsMembership)
  const { isNavigationCollapsed } = useApplicationSelector()

  return (
    <>
      <MobileNavigationDrawer links={membershipLinksWithIsMembership} />
      <div className="min-h-screen bg-gray-950 flex">
        {/* Fixed Left Navigation Panel */}
        <FixedLeftNavigationPanel selectedPage={selectedPage} links={membershipLinksWithIsMembership} user={user} />

        {/* Main Content Area */}
        <div
          className={`${isNavigationCollapsed ? 'lg:ml-20' : 'lg:ml-70'} flex-1 flex flex-col`}
          style={{
            transition: 'margin-left 0.3s ease-in-out'
          }}
        >
          {/* Fixed Header */}
          <FixedHeader selectedPage={selectedPage} links={membershipLinksWithIsMembership} />

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

export default MemberLayoutClient
