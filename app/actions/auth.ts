'use server'

import { createSession, deleteSession, getAdminCredentials } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

export async function loginAction(formData: FormData) {
  console.log('========================================')
  console.log('[LOGIN_ACTION] ===== loginAction called =====')
  console.log('[LOGIN_ACTION] Timestamp:', new Date().toISOString())
  
  const rawData = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  console.log('[LOGIN_ACTION] Form data received:', {
    email: rawData.email,
    hasPassword: !!rawData.password,
    passwordLength: rawData.password?.length || 0,
  })

  const result = loginSchema.safeParse(rawData)
  if (!result.success) {
    console.log('[LOGIN_ACTION] ❌ Validation failed:', result.error.errors)
    console.log('========================================')
    redirect('/login?error=invalid')
  }

  const { email, password } = result.data
  
  try {
    const { email: adminEmail, password: adminPassword } = getAdminCredentials()

    console.log('[LOGIN_ACTION] Comparing credentials:', {
      emailMatch: email === adminEmail,
      passwordMatch: password === adminPassword,
      providedEmail: email,
      expectedEmail: adminEmail,
    })

    if (email !== adminEmail || password !== adminPassword) {
      console.log('[LOGIN_ACTION] ❌ Invalid credentials')
      console.log('========================================')
      redirect('/login?error=invalid')
    }

    console.log('[LOGIN_ACTION] ✅ Credentials valid, creating session...')
    await createSession()
    console.log('[LOGIN_ACTION] ✅ Session created, redirecting to /app/dashboard')
    console.log('========================================')
    redirect('/app/dashboard')
  } catch (error) {
    console.error('[LOGIN_ACTION] ❌ Error during login:', error)
    console.log('========================================')
    redirect('/login?error=server')
  }
}

export async function logoutAction() {
  console.log('========================================')
  console.log('[LOGOUT_ACTION] ===== logoutAction called =====')
  console.log('[LOGOUT_ACTION] Timestamp:', new Date().toISOString())
  
  await deleteSession()
  console.log('[LOGOUT_ACTION] ✅ Session deleted, redirecting to /login')
  console.log('========================================')
  redirect('/login')
}
