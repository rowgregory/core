import { IParley } from '@/types/parley'
import { ArrowRight } from 'lucide-react'
import React, { FC } from 'react'
import Picture from '../common/Picture'
import getInitials from '@/app/lib/utils/common/getInitials'

const ParticipantsWithDirectionArrow: FC<{ parley: IParley }> = ({ parley }) => {
  return (
    <div className="flex items-center space-x-4">
      {/* Requester */}
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Requester</p>
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-linear-to-r from-teal-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
            {parley.requester.profileImage ? (
              <Picture
                src={parley.requester.profileImage}
                className="w-full h-full rounded-full object-cover"
                priority={false}
              />
            ) : (
              getInitials(parley.requester.name)
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-white truncate">{parley.requester.name}</p>
            <p className="text-sm text-gray-400 truncate">{parley.requester.company}</p>
            <p className="text-xs text-gray-500">{parley.requester.industry}</p>
          </div>
        </div>
      </div>

      {/* Direction Arrow */}
      <div className="flex-shrink-0">
        <ArrowRight className="w-6 h-6 text-gray-500" />
      </div>

      {/* Recipient */}
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Recipient</p>
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-linear-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
            {parley.recipient.profileImage ? (
              <Picture
                src={parley.recipient.profileImage}
                className="w-full h-full rounded-full object-cover"
                priority={false}
              />
            ) : (
              getInitials(parley.recipient.name)
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-white truncate">{parley.recipient.name}</p>
            <p className="text-sm text-gray-400 truncate">{parley.recipient.company}</p>
            <p className="text-xs text-gray-500">{parley.recipient.industry}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ParticipantsWithDirectionArrow
