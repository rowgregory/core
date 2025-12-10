import { NextRequest, NextResponse } from 'next/server'
import { auth } from './app/lib/auth'

// Routes that bypass authentication
const publicRoutes = ['/auth/login', '/auth/callback']

const protectedAPIRoutes = [
  // Anchor routes
  '/api/anchor/[chapterId]/get-anchors-list',
  '/api/anchor/[chapterId]/[userId]/create-anchor',
  '/api/anchor/[chapterId]/[userId]/get-my-anchors',
  '/api/anchor/[chapterId]/[userId]/update-anchor',

  // Grog routes (assuming events/meetings)
  '/api/grog/[chapterId]/get-grogslist',
  '/api/grog/[chapterId]/[userId]/create-grog',
  '/api/grog/[chapterId]/[userId]/update-grog',
  '/api/grog/[chapterId]/[userId]/update-grog-status',

  // Parley routes (assuming discussions/forums)
  '/api/parley/[chapterId]',
  '/api/parley/[chapterId]/create',
  '/api/parley/[chapterId]/[userId]/[parleyId]/delete-parley',
  '/api/parley/[chapterId]/[userId]/update',
  '/api/parley/[chapterId]/[userId]/update-status',

  // Rendezvous routes (assuming appointments/meetings)
  '/api/rendezvous/[chapterId]/create-rendezvous',
  '/api/rendezvous/[chapterId]/fetch-rendezvous-list',
  '/api/rendezvous/[chapterId]/update-rendezvous',

  // Settings routes
  '/api/settings/[chapterId]',

  // Treasure Map routes (assuming analytics/reporting)
  '/api/treasure-map/[chapterId]/get-treasure-maps-list',
  '/api/treasure-map/[chapterId]/[userId]/create-treasure-map',
  '/api/treasure-map/[chapterId]/[userId]/get-my-treasure-maps',
  '/api/treasure-map/[chapterId]/[userId]/update-treasure-map',
  '/api/treasure-map/[chapterId]/[userId]/update-treasure-map-status',

  // User routes
  '/api/user/[chapterId]/create-user',
  '/api/user/[chapterId]/reports/generate-member-metrics',
  '/api/user/[chapterId]/stowaway/update',
  '/api/user/[chapterId]/[userId]/get-user-by-id',
  '/api/user/[chapterId]/[userId]/me/get-my-profile',
  '/api/user/[chapterId]/[userId]/me/update-my-profile',
  '/api/user/[chapterId]/[userId]/update-user',
  '/api/user/[chapterId]/[userId]/update-user-status'
]

const cronRoutes = ['/api/cron/weekly-reminder-email']

export async function middleware(req: NextRequest) {
  const { nextUrl } = req

  // Skip middleware for static files and Next.js internals only
  if (
    cronRoutes.includes(nextUrl.pathname) ||
    nextUrl.pathname.startsWith('/_next') ||
    nextUrl.pathname.includes('.') ||
    nextUrl.pathname.startsWith('/icon') ||
    nextUrl.pathname.startsWith('/api/placeholder')
  ) {
    return NextResponse.next()
  }

  const session = await auth()
  const isLoggedIn = !!session?.user

  // Set up request headers
  const requestHeaders = new Headers(req.headers)
  requestHeaders.set('x-pathname', nextUrl.pathname)
  if (session?.user) {
    const userData = {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name,
      role: session.user.role,
      isAdmin: session.user.isAdmin,
      isSuperUser: session.user.isSuperUser
    }
    requestHeaders.set('x-user', JSON.stringify(userData))
  }

  const isPublicRoute = publicRoutes.includes(nextUrl.pathname)
  const isAuthAPIRoute = nextUrl.pathname.startsWith('/api/auth')

  // Helper function to check if path matches any protected route pattern
  const isProtectedAPIRoute =
    !isAuthAPIRoute &&
    protectedAPIRoutes.some((route) => {
      // Convert route pattern to regex (replace [param] with wildcard)
      const pattern = route.replace(/\[[\w-]+\]/g, '[^/]+')
      const regex = new RegExp(`^${pattern}$`)
      return regex.test(nextUrl.pathname)
    })

  const isProtectedPageRoute = nextUrl.pathname.startsWith('/member') || nextUrl.pathname.startsWith('/admin')
  const isAdminRoute = nextUrl.pathname.startsWith('/admin')

  // Handle page route redirects for logged in users
  if (isLoggedIn && isPublicRoute) {
    // Only redirect from login page, not from custom callback
    if (nextUrl.pathname === '/auth/login') {
      const role = session.user.role
      const isAdmin = session.user.isAdmin
      const isSuperUser = session.user.isSuperUser

      if (role === 'admin' || isAdmin || isSuperUser) {
        return NextResponse.redirect(new URL('/admin/bridge', nextUrl))
      }

      return NextResponse.redirect(new URL('/member/bridge', nextUrl))
    }

    // Let custom callback handle its own routing
    return NextResponse.next({
      request: {
        headers: requestHeaders
      }
    })
  }

  // Protect API routes - require authentication
  if (isProtectedAPIRoute && !isLoggedIn) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Protect page routes - redirect to login
  if (isProtectedPageRoute && !isLoggedIn) {
    const loginUrl = new URL('/auth/login', nextUrl)
    loginUrl.searchParams.set('callbackUrl', nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Block MEMBER role from accessing admin routes
  if (isLoggedIn && isAdminRoute && session.user.role === 'MEMBER') {
    return NextResponse.redirect(new URL('/member/bridge', nextUrl))
  }

  // Continue with headers for all routes
  return NextResponse.next({
    request: {
      headers: requestHeaders
    }
  })
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|icon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)']
}
