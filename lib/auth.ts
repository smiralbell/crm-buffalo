import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

const SESSION_COOKIE_NAME = 'crm_session'
const SESSION_MAX_AGE = 60 * 60 * 24 * 7 // 7 days

export async function createSession() {
  console.log('[AUTH] Creating session...')
  const cookieStore = await cookies()
  // EasyPanel: HTTPS externally (proxy), HTTP internally (container)
  // For cookies to work behind proxy, we need secure: true when browser sees HTTPS
  // However, if there are issues, we can try secure: false temporarily
  // Try secure: true first (should work with EasyPanel's HTTPS proxy)
  const isProduction = process.env.NODE_ENV === 'production'
  
  console.log('[AUTH] Setting cookie with options:', {
    name: SESSION_COOKIE_NAME,
    value: 'authenticated',
    secure: isProduction,
    sameSite: 'lax',
    maxAge: SESSION_MAX_AGE,
    path: '/',
  })
  
  try {
    cookieStore.set(SESSION_COOKIE_NAME, 'authenticated', {
      httpOnly: true,
      secure: isProduction, // EasyPanel proxy provides HTTPS to browser
      sameSite: 'lax', // Allows redirects
      maxAge: SESSION_MAX_AGE,
      path: '/',
    })
    console.log('[AUTH] Session cookie set successfully')
  } catch (error) {
    console.error('[AUTH] Error setting session cookie:', error)
    throw error
  }
}

export async function getSession(): Promise<boolean> {
  const cookieStore = await cookies()
  const session = cookieStore.get(SESSION_COOKIE_NAME)
  const isAuthenticated = session?.value === 'authenticated'
  console.log('[AUTH] Getting session:', {
    hasCookie: !!session,
    cookieValue: session?.value,
    isAuthenticated,
  })
  return isAuthenticated
}

export async function deleteSession() {
  console.log('[AUTH] Deleting session...')
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE_NAME)
  console.log('[AUTH] Session deleted')
}

export async function requireAuth() {
  console.log('[AUTH] requireAuth called')
  const isAuthenticated = await getSession()
  if (!isAuthenticated) {
    console.log('[AUTH] Not authenticated, redirecting to /login')
    redirect('/login')
  }
  console.log('[AUTH] Authentication check passed')
}

export function getAdminCredentials() {
  const email = process.env.CRM_ADMIN_EMAIL
  const password = process.env.CRM_ADMIN_PASSWORD

  if (!email || !password) {
    throw new Error('CRM_ADMIN_EMAIL and CRM_ADMIN_PASSWORD must be set')
  }

  return { email, password }
}

