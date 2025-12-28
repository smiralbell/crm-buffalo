import React from 'react'
import { Sidebar } from '@/components/sidebar'
import { requireAuth } from '@/lib/auth'
import { headers } from 'next/headers'

// Force dynamic rendering - this layout uses auth which requires runtime data
export const dynamic = 'force-dynamic'

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // CRITICAL: This layout should ONLY be for /app/* routes
  // But Next.js seems to be applying it incorrectly to /login
  // We need to detect this and prevent auth check
  
  let pathname = ''
  try {
    const headersList = await headers()
    // Get pathname from the header we set in middleware
    pathname = headersList.get('x-pathname') || ''
  } catch (error) {
    // If headers() fails, we're probably in build time or static generation
    // In that case, just return children to be safe
    console.log('[APP_LAYOUT] Could not read headers, returning children safely')
    return <>{children}</>
  }
  
  console.log('[APP_LAYOUT] AppLayout rendering')
  console.log('[APP_LAYOUT] Pathname from middleware:', pathname)
  
  // STRICT CHECK: Only execute auth if we're 100% certain we're on /app/* route
  // If pathname is empty, /login, /, or anything not starting with /app, skip auth
  const isAppRoute = pathname && pathname.startsWith('/app') && pathname.length > 4
  
  if (!isAppRoute) {
    console.log('[APP_LAYOUT] BLOCKED: Not a valid /app/* route. Pathname:', pathname || '(empty)')
    console.log('[APP_LAYOUT] Returning children directly without auth check to prevent loop')
    // Return children directly - NO auth check, NO layout wrapper
    // This prevents the redirect loop
    return <>{children}</>
  }
  
  console.log('[APP_LAYOUT] CONFIRMED: Valid /app/* route:', pathname)
  console.log('[APP_LAYOUT] Proceeding with authentication check...')
  
  // Only execute auth check if we're 100% certain we're on /app/* route
  try {
    await requireAuth()
    console.log('[APP_LAYOUT] Authentication check passed, rendering layout')
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
