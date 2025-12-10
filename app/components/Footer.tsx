'use client'

import useCustomPathname from '@/hooks/useCustomPathname'
import { motion } from 'framer-motion'
import Link from 'next/link'

const fadeInUp: any = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' }
  }
}

const Footer = () => {
  const path = useCustomPathname()

  return (
    <footer className="relative bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-900 text-white overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-10 md:gap-12 mb-10 sm:mb-12 md:mb-16">
          {/* Contact Section */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
            <h3 className="text-xl sm:text-lg md:text-xl font-bold mb-4 sm:mb-5 md:mb-6">Contact</h3>

            <div className="space-y-4 sm:space-y-3 md:space-y-4 text-gray-300">
              <p className="leading-relaxed text-base sm:text-sm md:text-base">
                Boys & Girls Club <br />
                Lynn, Massachusetts 01902 <br /> USA
              </p>

              {/* <div>
                <p className="text-sm sm:text-xs md:text-sm text-gray-400 mb-2 sm:mb-1">Email</p>
                <a
                  href="mailto:info@coastalreferralexchange.com"
                  className="text-lg sm:text-base md:text-lg font-semibold hover:text-cyan-400 active:text-cyan-300 transition-colors inline-block py-1"
                  style={{ wordBreak: 'break-word' }}
                >
                  info@coastal-referral-exchange.com
                </a>
              </div> */}
            </div>
          </motion.div>

          {/* Navigation Section */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-xl sm:text-lg md:text-xl font-bold mb-4 sm:mb-5 md:mb-6">Quick Links</h3>

            <ul className="space-y-3 sm:space-y-2 md:space-y-3">
              <li>
                <Link
                  href="/"
                  className={`${path === '/' ? 'text-cyan-300' : 'text-gray-300'} hover:text-cyan-400 active:text-cyan-300 transition-colors inline-block py-1 text-base sm:text-sm md:text-base`}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/swabbie"
                  className={`${path === '/swabbie' ? 'text-cyan-300' : 'text-gray-300'} hover:text-cyan-400 active:text-cyan-300 transition-colors inline-block py-1 text-base sm:text-sm md:text-base`}
                >
                  Application
                </Link>
              </li>
              <li>
                <Link
                  href="/navigators"
                  className={`${path === '/navigators' ? 'text-cyan-300' : 'text-gray-300'} hover:text-cyan-400 active:text-cyan-300 transition-colors inline-block py-1 text-base sm:text-sm md:text-base`}
                >
                  Navigators
                </Link>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Divider */}
        <div className="h-px bg-linear-to-r from-transparent via-blue-400/30 to-transparent mb-8 sm:mb-6 md:mb-8"></div>

        {/* Bottom Section */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-6 sm:gap-4 md:gap-6">
          {/* Logo */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
            <Link
              href="/"
              className="flex items-center gap-2 text-xl sm:text-lg md:text-2xl font-bold bg-linear-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent text-center"
            >
              Coastal Referral Exchange
            </Link>
          </motion.div>

          {/* Social Links */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="flex items-center gap-4 sm:gap-3 md:gap-4"
          >
            <a
              href="https://www.facebook.com/profile.php?id=61580349661260"
              target="_blank"
              rel="noopener noreferrer"
              className="w-11 h-11 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full bg-slate-800 hover:bg-blue-600 active:bg-blue-700 flex items-center justify-center transition-colors"
              aria-label="Facebook"
            >
              <svg className="w-5 h-5 sm:w-4 sm:h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>
          </motion.div>

          {/* Legal Links */}
          {/* <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="flex items-center gap-6 sm:gap-4 md:gap-6 text-sm sm:text-xs md:text-sm text-gray-400"
          >
            <Link href="/terms" className="hover:text-cyan-400 active:text-cyan-300 transition-colors py-1">
              Terms
            </Link>
            <Link href="/privacy" className="hover:text-cyan-400 active:text-cyan-300 transition-colors py-1">
              Privacy
            </Link>
          </motion.div> */}
        </div>

        {/* Copyright & Developer Credit */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="mt-8 sm:mt-6 md:mt-8 text-center space-y-2"
        >
          <p className="text-sm sm:text-xs md:text-sm text-gray-500">
            © Coastal Referral Exchange {new Date().getFullYear()}. All Rights Reserved
          </p>
          <p className="text-xs text-gray-600">
            Developed by{' '}
            <a
              href="https://sqysh.com?cameFrom=core"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 hover:text-cyan-300 active:text-cyan-200 transition-colors font-semibold"
            >
              Sqysh
            </a>
          </p>
        </motion.div>
      </div>
    </footer>
  )
}

export default Footer
