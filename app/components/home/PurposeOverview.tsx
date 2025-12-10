import React from 'react'
import { motion } from 'framer-motion'
import { fadeInUp, staggerContainer } from '@/app/lib/constants/motion'
import { Calendar, Handshake, Users } from 'lucide-react'

const PurposeOverview = () => {
  return (
    <motion.section className="py-20" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}>
      <div className="max-w-6xl mx-auto px-6">
        <motion.div variants={fadeInUp} className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">Purpose Overview</h2>
          <p className="text-xl text-gray-200 leading-relaxed mb-8">
            Coastal Referral Exchange brings together a select group of business owners from the North Shore to meet
            weekly with a clear goal: helping each other succeed through referrals and collaboration.
          </p>
        </motion.div>

        <motion.div variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <motion.div
            variants={fadeInUp}
            className="text-center p-6 bg-gray-700/30 rounded-xl border border-gray-600/30"
          >
            <div className="w-16 h-16 bg-linear-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/25">
              <Handshake className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Share Opportunities</h3>
            <p className="text-gray-300">
              Connect with the right people, exchange quality leads, and grow your business faster.
            </p>
          </motion.div>

          <motion.div
            variants={fadeInUp}
            className="text-center p-6 bg-gray-700/30 rounded-xl border border-gray-600/30"
          >
            <div className="w-16 h-16 bg-linear-to-r from-cyan-500 to-cyan-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-purple-500/25">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Offer Advice</h3>
            <p className="text-gray-300">And best practices to strengthen each other&apos;s businesses</p>
          </motion.div>

          <motion.div
            variants={fadeInUp}
            className="text-center p-6 bg-gray-700/30 rounded-xl border border-gray-600/30"
          >
            <div className="w-16 h-16 bg-linear-to-r from-teal-500 to-teal-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-500/25">
              <Calendar className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Schedule Meetings</h3>
            <p className="text-gray-300">One-on-one to deepen understanding and build trust</p>
          </motion.div>
        </motion.div>

        <motion.div variants={fadeInUp} className="text-center">
          <p className="text-lg text-gray-200 max-w-4xl mx-auto">
            By consistently showing up for one another, members create momentum, foster opportunities, and navigate the
            path to greater business success — together.
          </p>
        </motion.div>
      </div>
    </motion.section>
  )
}

export default PurposeOverview
