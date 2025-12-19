'use client'

import React, { FC, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Save, Edit2, X, Settings2, MapPin, Calendar, Clock, CheckCircle, Sliders } from 'lucide-react'
import { createFormActions, resetForm, setInputs } from '@/app/redux/features/formSlice'
import { useAppDispatch, useFormSelector, useSettingsSelector } from '@/app/redux/store'
import { showToast } from '@/app/redux/features/toastSlice'
import { useUpdateChapterSettingsMutation } from '@/app/redux/services/settingsApi'
import { Input } from '@/app/components/ui/Input'
import { Select } from '@/app/components/ui/Select'
import { validateChapterSettingsForm } from '@/app/lib/utils/validations/validateChapterSettingsForm'
import { MEETING_FREQUENCIES } from '@/app/lib/constants/settings/meetingFrequencies'
import { MEETING_DAYS } from '@/app/lib/constants/settings/meetingDay'
import { chapterId } from '@/app/lib/constants/api/chapterId'
import { setChapter } from '@/app/redux/features/settingsSlice'
import { normalizeTimeFormat } from '@/app/lib/utils/time/normalizeTimeFormat'

const Rigging: FC = () => {
  const dispatch = useAppDispatch()
  const { settingsForm } = useFormSelector()
  const { settings } = useSettingsSelector()
  const { handleInput, setErrors } = createFormActions('settingsForm', dispatch)
  const [updateChapterSettings, { isLoading }] = useUpdateChapterSettingsMutation()
  const [isEditing, setIsEditing] = useState(false)
  const inputs = settingsForm?.inputs

  useEffect(() => {
    if (settings) {
      dispatch(
        setInputs({
          formName: 'settingsForm',
          data: {
            name: settings.name,
            location: settings.location,
            meetingDay: settings.meetingDay,
            meetingTime: normalizeTimeFormat(settings.meetingTime),
            meetingFrequency: settings.meetingFrequency
          }
        })
      )
    }
  }, [dispatch, settings])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (!validateChapterSettingsForm(inputs, setErrors)) return

      const response = await updateChapterSettings({ chapterId, settings: inputs }).unwrap()
      dispatch(setChapter(response.chapter))
      dispatch(
        showToast({
          type: 'success',
          message: 'Chapter Settings Updated',
          description: 'Your chapter settings have been successfully updated.'
        })
      )

      setIsEditing(false)
    } catch (error: any) {
      dispatch(
        showToast({
          type: 'error',
          message: 'Update Failed',
          description: error.data.message || 'Unable to update chapter settings'
        })
      )
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    dispatch(resetForm('settingsForm'))
  }

  return (
    <div className="bg-gray-900 min-h-[calc(100vh-68px)]">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex-1 px-3 py-6 sm:p-6 overflow-y-auto space-y-6"
      >
        {/* Form Content */}
        <>
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-y-6 px-3 sm:px-8 py-6 border-b border-gray-700/50">
            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex w-16 h-16 bg-linear-to-br from-teal-500 via-cyan-600 to-blue-600 rounded-xl items-center justify-center">
                <Sliders className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Rigging</h2>
                <p className="text-gray-400 text-sm">Control chapter configurations</p>
              </div>
            </div>
            <div className="flex items-center justify-end mb-8">
              {!isEditing ? (
                <motion.button
                  onClick={() => setIsEditing(true)}
                  className=" flex items-center space-x-2 text-cyan-400 hover:text-cyan-300  bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/20 hover:border-cyan-500/30 px-4 py-2.5 rounded-lg font-medium text-sm transition-all duration-200"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Edit2 className="w-4 h-4" />
                  <span>Edit Settings</span>
                </motion.button>
              ) : (
                <div className="flex space-x-3">
                  <motion.button
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className=" flex items-center space-x-2  bg-cyan-600 hover:bg-cyan-700  text-white font-medium  px-4 py-2.5 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed  transition-all duration-200"
                    whileHover={{ scale: isLoading ? 1 : 1.02 }}
                    whileTap={{ scale: isLoading ? 1 : 0.98 }}
                  >
                    <Save className="w-4 h-4" />
                    <span>{isLoading ? 'Saving...' : 'Save Changes'}</span>
                  </motion.button>
                  <motion.button
                    onClick={handleCancel}
                    className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <X className="w-4 h-4" />
                    <span>Cancel</span>
                  </motion.button>
                </div>
              )}
            </div>
          </div>
          <div className="grid lg:grid-cols-2 gap-y-8 sm:gap-8 p-4 sm:p-8">
            {/* Chapter Information */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-2 h-8 bg-linear-to-b from-cyan-400 to-cyan-400 rounded-full"></div>
                <h3 className="text-lg font-semibold text-white">Chapter Information</h3>
              </div>

              <Input
                label="Chapter Name"
                icon={<Settings2 className="text-cyan-400 w-4 h-4" />}
                type="text"
                name="name"
                value={inputs.name || ''}
                onChange={handleInput}
                disabled={!isEditing}
                placeholder="Enter chapter name"
              />

              <Input
                label="Meeting Location"
                icon={<MapPin className="text-cyan-400 w-4 h-4" />}
                type="text"
                name="location"
                value={inputs.location || ''}
                onChange={handleInput}
                disabled={!isEditing}
                placeholder="Enter meeting location"
              />
            </div>

            {/* Meeting Schedule */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-2 h-8 bg-linear-to-b from-cyan-400 to-fuchsia-400 rounded-full"></div>
                <h3 className="text-lg font-semibold text-white">Meeting Schedule</h3>
              </div>

              <Select
                label="Meeting Day"
                icon={<Calendar className="text-cyan-400 w-4 h-4" />}
                name="meetingDay"
                value={inputs.meetingDay || ''}
                onChange={handleInput}
                disabled={!isEditing}
                options={MEETING_DAYS}
              />

              <Input
                label="Meeting Time"
                icon={<Clock className="text-cyan-400 w-4 h-4" />}
                type="time"
                name="meetingTime"
                value={inputs.meetingTime || ''}
                onChange={handleInput}
                disabled={!isEditing}
              />

              <Select
                label="Meeting Frequency"
                icon={<Calendar className="text-cyan-400 w-4 h-4" />}
                name="meetingFrequency"
                value={inputs.meetingFrequency || 'WEEKLY'}
                onChange={handleInput}
                disabled={!isEditing}
                options={MEETING_FREQUENCIES}
              />
            </div>
          </div>
        </>
      </motion.div>

      <div className="hidden xl:block w-80 bg-gray-800/30 border-l border-gray-700/50 p-6 overflow-y-auto">
        {/* Right Panel */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-400 text-sm font-medium">Meeting Overview</span>
          </div>

          {/* Configuration Status */}
          <motion.div
            className="mt-8 p-6 bg-green-500/5 border border-green-500/20 rounded-xl"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-start space-x-4">
              <motion.div
                className="p-2 bg-green-500/10 rounded-lg shrink-0"
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: 'reverse'
                }}
              >
                <CheckCircle className="w-5 h-5 text-green-400" />
              </motion.div>
              <div>
                <h4 className="text-sm font-bold text-green-300">Configuration Active</h4>
                <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                  All chapter settings are current and operational. Your chapter is configured for
                  <span className="text-white font-medium"> {inputs?.meetingFrequency?.toLowerCase()}</span> meetings
                  every <span className="text-white font-medium">{inputs?.meetingDay?.toLowerCase()}</span> at
                  <span className="text-white font-medium"> {inputs?.meetingTime}</span>.
                </p>
              </div>
            </div>
          </motion.div>
          {/* Quick Stats */}
          <div className="mt-8 grid grid-cols-1 gap-4">
            <motion.div
              className="bg-gray-800/20 hover:bg-gray-600/20 border border-gray-700/30 rounded-xl p-4 text-center"
              whileHover={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            >
              <div className="text-2xl font-bold text-cyan-400">13</div>
              <div className="text-xs text-gray-400 mt-1">Total Members</div>
            </motion.div>
            <motion.div
              className="bg-gray-800/20 border border-gray-700/30 rounded-xl p-4 text-center hover:bg-gray-600/20"
              whileHover={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            >
              <div className="text-2xl font-bold text-cyan-400">{inputs.meetingTime || '—'}</div>
              <div className="text-xs text-gray-400 mt-1">Meeting Time</div>
            </motion.div>
            <motion.div
              className="bg-gray-800/20 hover:bg-gray-600/20 border border-gray-700/30 rounded-xl p-4 text-center"
              whileHover={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            >
              <div className="text-2xl font-bold text-fuchsia-400">Weekly</div>
              <div className="text-xs text-gray-400 mt-1">Frequency</div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Rigging
