import { FC } from 'react'
import TooltipWrapper from '../../common/TooltipWrapper'
import { MoreHorizontal } from 'lucide-react'

const MemberEngagement: FC<{ buckets: any[] }> = ({ buckets }) => {
  return (
    <div className="mb-8">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-white font-semibold">Member Engagement</h3>
        <TooltipWrapper
          tooltip={`Engagement tracks individual user activity across all six possible actions: sending/receiving treasure maps, giving/receiving anchors, and requesting/receiving parleys. Each user's total actions are counted and converted to a percentage (with 3 total actions representing 100% engagement). Users are then grouped into engagement buckets ranging from highly engaged (90-100%) to low engagement (0-29%), providing a distribution view of community participation levels.`}
        >
          <MoreHorizontal className="text-gray-400 text-sm font-medium" />
        </TooltipWrapper>
      </div>
      <div className="space-y-3">
        {buckets?.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
              <span className="text-gray-300 text-sm">{item.range}</span>
            </div>
            <span className="text-white font-medium">{item.count}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MemberEngagement
