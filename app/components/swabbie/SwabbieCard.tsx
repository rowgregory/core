import { FC, useState } from 'react'
import { motion } from 'framer-motion'
import {
  AlertCircle,
  Briefcase,
  Building2,
  Calendar,
  CheckCircle,
  CheckCircle2,
  Clock,
  FileText,
  Mail,
  MapPin,
  Phone,
  RotateCcw,
  Sailboat,
  Shield,
  XCircle
} from 'lucide-react'
import { formatDate } from '@/app/lib/utils/date/formatDate'
import { useAppDispatch } from '@/app/lib/redux/store'
import useSoundEffect from '@/hooks/useSoundEffect'
import { showToast } from '@/app/lib/redux/features/toastSlice'
import { updateUserStatus } from '@/app/lib/actions/updateUserStatus'
import { useRouter } from 'next/navigation'

const statusColors: any = {
  PENDING: 'bg-amber-900/30 text-amber-300 border-amber-600/50',
  INITIAL_REVIEW: 'bg-blue-900/30 text-blue-300 border-blue-600/50',
  BACKGROUND_CHECK: 'bg-yellow-900/30 text-yellow-300 border-yellow-600/50',
  REJECTED: 'bg-red-900/30 text-red-300 border-red-600/50',
  ACTIVE: 'bg-green-900/30 text-green-300 border-green-600/50'
}

export const statusIcons: any = {
  PENDING: Clock,
  INITIAL_REVIEW: CheckCircle,
  BACKGROUND_CHECK: Shield,
  REJECTED: AlertCircle,
  ACTIVE: CheckCircle2
}

