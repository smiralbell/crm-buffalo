import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const session = request.cookies.get('crm_session')
  const isAuthenticated = session?.value === 'authenticated'
  const pathname = request.nextUrl.pathname
  const isLoginPage = pathname === '/login'
  const isAppRoute = pathname.startsWith('/app')

  if (isLoginPage && isAuthenticated) {
    const url = new URL('/app/dashboard', request.url)
    return NextResponse.redirect(url)
  }

  if (isAppRoute && !isAuthenticated) {
    const url = new URL('/login', request.url)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/app/:path*', '/login'],
}

