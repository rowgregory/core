'use client'

import Toast from './components/common/Toast'
import { Footer } from './components/Footer'
import NavigationDrawer from './components/NavigationDrawer'
import { store } from './lib/redux/store'
import { Provider } from 'react-redux'
import { usePathname } from 'next/navigation'
import { ThemeProvider } from './lib/providers/ThemeProvider'

const showLink = (path: string) =>
  ![
    '/admin',
    '/members',
    '/application',
    '/login',
    '/dashboard',
    '/super',
    '/profile',
    '/onboarding',
    '/visitor-day',
    '/visitor',
    '/attendance',
    '/check-in',
    '/events'
  ].some((str) => path.includes(str))

export default function RootLayoutWrapper({ children }) {
  const path = usePathname()

  return (
    <Provider store={store}>
      <ThemeProvider>
        <Toast />
        <NavigationDrawer />
        {children}
        {showLink(path) && <Footer />}
      </ThemeProvider>
    </Provider>
  )
}
