import React, { FC } from 'react'
import Picture from '../common/Picture'
import { ChevronRight } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface INavigatorCard {
  navigator: any
  setExpandedMember: (expandedMember: any) => void
  expandedMember: any
}

const NavigatorCard: FC<INavigatorCard> = ({ navigator }) => {
  const { push } = useRouter()

  return (
    <div
      onClick={() => push(`/navigators/${navigator.id}`)}
      className="bg-slate-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-700 cursor-pointer group"
    >
      {/* Member Image */}
      <div className="h-[400px] bg-linear-to-br from-blue-500 to-teal-500 relative overflow-hidden">
        <Picture
          priority={true}
          src={navigator?.profileImage}
          alt={navigator?.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent" />
        {navigator?.yearsInBusiness && (
          <div className="absolute bottom-4 left-4">
            <div className="bg-white/90 px-3 py-1 rounded-full text-sm font-medium text-slate-900">
              {navigator.yearsInBusiness} years experience
            </div>
          </div>
        )}
      </div>

      {/* Member Info */}
      <div className="p-6">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
            {navigator?.name}
          </h3>
          <p className="text-gray-300 text-lg">{navigator?.company}</p>
        </div>

        {/* View Profile CTA */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-700">
          <span className="text-blue-400 font-medium text-sm group-hover:text-blue-300 transition-colors">
            View Full Profile
          </span>
          <ChevronRight className="w-5 h-5 text-blue-400 group-hover:text-blue-300 group-hover:translate-x-1 transition-all" />
        </div>
      </div>
    </div>
  )
}

export default NavigatorCard
