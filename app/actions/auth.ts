'use server'

import { createSession, deleteSession, getAdminCredentials } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

export async function loginAction(formData: FormData) {
  console.log('[LOGIN] loginAction called')
  const rawData = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  console.log('[LOGIN] Form data received:', { email: rawData.email, hasPassword: !!rawData.password })

  const result = loginSchema.safeParse(rawData)
  if (!result.success) {
    console.log('[LOGIN] Validation failed:', result.error)
    redirect('/login?error=invalid')
  }

  const { email, password } = result.data
  const { email: adminEmail, password: adminPassword } = getAdminCredentials()

  console.log('[LOGIN] Comparing credentials:', {
    emailMatch: email === adminEmail,
    passwordMatch: password === adminPassword,
  })

  if (email !== adminEmail || password !== adminPassword) {
    console.log('[LOGIN] Invalid credentials')
    redirect('/login?error=invalid')
  }

  console.log('[LOGIN] Credentials valid, creating session...')
  await createSession()
  console.log('[LOGIN] Session created, redirecting to /app/dashboard')
  redirect('/app/dashboard')
}

export async function logoutAction() {
  await deleteSession()
  redirect('/login')
}

