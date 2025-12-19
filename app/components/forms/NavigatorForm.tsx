import React, { FC } from 'react'
import { motion } from 'framer-motion'
import { Briefcase, Building, Calendar, CheckCircle, Mail, Phone, Shield, User } from 'lucide-react'
import { Input } from '../ui/Input'
import industryList from '@/app/lib/constants/navigator/industryList'
import { Select } from '../ui/Select'
import membershipStatusOptions from '@/app/lib/constants/navigator/membershipStatusOptions'
import { convertToDateFormat } from '@/app/lib/utils/date/formatDate'
import { Switch } from '../ui/Switch'
import { INavigatorForm } from '@/types/forms'

const NavigatorForm: FC<INavigatorForm> = ({
  errors,
  handleInput,
  handleSubmit,
  handleToggle,
  inputs,
  isLoading,
  isUpdating,
  onClose
}) => {
  return (
    <>
      <div className="flex-1 overflow-y-auto">
        <form id="navigatorForm" onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-4"
          >
            <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
              <User className="w-5 h-5 text-blue-400" />
              <span>Basic Information</span>
            </h3>

            {/* Name */}
            <Input
              name="name"
              label="Full Name"
              value={inputs?.name || ''}
              onChange={handleInput}
              placeholder="Enter member's full name"
              icon={<User className="w-5 h-5" />}
              error={errors?.name}
              isRequired
            />

            {/* Email */}
            <Input
              name="email"
              type="email"
              label="Email Address"
              value={inputs?.email || ''}
              onChange={handleInput}
              placeholder="member@example.com"
              icon={<Mail className="w-5 h-5" />}
              error={errors?.email}
              isRequired
            />

            {/* Phone */}
            <Input
              name="phone"
              type="tel"
              label="Phone Number"
              value={inputs?.phone || ''}
              onChange={handleInput}
              placeholder="(555) 123-4567"
              icon={<Phone className="w-5 h-5" />}
              helperText="Optional"
            />

            {/* Company */}
            <Input
              name="company"
              label="Company"
              value={inputs?.company || ''}
              onChange={handleInput}
              placeholder="Company name"
              icon={<Building className="w-5 h-5" />}
              error={errors?.company}
              isRequired
            />

            {/* Profession */}
            <Select
              name="industry"
              label="Industry"
              value={inputs?.industry || ''}
              onChange={handleInput}
              options={industryList.map((industry) => ({ value: industry, label: industry }))}
              placeholder="Select industry..."
              icon={<Briefcase className="w-5 h-5" />}
              error={errors?.industry}
              isRequired
            />
          </motion.div>

          {/* Membership Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
              <Shield className="w-5 h-5 text-blue-400" />
              <span>Membership Details</span>
            </h3>

            {/* Chapter Assignment Display */}
            <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-lg p-4">
              <label className="block text-sm font-medium text-cyan-300 mb-3">Assigning to Chapter</label>
              <div className="flex items-center space-x-4">
                <div className="hidden w-12 h-12 bg-linear-to-r from-cyan-500 via-blue-500 to-teal-500 rounded-full sm:flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg">L</span>
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg">Storm Watch Chapter</h3>
                  <p className="text-sm text-cyan-300">This navigator will be added to Storm Watch</p>
                  <p className="text-xs text-gray-400 mt-1">Lynn, MA • Weekly Meetings</p>
                </div>
              </div>
            </div>

            {/* Membership Status */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">Membership Status</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {membershipStatusOptions.map((status) => (
                  <motion.label
                    key={status.value}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`relative flex flex-col p-3 border rounded-lg cursor-pointer transition-all ${
                      inputs?.membershipStatus === status.value
                        ? 'border-cyan-500 bg-cyan-500/10'
                        : 'border-gray-600 hover:border-gray-500'
                    }`}
                  >
                    <input
                      type="radio"
                      name="membershipStatus"
                      value={status.value}
                      checked={inputs?.membershipStatus === status.value}
                      onChange={() => {
                        // Explicitly pass the status value instead of the event's checked state
                        handleToggle({
                          target: {
                            name: 'membershipStatus',
                            checked: status.value
                          }
                        })
                      }}
                      className="sr-only"
                    />
                    <div
                      className={`font-medium text-sm ${
                        inputs?.membershipStatus === status.value ? 'text-white' : 'text-gray-300'
                      }`}
                    >
                      {status.label}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">{status.description}</div>
                  </motion.label>
                ))}
              </div>
            </div>

            {/* Join and Expiration Dates */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                name="joinedAt"
                type="date"
                label="Join Date"
                value={convertToDateFormat(inputs?.joinedAt) || ''}
                onChange={handleInput}
                icon={<Calendar className="w-5 h-5" />}
                error={errors?.joinedAt}
                isRequired
              />

              <Input
                name="expiresAt"
                type="date"
                label="Expires At"
                value={convertToDateFormat(inputs?.expiresAt) || ''}
                onChange={handleInput}
                icon={<Calendar className="w-5 h-5" />}
              />
            </div>
          </motion.div>

          {/* Profile & Networking */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-4"
          >
            {/* Admin Settings */}
            <Switch
              name="isAdmin"
              checked={inputs?.isAdmin ?? false}
              onChange={handleToggle}
              label="Admin privileges"
            />
            <Switch
              name="isMembership"
              checked={inputs?.isMembership ?? false}
              onChange={handleToggle}
              label="Membership privileges"
            />
            <Switch
              name="isPublic"
              checked={inputs?.isPublic ?? false}
              onChange={handleToggle}
              label="Toggle public visibility"
            />
          </motion.div>
        </form>
      </div>
      {/* Footer */}
      <motion.div
        className="p-6 border-t border-gray-700/50 bg-gray-900/50"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.4 }}
      >
        <div className="flex flex-col sm:flew-row gap-y-3 sm:gap-x-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClose}
            className="order-2 sm:order-1 flex-1 px-6 py-3 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-800 transition-all"
          >
            Cancel
          </motion.button>
          <motion.button
            type="submit"
            form="navigatorForm"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSubmit}
            disabled={isLoading}
            className="order-1 sm:order-2 flex-1 px-6 py-3 bg-linear-to-r from-cyan-600 via-blue-600 to-teal-600 text-white rounded-lg hover:from-cyan-500 hover:via-blue-500 hover:to-teal-500 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                <span>{isUpdating ? 'Updating' : 'Adding'} Navigator...</span>
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5" />
                <span>{isUpdating ? 'Update' : 'Add'} Navigator</span>
              </>
            )}
          </motion.button>
        </div>
      </motion.div>
    </>
  )
}

export default NavigatorForm
