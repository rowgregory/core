'use client'

import React, { useEffect } from 'react'
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
import { setUsers } from './redux/features/userSlice'
import { useAppDispatch } from './redux/store'
import { PageWrapperProps } from '@/types/common'

const showLink = (path: string) =>
  !['/admin', '/member', '/swabbie/port', '/auth/login', '/auth/custom-callback'].some((str) => path.includes(str))

export default function PageWrapper({ children, users }: PageWrapperProps) {
  const path = useCustomPathname()
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (users) {
      dispatch(setUsers(users))
    }
  }, [dispatch, users])

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

      {showLink(path) && <Header />}
      {children}
      {showLink(path) && <Footer />}
    </>
  )
}
