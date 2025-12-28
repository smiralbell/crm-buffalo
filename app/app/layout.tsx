import React from 'react'
import { Sidebar } from '@/components/sidebar'
import { requireAuth } from '@/lib/auth'

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // This will redirect to /login if not authenticated
  // The middleware also protects /app routes, so this is a double check
  await requireAuth()

  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}

