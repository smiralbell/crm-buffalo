import React from 'react'
import { Sidebar } from '@/components/sidebar'
import { headers } from 'next/headers'

export const dynamic = 'force-dynamic'

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // CRITICAL FIX: Verify we're actually on an /app/* route
  // Next.js standalone mode sometimes applies layouts incorrectly
  let shouldRenderLayout = true
  
  try {
    const headersList = await headers()
    // Try multiple ways to get the pathname
    const referer = headersList.get('referer') || ''
    const host = headersList.get('host') || ''
    
    // If we have a referer, extract pathname from it
    if (referer) {
      try {
        const refererUrl = new URL(referer)
        const pathname = refererUrl.pathname
        console.log('[APP_LAYOUT] Pathname from referer:', pathname)
        
        // If pathname doesn't start with /app, don't render layout
        if (pathname && !pathname.startsWith('/app')) {
          console.log('[APP_LAYOUT] ❌ BLOCKED: Not on /app/* route. Pathname:', pathname)
          console.log('[APP_LAYOUT] Returning children only to prevent layout interference')
          shouldRenderLayout = false
        }
      } catch (error) {
        // If we can't parse referer, continue (might be first request)
        console.log('[APP_LAYOUT] Could not parse referer, assuming correct route')
      }
    }
  } catch (error) {
    // If we can't read headers, be safe and don't render layout
    console.log('[APP_LAYOUT] ⚠️ Could not read headers, returning children only to be safe')
    shouldRenderLayout = false
  }
  
  console.log('========================================')
  console.log('[APP_LAYOUT] ===== AppLayout rendering =====')
  console.log('[APP_LAYOUT] Timestamp:', new Date().toISOString())
  console.log('[APP_LAYOUT] Should render layout:', shouldRenderLayout)
  console.log('[APP_LAYOUT] This layout is ONLY for /app/* routes')
  console.log('========================================')
  
  // If we shouldn't render the layout, return children directly
  if (!shouldRenderLayout) {
    return <>{children}</>
  }
  
  // Only render layout if we're sure we're on /app/* route
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}
