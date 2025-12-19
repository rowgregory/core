import React from 'react'
import { motion } from 'framer-motion'
import { fadeInUp, staggerContainer } from '@/app/lib/constants/motion'
import expectations from '@/app/lib/constants/home/expectations'
import { CheckCircle } from 'lucide-react'

const MemberExpectations = () => {
  return (
    <motion.section className="py-20" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
      <div className="max-w-6xl mx-auto px-6">
        <motion.div variants={fadeInUp} className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Member Expectations</h2>
          <p className="text-xl text-gray-300">What it takes to be part of our network</p>
        </motion.div>

        <motion.div variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {expectations.map((expectation: any, index: number) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              className="flex items-start space-x-4 p-6 bg-gray-700/40 backdrop-blur-sm rounded-xl hover:bg-gray-700/60 transition-colors duration-200 border border-gray-600/30"
            >
              <CheckCircle className="w-6 h-6 text-cyan-400 mt-1 shrink-0" />
              <p className="text-gray-200 leading-relaxed">{expectation}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  )
}

export default MemberExpectations
