const getApplicationStatusColor: any = (status: string) => {
  switch (status) {
    case 'FLAGGED':
      return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20'
    case 'PENDING':
      return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20'

    case 'INITIAL_REVIEW':
      return 'text-blue-400 bg-blue-400/10 border-blue-400/20'

    case 'BACKGROUND_CHECK':
      return 'text-indigo-400 bg-indigo-400/10 border-indigo-400/20'

    case 'REJECTED':
      return 'text-red-500 bg-red-500/10 border-red-500/20'

    case 'ACTIVE':
      return 'text-green-400 bg-green-400/10 border-green-400/20'
    case 'INACTIVE':
      return 'text-gray-400 bg-gray-400/10 border-gray-400/20'
    case 'SUSPENDED':
      return 'text-orange-400 bg-orange-400/10 border-orange-400/20'
    case 'EXPIRED':
      return 'text-red-400 bg-red-400/10 border-red-400/20'
    case 'CANCELLED':
      return 'text-red-500 bg-red-500/10 border-red-500/20'
    default:
      return 'text-gray-400 bg-gray-400/10 border-gray-400/20'
  }
}

export default getApplicationStatusColor