const SwabbieCard: FC<{ swabbie: any; index: number }> = ({ swabbie, index }) => {
  const router = useRouter()
  const StatusIcon: any = statusIcons[swabbie.membershipStatus]
  const [currentStatus, setCurrentStatus] = useState('')
  const { play: playDroplet } = useSoundEffect('/sound-effects/droplet.mp3', true)
  const { play: playPortal } = useSoundEffect('/sound-effects/portal.mp3', true)
  const dispatch = useAppDispatch()
  const [isLoading, setIsLoading] = useState(false)

  if (!StatusIcon) {
    return null
  }

  const handleStatusUpdate = async (newStatus) => {
    setCurrentStatus(newStatus)

    try {
      setIsLoading(true)
      await updateUserStatus(swabbie.id, newStatus)

      router.refresh()

      if (newStatus === 'ACTIVE') {
        playPortal()
      } else {
        playDroplet()
      }
    } catch (error) {
      dispatch(
        showToast({
          type: 'error',
          message: 'Failed to update swabbie status.',
          description: error?.data?.message
        })
      )
    } finally {
      setIsLoading(false)
    }
  }

  const isRejected = swabbie.membershipStatus === 'REJECTED'

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 * index, ease: 'easeInOut' }}
      className="bg-slate-800/40 backdrop-blur-md rounded-xl border border-slate-600/30 p-6 hover:border-cyan-400/50 transition-all duration-300 shadow-lg shadow-slate-900/50"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div
            className={`h-12 w-12 rounded-full flex items-center justify-center shadow-lg ${
              isRejected
                ? 'bg-linear-to-r from-red-600 to-red-700 shadow-red-900/50'
                : 'bg-linear-to-r from-cyan-600 to-blue-700 shadow-cyan-900/50'
            }`}
          >
            <Sailboat className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className={`text-lg font-semibold ${isRejected ? 'text-red-200' : 'text-white'}`}>{swabbie.name}</h3>
            <p className="text-sm text-slate-300">{swabbie.id}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div
            className={`px-2 py-1 rounded-full text-xs font-medium border ${statusColors[swabbie.membershipStatus]}`}
          >
            <div className="flex items-center space-x-1">
              <StatusIcon className="h-3 w-3" />
              <span>{swabbie.membershipStatus}</span>
            </div>
          </div>
        </div>
      </div>

      <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 ${isRejected ? 'opacity-75' : ''}`}>
        <div className="space-y-2">
          <div className="flex items-center text-sm text-slate-300">
            <Mail className="h-4 w-4 mr-2 text-slate-400" />
            {swabbie.email}
          </div>
          <div className="flex items-center text-sm text-slate-300">
            <Phone className="h-4 w-4 mr-2 text-slate-400" />
            {swabbie.phone}
          </div>
          <div className="flex items-center text-sm text-slate-300">
            <MapPin className="h-4 w-4 mr-2 text-slate-400" />
            {swabbie.location}
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center text-sm text-slate-300">
            <Building2 className="h-4 w-4 mr-2 text-slate-400" />
            {swabbie.company}
          </div>
          <div className="flex items-center text-sm text-slate-300">
            <Briefcase className="h-4 w-4 mr-2 text-slate-400" />
            {swabbie.industry}
          </div>
          <div className="flex items-center text-sm text-slate-300">
            <Calendar className="h-4 w-4 mr-2 text-slate-400" />
            Applied {formatDate(swabbie.createdAt)}
          </div>
        </div>
      </div>

      <div className={`mb-4 ${isRejected ? 'opacity-75' : ''}`}>
        <div className="text-xs text-slate-400 mb-1">Business Specialties</div>
        <div className="flex flex-wrap gap-1">
          {swabbie.interests.map((interest: string, index: number) => (
            <span
              key={index}
              className={`px-2 py-1 text-xs rounded-full border ${
                isRejected
                  ? 'bg-red-900/20 text-red-300 border-red-600/30'
                  : 'bg-cyan-900/20 text-cyan-300 border-cyan-600/30'
              }`}
            >
              {interest}
            </span>
          ))}
        </div>
      </div>

      {/* License Status */}
      <div className="flex items-center space-x-2 mb-5 py-4 border-y border-gray-600/30">
        <div className={`h-2 w-2 rounded-full ${swabbie.isLicensed ? 'bg-emerald-400' : 'bg-gray-400'}`} />
        <span className="text-xs text-gray-300">
          {swabbie.businessLicenseNumber ? `Licensed (${swabbie.businessLicenseNumber})` : 'No License'}
        </span>
      </div>

      {/* Swabbie */}
      <div className="">
        {(swabbie.membershipStatus === 'PENDING' ||
          swabbie.membershipStatus === 'INITIAL_REVIEW' ||
          swabbie.membershipStatus === 'BACKGROUND_CHECK' ||
          swabbie.membershipStatus === 'ACTIVE' ||
          swabbie.membershipStatus === 'REJECTED') && (
          <div className="space-y-5">
            {/* Voyage Process Header */}
            <div className="flex items-center space-x-2 mb-4">
              <div
                className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                  swabbie.membershipStatus === 'REJECTED'
                    ? 'bg-red-600/20 border-red-600'
                    : 'bg-blue-600/20 border-blue-600'
                }`}
              >
                {swabbie.membershipStatus === 'REJECTED' ? (
                  <XCircle className="w-3 h-3 text-red-400" />
                ) : (
                  <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                )}
              </div>
              <h3 className="text-base font-semibold text-gray-100">Swabbie Voyage Process</h3>
              {swabbie.membershipStatus === 'ACTIVE' && (
                <div className="flex items-center space-x-1 ml-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-medium text-emerald-400">Voyage Complete</span>
                </div>
              )}
              {swabbie.membershipStatus === 'REJECTED' && (
                <div className="flex items-center space-x-1 ml-2">
                  <XCircle className="w-4 h-4 text-red-400" />
                  <span className="text-xs font-medium text-red-400">Voyage Ended</span>
                </div>
              )}
            </div>

            {/* Step-by-step Process */}
            <div className="space-y-4">
              {/* Step 1: Initial Review */}
              <div className="flex items-start space-x-3">
                <div className="flex flex-col items-center">
                  {swabbie.membershipStatus === 'PENDING' ? (
                    <div className="w-8 h-8 rounded-full bg-blue-600/10 border-2 border-blue-600 flex items-center justify-center">
                      <span className="text-xs font-semibold text-blue-400">1</span>
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-emerald-600 border-2 border-emerald-600 flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <div
                    className={`w-0.5 h-8 mt-2 ${
                      swabbie.membershipStatus === 'PENDING'
                        ? 'bg-gray-600'
                        : swabbie.membershipStatus === 'REJECTED'
                          ? 'bg-red-600'
                          : 'bg-emerald-600'
                    }`}
                  ></div>
                </div>
                <div className="flex-1 pt-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4
                      className={`text-sm font-medium ${
                        swabbie.membershipStatus === 'PENDING'
                          ? 'text-gray-200'
                          : swabbie.membershipStatus === 'REJECTED'
                            ? 'text-red-400'
                            : 'text-emerald-400'
                      }`}
                    >
                      Initial Review
                    </h4>
                    <span
                      className={`text-xs ${
                        swabbie.membershipStatus === 'PENDING'
                          ? 'text-gray-400'
                          : swabbie.membershipStatus === 'REJECTED'
                            ? 'text-red-400 font-medium'
                            : 'text-emerald-400 font-medium'
                      }`}
                    >
                      {swabbie.membershipStatus === 'PENDING' ? 'First Step' : 'Completed'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mb-3">Review qualifications and experience</p>
                  {swabbie.membershipStatus === 'PENDING' && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleStatusUpdate('INITIAL_REVIEW')}
                      disabled={isLoading}
                      className="flex items-center space-x-2 px-4 py-2 border border-blue-600 text-blue-400 rounded-lg hover:bg-blue-600/10 hover:border-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium cursor-pointer whitespace-nowrap"
                    >
                      <FileText className="w-4 h-4" />
                      <span>Complete Initial Review</span>
                      {currentStatus === 'INITIAL_REVIEW' && isLoading && (
                        <div className="w-2.5 h-2.5 border-2 border-blue-400 rounded-full border-top-0 animate-spin ml-2" />
                      )}
                    </motion.button>
                  )}
                </div>
              </div>

              {/* Step 2: Background Check */}
              <div className="flex items-start space-x-3">
                <div className="flex flex-col items-center">
                  {swabbie.membershipStatus === 'PENDING' ? (
                    <div className="w-8 h-8 rounded-full bg-gray-600/10 border-2 border-gray-600 flex items-center justify-center">
                      <span className="text-xs font-semibold text-gray-500">2</span>
                    </div>
                  ) : swabbie.membershipStatus === 'INITIAL_REVIEW' ? (
                    <div className="w-8 h-8 rounded-full bg-orange-600/10 border-2 border-orange-600 flex items-center justify-center animate-pulse">
                      <span className="text-xs font-semibold text-orange-400">2</span>
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-emerald-600 border-2 border-emerald-600 flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <div
                    className={`w-0.5 h-8 mt-2 ${
                      swabbie.membershipStatus === 'PENDING'
                        ? 'bg-gray-600'
                        : swabbie.membershipStatus === 'INITIAL_REVIEW'
                          ? 'bg-gray-600'
                          : swabbie.membershipStatus === 'REJECTED'
                            ? 'bg-red-600'
                            : 'bg-emerald-600'
                    }`}
                  ></div>
                </div>
                <div className="flex-1 pt-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4
                      className={`text-sm font-medium ${
                        swabbie.membershipStatus === 'PENDING'
                          ? 'text-gray-500'
                          : swabbie.membershipStatus === 'INITIAL_REVIEW'
                            ? 'text-orange-400'
                            : swabbie.membershipStatus === 'REJECTED'
                              ? 'text-red-400'
                              : 'text-emerald-400'
                      }`}
                    >
                      Background Check
                    </h4>
                    <span
                      className={`text-xs ${
                        swabbie.membershipStatus === 'PENDING'
                          ? 'text-gray-500'
                          : swabbie.membershipStatus === 'INITIAL_REVIEW'
                            ? 'text-orange-400 font-medium'
                            : swabbie.membershipStatus === 'REJECTED'
                              ? 'text-red-400 font-medium'
                              : 'text-emerald-400 font-medium'
                      }`}
                    >
                      {swabbie.membershipStatus === 'PENDING'
                        ? 'Pending'
                        : swabbie.membershipStatus === 'INITIAL_REVIEW'
                          ? 'Current Step'
                          : swabbie.membershipStatus === 'REJECTED'
                            ? 'Completed'
                            : 'Completed'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mb-3">Standard verification process for all swabbies</p>
                  {swabbie.membershipStatus === 'INITIAL_REVIEW' && (
                    <div className="space-y-3">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleStatusUpdate('BACKGROUND_CHECK')}
                        disabled={isLoading}
                        className="flex items-center space-x-2 px-4 py-2 border border-orange-600 text-orange-400 rounded-lg hover:bg-orange-600/10 hover:border-orange-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium cursor-pointer whitespace-nowrap"
                      >
                        <Shield className="w-4 h-4" />
                        <span>Complete Background Check</span>
                        {currentStatus === 'BACKGROUND_CHECK' && isLoading && (
                          <div className="w-2.5 h-2.5 border-2 border-orange-400 rounded-full border-top-0 animate-spin ml-2" />
                        )}
                      </motion.button>

                      {/* Background Check Checklist */}
                      <div className="bg-orange-600/5 border border-orange-600/20 rounded-lg p-3">
                        <p className="text-xs font-medium text-orange-400 mb-2">Verify Before Proceeding:</p>
                        <div className="space-y-1.5">
                          <div className="flex items-center space-x-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-orange-400"></div>
                            <span className="text-xs text-gray-400">Business license is valid and current</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-orange-400"></div>
                            <span className="text-xs text-gray-400">Application details are complete and accurate</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-orange-400"></div>
                            <span className="text-xs text-gray-400">No previous violations or flags in system</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Step 3: Final Decision */}
              <div className="flex items-start space-x-3">
                <div className="flex flex-col items-center">
                  {swabbie.membershipStatus === 'PENDING' || swabbie.membershipStatus === 'INITIAL_REVIEW' ? (
                    <div className="w-8 h-8 rounded-full bg-gray-600/10 border-2 border-gray-600 flex items-center justify-center">
                      <span className="text-xs font-semibold text-gray-500">3</span>
                    </div>
                  ) : swabbie.membershipStatus === 'BACKGROUND_CHECK' ? (
                    <div className="w-8 h-8 rounded-full bg-purple-600/10 border-2 border-purple-600 flex items-center justify-center animate-pulse">
                      <span className="text-xs font-semibold text-purple-400">3</span>
                    </div>
                  ) : swabbie.membershipStatus === 'REJECTED' ? (
                    <div className="w-8 h-8 rounded-full bg-red-600 border-2 border-red-600 flex items-center justify-center">
                      <XCircle className="w-4 h-4 text-white" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-emerald-600 border-2 border-emerald-600 flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                  )}
                  {(swabbie.membershipStatus === 'ACTIVE' || swabbie.membershipStatus === 'REJECTED') && (
                    <div
                      className={`w-0.5 h-8 mt-2 ${swabbie.membershipStatus === 'REJECTED' ? 'bg-red-600' : 'bg-emerald-600'}`}
                    ></div>
                  )}
                </div>
                <div className="flex-1 pt-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4
                      className={`text-sm font-medium ${
                        swabbie.membershipStatus === 'PENDING' || swabbie.membershipStatus === 'INITIAL_REVIEW'
                          ? 'text-gray-500'
                          : swabbie.membershipStatus === 'BACKGROUND_CHECK'
                            ? 'text-purple-400'
                            : swabbie.membershipStatus === 'REJECTED'
                              ? 'text-red-400'
                              : 'text-emerald-400'
                      }`}
                    >
                      Final Decision
                    </h4>
                    <span
                      className={`text-xs ${
                        swabbie.membershipStatus === 'PENDING' || swabbie.membershipStatus === 'INITIAL_REVIEW'
                          ? 'text-gray-500'
                          : swabbie.membershipStatus === 'BACKGROUND_CHECK'
                            ? 'text-purple-400 font-medium'
                            : swabbie.membershipStatus === 'REJECTED'
                              ? 'text-red-400 font-medium'
                              : 'text-emerald-400 font-medium'
                      }`}
                    >
                      {swabbie.membershipStatus === 'PENDING' || swabbie.membershipStatus === 'INITIAL_REVIEW'
                        ? 'Pending'
                        : swabbie.membershipStatus === 'BACKGROUND_CHECK'
                          ? 'Current Step'
                          : swabbie.membershipStatus === 'REJECTED'
                            ? 'Rejected'
                            : 'Completed'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mb-3">Make the final call on crew membership</p>
                  {swabbie.membershipStatus === 'BACKGROUND_CHECK' && (
                    <div className="grid grid-cols-2 gap-3">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleStatusUpdate('ACTIVE')}
                        disabled={isLoading}
                        className="flex items-center space-x-2 px-4 py-2 border border-emerald-600 text-emerald-400 rounded-lg hover:bg-emerald-600/10 hover:border-emerald-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium cursor-pointer justify-center whitespace-nowrap"
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span>Welcome Aboard</span>
                        {currentStatus === 'ACTIVE' && isLoading && (
                          <div className="w-2.5 h-2.5 border-2 border-emerald-400 rounded-full border-top-0 animate-spin ml-2" />
                        )}
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleStatusUpdate('REJECTED')}
                        disabled={isLoading}
                        className="flex items-center space-x-2 px-4 py-2 border border-red-600 text-red-400 rounded-lg hover:bg-red-600/10 hover:border-red-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium cursor-pointer justify-center whitespace-nowrap"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>Walk the Plank</span>
                        {currentStatus === 'REJECTED' && isLoading && (
                          <div className="w-2.5 h-2.5 border-2 border-red-400 rounded-full border-top-0 animate-spin ml-2" />
                        )}
                      </motion.button>
                    </div>
                  )}
                </div>
              </div>

              {/* Step 4: Walk the Plank (only show when REJECTED) */}
              {swabbie.membershipStatus === 'REJECTED' && (
                <div className="flex items-start space-x-3">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-red-600 border-2 border-red-600 flex items-center justify-center">
                      <XCircle className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <div className="flex-1 pt-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-medium text-red-400">Walk the Plank</h4>
                      <span className="text-xs text-red-400 font-medium">Application Denied</span>
                    </div>
                    <p className="text-xs text-gray-400 mb-3">Application has been rejected</p>
                    <div className="bg-red-600/10 border border-red-600/30 rounded-lg p-3">
                      <div className="flex items-center space-x-2">
                        <XCircle className="w-4 h-4 text-red-400" />
                        <span className="text-sm font-medium text-red-400">Voyage Terminated</span>
                      </div>
                      <p className="text-xs text-gray-400 mt-1.5">
                        This swabbie&apos;s application has been rejected and they have been notified
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Welcome Aboard (only show when ACTIVE) */}
              {swabbie.membershipStatus === 'ACTIVE' && (
                <div className="flex items-start space-x-3">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-emerald-600 border-2 border-emerald-600 flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <div className="flex-1 pt-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-medium text-emerald-400">Welcome Aboard</h4>
                      <span className="text-xs text-emerald-400 font-medium">Crew Member</span>
                    </div>
                    <p className="text-xs text-gray-400 mb-3">Successfully joined the crew with full access</p>
                    <div className="bg-emerald-600/10 border border-emerald-600/30 rounded-lg p-3">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                        <span className="text-sm font-medium text-emerald-400">Voyage Successfully Completed!</span>
                      </div>
                      <p className="text-xs text-gray-400 mt-1.5">
                        This swabbie has been welcomed aboard and granted full crew access
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Process Info - update for different statuses */}
            {swabbie.membershipStatus !== 'ACTIVE' && swabbie.membershipStatus !== 'REJECTED' && (
              <div className="bg-gray-800/30 border border-gray-600/30 rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 rounded-full bg-blue-600/20 border border-blue-600 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                  </div>
                  <span className="text-xs font-medium text-gray-300">Automatic Notifications</span>
                </div>
                <p className="text-xs text-gray-400 mt-1.5 ml-6">
                  Each step automatically sends status updates to the swabbie via email
                </p>
              </div>
            )}
          </div>
        )}

        {/* Rejected State Button */}
        {isRejected && (
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 rounded-full bg-blue-600/20 border border-blue-600 flex items-center justify-center">
                <RotateCcw className="w-3 h-3 text-blue-400" />
              </div>
              <h3 className="text-base font-semibold text-gray-100">Recovery Options</h3>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-full bg-blue-600/10 border-2 border-blue-600 flex items-center justify-center">
                <RotateCcw className="w-4 h-4 text-blue-400" />
              </div>
              <div className="flex-1 pt-1">
                <h4 className="text-sm font-medium text-gray-200 mb-2">Give Second Chance</h4>
                <p className="text-xs text-gray-400 mb-3">Reset application to pending status for reconsideration</p>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleStatusUpdate('PENDING')}
                  disabled={isLoading}
                  className="flex items-center space-x-2 px-4 py-2 border border-blue-600 text-blue-400 rounded-lg hover:bg-blue-600/10 hover:border-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium cursor-pointer whitespace-nowrap"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Reset to Pending</span>
                </motion.button>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}
export default SwabbieCard
