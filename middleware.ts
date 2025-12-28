import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const url = request.url
  const method = request.method
  
  console.log('[MIDDLEWARE] Request:', { pathname, url, method })
  
  // Skip middleware for static files and API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.') ||
    pathname === '/favicon.ico'
  ) {
    console.log('[MIDDLEWARE] Skipping static/API route:', pathname)
    return NextResponse.next()
  }

  const session = request.cookies.get('crm_session')
  const sessionValue = session?.value
  const isAuthenticated = sessionValue === 'authenticated'
  const isLoginPage = pathname === '/login'
  const isAppRoute = pathname.startsWith('/app')
  const isRoot = pathname === '/'

  console.log('[MIDDLEWARE] Session check:', {
    hasCookie: !!session,
    cookieValue: sessionValue,
    isAuthenticated,
    isLoginPage,
    isAppRoute,
    isRoot,
  })

  // If on login page and already authenticated, redirect to dashboard
  if (isLoginPage && isAuthenticated) {
    console.log('[MIDDLEWARE] Redirecting authenticated user from /login to /app/dashboard')
    return NextResponse.redirect(new URL('/app/dashboard', request.url))
  }

  // If trying to access app routes without auth, redirect to login
  if (isAppRoute && !isAuthenticated) {
    console.log('[MIDDLEWARE] Redirecting unauthenticated user from', pathname, 'to /login')
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // For root path and other paths, let Next.js handle them
  console.log('[MIDDLEWARE] Allowing request to proceed:', pathname)
  
  // Add pathname to headers so layouts can access it if needed
  const response = NextResponse.next()
  response.headers.set('x-pathname', pathname)
  
  return response
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
