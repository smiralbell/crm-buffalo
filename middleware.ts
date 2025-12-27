import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const session = request.cookies.get('crm_session')
  const isAuthenticated = session?.value === 'authenticated'
  const isLoginPage = request.nextUrl.pathname === '/login'
  const isAppRoute = request.nextUrl.pathname.startsWith('/app')

  if (isLoginPage && isAuthenticated) {
    return NextResponse.redirect(new URL('/app/dashboard', request.url))
  }

  if (isAppRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/app/:path*', '/login'],
}

