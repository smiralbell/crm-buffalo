import React from 'react'
import { Sidebar } from '@/components/sidebar'
import { requireAuth } from '@/lib/auth'
import { headers } from 'next/headers'

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // CRITICAL FIX: Check if we're actually on an /app/* route
  // This layout should ONLY apply to /app/* routes, but Next.js seems to be applying it incorrectly
  const headersList = await headers()
  const pathname = headersList.get('x-pathname') || ''
  
  console.log('[APP_LAYOUT] AppLayout rendering')
  console.log('[APP_LAYOUT] Pathname from headers:', pathname)
  
  // SAFETY CHECK: Only process if we're on an /app/* route
  // If pathname is empty, undefined, or doesn't start with /app, return children immediately
  const isAppRoute = pathname && pathname.startsWith('/app')
  
  if (!isAppRoute) {
    console.log('[APP_LAYOUT] WARNING: Layout applied to non-/app route:', pathname || '(empty)')
    console.log('[APP_LAYOUT] Returning children directly without any processing to prevent loop')
    // Return children directly without ANY processing - no auth check, no layout wrapper
    // This prevents the redirect loop when Next.js incorrectly applies this layout
    return <>{children}</>
  }
  
  console.log('[APP_LAYOUT] Confirmed /app route, proceeding with auth check')
  
  // This layout is ONLY for /app/* routes
  // The middleware already protects /app routes and redirects to /login if not authenticated
  // So by the time we get here, the user should be authenticated
  // But we add an extra check just to be safe
  console.log('[APP_LAYOUT] Calling requireAuth...')
  await requireAuth()
  console.log('[APP_LAYOUT] requireAuth passed, rendering layout')

  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}
