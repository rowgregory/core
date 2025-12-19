import { FC } from 'react'
import { IParley } from '@/types/parley'
import { ArrowRight } from 'lucide-react'
import Picture from '../common/Picture'
import getInitials from '@/app/lib/utils/common/getInitials'

const ParticipantsWithDirectionArrow: FC<{ parley: IParley }> = ({ parley }) => {
  return (
    <div className="flex items-center gap-2 xs:gap-3 sm:gap-4">
      {/* Requester */}
      <div className="flex-1 min-w-0">
        <p className="text-[9px] xs:text-xs text-gray-500 uppercase tracking-wide mb-1 xs:mb-2">Requester</p>
        <div className="flex items-center gap-2 xs:gap-3">
          <div className="w-8 h-8 xs:w-9 xs:h-9 sm:w-10 sm:h-10 bg-linear-to-r from-teal-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-semibold text-xs xs:text-sm shrink-0">
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
            <p className="font-semibold text-white text-xs xs:text-sm truncate">{parley.requester.name}</p>
            <p className="text-[10px] xs:text-xs sm:text-sm text-gray-400 truncate">{parley.requester.company}</p>
            <p className="text-[9px] xs:text-xs text-gray-500 truncate">{parley.requester.industry}</p>
          </div>
        </div>
      </div>

      {/* Direction Arrow */}
      <div className="shrink-0">
        <ArrowRight className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6 text-gray-500" />
      </div>

      {/* Recipient */}
      <div className="flex-1 min-w-0">
        <p className="text-[9px] xs:text-xs text-gray-500 uppercase tracking-wide mb-1 xs:mb-2">Recipient</p>
        <div className="flex items-center gap-2 xs:gap-3">
          <div className="w-8 h-8 xs:w-9 xs:h-9 sm:w-10 sm:h-10 bg-linear-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-xs xs:text-sm shrink-0">
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
            <p className="font-semibold text-white text-xs xs:text-sm truncate">{parley.recipient.name}</p>
            <p className="text-[10px] xs:text-xs sm:text-sm text-gray-400 truncate">{parley.recipient.company}</p>
            <p className="text-[9px] xs:text-xs text-gray-500 truncate">{parley.recipient.industry}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ParticipantsWithDirectionArrow
