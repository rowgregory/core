'use client'

import { motion } from 'framer-motion'
import { MotionLink } from '../common/MotionLink'

const AboutSection = () => {
  const fadeInUp: any = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' }
    }
  }

  const fadeIn: any = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.8, ease: 'easeOut' }
    }
  }

  return (
    <section className="py-16 md:py-28 bg-linear-to-b from-blue-900 via-slate-900 to-slate-900">
      <div className="max-w-[1400px] mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Left Column - Main Content */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="relative p-6 md:p-10 lg:p-14 col-span-1 lg:col-span-2 rounded-2xl overflow-hidden"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
          >
            <motion.div variants={fadeInUp} className="mb-8 relative z-20">
              <div className="inline-block px-3 py-1.5 border border-neutral-400/30 rounded-lg mb-4">
                <span className="text-blue-300 font-bold uppercase tracking-wider font-sora text-sm md:text-xl">
                  About Coastal
                </span>
              </div>

              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 md:mb-6 leading-tight md:leading-[58px] font-sora">
                Navigate opportunities with our coastal network
              </h2>

              <p className="text-gray-300 text-sm md:text-base leading-relaxed font-medium">
                Coastal Referral Exchange Networking exists to help business owners grow financially through trusted,
                referral-based connections. By fostering a supportive and high-energy environment, we empower our
                members to build meaningful relationships, exchange quality referrals, and share best practices that
                drive measurable results for their businesses and their communities.
              </p>
            </motion.div>

            {/* Orb - Hidden on mobile */}
            <div className="hidden md:block absolute -bottom-20 -left-20 w-48 h-48 opacity-30">
              <div className="w-full h-full bg-sky-200 rounded-full blur-3xl"></div>
            </div>

            {/* Large Background Text - Smaller on mobile */}
            <motion.div
              variants={fadeIn}
              className="absolute -bottom-8 md:-bottom-14 left-1/2 -translate-x-1/2 w-fit pointer-events-none overflow-hidden z-10"
            >
              <h3 className="text-[100px] sm:text-[140px] md:text-[180px] lg:text-[200px] font-bold text-white/10 leading-none select-none">
                Coastal
              </h3>
            </motion.div>
          </motion.div>

          {/* Right Column - Cards */}
          <div className="flex flex-col gap-6">
            {/* API Integration Card */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="relative bg-gradient-to-br from-blue-500 to-cyan-400 rounded-2xl p-6 md:p-10 lg:p-14 overflow-hidden group"
            >
              <div className="relative z-10">
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-3 md:mb-4 font-sora">
                  Meaningful connections for your business
                </h3>

                <p className="text-white text-sm md:text-base font-sora font-medium mb-6 md:mb-8">
                  Strategic, high quality networking has become essential for modern businesses looking to grow and
                  connect with the right opportunities
                </p>

                <MotionLink
                  href="/navigators"
                  whileHover={{ scale: 1.05, x: 5 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-4 md:px-6 py-2.5 md:py-3 rounded-xl hover:bg-white/30 transition-all font-sora font-medium text-sm md:text-base ml-auto"
                >
                  Explore More
                  <svg
                    className="w-4 h-4 md:w-5 md:h-5 -rotate-45"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </MotionLink>
              </div>
            </motion.div>

            {/* Seamless Integration Card */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              transition={{ delay: 0.2 }}
              className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 md:p-10 lg:p-14"
            >
              <h3 className="text-xl md:text-2xl font-bold text-white mb-6 md:mb-8">Seamless Networking</h3>

              <div className="flex items-center justify-end">
                {/* Number */}
                <div className="text-right">
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4, type: 'spring', stiffness: 100 }}
                    className="text-5xl md:text-7xl font-bold bg-linear-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent"
                  >
                    30+
                  </motion.div>
                  <p className="text-gray-400 text-xs md:text-sm mt-2">Years of Experience</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AboutSection
