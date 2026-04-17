'use client'

import { useState, useEffect } from 'react'
import HeroSection from './components/home/HeroSection'
import PurposeOverview from './components/home/PurposeOverview'
import MemberExpectations from './components/home/MemberExpectations'
import CTASection from './components/home/CTASection'
import AboutSection from './components/home/AboutSection'

const Home = () => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Hero Section */}
      <HeroSection isVisible={isVisible} />
      <AboutSection />

      {/* Purpose Overview */}
      <PurposeOverview />

      {/* Member Expectations */}
      <MemberExpectations />

      {/* CTA Section */}
      <CTASection />
    </div>
  )
}

export default Home
