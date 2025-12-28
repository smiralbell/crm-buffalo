'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function HomePage() {
  const router = useRouter()
  
  useEffect(() => {
    // Simple client-side redirect to login
    // Middleware handles auth protection for /app/* routes
    router.replace('/login')
  }, [router])
  
  // Return null while redirecting
  return null
}
