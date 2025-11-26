'use client'

import React, { ReactNode } from 'react'
import Toast from './components/common/Toast'
import Header from './components/header/Header'
import useCustomPathname from '@/hooks/useCustomPathname'
import NavigatorDrawer from './components/drawers/NavigatorDrawer'
import ParleyDrawer from './components/drawers/ParleyDrawer'
import AnchorDrawer from './components/drawers/AnchorDrawer'
import SwabbieDrawer from './components/drawers/SwabbieDrawer'
import TreasureMapDrawer from './components/drawers/TreasureMapDrawer'
import GrogDrawer from './components/drawers/GrogDrawer'
import StowawayDrawer from './components/drawers/StowawayDrawer'
import Footer from './components/Footer'
import NavigationDrawer from './components/NavigationDrawer'
import { useGetUsersQuery } from './redux/services/userApi'
import { chapterId } from './lib/constants/api/chapterId'

interface PageWrapperProps {
  children: ReactNode
}

export default function PageWrapper({ children }: PageWrapperProps) {
  const path = useCustomPathname()
  const showLink = !['/admin', '/member', '/swabbie/port', '/auth/custom-callback'].some((str) => path.includes(str))
  useGetUsersQuery({ chapterId })

  return (
    <>
      <Toast />
      <NavigatorDrawer />
      <ParleyDrawer />
      <AnchorDrawer />
      <SwabbieDrawer />
      <TreasureMapDrawer />
      <GrogDrawer />
      <StowawayDrawer />
      <NavigationDrawer />
      {showLink && <Header />}
      {children}
      {showLink && <Footer />}
    </>
  )
}
