'use client'

import { useState } from 'react'
import { X, AlertTriangle, Send } from 'lucide-react'
import { useAppDispatch, useReportSlice } from '@/app/lib/redux/store'
import { setCloseReportSuspiciousActivityDrawer } from '@/app/lib/redux/features/reportSlice'

type ReportType = 'SPAM' | 'INAPPROPRIATE' | 'FRAUD' | 'HARASSMENT' | 'OTHER'

const ReportSuspiciousActivityDrawer = () => {
  const [reportType, setReportType] = useState<ReportType>('SPAM')
  const [description, setDescription] = useState('')
  const [reportedUserId, setReportedUserId] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const dispatch = useAppDispatch()
  const { reportSuspiciousActivity } = useReportSlice()
  const onClose = () => dispatch(setCloseReportSuspiciousActivityDrawer())

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      // Reset form
      setReportType('SPAM')
      setDescription('')
      setReportedUserId('')
      onClose()
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!reportSuspiciousActivity) return null

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={onClose} />

      {/* Drawer */}
      <div className="fixed md:static inset-0 md:inset-auto w-full md:w-80 bg-gray-800/30 border-l border-gray-700/50 p-6 overflow-y-auto z-50 md:z-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            <h2 className="text-lg font-semibold text-white">Report Activity</h2>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-gray-700/50 rounded-lg transition-colors">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Report Type */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Report Type</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value as ReportType)}
              className="w-full px-3 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500"
              required
            >
              <option value="SPAM">Spam</option>
              <option value="INAPPROPRIATE">Inappropriate Content</option>
              <option value="FRAUD">Fraudulent Activity</option>
              <option value="HARASSMENT">Harassment</option>
              <option value="OTHER">Other</option>
            </select>
          </div>

          {/* User ID (Optional) */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">User ID (Optional)</label>
            <input
              type="text"
              value={reportedUserId}
              onChange={(e) => setReportedUserId(e.target.value)}
              placeholder="Enter user ID if applicable"
              className="w-full px-3 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the suspicious activity..."
              rows={6}
              className="w-full px-3 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 resize-none"
              required
            />
            <p className="text-xs text-gray-500 mt-1">Please provide as much detail as possible</p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-600 hover:bg-amber-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
          >
            <Send className="w-4 h-4" />
            {isSubmitting ? 'Submitting...' : 'Submit Report'}
          </button>

          {/* Disclaimer */}
          <div className="p-3 bg-gray-900/50 border border-gray-700 rounded-lg">
            <p className="text-xs text-gray-400">
              Your report will be reviewed by administrators. False reports may result in account restrictions.
            </p>
          </div>
        </form>
      </div>
    </>
  )
}

export default ReportSuspiciousActivityDrawer
