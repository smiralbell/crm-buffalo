import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

const SESSION_COOKIE_NAME = 'crm_session'
const SESSION_MAX_AGE = 60 * 60 * 24 * 7 // 7 days

export async function createSession() {
  console.log('========================================')
  console.log('[AUTH] ===== createSession called =====')
  console.log('[AUTH] Timestamp:', new Date().toISOString())
  
  try {
    const cookieStore = await cookies()
    const isProduction = process.env.NODE_ENV === 'production'
    
    console.log('[AUTH] Environment:', {
      NODE_ENV: process.env.NODE_ENV,
      isProduction,
    })
    
    console.log('[AUTH] Setting cookie with options:', {
      name: SESSION_COOKIE_NAME,
      value: 'authenticated',
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      maxAge: SESSION_MAX_AGE,
      path: '/',
    })
    
    cookieStore.set(SESSION_COOKIE_NAME, 'authenticated', {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      maxAge: SESSION_MAX_AGE,
      path: '/',
    })
    
    console.log('[AUTH] ✅ Session cookie set successfully')
    console.log('========================================')
  } catch (error) {
    console.error('[AUTH] ❌ Error setting session cookie:', error)
    console.log('========================================')
    throw error
  }
}

export async function getSession(): Promise<boolean> {
  console.log('[AUTH] ===== getSession called =====')
  console.log('[AUTH] Timestamp:', new Date().toISOString())
  
  try {
    const cookieStore = await cookies()
    const session = cookieStore.get(SESSION_COOKIE_NAME)
    const allCookies = cookieStore.getAll()
    
    console.log('[AUTH] Cookie store state:', {
      hasSessionCookie: !!session,
      sessionValue: session?.value,
      allCookiesCount: allCookies.length,
      allCookies: allCookies.map(c => ({ name: c.name, hasValue: !!c.value })),
    })
    
    const isAuthenticated = session?.value === 'authenticated'
    console.log('[AUTH] Is authenticated:', isAuthenticated)
    console.log('[AUTH] ===== getSession end =====')
    
    return isAuthenticated
  } catch (error) {
    console.error('[AUTH] ❌ Error getting session:', error)
    console.log('[AUTH] ===== getSession end (error) =====')
    return false
  }
}

export async function deleteSession() {
  console.log('========================================')
  console.log('[AUTH] ===== deleteSession called =====')
  console.log('[AUTH] Timestamp:', new Date().toISOString())
  
  try {
    const cookieStore = await cookies()
    cookieStore.delete(SESSION_COOKIE_NAME)
    console.log('[AUTH] ✅ Session deleted successfully')
    console.log('========================================')
  } catch (error) {
    console.error('[AUTH] ❌ Error deleting session:', error)
    console.log('========================================')
  }
}

export async function requireAuth() {
  console.log('========================================')
  console.log('[AUTH] ===== requireAuth called =====')
  console.log('[AUTH] Timestamp:', new Date().toISOString())
  
  const isAuthenticated = await getSession()
  
  if (!isAuthenticated) {
    console.log('[AUTH] ❌ Not authenticated, redirecting to /login')
    console.log('========================================')
    redirect('/login')
  }
  
  console.log('[AUTH] ✅ Authentication check passed')
  console.log('========================================')
}

export function getAdminCredentials() {
  console.log('[AUTH] ===== getAdminCredentials called =====')
  
  const email = process.env.CRM_ADMIN_EMAIL
  const password = process.env.CRM_ADMIN_PASSWORD

  console.log('[AUTH] Environment variables:', {
    hasEmail: !!email,
    hasPassword: !!password,
    emailLength: email?.length || 0,
    passwordLength: password?.length || 0,
  })

  if (!email || !password) {
    console.error('[AUTH] ❌ Missing credentials in environment')
    throw new Error('CRM_ADMIN_EMAIL and CRM_ADMIN_PASSWORD must be set')
  }

  console.log('[AUTH] ✅ Credentials loaded successfully')
  return { email, password }
}
