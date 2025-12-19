import React, { FC } from 'react'
import { motion } from 'framer-motion'
import {
  User,
  MapPin,
  CheckCircle,
  ArrowRight,
  Anchor,
  Navigation,
  Shield,
  Waves,
  Compass,
  Ship,
  Zap,
  AlertTriangle,
  AlertCircle
} from 'lucide-react'
import { IForm } from '@/types/forms'
import { Switch } from '../ui/Switch'

const InputStyle =
  'w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors'

const SwabbieErrorText = ({ error }: { error: string }) => (
  <p className="text-red-400 text-sm mt-1 flex items-center space-x-1">
    <AlertCircle className="w-4 h-4 shrink-0" />
    <span>{error}</span>
  </p>
)

const SwabbieApplicationForm: FC<IForm> = ({ inputs, errors, handleInput, handleSubmit, handleToggle, isLoading }) => {
  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="bg-slate-800/40 backdrop-blur-md border border-slate-600/30 rounded-xl md:p-8 shadow-2xl shadow-slate-900/50"
    >
      <div className="p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* LEFT COLUMN */}
          <div className="space-y-10">
            {/* Personal Information */}
            <section>
              <div className="flex items-center mb-6">
                <div className="bg-linear-to-b from-teal-600 to-teal-700 p-2 rounded-lg mr-4 shadow-lg shadow-cyan-900/50">
                  <User className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-semibold text-white">Visitor Details</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Full Name <span className="text-amber-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={inputs.name || ''}
                    onChange={handleInput}
                    className={InputStyle}
                    placeholder="Enter your name"
                  />
                  {errors?.name && <SwabbieErrorText error={errors.name} />}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Email Address <span className="text-amber-400">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={inputs.email || ''}
                    onChange={handleInput}
                    className={InputStyle}
                    placeholder="sqysh@sqysh.io"
                  />
                  {errors?.email && <SwabbieErrorText error={errors.email} />}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Location <span className="text-amber-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={inputs.location || ''}
                    onChange={handleInput}
                    className={InputStyle}
                    placeholder="Lynn"
                  />
                  {errors?.location && <SwabbieErrorText error={errors.location} />}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={inputs.phone || ''}
                    onChange={handleInput}
                    className={InputStyle}
                    placeholder="1234567890"
                  />
                </div>
              </div>
            </section>

            {/* Maritime Information */}
            <section>
              <div className="flex items-center mb-6">
                <div className="bg-linear-to-r from-cyan-600 to-cyan-700 p-2 rounded-lg mr-4 shadow-lg shadow-emerald-900/50">
                  <Ship className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-semibold text-white">Business Credentials</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Business Name <span className="text-amber-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={inputs.company || ''}
                    onChange={handleInput}
                    className={InputStyle}
                    placeholder="Your business name"
                  />
                  {errors?.company && <SwabbieErrorText error={errors.company} />}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Business Industry <span className="text-amber-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="industry"
                    value={inputs.industry || ''}
                    onChange={handleInput}
                    className={InputStyle}
                    placeholder="e.g., Financial Advisor, Maritime Attorney, Insurance Broker"
                  />
                  {errors?.industry && <SwabbieErrorText error={errors.industry} />}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Licensed</label>
                  <div className="mt-1">
                    <Switch
                      name="isLicensed"
                      checked={inputs.isLicensed ?? false}
                      onChange={handleToggle}
                      label="Do you hold a Professional License?"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Professional License Number</label>
                  <input
                    type="text"
                    name="businessLicenseNumber"
                    value={inputs.businessLicenseNumber || ''}
                    onChange={handleInput}
                    disabled={!inputs?.isLicensed}
                    className={`${InputStyle} ${
                      !inputs?.isLicensed ? 'opacity-50 cursor-not-allowed bg-slate-700/30' : ''
                    }`}
                    placeholder={
                      inputs?.isLicensed ? 'Your professional license number' : 'Enable license to enter number'
                    }
                  />
                  {errors?.businessLicenseNumber && <SwabbieErrorText error={errors.businessLicenseNumber} />}
                </div>
              </div>
            </section>
          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-10">
            {/* Harbor Selection */}
            <section>
              <div className="flex items-center mb-6">
                <div className="bg-linear-to-r from-blue-600 to-blue-700 p-2 rounded-lg mr-4 shadow-lg shadow-purple-900/50">
                  <Compass className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-semibold text-white">Storm Harbor Watch Chapter</h2>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Assigned Harbor Chapter</label>
                <div className="w-full px-4 py-3 bg-slate-700/30 border border-slate-600/50 rounded-lg text-white cursor-not-allowed opacity-75">
                  <div className="flex items-center justify-between">
                    <span>Storm Harbor Watch - North Shore (Thursdays at Dawn)</span>
                    <div className="flex items-center space-x-2">
                      <div className="h-2 w-2 bg-emerald-400 rounded-full animate-pulse"></div>
                      <span className="text-xs text-emerald-400">Active</span>
                    </div>
                  </div>
                </div>
                <p className="text-slate-400 text-xs mt-2">
                  You will be automatically assigned to the Storm Harbor Watch chapter based on your location.
                </p>
              </div>
            </section>

            {/* Harbor Benefits */}
            <section className="bg-slate-700/30 rounded-lg p-6 border border-slate-600/50 shadow-inner">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <Shield className="w-5 h-5 mr-2 text-emerald-400" />
                Coastal Referral Exchange Benefits
              </h3>
              <div className="mb-4 p-3 bg-cyan-800/20 border border-cyan-600/50 rounded-lg">
                <p className="text-cyan-200 text-sm">
                  <strong>New Chapter Launch:</strong> Join our founding crew on Boston&apos;s North Shore! Many of our
                  charter members bring 20+ years of proven business networking experience across diverse industries.
                </p>
              </div>
              <div className="space-y-3">
                <div className="flex items-center text-slate-300">
                  <Waves className="w-3 h-3 text-cyan-400 mr-3" />
                  <span>Weekly business meetings (7:00 AM)</span>
                </div>
                <div className="flex items-center text-slate-300">
                  <Anchor className="w-3 h-3 text-emerald-400 mr-3" />
                  <span>Seasoned business professionals</span>
                </div>
                <div className="flex items-center text-slate-300">
                  <Compass className="w-3 h-3 text-cyan-400 mr-3" />
                  <span>Prime North Shore business territory</span>
                </div>
                <div className="flex items-center text-slate-300">
                  <Navigation className="w-3 h-3 text-cyan-400 mr-3" />
                  <span>Exclusive business category protection</span>
                </div>
                <div className="flex items-center text-slate-300">
                  <Zap className="w-3 h-3 text-emerald-400 mr-3" />
                  <span>Charter member business opportunities</span>
                </div>
                <div className="flex items-center text-slate-300">
                  <MapPin className="w-3 h-3 text-cyan-400 mr-3" />
                  <span>Local business community focus</span>
                </div>
                <div className="flex items-center text-slate-300">
                  <CheckCircle className="w-3 h-3 text-emerald-400 mr-3" />
                  <span>Proven business networking methodology</span>
                </div>
              </div>
            </section>

            {/* Application Notice */}
            <div className="bg-amber-900/20 border border-amber-600/50 rounded-lg p-4 shadow-inner">
              <div className="flex items-start">
                <AlertTriangle className="w-5 h-5 text-amber-400 mr-3 mt-0.5 shrink-0" />
                <div>
                  <h4 className="text-amber-400 font-semibold mb-1">Quartermaster Review</h4>
                  <p className="text-amber-200 text-sm">
                    Once you submit your application, the Quartermaster will begin an initial review immediately and
                    you&apos;ll receive an email confirmation. Following approval of the initial review, a background
                    check will be performed which typically takes 1–3 business days. You&apos;ll receive email updates
                    at each step of the process, with the final decision notification sent to the email address provided
                    in your application.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button - Full Width at Bottom */}
        <div className="pt-10 mt-10 border-t border-slate-600/50">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-slate-400">
              By submitting, you agree to Coastal Referral Exchange&apos;s code of conduct and referral terms
            </p>
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-linear-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:from-slate-700 disabled:to-slate-600 px-8 py-3 rounded-lg font-semibold text-white transition-all inline-flex items-center gap-2 disabled:cursor-not-allowed cursor-pointer group whitespace-nowrap shadow-lg shadow-cyan-900/50"
            >
              {isLoading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="rounded-full h-4 w-4 border-2 border-white border-t-transparent"
                  />
                  Scrapin’ the deck…
                </>
              ) : (
                <>
                  Submit Application
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-2 duration-300" />
                </>
              )}
            </motion.button>
          </div>
        </div>
      </div>
    </motion.form>
  )
}

export default SwabbieApplicationForm
