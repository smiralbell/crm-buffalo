import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

const SESSION_COOKIE_NAME = 'crm_session'
const SESSION_MAX_AGE = 60 * 60 * 24 * 7 // 7 days

export async function createSession() {
  const cookieStore = await cookies()
  const isProduction = process.env.NODE_ENV === 'production'
  cookieStore.set(SESSION_COOKIE_NAME, 'authenticated', {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    maxAge: SESSION_MAX_AGE,
    path: '/',
  })
}

export async function getSession(): Promise<boolean> {
  const cookieStore = await cookies()
  const session = cookieStore.get(SESSION_COOKIE_NAME)
  return session?.value === 'authenticated'
}

export async function deleteSession() {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE_NAME)
}

export async function requireAuth() {
  const isAuthenticated = await getSession()
  if (!isAuthenticated) {
    redirect('/login')
  }
}

export function getAdminCredentials() {
  const email = process.env.CRM_ADMIN_EMAIL
  const password = process.env.CRM_ADMIN_PASSWORD

  if (!email || !password) {
    throw new Error('CRM_ADMIN_EMAIL and CRM_ADMIN_PASSWORD must be set')
  }

  return { email, password }
}

