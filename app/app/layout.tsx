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
  console.log('[APP_LAYOUT] This layout should ONLY be for /app/* routes')
  
  // SAFETY CHECK: If we're not on an /app/* route, return children immediately
  // This prevents the redirect loop when Next.js incorrectly applies this layout to /login or /
  // We check: if pathname exists AND it doesn't start with /app, then skip everything
  const isAppRoute = pathname.startsWith('/app')
  
  if (pathname && !isAppRoute) {
    console.log('[APP_LAYOUT] WARNING: Layout applied to non-/app route:', pathname)
    console.log('[APP_LAYOUT] Returning children directly without any processing to prevent loop')
    // Return children directly without ANY processing - no auth check, no layout wrapper
    return <>{children}</>
  }
  
  // Only execute auth check if we're actually on an /app/* route
  // If pathname is empty or undefined, we also skip (shouldn't happen, but safety first)
  if (!isAppRoute) {
    console.log('[APP_LAYOUT] Pathname empty or not /app route, returning children directly')
    return <>{children}</>
  }
  
  // This layout is ONLY for /app/* routes
  // The middleware already protects /app routes and redirects to /login if not authenticated
  // So by the time we get here, the user should be authenticated
  // But we add an extra check just to be safe
  console.log('[APP_LAYOUT] Confirmed /app route, calling requireAuth...')
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
