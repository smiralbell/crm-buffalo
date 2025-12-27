import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'

export default async function HomePage() {
  const isAuthenticated = await getSession()
  
  if (isAuthenticated) {
    redirect('/app/dashboard')
  } else {
    redirect('/login')
  }
}

