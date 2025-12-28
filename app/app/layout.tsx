import React from 'react'
import { Sidebar } from '@/components/sidebar'
import { requireAuth } from '@/lib/auth'

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  console.log('[APP_LAYOUT] AppLayout rendering')
  console.log('[APP_LAYOUT] This layout should ONLY be for /app/* routes')
  
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
