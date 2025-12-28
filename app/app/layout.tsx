import React from 'react'
import { Sidebar } from '@/components/sidebar'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // This layout is ONLY for /app/* routes
  // In Next.js App Router, layouts in app/app/ should only apply to /app/* routes
  // If it's being applied elsewhere, that's a Next.js bug, but we log it
  console.log('[APP_LAYOUT] Rendering AppLayout for /app/* route')
  
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}
