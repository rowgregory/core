'use client'

import { PurposeOverview } from './components/home/PurposeOverview'
import { MemberExpectations } from './components/home/MemberExpectations'
import { CTASection } from './components/home/CTASection'
import { AboutSection } from './components/home/AboutSection'
import HeroSection from './components/home/HeroSection'

const Home = () => {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <PurposeOverview />
      <MemberExpectations />
      <CTASection />
    </>
  )
}

export default Home
