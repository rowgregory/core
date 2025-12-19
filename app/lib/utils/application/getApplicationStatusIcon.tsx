import {
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Pause,
  Ban,
  Flag,
  Hourglass,
  BanIcon,
  FileSearch
} from 'lucide-react'

const getApplicationStatusIcon: any = (status: string) => {
  switch (status) {
    case 'FLAGGED':
      return <Flag className="w-4 h-4" />
    case 'INITIAL_REVIEW':
      return <Hourglass className="w-4 h-4" />
    case 'BACKGROUND_CHECK':
      return <FileSearch className="w-4 h-4" />
    case 'REJECTED':
      return <BanIcon className="w-4 h-4" />
    case 'PENDING':
      return <Clock className="w-4 h-4" />
    case 'ACTIVE':
      return <CheckCircle className="w-4 h-4" />
    case 'INACTIVE':
      return <Pause className="w-4 h-4" />
    case 'SUSPENDED':
      return <AlertCircle className="w-4 h-4" />
    case 'EXPIRED':
      return <XCircle className="w-4 h-4" />
    case 'CANCELLED':
      return <Ban className="w-4 h-4" />
    default:
      return <AlertCircle className="w-4 h-4" />
  }
}

export default getApplicationStatusIcon
