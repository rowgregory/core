'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const fadeInUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, easing: 'easeOut' } }
}

const Footer = () => {
  const path = usePathname()

  const footerLinkCls = (active: boolean) =>
    `text-f10 font-mono tracking-[0.15em] uppercase transition-colors duration-150 py-1 inline-block ${
      active ? 'text-primary-dark' : 'text-on-dark hover:text-text-dark'
    }`

  return (
    <footer className="bg-navbar-light dark:bg-navbar-dark border-t border-border-dark">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* ── Top grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 mb-12">
          {/* Contact */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
            <p className="text-f10 font-mono tracking-[0.2em] uppercase text-primary-dark mb-4">Contact</p>
            <p className="font-nunito text-sm text-on-dark leading-relaxed">
              Coastal Referral Exchange
              <br />
              North Shore, Massachusetts
              <br />
              USA
            </p>
          </motion.div>

          {/* Quick links */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            transition={{ delay: 0.1 }}
          >
            <p className="text-f10 font-mono tracking-[0.2em] uppercase text-primary-dark mb-4">Quick Links</p>
            <ul className="space-y-2">
              <li>
                <Link href="/" className={footerLinkCls(path === '/')}>
                  Home
                </Link>
              </li>
              <li>
                <Link href="/application" className={footerLinkCls(path === '/application')}>
                  Apply
                </Link>
              </li>
              <li>
                <Link href="/auth/login" className={footerLinkCls(path === '/members')}>
                  Launch App
                </Link>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* ── Divider ── */}
        <div className="h-px bg-border-dark mb-8" />

        {/* ── Bottom row ── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
            <Link
              href="/"
              className="font-sora font-black text-lg text-text-dark hover:text-primary-dark transition-colors duration-150"
              aria-label="Coastal Referral Exchange — Home"
            >
              CORE<span className="text-primary-dark">.</span>
            </Link>
          </motion.div>

          {/* Facebook */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
            <a
              href="https://www.facebook.com/profile.php?id=61580349661260"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 flex items-center justify-center border border-border-dark text-on-dark hover:text-primary-dark hover:border-primary-dark transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-dark"
              aria-label="Coastal Referral Exchange on Facebook"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>
          </motion.div>
        </div>

        {/* ── Copyright ── */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="mt-8 text-center space-y-1.5"
        >
          <p className="text-f10 font-mono tracking-widest text-on-dark/60">
            © Coastal Referral Exchange {new Date().getFullYear()}. All Rights Reserved.
          </p>
          <p className="text-f10 font-mono tracking-widest text-on-dark/40">
            Developed by{' '}
            <a
              href="https://sqysh.com?cameFrom=core"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-dark hover:text-text-dark transition-colors duration-150"
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
