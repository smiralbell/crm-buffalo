import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  console.log('========================================')
  console.log('[ROOT] ===== HomePage rendering =====')
  console.log('[ROOT] Timestamp:', new Date().toISOString())
  
  try {
    console.log('[ROOT] Checking session...')
    const isAuthenticated = await getSession()
    console.log('[ROOT] Session check result:', isAuthenticated)
    
    if (isAuthenticated) {
      console.log('[ROOT] ✅ Authenticated - Redirecting to /app/dashboard')
      redirect('/app/dashboard')
    } else {
      console.log('[ROOT] ❌ Not authenticated - Redirecting to /login')
      redirect('/login')
    }
  } catch (error) {
    console.error('[ROOT] ❌ ERROR checking session:', error)
    console.log('[ROOT] Error occurred, redirecting to /login')
    redirect('/login')
  }
}
