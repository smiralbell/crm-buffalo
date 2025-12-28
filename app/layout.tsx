import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'CRM',
  description: 'Professional CRM System',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  console.log('========================================')
  console.log('[ROOT_LAYOUT] ===== RootLayout rendering =====')
  console.log('[ROOT_LAYOUT] Timestamp:', new Date().toISOString())
  console.log('[ROOT_LAYOUT] Rendering HTML structure')
  console.log('[ROOT_LAYOUT] Inter font loaded:', inter.className)
  console.log('========================================')
  
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
