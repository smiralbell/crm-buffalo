import React from 'react'
import { Sidebar } from '@/components/sidebar'
import { requireAuth } from '@/lib/auth'

// Force dynamic rendering - this layout uses auth which requires runtime data
export const dynamic = 'force-dynamic'

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // This layout is ONLY for /app/* routes
  // In Next.js App Router, layouts in app/app/ should only apply to /app/* routes
  // But if it's being applied incorrectly, we have a safety check below
  
  console.log('[APP_LAYOUT] AppLayout rendering')
  console.log('[APP_LAYOUT] This layout should ONLY be for /app/* routes')
  
  // Safety check: Try to get pathname from headers (set by middleware)
  // If we can't get it or it's not /app/*, we should not execute auth
  let shouldExecuteAuth = true
  
  try {
    const { headers } = await import('next/headers')
    const headersList = await headers()
    const pathname = headersList.get('x-pathname') || ''
    
    console.log('[APP_LAYOUT] Pathname from middleware:', pathname)
    
    // Only execute auth if we're 100% certain we're on /app/* route
    const isAppRoute = pathname && pathname.startsWith('/app') && pathname.length > 4
    
    if (!isAppRoute) {
      console.log('[APP_LAYOUT] BLOCKED: Not a valid /app/* route. Pathname:', pathname || '(empty)')
      console.log('[APP_LAYOUT] Returning children directly without auth check to prevent loop')
      shouldExecuteAuth = false
    } else {
      console.log('[APP_LAYOUT] CONFIRMED: Valid /app/* route:', pathname)
    }
  } catch (error) {
    // If we can't read headers, be safe and don't execute auth
    console.log('[APP_LAYOUT] Could not read headers, skipping auth check to be safe')
    shouldExecuteAuth = false
  }
  
  // Only execute auth if we're certain we're on /app/* route
  if (shouldExecuteAuth) {
    try {
      console.log('[APP_LAYOUT] Proceeding with authentication check...')
      await requireAuth()
      console.log('[APP_LAYOUT] Authentication check passed, rendering layout')
    } catch (error) {
      console.error('[APP_LAYOUT] Authentication check failed:', error)
      // If auth fails, return children without layout to prevent loop
      return <>{children}</>
    }
  } else {
    // Return children directly without layout wrapper
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
