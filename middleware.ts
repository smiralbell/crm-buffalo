import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const url = request.url
  const method = request.method
  const headers = Object.fromEntries(request.headers.entries())
  
  console.log('========================================')
  console.log('[MIDDLEWARE] ===== NEW REQUEST =====')
  console.log('[MIDDLEWARE] Method:', method)
  console.log('[MIDDLEWARE] Pathname:', pathname)
  console.log('[MIDDLEWARE] Full URL:', url)
  console.log('[MIDDLEWARE] Host:', request.headers.get('host'))
  console.log('[MIDDLEWARE] User-Agent:', request.headers.get('user-agent'))
  console.log('[MIDDLEWARE] Referer:', request.headers.get('referer'))
  console.log('[MIDDLEWARE] X-Forwarded-For:', request.headers.get('x-forwarded-for'))
  console.log('[MIDDLEWARE] X-Forwarded-Proto:', request.headers.get('x-forwarded-proto'))
  console.log('[MIDDLEWARE] All headers:', JSON.stringify(headers, null, 2))
  
  // Get session cookie
  const session = request.cookies.get('crm_session')
  const allCookies = request.cookies.getAll()
  
  console.log('[MIDDLEWARE] Session cookie:', {
    hasCookie: !!session,
    cookieValue: session?.value,
    allCookies: allCookies.map(c => ({ name: c.name, value: c.value.substring(0, 20) + '...' })),
  })
  
  const isAuthenticated = session?.value === 'authenticated'
  console.log('[MIDDLEWARE] Is authenticated:', isAuthenticated)
  
  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    console.log('[MIDDLEWARE] ❌ NOT AUTHENTICATED - Redirecting to /login')
    const redirectUrl = new URL('/login', request.url)
    console.log('[MIDDLEWARE] Redirect URL:', redirectUrl.toString())
    const response = NextResponse.redirect(redirectUrl)
    // Set pathname header for layouts to use
    response.headers.set('x-pathname', '/login')
    return response
  }
  
  // If authenticated, allow request
  console.log('[MIDDLEWARE] ✅ AUTHENTICATED - Allowing request to proceed')
  const response = NextResponse.next()
  // CRITICAL: Set pathname header so AppLayout can verify route
  response.headers.set('x-pathname', pathname)
  console.log('[MIDDLEWARE] Set x-pathname header:', pathname)
  console.log('[MIDDLEWARE] Response status:', response.status)
  console.log('[MIDDLEWARE] ===== END REQUEST =====')
  console.log('========================================')
  return response
}

export const config = {
  // ONLY protect /app/* routes
  // Do NOT run for /, /login, or any other route
  matcher: ['/app/:path*'],
}
