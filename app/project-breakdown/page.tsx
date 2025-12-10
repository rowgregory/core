'use client'

import React, { useState } from 'react'
import {
  Users,
  CheckCircle,
  Coffee,
  Target,
  Shield,
  DollarSign,
  Eye,
  Building,
  Calculator,
  ArrowLeft,
  BarChart3,
  Gamepad2,
  MessageSquare,
  Calendar,
  Zap,
  ShoppingCart,
  RotateCcw,
  Flag,
  Activity,
  Grid,
  UserPlus,
  Repeat
} from 'lucide-react'
import Link from 'next/link'

const ProjectBreakdown = () => {
  const [selectedFeatures, setSelectedFeatures] = useState([]) as any
  const coreFeatures = [
    {
      icon: Building,
      title: 'Single Chapter Architecture',
      description: 'Platform designed for our unified networking group with centralized management',
      hours: '40-60 hours',
      cost: '$525' // slightly lower, random-ish
    },
    {
      icon: Users,
      title: 'Member Management System',
      description: 'Allows admins to manually add members to the chapter with profile setup and access control',
      hours: '60-90 hours',
      cost: '$585' // slightly lower, random-ish
    },
    {
      icon: Shield,
      title: 'Authentication & Security',
      description: 'Secure login system, role-based access (Member/Admin), and session management',
      hours: '25-38 hours',
      cost: '$515' // slightly lower, random-ish
    }
  ]

  const gameFeatures = [
    {
      id: 'visitors',
      icon: Eye,
      title: 'Explorer Management',
      description: 'Add explorers, track attendance, store contact info',
      cost: 620, // lowered from 670
      category: 'Core'
    },
    {
      id: 'analytics',
      icon: BarChart3,
      title: 'Analytics Dashboard',
      description: 'Real-time metrics, activity tracking, ROI calculations',
      cost: 900, // lowered from 960
      category: 'Core'
    },
    {
      id: 'revenue',
      icon: DollarSign,
      title: 'Closed & Credited',
      description: 'Track closed business deals and performance metrics',
      cost: 650, // lowered from 700
      category: 'Core'
    },
    {
      id: 'missions',
      icon: Flag,
      title: 'Weekly Missions',
      description: 'Gamified challenges to boost engagement and track progress',
      cost: 850, // lowered from 900
      category: 'Core'
    },
    {
      id: 'pulse',
      icon: Activity,
      title: 'Chapter Pulse',
      description: 'Live feed of all activity – referrals, meetings, visitors, deals',
      cost: 800, // lowered from 850
      category: 'Core'
    },
    {
      id: 'referrals',
      icon: Target,
      title: 'Lead Tracking',
      description: 'Submit and track leads with status updates',
      cost: 560, // lowered from 600
      category: 'Core'
    },
    {
      id: 'boosts',
      icon: Zap,
      title: 'Performance Boosts',
      description: 'Earn temporary bonuses for consistent engagement or milestones',
      cost: 650, // lowered from 700
      category: 'Core'
    },
    {
      id: 'meetings',
      icon: Coffee,
      title: 'Face-2-Face Tracker',
      description: 'Log face-2-face meetings with notes and history',
      cost: 590, // lowered from 630
      category: 'Core'
    },
    {
      id: 'eventScheduler',
      icon: Calendar,
      title: 'Event Scheduler',
      description: 'Plan, manage, and send invites for chapter events and meetups',
      cost: 820, // lowered from 750
      category: 'Core'
    },
    {
      id: 'memoryMatch',
      icon: Repeat, // or another icon representing memory or game
      title: 'Memory Match Game',
      description: 'Engage members with a fun memory card-matching game to boost interaction and networking',
      cost: 780, // medium complexity: game logic + UI/UX
      category: 'Core'
    },
    {
      id: 'newMemberForm',
      icon: UserPlus,
      title: 'New Member Form',
      description: 'Streamlined form for adding new members with required details and validation',
      cost: 560, // lowered from 600
      category: 'Core'
    },
    {
      id: 'goalTracker',
      icon: CheckCircle,
      title: 'Goal Tracker',
      description: 'Set and monitor personal and chapter goals with progress updates',
      cost: 650, // lowered from 700
      category: 'Core'
    },
    {
      id: 'networkBingo',
      icon: Grid,
      title: 'Network Bingo Game',
      description: 'Interactive bingo game to encourage members to connect and engage',
      cost: 850, // lowered from 900
      category: 'Core'
    },
    {
      id: 'arcadeCyclone',
      icon: Zap,
      title: 'Arcade Cyclone Generator',
      description: 'Face-to-face meeting generator with an arcade-style challenge twist',
      cost: 900, // lowered from 950
      category: 'Core'
    },
    {
      id: 'appMessaging',
      icon: MessageSquare,
      title: 'In-App Messaging System',
      description: 'Seamless private and group messaging between members within the app',
      cost: 940, // lowered from 1000
      category: 'Core'
    }
  ]

  const toggleFeature = (featureId: any) => {
    setSelectedFeatures((prev: any) =>
      prev.includes(featureId) ? prev.filter((id: any) => id !== featureId) : [...prev, featureId]
    )
  }

  const resetSelection = () => {
    setSelectedFeatures([])
  }

  const calculateSelectedTotal = () => {
    return gameFeatures
      .filter((feature) => selectedFeatures.includes(feature.id))
      .reduce((total, feature) => total + feature.cost, 0)
  }

  const getRecommendation = () => {
    const count = selectedFeatures.length

    if (count === 0) return { text: 'Select some features to see your custom quote!', color: 'text-gray-400' }
    if (count <= 2) return { text: 'Great start! Consider adding 1-2 more for better value.', color: 'text-blue-400' }
    if (count <= 4) return { text: 'Perfect balance of features and budget!', color: 'text-green-400' }
    if (count === 5) return { text: 'Excellent choice! Almost the full experience.', color: 'text-purple-400' }
    if (count <= 7) return { text: 'You’re building a powerhouse networking app!', color: 'text-yellow-400' }
    if (count <= 10) return { text: 'Nearly everything included — networking unleashed!', color: 'text-orange-400' }
    if (count <= 14)
      return { text: 'All-in premium package, the ultimate networking experience!', color: 'text-red-400' }
    if (count === 15) return { text: 'Complete feature set selected — nothing left to add!', color: 'text-pink-400' }
  }

  const calculateTotal = (items: any[]) => {
    const costs = items.map((item) => {
      const range = item.cost.replace('$', '').split('-')
      return {
        min: parseInt(range[0].replace(',', ''))
      }
    })
    return costs.reduce((sum, cost) => sum + cost.min, 0)
  }

  const totalPrice = calculateTotal(coreFeatures)

  return (
    <div className="min-h-screen bg-black">
      <div className="p-4 lg:p-8">
        {/* Back Button */}
        <div className="max-w-7xl mx-auto mb-8">
          <Link href="/" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group">
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Home</span>
          </Link>
        </div>

        {/* Header */}
        <div className="max-w-7xl mx-auto mb-12">
          <div className="text-center">
            <h1 className="text-4xl lg:text-6xl font-bold text-white mb-4 leading-tight">
              Coastal Referral Exchange{' '}
              <span className="bg-linear-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">Platform</span>
            </h1>
            <p className="text-lg lg:text-2xl text-gray-300 max-w-3xl mx-auto">
              Development breakdown for our local business networking chapter
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto">
          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-12 gap-8">
            {/* Left Column - Platform Options */}
            <div className="lg:col-span-8">
              <section className="mb-12">
                <h2 className="text-2xl lg:text-4xl font-bold text-white mb-8">How Modern, Bruh?</h2>

                <div className="grid md:grid-cols-2 gap-6 mb-12">
                  {/* Simple Option */}
                  <div className="bg-gray-900 border-2 border-blue-500 rounded-2xl p-6">
                    <div className="bg-linear-to-r from-blue-500 to-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium inline-block mb-4">
                      SPARK
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">Boot Sequence</h3>
                    <div className="text-3xl font-bold bg-linear-to-r from-blue-400 to-blue-500 bg-clip-text text-transparent mb-3">
                      $1000
                    </div>
                    <div className="text-base text-gray-300 mb-6">
                      Just ${(1000 / 12).toFixed(2)} per member (split 12 ways)
                    </div>

                    <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                        <span className="text-sm text-gray-300">Professional static multi-page website</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                        <span className="text-sm text-gray-300">Member directory & profiles</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                        <span className="text-sm text-gray-300">Contact page</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                        <span className="text-sm text-gray-300">Mobile responsive design</span>
                      </div>
                    </div>

                    <div className="bg-blue-600/20 border border-blue-400 p-3 rounded-lg mb-4">
                      <p className="text-xs text-blue-200">
                        <strong className="text-blue-300">Perfect for:</strong> Professional web presence
                      </p>
                    </div>

                    <div className="text-sm text-gray-400">
                      <strong className="text-gray-300">Timeline:</strong> 1-2 weeks
                    </div>
                  </div>

                  {/* Mix & Match Option */}
                  <div className="bg-gray-900 border-2 border-green-500 rounded-2xl p-6 ring-green-400">
                    <div className="bg-linear-to-r from-green-500 to-emerald-600 text-white px-3 py-1 rounded-full text-sm font-medium inline-block mb-4">
                      SURGE
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">Mix & Match</h3>
                    <div className="text-3xl font-bold bg-linear-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-3">
                      ${totalPrice.toLocaleString()}+
                    </div>
                    <div className="text-base text-gray-300 mb-6">
                      {selectedFeatures.length > 0
                        ? `Starting at $${Math.round(totalPrice / 12)} per member (split 12 ways)`
                        : 'Choose your own features below'}
                    </div>

                    <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-2">
                        <Gamepad2 className="w-4 h-4 text-green-400 flex-shrink-0" />
                        <span className="text-sm text-gray-300">Everything in Boot Sequence, plus:</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Target className="w-4 h-4 text-green-400 flex-shrink-0" />
                        <span className="text-sm text-gray-300">Pick exactly what you need</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calculator className="w-4 h-4 text-green-400 flex-shrink-0" />
                        <span className="text-sm text-gray-300">See real-time pricing</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-green-400 flex-shrink-0" />
                        <span className="text-sm text-gray-300">Perfect for group decisions</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-green-400 flex-shrink-0" />
                        <span className="text-sm text-gray-300">Add more features later</span>
                      </div>
                      {selectedFeatures.length > 0 && (
                        <div className="mt-4 pt-3 border-t border-green-500/20">
                          <div className="text-xs text-green-300 font-semibold mb-2">Your current selection:</div>
                          {gameFeatures
                            .filter((feature) => selectedFeatures.includes(feature.id))
                            .map((feature) => (
                              <div key={feature.id} className="flex items-center gap-2 mb-1">
                                <CheckCircle className="w-3 h-3 text-green-400 flex-shrink-0" />
                                <span className="text-xs text-gray-300">{feature.title}</span>
                              </div>
                            ))}
                        </div>
                      )}
                    </div>

                    <div className="bg-green-600/20 border border-green-400 p-3 rounded-lg mb-4">
                      <p className="text-xs text-green-200">
                        <strong className="text-green-300">Perfect for:</strong> Groups who want control over their
                        investment
                      </p>
                    </div>

                    <div className="text-sm text-gray-400">
                      <strong className="text-gray-300">Timeline:</strong>
                      {selectedFeatures.length > 0
                        ? ` ${selectedFeatures.length <= 3 ? '3-5' : selectedFeatures.length <= 5 ? '5-7' : '6-8'} weeks`
                        : ' Depends on features chosen'}
                    </div>
                  </div>
                </div>
              </section>

              {/* Core Features Grid */}
              <section className="mb-12">
                <div className="bg-gray-950 border border-gray-800 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-gray-800 rounded-lg">
                      <Calculator className="w-6 h-6 text-gray-300" />
                    </div>
                    <h2 className="text-2xl font-semibold text-gray-100">Required Core Features</h2>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    {coreFeatures.map((feature, index) => (
                      <div
                        key={index}
                        className="bg-gray-900 border border-gray-700 rounded-lg p-4 hover:bg-gray-800 transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-blue-600/20 rounded-lg border border-blue-500/30 flex-shrink-0">
                            <feature.icon className="w-4 h-4 text-blue-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-white text-sm mb-1">{feature.title}</h3>
                            <p className="text-gray-300 text-xs mb-2 leading-relaxed">{feature.description}</p>
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-gray-400">{feature.hours}</span>
                              <span className="font-semibold text-green-400 text-sm">{feature.cost}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 bg-gray-900 border border-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-100">Core Features Total</h3>
                        <p className="text-gray-400 text-sm">{coreFeatures.length} deliverables</p>
                      </div>
                      <div className="text-2xl font-bold text-gray-100">${totalPrice.toLocaleString()}</div>
                    </div>
                  </div>
                </div>
              </section>

              <section className="mb-12">
                <div className="bg-gradient-to-br from-indigo-950 to-gray-900 border-2 border-indigo-500/30 rounded-xl p-6">
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 bg-indigo-600/20 border border-indigo-500/30 rounded-full px-4 py-2 mb-4">
                      <Gamepad2 className="w-4 h-4 text-indigo-400" />
                      <span className="text-indigo-300 text-sm font-medium">Interactive Builder</span>
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-4">🎮 Build Your Perfect Platform</h2>
                    <p className="text-gray-300 text-lg">Click features to add them to your custom package!</p>
                  </div>

                  {/* Feature Selection Grid */}
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                    {gameFeatures.map((feature) => {
                      const isSelected = selectedFeatures.includes(feature.id)
                      return (
                        <div
                          key={feature.id}
                          onClick={() => toggleFeature(feature.id)}
                          className={`
                            cursor-pointer transition-all duration-300 transform hover:scale-105 rounded-lg p-4 border-2
                            ${
                              isSelected
                                ? 'bg-indigo-900/50 border-indigo-400 shadow-lg shadow-indigo-500/25 scale-105'
                                : 'bg-gray-900/70 border-gray-600 hover:border-indigo-500/50 hover:bg-gray-800/70'
                            }
                          `}
                        >
                          <div className="flex items-start gap-3 mb-3">
                            <div
                              className={`p-2 rounded-lg flex-shrink-0 ${isSelected ? 'bg-indigo-600/30' : 'bg-gray-700'}`}
                            >
                              <feature.icon className={`w-5 h-5 ${isSelected ? 'text-indigo-400' : 'text-gray-400'}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3
                                className={`font-semibold text-sm mb-1 ${isSelected ? 'text-white' : 'text-gray-300'}`}
                              >
                                {feature.title}
                              </h3>
                              <p
                                className={`text-xs leading-relaxed ${isSelected ? 'text-indigo-200' : 'text-gray-400'}`}
                              >
                                {feature.description}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className={`text-sm font-bold ${isSelected ? 'text-indigo-300' : 'text-gray-500'}`}>
                              ${feature.cost.toLocaleString()}
                            </span>
                            {isSelected && (
                              <div className="w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center">
                                <CheckCircle className="w-4 h-4 text-white" />
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  {/* Results Panel */}
                  <div className="bg-gray-900/80 border border-indigo-500/30 rounded-xl p-6">
                    <div className="grid md:grid-cols-2 gap-6 items-center">
                      {/* Left Side - Selection Summary */}
                      <div>
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                          <ShoppingCart className="w-5 h-5 text-indigo-400" />
                          Your Custom Package
                        </h3>

                        {selectedFeatures.length > 0 ? (
                          <div className="space-y-2 mb-4">
                            {gameFeatures
                              .filter((feature) => selectedFeatures.includes(feature.id))
                              .map((feature) => (
                                <div key={feature.id} className="flex justify-between items-center text-sm">
                                  <span className="text-gray-300">{feature.title}</span>
                                  <span className="text-indigo-300 font-semibold">
                                    ${feature.cost.toLocaleString()}
                                  </span>
                                </div>
                              ))}
                          </div>
                        ) : (
                          <div className="text-gray-400 text-sm mb-4 italic">
                            No features selected yet. Click features above to add them!
                          </div>
                        )}

                        <div className="border-t border-gray-700 pt-3">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-semibold text-white">Selected Features:</span>
                            <span className="text-indigo-300">{selectedFeatures.length} of 15</span>
                          </div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-semibold text-white">Required Core Features:</span>
                            <span className="text-indigo-300">${totalPrice.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-semibold text-white">Local Business Discount:</span>
                            <span className="text-indigo-300">
                              ${((calculateSelectedTotal() + totalPrice) * 0.15).toLocaleString()}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-white text-lg">Total Cost:</span>
                            <span className="font-bold text-indigo-400 text-2xl">
                              ${((calculateSelectedTotal() + totalPrice) * 0.85).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right Side - Recommendation & Actions */}
                      <div className="text-center">
                        <div className="bg-indigo-900/30 border border-indigo-500/20 rounded-lg p-4 mb-4">
                          <div className="text-sm font-semibold mb-2 text-indigo-300">💡 Smart Recommendation</div>
                          <div className={`text-sm ${getRecommendation()?.color}`}>{getRecommendation()?.text}</div>
                        </div>

                        {selectedFeatures.length > 0 && (
                          <div className="bg-gray-800 rounded-lg p-4 mb-4">
                            <div className="text-sm text-gray-300 mb-2">Cost per member (split 12 ways):</div>
                            <div className="text-2xl font-bold text-white">
                              ${((Math.round(calculateSelectedTotal() + totalPrice) * 0.85) / 12).toFixed(2)}
                            </div>
                          </div>
                        )}

                        <div className="flex gap-3">
                          <button
                            onClick={resetSelection}
                            className="flex-1 bg-gray-700 hover:bg-gray-600 text-gray-300 font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                          >
                            <RotateCcw className="w-4 h-4" />
                            Reset
                          </button>
                          <button
                            disabled={selectedFeatures.length === 0}
                            className={`flex-1 font-bold py-3 px-4 rounded-lg transition-all ${
                              selectedFeatures.length > 0
                                ? 'bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white'
                                : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                            }`}
                          >
                            Get Quote
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            {/* Right Column - Pricing & Details */}
            <div className="lg:col-span-4">
              {/* Special Pricing Card */}
              <div className="bg-gray-900 border-2 border-purple-500 rounded-2xl p-6 mb-8 sticky top-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white mb-2">🎉 Local Business Discount on Mix & Match</div>
                  <div className="text-lg font-bold text-purple-300 mb-4">Save 15%</div>

                  <div className="bg-gray-800 rounded-lg p-4 border border-purple-500 mb-6">
                    <div className="text-sm font-medium line-through text-gray-400 mb-1">
                      Regular: ${totalPrice.toLocaleString()}
                    </div>
                    <div className="text-3xl font-bold bg-linear-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-3">
                      ${((calculateSelectedTotal() + totalPrice) * 0.85).toLocaleString()}
                    </div>
                    <div className="text-lg font-bold bg-yellow-400 text-black px-4 py-2 rounded-lg">
                      ${(((calculateSelectedTotal() + totalPrice) * 0.85) / 12).toFixed(2)} per member
                    </div>
                    <div className="text-xs text-gray-400 mt-1">Split 12 ways</div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="bg-gray-800 rounded-lg p-3">
                      <div className="text-lg font-bold text-purple-400">6-8</div>
                      <div className="text-xs text-gray-300">weeks</div>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-3">
                      <div className="text-lg font-bold text-blue-400">8</div>
                      <div className="text-xs text-gray-300">features</div>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-3">
                      <div className="text-lg font-bold text-green-400">Full</div>
                      <div className="text-xs text-gray-300">platform</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Schedule */}
              <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 mb-8">
                <h3 className="text-lg font-bold text-white mb-4">Payment Schedule</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                    <div>
                      <div className="font-semibold text-white text-sm">Project Start</div>
                      <div className="text-xs text-gray-400">Setup & planning</div>
                    </div>
                    <div className="text-xl font-bold text-purple-400">50%</div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                    <div>
                      <div className="font-semibold text-white text-sm">Midpoint Demo</div>
                      <div className="text-xs text-gray-400">Core features ready</div>
                    </div>
                    <div className="text-xl font-bold text-blue-400">25%</div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                    <div>
                      <div className="font-semibold text-white text-sm">Launch Ready</div>
                      <div className="text-xs text-gray-400">Platform deployed</div>
                    </div>
                    <div className="text-xl font-bold text-green-400">25%</div>
                  </div>
                </div>
              </div>

              {/* What's Included */}
              <div className="bg-gray-900 border border-gray-700 rounded-xl p-6">
                <h3 className="text-lg font-bold text-white mb-4">What&apos;s Included</h3>

                <div className="mb-4">
                  <h4 className="font-semibold text-green-400 mb-3 text-sm flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Included
                  </h4>
                  <ul className="space-y-2 text-sm text-gray-300">
                    <li className="flex items-start gap-2">
                      <span className="text-purple-400 mt-1 text-xs">•</span>
                      <span>Full platform access & usage rights</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-400 mt-1 text-xs">•</span>
                      <span>Unlimited days to catch bugs</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-400 mt-1 text-xs">•</span>
                      <span>Mobile responsive design</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-400 mt-1 text-xs">•</span>
                      <span>Cloud hosting setup</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-400 mt-1 text-xs">•</span>
                      <span>Training</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-blue-400 mb-3 text-sm">Important Notes</h4>
                  <ul className="space-y-2 text-sm text-gray-300">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-400 mt-1 text-xs">•</span>
                      <span>Exclusive chapter license</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-400 mt-1 text-xs">•</span>
                      <span>
                        Hosting:{' '}
                        {selectedFeatures.length > 0
                          ? `${Math.round(calculateSelectedTotal() * 0.025) + 50}/month`
                          : '$50/month'}
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-400 mt-1 text-xs">•</span>
                      <span>Domain: ~$1/year</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-400 mt-1 text-xs">•</span>
                      <span>Additional features: $65/hour</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProjectBreakdown
