import React, { FC } from 'react'
import { motion } from 'framer-motion'
import { AlertCircle, Calendar, CheckCircle, Clock, MessageSquare, Phone, Scroll, Users, Video } from 'lucide-react'
import { useAppDispatch } from '@/app/redux/store'
import { setInputs } from '@/app/redux/features/formSlice'
import { formatDateTimeForInput } from '@/app/lib/utils/date/formatDate'
import { IForm } from '@/types/forms'

const meetingTypes = [
  { value: 'DECK_TO_DECK', label: 'Deck-to-Deck', icon: Users, description: 'In-person meeting' },
  { value: 'VOYAGE_CALL', label: 'Voyage Call', icon: Video, description: 'Video call (Zoom, Teams, etc.)' },
  { value: 'MESSAGE_IN_A_BOTTLE', label: 'Message in a Bottle', icon: Phone, description: 'Audio-only conversation' },
  { value: 'LANTERN_LIGHT', label: 'Lantern Light', icon: MessageSquare, description: 'Text-based parley (SMS, chat)' }
]

const durationOptions = [
  { value: 15, label: '15 minutes' },
  { value: 30, label: '30 minutes' },
  { value: 45, label: '45 minutes' },
  { value: 60, label: '1 hour' },
  { value: 90, label: '1.5 hours' },
  { value: 120, label: '2 hours' }
]

const parleyNoteOptions = [
  // Regular Professional Notes
  'Looking to discuss potential collaboration opportunities',
  'Seeking to parley about joining forces on future voyages',
  'Interested in learning more about your services',
  'Want to chart a course for potential treasure-sharing',
  'Would like to explore partnership possibilities',
  'Looking to discuss forming a crew alliance',
  'Seeking advice and industry insights',
  'Interested in sharing maps and navigation wisdom',
  'Want to share a potential business opportunity',
  'Hoping to negotiate mutually beneficial trading routes',
  'Looking to build professional network connections',
  'Seeking counsel from a seasoned captain of the seas',
  'Interested in discussing mutual referral opportunities',
  'Would like to schedule an informal coffee meeting',
  'Hoping to learn from your expertise and experience',
  'Open to discussing how we might work together',
  'Clear'
]

