'use client'

import Toast from './components/common/Toast'
import { Header } from './components/header/Header'
import Footer from './components/Footer'
import NavigationDrawer from './components/NavigationDrawer'
import { store } from './lib/redux/store'
import { Provider } from 'react-redux'
import { usePathname } from 'next/navigation'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

const showLink = (path: string) =>
  !['/admin', '/members', '/application', '/auth/login', '/dashboard', '/super', '/profile', '/onboarding'].some(
    (str) => path.includes(str)
  )

export default function RootLayoutWrapper({ children }) {
  const path = usePathname()

  return (
    <Elements stripe={stripePromise}>
      <Provider store={store}>
        <Toast />
        <NavigationDrawer />

        {showLink(path) && <Header />}
        {children}
        {showLink(path) && <Footer />}
      </Provider>
    </Elements>
  )
}
