import { User } from '@/types/user'

const getApplicationStatusOptions = (applications: User[]) => [
  { value: 'all', label: 'All Status', count: applications?.length },
  { value: 'PENDING', label: 'Pending', count: applications?.filter((a) => a.membershipStatus === 'PENDING').length },
  {
    value: 'INITIAL_REVIEW',
    label: 'Initial Review',
    count: applications?.filter((a) => a.membershipStatus === 'INITIAL_REVIEW').length
  },
  {
    value: 'BACKGROUND_CHECK',
    label: 'Background Check',
    count: applications?.filter((a) => a.membershipStatus === 'BACKGROUND_CHECK').length
  },
  {
    value: 'REJECTED',
    label: 'Rejected',
    count: applications?.filter((a) => a.membershipStatus === 'REJECTED').length
  }
]

export default getApplicationStatusOptions
