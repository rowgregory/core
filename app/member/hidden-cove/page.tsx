'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Star } from 'lucide-react'
import Picture from '@/app/components/common/Picture'
import useSoundEffect from '@/hooks/useSoundEffect'
import { features } from '@/app/lib/constants/hidden-cove/features'
import { getHiddenCoveStatusBadge } from '@/app/lib/constants/hidden-cove/getHiddenCoveStatusBadge'

const HiddenCove = () => {
  const { play } = useSoundEffect('/sound-effects/portal-login.mp3', true)
  play()

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gray-900/30" />
          <Picture
            src="/images/hidden-cove-4.jpg"
            className="w-full h-full object-cover object-center"
            priority={false}
          />
        </div>

        <div className="relative max-w-5xl mx-auto px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center px-3 py-1.5 bg-white/5 border border-white/10 rounded-full mb-6">
              <Star className="w-4 h-4 text-yellow-400 mr-2" />
              <span className="text-sm font-medium text-gray-300">Crew Add Ons</span>
            </div>

            <h1 className="text-4xl font-bold mb-4 text-white leading-tight">Choose What We Unlock Together</h1>

            <p className="text-base text-white mb-0 leading-relaxed">
              Below are three features we can enable for our group. Review each one, and confirm which tools we want to
              use going forward.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
        <div className="grid xl:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon
            const statusBadge = getHiddenCoveStatusBadge(feature.status)

            return (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="border border-white/10 bg-white/[0.02] rounded-2xl p-8 shadow-lg backdrop-blur-sm hover:bg-white/[0.05] transition-all duration-300"
              >
                <div className="space-y-6 flex flex-col h-full justify-between">
                  <div className="space-y-6">
                    {/* Icon + Status */}
                    <div className="flex items-center justify-between">
                      <div className={`p-3 rounded-xl bg-linear-to-r ${feature.gradient} shadow-lg`}>
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <div className={`px-3 py-1 border rounded-full text-xs font-medium ${statusBadge.color}`}>
                        {statusBadge.text}
                      </div>
                    </div>

                    {/* Name + Tagline + Description */}
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-2">{feature.name}</h2>
                      <p className={`text-sm font-medium text-${feature.accentColor} mb-3 uppercase tracking-wide`}>
                        {feature.tagline}
                      </p>
                      <p className="text-gray-400 text-sm leading-relaxed mb-4">{feature.description}</p>
                    </div>

                    {/* Capabilities */}
                    <div className="space-y-3">
                      {feature.capabilities.map((capability, capIndex) => (
                        <div key={capIndex} className="flex items-start space-x-3">
                          <div className={`w-2 h-2 rounded-full bg-${feature.accentColor} mt-2 flex-shrink-0`} />
                          <div>
                            <h4 className="font-semibold text-white text-xs">{capability.title}</h4>
                            <p className="text-gray-500 text-xs mt-1">{capability.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Pricing Section */}
                  <div className="space-y-4">
                    {/* Status Description */}
                    <div className="py-3 border-y border-white/10">
                      <p className="text-xs text-gray-500">{statusBadge.description}</p>
                    </div>
                    <div className="text-sm text-gray-400 space-y-1">
                      <p>
                        Initial Build:{' '}
                        <span className="text-white font-semibold">${feature.pricing.build.toLocaleString()}</span>
                      </p>
                      <p>
                        Monthly: <span className="text-white font-semibold">${feature.pricing.monthly}</span>
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="w-full px-4 py-2 rounded-lg border border-white/20 hover:border-white/30 text-sm font-medium text-white hover:bg-white/5 transition-all duration-200 flex items-center justify-center">
                        View Details Coming Soon
                      </div>
                      <div
                        className={`text-center w-full px-4 py-2 rounded-lg bg-linear-to-r ${feature.gradient} hover:shadow-lg hover:shadow-${feature.accentColor}/25 text-sm font-medium text-white transition-all duration-200`}
                      >
                        {feature.name}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
export default HiddenCove
