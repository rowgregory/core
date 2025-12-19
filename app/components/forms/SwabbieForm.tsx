import React from 'react'
import { motion } from 'framer-motion'
import { User, Mail, MapPin, Phone, Building2, Briefcase, Shield, FileText, CheckCircle } from 'lucide-react'
import industryList from '@/app/lib/constants/navigator/industryList'
import { Switch } from '../ui/Switch'

const SwabbieForm = ({ inputs, handleInput, isLoading, handleSubmit, isUpdating, onClose, handleToggle }: any) => {
  return (
    <>
      <form onSubmit={handleSubmit} id="swabbieForm" className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-6">
          {/* Personal Information Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <h4 className="text-md font-semibold text-white flex items-center space-x-2">
              <User className="w-4 h-4 text-blue-400" />
              <span>Personal Information</span>
            </h4>

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Full Name *</label>
              <input
                name="name"
                type="text"
                value={inputs?.name || ''}
                onChange={handleInput}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                placeholder="Enter swabbie's full name"
                required
              />
            </div>

            {/* Contact Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <Mail className="w-4 h-4 inline mr-1" />
                  Email Address *
                </label>
                <input
                  name="email"
                  type="email"
                  value={inputs?.email || ''}
                  onChange={handleInput}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  placeholder="sqysh@sqysh.io"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <Phone className="w-4 h-4 inline mr-1" />
                  Phone Number *
                </label>
                <input
                  name="phone"
                  type="tel"
                  value={inputs?.phone || ''}
                  onChange={handleInput}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  placeholder="9784730396"
                  required
                />
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <MapPin className="w-4 h-4 inline mr-1" />
                Location *
              </label>
              <input
                name="location"
                type="text"
                value={inputs?.location || ''}
                onChange={handleInput}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                placeholder="City"
                required
              />
            </div>
          </motion.div>

          {/* Business Information Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-4"
          >
            <h4 className="text-md font-semibold text-white flex items-center space-x-2">
              <Building2 className="w-4 h-4 text-green-400" />
              <span>Business Information</span>
            </h4>

            {/* Company and Industry Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Company Name *</label>
                <input
                  name="company"
                  type="text"
                  value={inputs?.company || ''}
                  onChange={handleInput}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  placeholder="Sqysh"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <Briefcase className="w-4 h-4 inline mr-1" />
                  Industry *
                </label>
                <select
                  name="industry"
                  value={inputs?.industry || ''}
                  onChange={handleInput}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  required
                >
                  <option value="" disabled>
                    Select industry...
                  </option>
                  {industryList.map((industry) => (
                    <option key={industry} value={industry}>
                      {industry}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </motion.div>

          {/* Licensing Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-4"
          >
            <h4 className="text-md font-semibold text-white flex items-center space-x-2">
              <Shield className="w-4 h-4 text-yellow-400" />
              <span>Professional Licensing</span>
            </h4>

            {/* Licensed Checkbox */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-4"
            >
              <Switch
                name="isLicensed"
                checked={inputs.isLicensed ?? false}
                onChange={handleToggle}
                label="Mark this if yer swabbie be licensed"
              />
            </motion.div>

            {/* License Number (Conditional) */}
            {inputs?.isLicensed && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <FileText className="w-4 h-4 inline mr-1" />
                  Business License Number
                </label>
                <input
                  name="businessLicenseNumber"
                  type="text"
                  value={inputs?.businessLicenseNumber || ''}
                  onChange={handleInput}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  placeholder="Enter your license number"
                />
              </motion.div>
            )}
          </motion.div>
        </div>
      </form>
      {/* Footer */}
      <motion.div
        className="p-6 border-t border-gray-700/50 bg-gray-900/50"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.4 }}
      >
        <div className="flex flex-col sm:flex-row sm:gap-x-3 gap-y-3">
          <motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClose}
            className="order-2 sm:order-1 flex-1 px-6 py-3 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-800 transition-all"
          >
            Cancel
          </motion.button>

          <motion.button
            type="submit"
            form="swabbieForm"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={isLoading}
            className="order-1 sm:order-2 flex-1 px-6 py-3 bg-linear-to-r from-teal-600 via-cyan-600 to-blue-600 text-white rounded-lg hover:from-teal-500 hover:to-blue-500 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                <span>{isUpdating ? 'Updating' : 'Draft...'}</span>
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5" />
                <span>{isUpdating ? 'Update' : 'Draft'} Swabbie</span>
              </>
            )}
          </motion.button>
        </div>
      </motion.div>
    </>
  )
}

export default SwabbieForm
