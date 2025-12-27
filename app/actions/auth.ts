'use server'

import { createSession, deleteSession, getAdminCredentials } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

export async function loginAction(formData: FormData) {
  const rawData = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const result = loginSchema.safeParse(rawData)
  if (!result.success) {
    redirect('/login?error=invalid')
  }

  const { email, password } = result.data
  const { email: adminEmail, password: adminPassword } = getAdminCredentials()

  if (email !== adminEmail || password !== adminPassword) {
    redirect('/login?error=invalid')
  }

  await createSession()
  redirect('/app/dashboard')
}

export async function logoutAction() {
  await deleteSession()
  redirect('/login')
}

