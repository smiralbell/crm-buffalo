import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const session = request.cookies.get('crm_session')
  const isAuthenticated = session?.value === 'authenticated'
  const pathname = request.nextUrl.pathname
  const isLoginPage = pathname === '/login'
  const isAppRoute = pathname.startsWith('/app')
  const isRoot = pathname === '/'

  // Don't process root path in middleware - let app/page.tsx handle it
  if (isRoot) {
    return NextResponse.next()
  }

  // If on login page and already authenticated, redirect to dashboard
  if (isLoginPage && isAuthenticated) {
    // Use the same origin to avoid redirect loops
    const dashboardUrl = new URL('/app/dashboard', request.url)
    return NextResponse.redirect(dashboardUrl)
  }

  // If trying to access app routes without auth, redirect to login
  if (isAppRoute && !isAuthenticated) {
    // Use the same origin to avoid redirect loops
    const loginUrl = new URL('/login', request.url)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/app/:path*', '/login'],
}

