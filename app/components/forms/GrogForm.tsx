import React, { FC } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Clock, Users, Settings, CheckCircle } from 'lucide-react'
import { IForm } from '@/types/forms'
import { formatDateForInput } from '@/app/lib/utils/date/formatDate'

const GrogForm: FC<IForm> = ({ inputs, errors, handleInput, isLoading, handleSubmit, isUpdating, onClose }) => {
  const InputStyle =
    'w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500/50 focus:bg-slate-700/70 transition-all'
  const TextAreaStyle =
    'w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500/50 focus:bg-slate-700/70 transition-all resize-none'
  const SelectStyle =
    'w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:border-cyan-500/50 focus:bg-slate-700/70 transition-all'

  const handleToggle = (name: string) => {
    handleInput({ target: { name, value: !inputs[name] } })
  }

  return (
    <>
      <form onSubmit={handleSubmit} id="eventForm" className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-8">
          {/* Basic Event Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <div className="flex items-center mb-4">
              <div className="bg-linear-to-b from-teal-600 to-teal-700 p-2 rounded-lg mr-4 shadow-lg shadow-cyan-900/50">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-semibold text-white">Grog Details</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Add this after the Event Captain section and before Event Details */}
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Event Host/Organization <span className="text-amber-400">*</span>
                </label>
                <input
                  type="text"
                  name="host"
                  value={inputs.host || ''}
                  onChange={handleInput}
                  className={InputStyle}
                  placeholder="Storm Harbor Watch, The Anchor Inn, Chamber of Commerce..."
                />
                <p className="text-slate-400 text-xs mt-1">The organization, business, or person hosting this event</p>
                {errors.host && <p className="text-red-400 text-sm mt-1">{errors.host}</p>}
              </div>
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Event Title <span className="text-amber-400">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={inputs.title || ''}
                  onChange={handleInput}
                  className={InputStyle}
                  placeholder="Storm Harbor Watch - Weekly Breakfast Meeting"
                />
                {errors.title && <p className="text-red-400 text-sm mt-1">{errors.title}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Event Type <span className="text-amber-400">*</span>
                </label>
                <select name="type" value={inputs.type || ''} onChange={handleInput} className={SelectStyle}>
                  <option value="">Select event type</option>
                  <option value="networking">Networking</option>
                  <option value="workshop">Workshop</option>
                  <option value="mixer">Mixer</option>
                  <option value="luncheon">Luncheon</option>
                  <option value="seminar">Seminar</option>
                  <option value="conference">Conference</option>
                </select>
                {errors.type && <p className="text-red-400 text-sm mt-1">{errors.type}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Category <span className="text-amber-400">*</span>
                </label>
                <select name="category" value={inputs.category || ''} onChange={handleInput} className={SelectStyle}>
                  <option value="">Select category</option>
                  <option value="weekly-meeting">Weekly Meeting</option>
                  <option value="special">Special Event</option>
                  <option value="education">Education</option>
                  <option value="chamber-event">Chamber Event</option>
                  <option value="social">Social</option>
                  <option value="training">Training</option>
                </select>
                {errors.category && <p className="text-red-400 text-sm mt-1">{errors.category}</p>}
              </div>

              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-slate-300 mb-2">Event Description</label>
                <textarea
                  name="description"
                  value={inputs.description || ''}
                  onChange={handleInput}
                  rows={4}
                  className={TextAreaStyle}
                  placeholder="Join fellow business professionals for our weekly networking breakfast. Share referrals, build relationships, and grow your business network..."
                />
              </div>
            </div>
          </motion.div>

          {/* Date & Time */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            <div className="flex items-center mb-4">
              <div className="bg-linear-to-r from-cyan-600 to-cyan-700 p-2 rounded-lg mr-4 shadow-lg shadow-emerald-900/50">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-semibold text-white">When & Where</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Event Date <span className="text-amber-400">*</span>
                </label>
                <input
                  type="date"
                  name="date"
                  value={formatDateForInput(inputs.date) || ''}
                  onChange={handleInput}
                  className={InputStyle}
                />
                {errors.date && <p className="text-red-400 text-sm mt-1">{errors.date}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Start Time <span className="text-amber-400">*</span>
                </label>
                <input
                  type="time"
                  name="time"
                  value={inputs.time || ''}
                  onChange={handleInput}
                  className={InputStyle}
                />
                {errors.time && <p className="text-red-400 text-sm mt-1">{errors.time}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Duration</label>
                <input
                  type="text"
                  name="duration"
                  value={inputs.duration || ''}
                  onChange={handleInput}
                  className={InputStyle}
                  placeholder="90 minutes"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                  placeholder="The Anchor Inn, Lynn MA"
                />
                {errors.location && <p className="text-red-400 text-sm mt-1">{errors.location}</p>}
              </div>
            </div>
          </motion.div>

          {/* Capacity & Registration */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-6"
          >
            <div className="flex items-center mb-4">
              <div className="bg-linear-to-r from-blue-600 to-blue-700 p-2 rounded-lg mr-4 shadow-lg shadow-purple-900/50">
                <Users className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-semibold text-white">Crew Capacity</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Maximum Attendees</label>
                <input
                  type="number"
                  name="maxAttendees"
                  value={inputs.maxAttendees || ''}
                  onChange={handleInput}
                  min="1"
                  className={InputStyle}
                  placeholder="30"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Registration Deadline</label>
                <input
                  type="date"
                  name="registrationDeadline"
                  value={formatDateForInput(inputs.registrationDeadline) || ''}
                  onChange={handleInput}
                  className={InputStyle}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Event Cost (USD)</label>
                <input
                  type="number"
                  name="cost"
                  value={inputs.cost || ''}
                  onChange={handleInput}
                  min="0"
                  step="0.01"
                  className={InputStyle}
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg border border-slate-600/50">
                <div>
                  <label className="text-sm font-medium text-slate-300">Featured Event</label>
                  <p className="text-xs text-slate-400">Highlight this event</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggle('featured')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 ${
                    inputs.featured ? 'bg-cyan-600' : 'bg-slate-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      inputs.featured ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </motion.div>

          {/* Additional Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-6"
          >
            <div className="flex items-center mb-4">
              <div className="bg-linear-to-r from-purple-600 to-purple-700 p-2 rounded-lg mr-4 shadow-lg shadow-purple-900/50">
                <Settings className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-semibold text-white">Additional Details</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Dress Code</label>
                <input
                  type="text"
                  name="dresscode"
                  value={inputs.dresscode || ''}
                  onChange={handleInput}
                  className={InputStyle}
                  placeholder="Business casual"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Requirements/Prerequisites</label>
                <textarea
                  name="requirements"
                  value={inputs.requirements || ''}
                  onChange={handleInput}
                  rows={3}
                  className={TextAreaStyle}
                  placeholder="Business cards, portfolio, etc."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">What to Bring/Materials</label>
                <textarea
                  name="materials"
                  value={inputs.materials || ''}
                  onChange={handleInput}
                  rows={3}
                  className={TextAreaStyle}
                  placeholder="Laptop, notebook, business cards..."
                />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Registration URL</label>
                <input
                  type="url"
                  name="registrationUrl"
                  value={inputs.registrationUrl || ''}
                  onChange={handleInput}
                  className={InputStyle}
                  placeholder="https://sqysh.io/..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Meeting URL (Virtual Events)</label>
                <input
                  type="url"
                  name="meetingUrl"
                  value={inputs.meetingUrl || ''}
                  onChange={handleInput}
                  className={InputStyle}
                  placeholder="https://zoom.us/..."
                />
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg border border-slate-600/50">
                <div>
                  <label className="text-sm font-medium text-slate-300">Public Event</label>
                  <p className="text-xs text-slate-400">Anyone can view this event</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggle('isPublic')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 ${
                    inputs.isPublic ? 'bg-cyan-600' : 'bg-slate-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      inputs.isPublic ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg border border-slate-600/50">
                <div>
                  <label className="text-sm font-medium text-slate-300">Requires RSVP</label>
                  <p className="text-xs text-slate-400">Attendees must register in advance</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggle('requiresRSVP')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 ${
                    inputs.requiresRSVP ? 'bg-cyan-600' : 'bg-slate-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      inputs.requiresRSVP ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
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
        <div className="flex space-x-3">
          <motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClose}
            className="flex-1 px-6 py-3 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-800 transition-all"
          >
            Cancel
          </motion.button>
          <motion.button
            type="submit"
            form="eventForm"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={isLoading}
            className="flex-1 px-6 py-3 bg-linear-to-r from-teal-600 via-cyan-600 to-blue-600 text-white rounded-lg hover:from-teal-500 hover:to-blue-500 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                <span>Launching...</span>
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5" />
                <span>{isUpdating ? 'Update' : 'Launch'} Grog</span>
              </>
            )}
          </motion.button>
        </div>
      </motion.div>
    </>
  )
}

export default GrogForm