const ParleyForm: FC<IForm> = ({
  inputs,
  errors,
  handleInput,
  isLoading,
  handleSubmit,
  isUpdating,
  onClose,
  user,
  users,
  ref
}) => {
  const dispatch = useAppDispatch()

  return (
    <>
      <form ref={ref} id="parleyForm" onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
        <div className=" p-6 space-y-6">
          {/* Participants Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-4"
          >
            <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
              <Scroll className="w-5 h-5 text-cyan-400" />
              <span>Parley Request</span>
            </h3>

            {/* Role Switch Toggle */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-300">What be yer role in this parley?</label>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    dispatch(
                      setInputs({
                        formName: 'parleyForm',
                        data: { isReceiving: false, requesterId: user?.id, recipientId: '' }
                      })
                    )
                  }}
                  className={`py-4 px-4 rounded-xl border transition-all duration-200 ${
                    !inputs?.isReceiving
                      ? 'border-teal-400 bg-teal-400/10 text-teal-300 shadow-lg shadow-teal-400/20'
                      : 'border-gray-600 bg-gray-800/50 text-gray-300 hover:border-gray-500 hover:bg-gray-700/50'
                  }`}
                >
                  <div className="text-center">
                    <div className="font-semibold">I&apos;m Requesting</div>
                    <div className="text-xs opacity-70 mt-1">Asking for a parley</div>
                  </div>
                </button>
              </div>
            </div>

            {!inputs?.isReceiving ? (
              <>
                {/* When REQUESTING - Current User (Read-only) */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">You are requesting this parley</label>
                  <div className="w-full px-4 py-3 bg-gray-700/30 border border-gray-600 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-linear-to-r from-teal-500 via-cyan-500 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                        {user?.name
                          ?.split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </div>
                      <div>
                        <p className="font-semibold text-white">{user?.name}</p>
                        <p className="text-sm text-gray-400">{user?.email}</p>
                      </div>
                      <div className="ml-auto">
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-teal-400/20 text-teal-300 border border-teal-400/30">
                          Requester
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Who to meet with */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Who would you like to parley with?
                  </label>
                  <select
                    name="recipientId"
                    value={inputs?.recipientId || ''}
                    onChange={(e) => handleInput({ target: { name: 'recipientId', value: e.target.value } })}
                    className={`w-full px-4 py-3 bg-gray-800/50 border rounded-lg text-white focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition-all ${
                      errors?.recipientId ? 'border-red-500' : 'border-gray-600'
                    }`}
                  >
                    <option value="">Select a crew member...</option>
                    {users
                      ?.filter((navigator) => navigator.id !== user?.id && navigator?.membershipStatus === 'ACTIVE')
                      .map((navigator) => (
                        <option key={navigator.id} value={navigator.id || ''}>
                          {navigator.name} - {navigator.company}
                        </option>
                      ))}
                  </select>
                  {errors?.recipientId && (
                    <p className="text-red-400 text-sm mt-1 flex items-center space-x-1">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors?.recipientId}</span>
                    </p>
                  )}
                </div>
              </>
            ) : (
              <>
                {/* When RECEIVING - Current User (Read-only) */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    You received this parley request
                  </label>
                  <div className="w-full px-4 py-3 bg-gray-700/30 border border-gray-600 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-linear-to-r from-purple-500 via-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                        {user?.name
                          ?.split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </div>
                      <div>
                        <p className="font-semibold text-white">{user?.name}</p>
                        <p className="text-sm text-gray-400">{user?.email}</p>
                      </div>
                      <div className="ml-auto">
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-400/20 text-purple-300 border border-purple-400/30">
                          Recipient
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Who requested it */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Who requested this parley with ye?
                  </label>
                  <select
                    name="requesterId"
                    value={inputs?.requesterId || ''}
                    onChange={(e) => handleInput({ target: { name: 'requesterId', value: e.target.value } })}
                    className={`w-full px-4 py-3 bg-gray-800/50 border rounded-lg text-white focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all ${
                      errors?.requesterId ? 'border-red-500' : 'border-gray-600'
                    }`}
                  >
                    <option value="">Select who requested the parley...</option>
                    {users
                      ?.filter((navigator) => navigator.id !== user?.id && navigator?.membershipStatus === 'ACTIVE')
                      .map((navigator) => (
                        <option key={navigator.id} value={navigator.id || ''}>
                          {navigator.name} - {navigator.company}
                        </option>
                      ))}
                  </select>
                  {errors?.requesterId && (
                    <p className="text-red-400 text-sm mt-1 flex items-center space-x-1">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors?.requesterId}</span>
                    </p>
                  )}
                </div>
              </>
            )}
          </motion.div>

          {/* Meeting Details Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            {!isUpdating && (
              <div>
                <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-cyan-400" />
                  <span>Parley Details</span>
                </h3>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">Have you already met?</label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: 'Yes', value: 'COMPLETED', description: 'Marks yer parley as completed' },
                      {
                        label: 'No',
                        value: inputs?.status === 'CONFIRMED' ? 'CONFIRMED' : 'REQUESTED',
                        description:
                          inputs?.status === 'CONFIRMED'
                            ? 'Keeps yer parley as confirmed'
                            : 'Keeps yer parley as requested'
                      }
                    ].map((option) => (
                      <motion.label
                        key={option.value}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`relative flex flex-col items-center p-4 border rounded-lg cursor-pointer transition-all ${
                          inputs?.status === option.value
                            ? 'border-cyan-500 bg-cyan-500/10'
                            : 'border-gray-600 hover:border-gray-500'
                        }`}
                      >
                        <input
                          type="radio"
                          name="status"
                          value={option.value}
                          checked={inputs?.status === option.value}
                          onChange={handleInput}
                          className="sr-only"
                        />
                        <div
                          className={`font-medium text-sm mb-1 ${
                            inputs?.status === option.value ? 'text-white' : 'text-gray-300'
                          }`}
                        >
                          {option.label}
                        </div>
                        <div className="text-xs text-gray-500 text-center">{option.description}</div>
                      </motion.label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Date and Time */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Date & Time</label>

              {/* Quick Select Buttons */}
              <div className="flex flex-wrap gap-2 mb-3">
                {[
                  // Past dates (for completed parleys)
                  { label: 'Yesterday', days: -1, hour: 14, color: 'indigo' },
                  { label: 'Two Days Ago', days: -2, hour: 10, color: 'teal' },
                  { label: 'Three Days Ago', days: -3, hour: 15, color: 'blue' },
                  { label: 'Four Days Ago', days: -4, hour: 15, color: 'cyan' },
                  { label: 'Last Week', days: -7, hour: 11, color: 'purple' },
                  { label: 'Two Weeks Ago', days: -14, hour: 13, color: 'indigo' },
                  { label: 'Last Month', days: -30, hour: 12, color: 'teal' },

                  // Future dates (for upcoming parleys)
                  { label: 'Later Today (5 PM)', days: 0, hour: 17, color: 'blue' },
                  { label: 'Tomorrow Morning (9 AM)', days: 1, hour: 9, color: 'cyan' },
                  { label: 'Tomorrow Afternoon (2 PM)', days: 1, hour: 14, color: 'purple' },
                  { label: 'Two Days From Now (10 AM)', days: 2, hour: 10, color: 'indigo' },
                  { label: 'This Weekend (Saturday 10 AM)', days: 5, hour: 10, color: 'teal' },
                  { label: 'Next Week (Monday 11 AM)', days: 7, hour: 11, color: 'blue' },
                  { label: 'Two Weeks From Now', days: 14, hour: 14, color: 'cyan' },
                  { label: 'Next Month', days: 30, hour: 10, color: 'purple' }
                ].map((preset, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => {
                      const date = new Date()
                      date.setDate(date.getDate() + preset.days)
                      date.setHours(preset.hour, 0, 0, 0)
                      handleInput({ target: { name: 'scheduledAt', value: date.toISOString() } })
                    }}
                    className={`px-3 py-1.5 text-xs bg-${preset.color}-600/20 border border-${preset.color}-500/30 text-${preset.color}-300 rounded-md hover:bg-${preset.color}-600/30 transition-colors`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>

              <input
                name="scheduledAt"
                type="datetime-local"
                value={formatDateTimeForInput(inputs?.scheduledAt) || ''}
                onChange={handleInput}
                className={`w-full px-4 py-3 bg-gray-800/50 border rounded-lg text-white focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition-all ${
                  errors?.scheduledAt ? 'border-red-500' : 'border-gray-600'
                }`}
              />
              {errors?.scheduledAt && (
                <p className="text-red-400 text-sm mt-1 flex items-center space-x-1">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors?.scheduledAt}</span>
                </p>
              )}
            </div>

            {/* Duration */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">Duration</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {durationOptions.map((option) => (
                  <motion.button
                    key={option.value}
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleInput({ target: { name: 'duration', value: option.value.toString() } })}
                    className={`relative p-4 border rounded-lg transition-all text-center ${
                      parseInt(inputs?.duration) === option.value
                        ? 'border-cyan-500 bg-cyan-500/10 text-cyan-300'
                        : 'border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white'
                    }`}
                  >
                    <div className="flex flex-col items-center space-y-1">
                      <Clock
                        className={`w-5 h-5 ${
                          parseInt(inputs?.duration) === option.value ? 'text-teal-400' : 'text-gray-400'
                        }`}
                      />
                      <span className="text-sm font-medium">{option.label}</span>
                    </div>
                    {parseInt(inputs?.duration) === option.value && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1 w-5 h-5 bg-cyan-500 rounded-full flex items-center justify-center"
                      >
                        <CheckCircle className="w-3 h-3 text-white" />
                      </motion.div>
                    )}
                  </motion.button>
                ))}
              </div>
              {errors?.duration && (
                <p className="text-red-400 text-sm mt-2 flex items-center space-x-1">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors?.duration}</span>
                </p>
              )}
            </div>

            {/* Meeting Type */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">Parley Type</label>
              <div className="grid grid-cols-1 gap-3">
                {meetingTypes.map((type) => (
                  <motion.label
                    key={type.value}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`relative flex items-center p-4 border rounded-lg cursor-pointer transition-all ${
                      inputs?.meetingType === type.value
                        ? 'border-cyan-500 bg-cyan-500/10'
                        : 'border-gray-600 hover:border-gray-500'
                    }`}
                  >
                    <input
                      type="radio"
                      name="meetingType"
                      value={type.value || ''}
                      checked={inputs?.meetingType === type.value}
                      onChange={handleInput}
                      className="sr-only"
                    />
                    <div className="flex-1">
                      <div
                        className={`font-medium text-sm ${
                          inputs?.meetingType === type.value ? 'text-white' : 'text-gray-300'
                        }`}
                      >
                        {type.label}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">{type.description}</div>
                    </div>
                  </motion.label>
                ))}
              </div>
              {errors?.meetingType && (
                <p className="text-red-400 text-sm mt-2 flex items-center space-x-1">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors?.meetingType}</span>
                </p>
              )}
            </div>

            {/* Location (conditional) */}
            {inputs?.meetingType !== 'MESSAGE_IN_A_BOTTLE' && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {inputs?.meetingType === 'DECK_TO_DECK' ? 'Meeting Location' : 'Virtual Meeting Link/Platform'}
                </label>
                {/* Quick Location Buttons - Only show for in-person meetings */}
                {inputs?.meetingType === 'DECK_TO_DECK' && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {[
                      { label: "Dunkin' - Salem", location: "Dunkin', 302 Highland Ave, Salem, MA", color: 'orange' },
                      {
                        label: 'Starbucks - Swampscott',
                        location: 'Starbucks, 450 Paradise Rd, Swampscott, MA',
                        color: 'green'
                      },
                      { label: 'Panera - Beverly', location: 'Panera Bread, 70 Dodge St, Beverly, MA', color: 'blue' },
                      { label: 'JaHo - Salem', location: 'Jaho, 57 Loring Ave, Salem, MA', color: 'red' },
                      {
                        label: 'Nero - North Shore Mall',
                        location: 'Caffe Nero, North Shore Mall, Peabody, MA',
                        color: 'indigo'
                      },
                      { label: 'Sea Level - Salem', location: 'Sea Level, 94 Wharf St, Salem, MA', color: 'cyan' },
                      {
                        label: 'Library - Lynn',
                        location: 'Lynn Public Library, 5 N Common St, Lynn, MA',
                        color: 'purple'
                      },
                      {
                        label: 'Cafe - Marblehead',
                        location: 'Atomic Cafe, 268 Cabot St, Marblehead, MA',
                        color: 'teal'
                      },
                      {
                        label: 'Write custom location',
                        location: '',
                        color: 'gray'
                      }
                    ].map((preset, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => {
                          handleInput({ target: { name: 'location', value: preset.location } })
                        }}
                        className={`px-3 py-1.5 text-xs bg-${preset.color}-600/20 border border-${preset.color}-500/30 text-${preset.color}-300 rounded-md hover:bg-${preset.color}-600/30 transition-colors`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                )}

                {/* Quick Platform Buttons - Only show for virtual meetings */}
                {inputs?.meetingType === 'VOYAGE_CALL' && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {[
                      { label: 'Zoom', location: 'Zoom Meeting - Link to be provided', color: 'blue' },
                      { label: 'Google Meet', location: 'Google Meet - Link to be provided', color: 'green' },
                      { label: 'Microsoft Teams', location: 'Microsoft Teams - Link to be provided', color: 'purple' }
                    ].map((preset, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => {
                          handleInput({ target: { name: 'location', value: preset.location } })
                        }}
                        className={`px-3 py-1.5 text-xs bg-${preset.color}-600/20 border border-${preset.color}-500/30 text-${preset.color}-300 rounded-md hover:bg-${preset.color}-600/30 transition-colors`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                )}
                {inputs?.meetingType === 'LANTERN_LIGHT' && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {[
                      { label: 'Signal Flag Messages', location: 'Text messages via phone', color: 'yellow' },
                      { label: 'Carrier Pigeon Post', location: 'WhatsApp chat', color: 'blue' },
                      { label: "Crow's Nest Signals", location: 'Slack direct message', color: 'purple' },
                      { label: "Ship's Telegraph", location: 'Microsoft Teams chat', color: 'orange' },
                      { label: 'Lighthouse Beacons', location: 'Signal/Telegram app', color: 'cyan' },
                      { label: "Captain's Log Exchange", location: 'Email thread', color: 'red' },
                      { label: 'Parrot Post', location: 'Twitter/X DMs', color: 'indigo' }
                    ].map((preset, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => {
                          handleInput({ target: { name: 'location', value: preset.location } })
                        }}
                        className={`px-3 py-1.5 text-xs bg-${preset.color}-600/20 border border-${preset.color}-500/30 text-${preset.color}-300 rounded-md hover:bg-${preset.color}-600/30 transition-colors`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                )}

                <input
                  name="location"
                  type="text"
                  value={inputs?.location || ''}
                  onChange={handleInput}
                  placeholder={
                    inputs?.meetingType === 'DECK_TO_DECK'
                      ? 'e.g., Sqysh Café, 123 Galactic Way'
                      : 'e.g., Zoom link or platform details'
                  }
                  className={`w-full px-4 py-3 bg-gray-800/50 border rounded-lg text-white focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition-all ${
                    errors?.location ? 'border-red-500' : 'border-gray-600'
                  }`}
                />
                {errors?.location && (
                  <p className="text-red-400 text-sm mt-1 flex items-center space-x-1">
                    <AlertCircle className="w-4 h-4" />
                    <span>{errors?.location}</span>
                  </p>
                )}
              </div>
            )}

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Parley Notes (Optional)</label>

              <div className="flex flex-wrap gap-2 mb-3">
                {parleyNoteOptions.map((note, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => {
                      handleInput({ target: { name: 'notes', value: note === 'Clear' ? '' : note } })
                    }}
                    className={`px-3 py-1.5 text-xs bg-gray-600/20 border border-gray-500/30 text-gray-300 rounded-md hover:bg-gray-600/30 transition-colors`}
                  >
                    {note}
                  </button>
                ))}
              </div>

              <textarea
                name="notes"
                value={inputs?.notes || ''}
                onChange={handleInput}
                placeholder="Purpose of the parley, topics to discuss, agenda items..."
                rows={3}
                maxLength={1000}
                className={`w-full px-4 py-3 bg-gray-800/50 border rounded-lg text-white focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition-all resize-none ${
                  errors?.notes ? 'border-red-500' : 'border-gray-600'
                }`}
              />
              <div className="flex justify-between items-center mt-1">
                {errors?.notes && (
                  <p className="text-red-400 text-sm flex items-center space-x-1">
                    <AlertCircle className="w-4 h-4" />
                    <span>{errors?.notes}</span>
                  </p>
                )}
                <p className="text-xs text-gray-500 ml-auto">{inputs?.notes?.length || 0}/1000 characters</p>
              </div>
            </div>

            {/* Status (Hidden field - set to REQUESTED by default) */}
            <input type="hidden" name="status" value={inputs?.status || 'REQUESTED'} />

            {/* Chapter ID (Hidden field - set from context) */}
            <input type="hidden" name="chapterId" value={inputs?.chapterId || ''} />

            {/* Requester ID (Hidden field - set to current user) */}
            <input type="hidden" name="requesterId" value={inputs?.requesterId || user?.id} />
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
            form="parleyForm"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={isLoading}
            className="flex-1 px-6 py-3 bg-linear-to-r from-teal-600 via-cyan-600 to-blue-600 text-white rounded-lg hover:from-teal-500 hover:to-blue-500 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                <span>{isUpdating ? 'Updating' : 'Scheduling'}...</span>
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5" />
                <span>{isUpdating ? 'Update' : 'Schedule'} Parley</span>
              </>
            )}
          </motion.button>
        </div>
      </motion.div>
    </>
  )
}

export default ParleyForm
