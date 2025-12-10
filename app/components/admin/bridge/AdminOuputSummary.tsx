import React, { FC } from 'react'

const AdminOuputSummary: FC<{
  activeMembers: number
  totalRevenue: number
  newApplicationsCount: number
  parleyRequestsCount: number
}> = ({ activeMembers, totalRevenue, newApplicationsCount, parleyRequestsCount }) => {
  return (
    <div className="bg-gray-800/40 border border-gray-700/50 rounded-xl p-4">
      <h4 className="text-white font-semibold mb-3">Output</h4>
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-gray-400 text-sm">Active Members</span>
          <span className="text-white">{activeMembers} members</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-400 text-sm">Total Revenue</span>
          <span className="text-green-400 font-medium">${Number(totalRevenue)?.toLocaleString()}</span>
        </div>
      </div>

      <h4 className="text-white font-semibold mb-3 mt-6">Input</h4>
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-gray-400 text-sm">New Applications</span>
          <span className="text-white">{newApplicationsCount} pending</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-400 text-sm">Meeting Requests</span>
          <span className="text-white">{parleyRequestsCount} requests</span>
        </div>
      </div>
    </div>
  )
}

export default AdminOuputSummary
