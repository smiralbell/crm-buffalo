import React from 'react'
import { Sidebar } from '@/components/sidebar'

export const dynamic = 'force-dynamic'

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  console.log('========================================')
  console.log('[APP_LAYOUT] ===== AppLayout rendering =====')
  console.log('[APP_LAYOUT] Timestamp:', new Date().toISOString())
  console.log('[APP_LAYOUT] This layout is for /app/* routes')
  console.log('[APP_LAYOUT] Middleware ensures authentication')
  console.log('[APP_LAYOUT] Rendering layout with Sidebar')
  console.log('========================================')
  
  // Pure layout - no routing logic, no auth checks, no pathname inspection
  // Middleware handles route protection
  // This layout only renders UI structure
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}
