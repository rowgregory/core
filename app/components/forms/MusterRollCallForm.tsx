import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Anchor,
  UserCheck,
  UserX,
  Clock,
  UserPlus,
  Eye,
  Save,
  RotateCcw,
  Calendar,
  MapPin,
  Users,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Ship,
  Compass,
  Bell
} from 'lucide-react'

interface CrewMember {
  id: string
  name: string
  industry: string
  status: 'present' | 'absent' | 'excused' | 'substitute' | 'visitor' | null
  arrivalTime?: string
  excuseReason?: string
  substituteFor?: string
  notes?: string
}

const MusterRollCallForm: React.FC = () => {
  const [meetingDate, setMeetingDate] = useState(new Date().toISOString().split('T')[0])
  const [meetingLocation, setMeetingLocation] = useState('Harbor Conference Room')
  const [weatherConditions, setWeatherConditions] = useState('')
  const [guestSpeaker, setGuestSpeaker] = useState('')
  const [specialNotes, setSpecialNotes] = useState('')

  // Mock crew data
  const [crewMembers, setCrewMembers] = useState<CrewMember[]>([
    { id: '1', name: 'John Smith', industry: 'Technology', status: null },
    { id: '2', name: 'Sarah Johnson', industry: 'Marketing', status: null },
    { id: '3', name: 'Mike Davis', industry: 'Finance', status: null },
    { id: '4', name: 'Lisa Chen', industry: 'Legal', status: null },
    { id: '5', name: 'Tom Wilson', industry: 'Real Estate', status: null },
    { id: '6', name: 'Emma Rodriguez', industry: 'Healthcare', status: null },
    { id: '7', name: 'David Park', industry: 'Construction', status: null },
    { id: '8', name: 'Rachel Green', industry: 'Insurance', status: null }
  ])

  const updateMemberStatus = (memberId: string, status: CrewMember['status'], extraData?: Partial<CrewMember>) => {
    setCrewMembers((prev) =>
      prev.map((member) => (member.id === memberId ? { ...member, status, ...extraData } : member))
    )
  }

  const quickMarkAll = (status: 'present' | 'absent') => {
    setCrewMembers((prev) => prev.map((member) => ({ ...member, status })))
  }

  const resetAll = () => {
    setCrewMembers((prev) =>
      prev.map((member) => ({
        ...member,
        status: null,
        arrivalTime: '',
        excuseReason: '',
        substituteFor: '',
        notes: ''
      }))
    )
  }

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case 'present':
        return 'bg-emerald-500 border-emerald-400 text-white'
      case 'absent':
        return 'bg-red-500 border-red-400 text-white'
      case 'excused':
        return 'bg-blue-500 border-blue-400 text-white'
      case 'substitute':
        return 'bg-purple-500 border-purple-400 text-white'
      case 'visitor':
        return 'bg-cyan-500 border-cyan-400 text-white'
      default:
        return 'bg-gray-600 border-gray-500 text-gray-300'
    }
  }

  const getStatusIcon = (status: string | null) => {
    switch (status) {
      case 'present':
        return CheckCircle
      case 'absent':
        return XCircle
      case 'excused':
        return Clock
      case 'substitute':
        return UserPlus
      case 'visitor':
        return Eye
      default:
        return Users
    }
  }

  const presentCount = crewMembers.filter((m) => m.status === 'present').length
  const absentCount = crewMembers.filter((m) => m.status === 'absent').length
  const excusedCount = crewMembers.filter((m) => m.status === 'excused').length
  const unmarkedCount = crewMembers.filter((m) => m.status === null).length

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <Ship className="w-8 h-8 text-blue-400" />
              <div>
                <h1 className="text-4xl font-bold text-white">Muster Roll Call</h1>
                <p className="text-gray-400">All hands on deck - mark crew attendance</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={resetAll}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 border border-gray-600 rounded-lg text-gray-300 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset All</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg text-white transition-colors">
                <Save className="w-4 h-4" />
                <span>Save Muster</span>
              </button>
            </div>
          </div>

          {/* Meeting Details */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-800/40 border border-gray-700/50 rounded-xl backdrop-blur-sm">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-blue-400" />
              <input
                type="date"
                value={meetingDate}
                onChange={(e) => setMeetingDate(e.target.value)}
                className="bg-gray-700 border border-gray-600 rounded px-3 py-1.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-blue-400" />
              <input
                type="text"
                placeholder="Meeting location"
                value={meetingLocation}
                onChange={(e) => setMeetingLocation(e.target.value)}
                className="flex-1 bg-gray-700 border border-gray-600 rounded px-3 py-1.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <input
              type="text"
              placeholder="Weather conditions (optional)"
              value={weatherConditions}
              onChange={(e) => setWeatherConditions(e.target.value)}
              className="bg-gray-700 border border-gray-600 rounded px-3 py-1.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
              type="text"
              placeholder="Guest speaker (optional)"
              value={guestSpeaker}
              onChange={(e) => setGuestSpeaker(e.target.value)}
              className="bg-gray-700 border border-gray-600 rounded px-3 py-1.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </motion.div>

        {/* Quick Stats & Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8"
        >
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 text-center">
            <UserCheck className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-emerald-400">{presentCount}</div>
            <div className="text-xs text-emerald-400">Present</div>
          </div>

          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-center">
            <UserX className="w-6 h-6 text-red-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-red-400">{absentCount}</div>
            <div className="text-xs text-red-400">Absent</div>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 text-center">
            <Clock className="w-6 h-6 text-blue-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-400">{excusedCount}</div>
            <div className="text-xs text-blue-400">Excused</div>
          </div>

          <div className="bg-gray-500/10 border border-gray-500/30 rounded-xl p-4 text-center">
            <AlertTriangle className="w-6 h-6 text-gray-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-400">{unmarkedCount}</div>
            <div className="text-xs text-gray-400">Unmarked</div>
          </div>

          <button
            onClick={() => quickMarkAll('present')}
            className="bg-emerald-600 hover:bg-emerald-700 rounded-xl p-4 text-center transition-colors"
          >
            <Bell className="w-6 h-6 text-white mx-auto mb-2" />
            <div className="text-sm font-semibold text-white">All Aboard!</div>
            <div className="text-xs text-emerald-100">Mark All Present</div>
          </button>

          <button
            onClick={() => quickMarkAll('absent')}
            className="bg-red-600 hover:bg-red-700 rounded-xl p-4 text-center transition-colors"
          >
            <Anchor className="w-6 h-6 text-white mx-auto mb-2" />
            <div className="text-sm font-semibold text-white">Shore Leave</div>
            <div className="text-xs text-red-100">Mark All Absent</div>
          </button>
        </motion.div>

        {/* Crew Muster List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-800/40 border border-gray-700/50 rounded-xl backdrop-blur-sm overflow-hidden"
        >
          <div className="p-6 border-b border-gray-700/50">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white flex items-center">
                <Compass className="w-6 h-6 mr-2" />
                Crew Manifest
              </h2>
              <div className="text-sm text-gray-400">
                {crewMembers.length - unmarkedCount}/{crewMembers.length} crew marked
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid gap-4">
              {crewMembers.map((member, index) => {
                const StatusIcon = getStatusIcon(member.status)
                return (
                  <motion.div
                    key={member.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * index }}
                    className="flex items-center justify-between p-4 bg-gray-700/20 rounded-lg hover:bg-gray-700/30 transition-colors"
                  >
                    {/* Member Info */}
                    <div className="flex items-center space-x-4">
                      <div className="shrink-0 w-12 h-12 bg-linear-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold">
                          {member.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-white">{member.name}</h4>
                        <p className="text-sm text-gray-400">{member.industry}</p>
                      </div>
                    </div>

                    {/* Status Buttons */}
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() =>
                            updateMemberStatus(member.id, 'present', {
                              arrivalTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                            })
                          }
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
                            member.status === 'present'
                              ? 'bg-emerald-500 border-emerald-400 text-white'
                              : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-emerald-600 hover:border-emerald-500 hover:text-white'
                          }`}
                        >
                          ⚓ Present
                        </button>

                        <button
                          onClick={() => updateMemberStatus(member.id, 'absent')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
                            member.status === 'absent'
                              ? 'bg-red-500 border-red-400 text-white'
                              : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-red-600 hover:border-red-500 hover:text-white'
                          }`}
                        >
                          🏴‍☠️ Absent
                        </button>

                        <button
                          onClick={() => updateMemberStatus(member.id, 'excused')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
                            member.status === 'excused'
                              ? 'bg-blue-500 border-blue-400 text-white'
                              : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-blue-600 hover:border-blue-500 hover:text-white'
                          }`}
                        >
                          🕐 Excused
                        </button>

                        <button
                          onClick={() => updateMemberStatus(member.id, 'substitute')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
                            member.status === 'substitute'
                              ? 'bg-purple-500 border-purple-400 text-white'
                              : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-purple-600 hover:border-purple-500 hover:text-white'
                          }`}
                        >
                          👥 Substitute
                        </button>
                      </div>

                      {/* Status Indicator */}
                      <div
                        className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${getStatusColor(member.status)}`}
                      >
                        <StatusIcon className="w-4 h-4" />
                      </div>
                    </div>

                    {/* Additional Info for Special Status */}
                    {(member.status === 'excused' || member.status === 'substitute') && (
                      <div className="ml-4">
                        <input
                          type="text"
                          placeholder={member.status === 'excused' ? 'Reason for excuse...' : 'Substitute for...'}
                          value={member.status === 'excused' ? member.excuseReason || '' : member.substituteFor || ''}
                          onChange={(e) =>
                            updateMemberStatus(
                              member.id,
                              member.status,
                              member.status === 'excused'
                                ? { excuseReason: e.target.value }
                                : { substituteFor: e.target.value }
                            )
                          }
                          className="bg-gray-600 border border-gray-500 rounded px-3 py-1 text-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    )}
                  </motion.div>
                )
              })}
            </div>
          </div>
        </motion.div>

        {/* Special Notes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6 bg-gray-800/40 border border-gray-700/50 rounded-xl p-6 backdrop-blur-sm"
        >
          <h3 className="text-lg font-bold text-white mb-3">Captain&apos;s Log - Special Notes</h3>
          <textarea
            placeholder="Any special notes about today's muster, events, or crew updates..."
            value={specialNotes}
            onChange={(e) => setSpecialNotes(e.target.value)}
            rows={3}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </motion.div>
      </div>
    </div>
  )
}

export default MusterRollCallForm
