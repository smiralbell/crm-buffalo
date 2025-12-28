import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'

export default async function HomePage() {
  console.log('[ROOT] HomePage component rendering')
  try {
    console.log('[ROOT] Checking session...')
    const isAuthenticated = await getSession()
    console.log('[ROOT] Session check result:', isAuthenticated)
    
    if (isAuthenticated) {
      console.log('[ROOT] Authenticated, redirecting to /app/dashboard')
      redirect('/app/dashboard')
    } else {
      console.log('[ROOT] Not authenticated, redirecting to /login')
      redirect('/login')
    }
  } catch (error) {
    // If there's any error reading session, go to login
    console.error('[ROOT] Error checking session:', error)
    console.log('[ROOT] Error occurred, redirecting to /login')
    redirect('/login')
  }
}
