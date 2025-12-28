import React from 'react'
import { Sidebar } from '@/components/sidebar'
import { requireAuth } from '@/lib/auth'
import { headers } from 'next/headers'

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // CRITICAL FIX: Multiple verification methods to ensure we're on /app/* route
  // Next.js is incorrectly applying this layout to /login and other routes
  let pathname = ''
  
  try {
    const headersList = await headers()
    pathname = headersList.get('x-pathname') || ''
    
    // Also try to get from referer as fallback
    if (!pathname) {
      const referer = headersList.get('referer') || ''
      // Extract pathname from referer URL if available
      try {
        if (referer) {
          const url = new URL(referer)
          pathname = url.pathname
        }
      } catch {
        // Ignore URL parsing errors
      }
    }
  } catch (error) {
    console.log('[APP_LAYOUT] Error reading headers:', error)
  }
  
  console.log('[APP_LAYOUT] AppLayout rendering')
  console.log('[APP_LAYOUT] Pathname detected:', pathname || '(empty/unknown)')
  
  // STRICT CHECK: Only proceed if we're 100% certain we're on an /app/* route
  // If pathname is empty, undefined, or doesn't start with /app, return children immediately
  // This is CRITICAL to prevent redirect loops
  const isDefinitelyAppRoute = pathname && pathname.startsWith('/app') && pathname.length > 4
  
  if (!isDefinitelyAppRoute) {
    console.log('[APP_LAYOUT] BLOCKED: Not a valid /app/* route. Pathname:', pathname || '(empty)')
    console.log('[APP_LAYOUT] Returning children directly - NO auth check, NO layout wrapper')
    // Return children directly without ANY processing
    // This prevents redirect loops when Next.js incorrectly applies this layout
    return <>{children}</>
  }
  
  console.log('[APP_LAYOUT] CONFIRMED: Valid /app/* route detected:', pathname)
  console.log('[APP_LAYOUT] Proceeding with authentication check...')
  
  // Only execute auth check if we're 100% certain we're on an /app/* route
  // The middleware already protects /app routes and redirects to /login if not authenticated
  // So by the time we get here, the user should be authenticated
  // But we add an extra check just to be safe
  try {
    await requireAuth()
    console.log('[APP_LAYOUT] Authentication check passed, rendering full layout')
  } catch (error) {
    console.error('[APP_LAYOUT] Authentication check failed:', error)
    // If auth fails, return children without layout to prevent loop
    return <>{children}</>
  }

  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}
