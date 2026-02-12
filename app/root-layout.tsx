'use client'

import Toast from './components/common/Toast'
import Header from './components/header/Header'
import NavigatorDrawer from './components/drawers/NavigatorDrawer'
import ParleyDrawer from './components/drawers/ParleyDrawer'
import AnchorDrawer from './components/drawers/AnchorDrawer'
import SwabbieDrawer from './components/drawers/SwabbieDrawer'
import TreasureMapDrawer from './components/drawers/TreasureMapDrawer'
import StowawayDrawer from './components/drawers/StowawayDrawer'
import Footer from './components/Footer'
import NavigationDrawer from './components/NavigationDrawer'
import { store } from './lib/redux/store'
import { Provider } from 'react-redux'
import { usePathname } from 'next/navigation'

const showLink = (path: string) =>
  !['/admin', '/member', '/swabbie/port', '/auth/login', '/auth/custom-callback'].some((str) => path.includes(str))

export default function RootLayoutWrapper({ children, users }) {
  const path = usePathname()

  return (
    <Provider store={store}>
      <Toast />
      <NavigatorDrawer />
      <ParleyDrawer users={users} />
      <AnchorDrawer users={users} />
      <SwabbieDrawer />
      <TreasureMapDrawer users={users} />
      <StowawayDrawer />
      <NavigationDrawer />

      {showLink(path) && <Header />}
      {children}
      {showLink(path) && <Footer />}
    </Provider>
  )
}
