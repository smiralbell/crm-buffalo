import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'

// Force dynamic to prevent static generation
export const dynamic = 'force-dynamic'

export default async function HomePage() {
  // Simple server-side redirect - no client component needed
  const isAuthenticated = await getSession()
  
  if (isAuthenticated) {
    redirect('/app/dashboard')
  } else {
    redirect('/login')
  }
}
