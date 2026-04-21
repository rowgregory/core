import { NextRequest, NextResponse } from 'next/server'
import { auth } from './app/lib/auth'

const publicRoutes = ['/auth/login']
const protectedAPIRoutes = ['/api/pdf/member-directory']

export async function proxy(req: NextRequest) {
  const { nextUrl } = req

  // ── Skip middleware for static assets + cron ──────────────────────────────
  if (
    nextUrl.pathname.startsWith('/api/cron/') ||
    nextUrl.pathname.startsWith('/_next') ||
    nextUrl.pathname.includes('.') ||
    nextUrl.pathname.startsWith('/icon') ||
    nextUrl.pathname.startsWith('/api/placeholder')
  ) {
    return NextResponse.next()
  }

  const session = await auth()
  const isLoggedIn = !!session?.user

  const isPublicRoute = publicRoutes.includes(nextUrl.pathname)
  const isProtectedPage = nextUrl.pathname.startsWith('/dashboard') || nextUrl.pathname.startsWith('/super')
  const isSuperUserRoute = nextUrl.pathname.startsWith('/super')

  // ── Logged-in user hitting a public route → redirect to their home ────────
  if (isLoggedIn && isPublicRoute) {
    if (nextUrl.pathname === '/auth/login') {
      const dest = session.user.isSuperUser ? '/super' : '/dashboard'
      return NextResponse.redirect(new URL(dest, nextUrl))
    }
    return NextResponse.next()
  }

  // ── Protected page → send to login ───────────────────────────────────────
  if (isProtectedPage && !isLoggedIn) {
    const loginUrl = new URL('/auth/login', nextUrl)
    loginUrl.searchParams.set('callbackUrl', nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }

  // ── Non-superuser hitting /super → back to dashboard ────────────────────
  if (isLoggedIn && isSuperUserRoute && !session.user.isSuperUser) {
    return NextResponse.redirect(new URL('/dashboard', nextUrl))
  }

  // ── Protected API routes → 401 if not logged in ───────────────────────────
  if (protectedAPIRoutes.some((r) => nextUrl.pathname.startsWith(r)) && !isLoggedIn) {
    const signInUrl = new URL('/auth/login', req.url)
    return NextResponse.redirect(signInUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|icon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)']
}
