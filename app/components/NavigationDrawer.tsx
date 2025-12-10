'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { X } from 'lucide-react'
import { RootState, useAppDispatch, useAppSelector } from '../redux/store'
import { setCloseNavigationDrawer } from '../redux/features/appSlice'

const NavigationDrawer = () => {
  const pathname = usePathname()
  const dispatch = useAppDispatch()
  const { navigationDrawer } = useAppSelector((state: RootState) => state.app)
  const onClose = () => dispatch(setCloseNavigationDrawer())

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Application', href: '/swabbie' },
    { name: 'Navigators', href: '/navigators' },
    { name: 'Launch App', href: '/auth/login' }
  ]

  const drawerVariants: any = {
    closed: {
      x: '100%',
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30
      }
    },
    open: {
      x: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30
      }
    }
  }

  const backdropVariants: any = {
    closed: { opacity: 0 },
    open: { opacity: 1 }
  }

  const linkVariants: any = {
    closed: { opacity: 0, x: 20 },
    open: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.3
      }
    })
  }

  return (
    <AnimatePresence>
      {navigationDrawer && (
        <>
          {/* Backdrop */}
          <motion.div
            variants={backdropVariants}
            initial="closed"
            animate="open"
            exit="closed"
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />

          {/* Drawer */}
          <motion.div
            variants={drawerVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="fixed top-0 right-0 h-full w-full max-w-sm bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 shadow-2xl z-50 overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-blue-400/20">
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold bg-linear-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  Coastal Referral Exchange
                </span>
              </div>

              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition-colors"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </div>

            <nav className="p-6">
              {/* Navigation Links */}
              <ul className="space-y-2">
                {navLinks.map((link, index) => {
                  const isActive = pathname === link.href

                  return (
                    <motion.li key={link.href} custom={index} variants={linkVariants} initial="closed" animate="open">
                      <Link
                        href={link.href}
                        onClick={onClose}
                        className={`block px-6 py-4 rounded-xl text-lg font-semibold transition-all ${
                          isActive
                            ? 'bg-linear-to-r from-cyan-500 to-blue-500 text-white shadow-lg'
                            : 'text-gray-300 hover:bg-slate-800 hover:text-white'
                        }`}
                      >
                        {link.name}
                      </Link>
                    </motion.li>
                  )
                })}
              </ul>
            </nav>

            {/* Decorative Elements */}
            <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-blue-400/20">
              <div className="text-center text-sm text-gray-400">
                <p>Where business meets</p>
                <p className="text-cyan-400 font-semibold">the horizon</p>
              </div>
            </div>

            {/* Decorative Wave Pattern */}
            <div className="absolute bottom-20 left-0 right-0 pointer-events-none opacity-10">
              <svg viewBox="0 0 1440 320" className="w-full">
                <path
                  fill="currentColor"
                  className="text-cyan-400"
                  d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
                />
              </svg>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default NavigationDrawer
