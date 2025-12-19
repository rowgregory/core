import { IParley } from '@/types/parley'
import { FC } from 'react'
import { useSession } from 'next-auth/react'
import { ArrowDown } from 'lucide-react'
import getParleyStatusColor from '@/app/lib/utils/parley/getParleyStatusColor'
import getParleyStatusIcon from '@/app/lib/utils/parley/getParleyStatusIcon'
import getParleyMeetingIconType from '@/app/lib/utils/parley/getParleyMeetingIconType'

const Header: FC<{ parley: IParley }> = ({ parley }) => {
  const session = useSession()
  const isIncomingRequest = parley.recipientId === session.data?.user?.id && parley.status === 'REQUESTED'

  return (
    <div className="space-y-4 w-full">
      {/* Incoming Request Banner */}
      {isIncomingRequest && (
        <div className="flex items-center space-x-2 px-3 py-2 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
          <ArrowDown className="w-4 h-4 text-cyan-400" />
          <span className="text-cyan-300 text-sm font-medium">{parley.requester.name} wants to meet with you</span>
        </div>
      )}

      {/* Main Header with Large Icon */}
      <div className="flex justify-between w-full">
        {/* Large Meeting Type Icon */}
        <div className="flex items-center space-x-4">
          <div className="w-fit">
            <div className="w-12 h-12 flex items-center justify-center bg-gray-800/50 border border-gray-600 rounded-xl">
              <div className="w-8 h-8">{getParleyMeetingIconType(parley.meetingType).icon}</div>
            </div>
          </div>

          {/* Meeting Info */}
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              <div
                className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center space-x-1 ${getParleyStatusColor(parley.status)}`}
              >
                {getParleyStatusIcon(parley.status)}
                <span>{parley.status?.toLowerCase()}</span>
              </div>

              <div className="flex items-center space-x-2 text-gray-400 text-sm">
                <span className="font-medium">{getParleyMeetingIconType(parley.meetingType).text}</span>
                <span>•</span>
                <span>{parley.duration} min</span>
              </div>
            </div>

            {/* Small Description */}

            <p className="text-xs text-gray-500 line-clamp-1">{getParleyMeetingIconType(parley.meetingType).desc}</p>
          </div>
        </div>
        {/* Date */}
        <div className="shrink-0 text-xs text-gray-500">{new Date(parley.createdAt).toLocaleDateString()}</div>
      </div>
    </div>
  )
}

export default Header
