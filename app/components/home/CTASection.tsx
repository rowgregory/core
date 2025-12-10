import React from 'react'
import { motion } from 'framer-motion'
import { fadeInUp } from '@/app/lib/constants/motion'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

const CTASection = () => {
  return (
    <motion.section
      className="py-20 text-white relative overflow-hidden"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <motion.div variants={fadeInUp}>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Set Sail for Business Success</h2>
          <p className="text-xl mb-8 text-blue-100">
            Join the Coastal Referral Exchange and navigate powerful connections that steer your business toward growth
            and opportunity.
          </p>
          <Link
            href="/swabbie"
            className="px-8 py-4 bg-linear-to-r from-teal-500 via-cyan-500 to-blue-500 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-xl shadow-gray/25"
          >
            Apply Today
            <ArrowRight className="inline ml-2 w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    </motion.section>
  )
}

export default CTASection
