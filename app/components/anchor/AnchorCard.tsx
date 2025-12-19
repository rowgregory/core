import { FC, useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, DollarSign, Building2, User, FileText, MapPin, Globe, Crown } from 'lucide-react'
import { IAnchor } from '@/types/anchor'
import Picture from '../common/Picture'
import { formatDate } from '@/app/lib/utils/date/formatDate'
import { setOpenAnchorDrawer } from '@/app/redux/features/anchorSlice'
import { useAppDispatch } from '@/app/redux/store'
import { setInputs } from '@/app/redux/features/formSlice'
import { useSession } from 'next-auth/react'
import getAnchorStatusColor from '@/app/lib/utils/anchor/getAnchorStatusColor'

const formatCurrency = (amount: any, currency: string) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency || 'USD'
  }).format(amount)
}

const AnchorCard: FC<{ anchor: IAnchor; index: number }> = ({ anchor, index }) => {
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false)
  const dispatch = useAppDispatch()
  const session = useSession()

  // Helper functions to get participant info with null handling
  const getGiverInfo = () => {
    // Check for fleet dividends first
    if (anchor.externalGiverName === 'Fleet Earnings' || anchor.externalGiverCompany === 'Chapter Revenue') {
      return {
        name: 'Fleet Earnings',
        company: 'Chapter Revenue',
        profileImage: null,
        type: 'fleet-earnings'
      }
    } else if (anchor.giver && anchor.giverId) {
      return {
        name: anchor.giver.name || 'Unknown User',
        company: anchor.giver.company || 'Unknown Company',
        profileImage: anchor.giver.profileImage,
        type: 'internal'
      }
    } else if (anchor.externalGiverName || anchor.externalGiverEmail || anchor.externalGiverCompany) {
      return {
        name: anchor.externalGiverName || 'External Contact',
        company: anchor.externalGiverCompany || 'External Organization',
        profileImage: null,
        email: anchor.externalGiverEmail,
        type: 'external'
      }
    } else {
      // Fallback when no giver info is available
      return {
        name: 'Unknown Giver',
        company: 'Unknown',
        profileImage: null,
        type: 'unknown'
      }
    }
  }

  const getReceiverInfo = () => {
    if (anchor.receiver && anchor.receiverId) {
      return {
        name: anchor.receiver.name || 'Unknown User',
        company: anchor.receiver.company || 'Unknown Company',
        profileImage: anchor.receiver.profileImage,
        type: 'internal'
      }
    } else if (anchor.externalReceiverName || anchor.externalReceiverEmail || anchor.externalReceiverCompany) {
      return {
        name: anchor.externalReceiverName || 'External Contact',
        company: anchor.externalReceiverCompany || 'External Organization',
        profileImage: null,
        email: anchor.externalReceiverEmail,
        type: 'external'
      }
    } else {
      // Fallback when no receiver info is available
      return {
        name: 'Unknown Receiver',
        company: 'Unknown',
        profileImage: null,
        type: 'unknown'
      }
    }
  }

  const giverInfo = getGiverInfo()
  const receiverInfo = getReceiverInfo()

  const handleCardClick = () => {
    dispatch(setOpenAnchorDrawer())
    dispatch(
      setInputs({
        formName: 'anchorForm',
        data: {
          ...anchor,
          // Set giverId based on whether it's external, fleet-dividends, or internal
          giverId: anchor.externalGiverName === 'Fleet Earnings' ? 'fleet-earnings' : anchor.giverId || 'external',
          // Set receiverId based on whether it's external or internal
          receiverId: anchor.receiverId || 'external',
          // Keep external fields as they are
          externalGiverName: anchor.externalGiverName,
          externalGiverEmail: anchor.externalGiverEmail,
          externalGiverCompany: anchor.externalGiverCompany,
          externalReceiverName: anchor.externalReceiverName,
          externalReceiverEmail: anchor.externalReceiverEmail,
          externalReceiverCompany: anchor.externalReceiverCompany,
          isReceiving: anchor.receiverId === session.data?.user?.id,
          isUpdating: true
        }
      })
    )
  }

  return (
    <motion.div
      onClick={handleCardClick}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: index * 0.2, ease: 'easeInOut' }}
      className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:bg-gray-800/70 transition-all duration-200 cursor-pointer"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-x-3">
          <div className="flex -space-x-2">
            {/* Giver Avatar */}
            {giverInfo.type === 'internal' ? (
              <Picture
                priority={false}
                src={giverInfo.profileImage ?? ''}
                alt={giverInfo.name}
                className="w-10 h-10 rounded-full border-2 border-gray-700 bg-gray-600 object-cover"
              />
            ) : giverInfo.type === 'external' ? (
              <div className="w-10 h-10 rounded-full border-2 border-gray-700 bg-gray-800 flex items-center justify-center">
                <User className="w-5 h-5 text-orange-400" />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-full border-2 border-gray-700 bg-gray-800 flex items-center justify-center">
                <User className="w-5 h-5 text-gray-500" />
              </div>
            )}

            {/* Receiver Avatar */}
            {receiverInfo.type === 'internal' ? (
              <div className="w-10 h-10 rounded-full border-2 border-gray-700 bg-gray-800 flex items-center justify-center">
                <Crown className="w-5 h-5 text-purple-400" />
              </div>
            ) : receiverInfo.type === 'external' ? (
              <div className="w-10 h-10 rounded-full border-2 border-gray-700 bg-gray-800 flex items-center justify-center">
                <Building2 className="w-5 h-5 text-blue-400" />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-full border-2 border-gray-700 bg-gray-800 flex items-center justify-center">
                <Building2 className="w-5 h-5 text-gray-500" />
              </div>
            )}
          </div>
          <div>
            <h3 className="text-white font-semibold text-lg">{anchor.clientName}</h3>
            <p className="text-gray-400 text-sm">{anchor?.chapter?.name}</p>
          </div>
        </div>

        {/* Status Badge */}
        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getAnchorStatusColor(anchor.status)}`}>
          {anchor.status}
        </span>
      </div>

      {/* Business Value */}
      <div className="flex items-center space-x-2 mb-4">
        <div className="p-2 bg-green-500/20 rounded-lg">
          <DollarSign className="w-4 h-4 text-green-400" />
        </div>
        <div>
          <p className="text-gray-400 text-sm">Business Value</p>
          <p className="text-white font-semibold">{formatCurrency(anchor.businessValue, anchor.currency)}</p>
        </div>
      </div>

      {/* Connection Info */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <User className="w-4 h-4 text-gray-400" />
            <span className="text-gray-400 text-sm">Giver</span>
            {giverInfo.type === 'external' && (
              <span className="px-1.5 py-0.5 bg-orange-500/20 text-orange-400 text-xs rounded border border-orange-500/30">
                External
              </span>
            )}
            {giverInfo.type === 'unknown' && (
              <span className="px-1.5 py-0.5 bg-gray-500/20 text-gray-400 text-xs rounded border border-gray-500/30">
                Unknown
              </span>
            )}
          </div>
          <div>
            <p className="text-white text-sm font-medium">{giverInfo.name}</p>
            <p className="text-gray-400 text-xs">{giverInfo.company}</p>
            {giverInfo.type === 'external' && giverInfo.email && (
              <p className="text-gray-500 text-xs">{giverInfo.email}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Building2 className="w-4 h-4 text-gray-400" />
            <span className="text-gray-400 text-sm">Receiver</span>
            {receiverInfo.type === 'external' && (
              <span className="px-1.5 py-0.5 bg-blue-500/20 text-blue-400 text-xs rounded border border-blue-500/30">
                External
              </span>
            )}
            {receiverInfo.type === 'unknown' && (
              <span className="px-1.5 py-0.5 bg-gray-500/20 text-gray-400 text-xs rounded border border-gray-500/30">
                Unknown
              </span>
            )}
          </div>
          <div>
            <p className="text-white text-sm font-medium">Classified</p>
          </div>
        </div>
      </div>

      {/* Dates */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 text-sm">
        <div className="flex items-center space-x-2">
          <Calendar className="hidden sm:block w-4 h-4 text-gray-400" />
          <span className="text-gray-400">Closed:</span>
          <span className="text-white">{formatDate(anchor.closedDate)}</span>
        </div>
        <div className="text-gray-400">Created: {formatDate(anchor.createdAt)}</div>
      </div>

      {/* Show details only if user is a participant (internal users only) */}
      {(session?.data?.user?.id === anchor.receiverId || session?.data?.user?.id === anchor.giverId) && (
        <div>
          {anchor.description && (
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-400 text-sm">Description</span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setIsDescriptionExpanded(!isDescriptionExpanded)
                  }}
                  className="text-blue-400 hover:text-blue-300 text-xs font-medium transition-colors"
                >
                  {isDescriptionExpanded ? 'Show Less' : 'Show More'}
                </button>
              </div>
              <motion.div
                initial={false}
                animate={{ height: isDescriptionExpanded ? 'auto' : '1.5rem' }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="overflow-hidden"
              >
                <p className="text-gray-300 text-sm leading-relaxed">{anchor.description}</p>
              </motion.div>
            </div>
          )}

          {anchor.notes && (
            <div className="bg-gray-900/50 rounded-lg p-3 border border-gray-600">
              <div className="flex items-center space-x-2 mb-2">
                <MapPin className="w-4 h-4 text-blue-400" />
                <span className="text-blue-400 text-sm font-medium">Notes</span>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">{anchor.notes}</p>
            </div>
          )}
        </div>
      )}

      {/* External participant info notice */}
      {(giverInfo.type === 'external' || receiverInfo.type === 'external') && (
        <div className="mt-3 p-3 bg-gray-900/30 border border-gray-600/50 rounded-lg">
          <div className="flex items-center space-x-2">
            <Globe className="w-4 h-4 text-yellow-400" />
            <span className="text-yellow-400 text-xs font-medium">This anchor involves external business contacts</span>
          </div>
        </div>
      )}
    </motion.div>
  )
}

export default AnchorCard
