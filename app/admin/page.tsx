'use client'

import React, { FC, useEffect } from 'react'
import useCustomPathname from '@/hooks/useCustomPathname'
import { useSession } from 'next-auth/react'
import getCurrentPageId from '../lib/utils/common/getCurrentPageId'
import { adminNavLinks } from '../lib/constants/navigation/adminNavLinks'
import MobileNavigationDrawer from '../components/drawers/MobileNavigationDrawer'
import FixedLeftNavigationPanel from '../components/admin/FixedLeftNavigationPanel'
import FixedHeader from '../components/admin/FixedHeader'
import { motion } from 'framer-motion'
import { useAppDispatch, useApplicationSelector } from '../redux/store'
import { setUsers, setUser } from '../redux/features/userSlice'
import { setParleys } from '../redux/features/parleySlice'
import { setTreasureMaps } from '../redux/features/treasureMapSlice'
import { setAnchors } from '../redux/features/anchorSlice'
import { setRendezvous } from '../redux/features/rendezvousSlice'
import { setHydrateDashboard } from '../redux/features/dashboardSlice'
import { ILayoutClient } from '@/types/common'
import { setChapter } from '../redux/features/settingsSlice'

const AdminLayoutClient: FC<ILayoutClient> = ({ data, children }) => {
  const path = useCustomPathname()
  const session = useSession()
  const selectedPage = getCurrentPageId(path, adminNavLinks)
  const dispatch = useAppDispatch()
  const { isNavigationCollapsed } = useApplicationSelector()

  useEffect(() => {
    if (data) {
      dispatch(setUsers(data?.users))
      dispatch(setUser(data?.user))
      dispatch(setParleys(data?.parleys))
      dispatch(setTreasureMaps(data?.treasureMaps))
      dispatch(setAnchors(data?.anchors))
      dispatch(setRendezvous(data?.rendezvous))
      dispatch(setHydrateDashboard(data))
      dispatch(setChapter(data.chapter))
    }
  }, [dispatch, data])

  return (
    <>
      <MobileNavigationDrawer links={adminNavLinks} />
      <div className="min-h-screen bg-gray-950 flex">
        {/* Fixed Left Navigation Panel */}
        <FixedLeftNavigationPanel selectedPage={selectedPage} links={adminNavLinks} data={session?.data} />

        {/* Main Content Area */}
        <div
          className={`${isNavigationCollapsed ? 'lg:ml-20' : 'lg:ml-[280px]'} flex-1 flex flex-col`}
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
