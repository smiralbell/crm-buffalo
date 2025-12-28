import React from 'react'
import { Sidebar } from '@/components/sidebar'
import { requireAuth } from '@/lib/auth'

// Force dynamic rendering - this layout uses auth which requires runtime data
// This prevents Next.js from trying to statically render it during build
export const dynamic = 'force-dynamic'

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // This layout is ONLY for /app/* routes
  // The middleware already protects /app routes and redirects to /login if not authenticated
  // So by the time we get here, the user should be authenticated
  // We do a final auth check just to be safe
  console.log('[APP_LAYOUT] AppLayout rendering for /app/* route')
  
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
