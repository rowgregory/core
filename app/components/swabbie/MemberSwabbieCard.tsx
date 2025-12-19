import { FC } from 'react'
import { User as IUser } from '@/types/user'
import { statusIcons } from './SwabbieCard'
import Link from 'next/link'
import { Mail, Phone, MapPin, Building2, Briefcase, Calendar, Sailboat } from 'lucide-react'
import { motion } from 'framer-motion'
import { formatDate } from '@/app/lib/utils/date/formatDate'
import getApplicationStatusColor from '@/app/lib/utils/application/getApplicationStatusColor'

const MemberSwabbieCard: FC<{ swabbie: IUser; index: number }> = ({ swabbie, index }) => {
  const StatusIcon: any = statusIcons[swabbie.membershipStatus]
  const isRejected = swabbie.membershipStatus === 'SUSPENDED' || swabbie.membershipStatus === 'CANCELLED'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 * index, ease: 'easeInOut' }}
      className={`backdrop-blur-md rounded-xl border p-6 transition-all duration-300 shadow-lg ${
        isRejected
          ? 'bg-red-900/20 border-red-600/30 hover:border-red-400/50 shadow-red-900/50'
          : 'bg-gray-800/50 border-gray-700/30 hover:border-cyan-400/50 shadow-gray-900/50'
      }`}
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
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium border flex items-center gap-1 ${getApplicationStatusColor(swabbie.membershipStatus)}`}
          >
            <StatusIcon className="h-3 w-3" />
            {swabbie.membershipStatus}
          </span>
        </div>
      </div>

      <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 ${isRejected ? 'opacity-75' : ''}`}>
        <div className="space-y-2">
          <div className="flex items-center text-sm text-gray-300">
            <Mail className="h-4 w-4 mr-2 text-gray-400" />
            {swabbie.email}
          </div>
          <div className="flex items-center text-sm text-gray-300">
            <Phone className="h-4 w-4 mr-2 text-gray-400" />
            {swabbie.phone}
          </div>
          <div className="flex items-center text-sm text-gray-300">
            <MapPin className="h-4 w-4 mr-2 text-gray-400" />
            {swabbie.location}
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center text-sm text-gray-300">
            <Building2 className="h-4 w-4 mr-2 text-gray-400" />
            {swabbie.company}
          </div>
          <div className="flex items-center text-sm text-gray-300">
            <Briefcase className="h-4 w-4 mr-2 text-gray-400" />
            {swabbie.industry}
          </div>
          <div className="flex items-center text-sm text-gray-300">
            <Calendar className="h-4 w-4 mr-2 text-gray-400" />
            Joined {formatDate(swabbie.createdAt)}
          </div>
        </div>
      </div>

      <div className={`mb-4 ${isRejected ? 'opacity-75' : ''}`}>
        <div className="text-xs text-gray-400 mb-2">Specialties</div>
        <div className="flex flex-wrap gap-1">
          {swabbie?.specialties?.map((specialty: string, index: number) => (
            <span
              key={index}
              className={`px-2 py-1 text-xs rounded-full border ${
                isRejected
                  ? 'bg-red-900/20 text-red-300 border-red-600/30'
                  : 'bg-cyan-900/20 text-cyan-300 border-cyan-600/30'
              }`}
            >
              {specialty}
            </span>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between py-4 border-y border-gray-600/30 mb-5">
        <div className="flex items-center space-x-2">
          <div className={`h-2 w-2 rounded-full ${swabbie.isLicensed ? 'bg-emerald-400' : 'bg-gray-400'}`} />
          <span className="text-xs text-gray-300">
            {swabbie.businessLicenseNumber ? `Licensed (${swabbie.businessLicenseNumber})` : 'No License'}
          </span>
        </div>
      </div>

      <Link
        href={`/swabbie/port?swabbieId=${swabbie.id}`}
        className="px-4 py-2 text-xs text-blue-400 border border-blue-500/30 rounded hover:bg-blue-600/10 transition-colors duration-200"
      >
        <span>Visit {swabbie.name}&apos;s Dockside Dashboard</span>
      </Link>
    </motion.div>
  )
}

export default MemberSwabbieCard
