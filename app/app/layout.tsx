import React from 'react'
import { Sidebar } from '@/components/sidebar'

export const dynamic = 'force-dynamic'

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // This layout is ONLY for /app/* routes
  // Middleware already ensures authentication
  // No auth logic here - just render the layout
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}
