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
  console.log('[APP_LAYOUT] This layout is ONLY for /app/* routes')
  console.log('[APP_LAYOUT] Middleware already ensures authentication')
  console.log('[APP_LAYOUT] Rendering layout with Sidebar and children')
  console.log('========================================')
  
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}
