import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  
  // Get session cookie
  const session = request.cookies.get('crm_session')
  const isAuthenticated = session?.value === 'authenticated'
  
  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  
  // If authenticated, allow request
  return NextResponse.next()
}

export const config = {
  // ONLY protect /app/* routes
  // Do NOT run for /, /login, or any other route
  matcher: ['/app/:path*'],
}
