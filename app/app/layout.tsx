import React from 'react'
import { Sidebar } from '@/components/sidebar'
import { headers } from 'next/headers'

export const dynamic = 'force-dynamic'

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // CRITICAL FIX: This layout MUST only render for /app/* routes
  // In Next.js standalone mode, layouts can be incorrectly applied
  // We use a defensive approach: only render layout if we can confirm /app/* route
  
  let isAppRoute = false
  
  try {
    const headersList = await headers()
    
    // Method 1: Check x-pathname header (set by middleware if available)
    const pathnameHeader = headersList.get('x-pathname')
    if (pathnameHeader && pathnameHeader.startsWith('/app')) {
      isAppRoute = true
      console.log('[APP_LAYOUT] ✅ Confirmed /app/* route via x-pathname:', pathnameHeader)
    }
    
    // Method 2: Check referer header
    if (!isAppRoute) {
      const referer = headersList.get('referer') || ''
      if (referer) {
        try {
          const refererUrl = new URL(referer)
          const pathname = refererUrl.pathname
          if (pathname && pathname.startsWith('/app')) {
            isAppRoute = true
            console.log('[APP_LAYOUT] ✅ Confirmed /app/* route via referer:', pathname)
          } else if (pathname && (pathname === '/login' || pathname === '/')) {
            // Explicitly block if we're on login or root
            isAppRoute = false
            console.log('[APP_LAYOUT] ❌ BLOCKED: Detected non-/app route via referer:', pathname)
          }
        } catch (error) {
          // Ignore parse errors
        }
      }
    }
    
    // Method 3: If we can't determine, be safe and don't render layout
    // This prevents the layout from interfering with /login or other routes
    if (!isAppRoute && !pathnameHeader && !headersList.get('referer')) {
      console.log('[APP_LAYOUT] ⚠️ Cannot determine route - returning children only (defensive)')
    }
    
  } catch (error) {
    console.log('[APP_LAYOUT] ⚠️ Error reading headers - returning children only (defensive)')
    // On error, don't render layout to be safe
  }
  
  console.log('========================================')
  console.log('[APP_LAYOUT] ===== AppLayout rendering =====')
  console.log('[APP_LAYOUT] Timestamp:', new Date().toISOString())
  console.log('[APP_LAYOUT] Is /app/* route:', isAppRoute)
  console.log('[APP_LAYOUT] Will render layout:', isAppRoute)
  console.log('========================================')
  
  // CRITICAL: Only render layout if we confirmed /app/* route
  // Otherwise return children directly to prevent interference
  if (!isAppRoute) {
    console.log('[APP_LAYOUT] ❌ Returning children only (not on /app/* route)')
    return <>{children}</>
  }
  
  // Only render full layout if we're confirmed on /app/* route
  console.log('[APP_LAYOUT] ✅ Rendering full layout with Sidebar')
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}
