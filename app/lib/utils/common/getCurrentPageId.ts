const getCurrentPageId = (path: string, links: any) => {
  const pathSegments = path.split('/').filter(Boolean)
  const lastSegment = pathSegments[pathSegments.length - 1]

  // Handle special cases for multi-word routes
  if (path.includes('/treasure-maps')) return 'treasure-maps'

  // Find matching navigation item
  const matchingItem = links?.find((item: any) => item.linkKey === path || item.id === lastSegment)

  return matchingItem?.id || 'dashboard'
}

export default getCurrentPageId
