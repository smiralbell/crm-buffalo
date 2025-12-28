import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  
  // Skip middleware for static files, API routes, and Next.js internals
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next()
  }

  const session = request.cookies.get('crm_session')
  const isAuthenticated = session?.value === 'authenticated'
  const isLoginPage = pathname === '/login'
  const isAppRoute = pathname.startsWith('/app')

  // If on login page and already authenticated, redirect to dashboard
  if (isLoginPage && isAuthenticated) {
    return NextResponse.redirect(new URL('/app/dashboard', request.url))
  }

  // If trying to access app routes without auth, redirect to login
  if (isAppRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // For root path and other paths, let Next.js handle them
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
