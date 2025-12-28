import React from 'react'
import { Sidebar } from '@/components/sidebar'
import { requireAuth } from '@/lib/auth'

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  console.log('[APP_LAYOUT] AppLayout rendering')
  // This will redirect to /login if not authenticated
  // The middleware also protects /app routes, so this is a double check
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

