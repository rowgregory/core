import { User } from '@/types/user'

const navigatorStatusOptions = (users: User[]) => [
  { value: 'all', label: 'All Navigators', count: users?.length },
  { value: 'ACTIVE', label: 'Active', count: users?.filter((m) => m.membershipStatus === 'ACTIVE').length },
  { value: 'FLAGGED', label: 'Flagged', count: users?.filter((m) => m.membershipStatus === 'FLAGGED').length },
  { value: 'PENDING', label: 'Pending', count: users?.filter((m) => m.membershipStatus === 'PENDING').length },
  { value: 'EXPIRED', label: 'Expired', count: users?.filter((m) => m.membershipStatus === 'EXPIRED').length },
  {
    value: 'INACTIVE',
    label: 'Inactive',
    count: users?.filter((m) => m.membershipStatus === 'INACTIVE').length
  },
  {
    value: 'REJECTED',
    label: 'Rejected',
    count: users?.filter((m) => m.membershipStatus === 'REJECTED').length
  },
  {
    value: 'SUSPENDED',
    label: 'Suspended',
    count: users?.filter((m) => m.membershipStatus === 'SUSPENDED').length
  }
]

export default navigatorStatusOptions
