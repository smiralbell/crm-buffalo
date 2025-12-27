'use server'

import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'

const contactSchema = z.object({
  nombre: z.string().optional(),
  email: z.string().email(),
  instagram_user: z.string().optional(),
  telefono: z.string().optional(),
  empresa: z.string().optional(),
  direccion_fiscal: z.string().optional(),
  ciudad: z.string().optional(),
  codigo_postal: z.string().optional(),
  pais: z.string().optional(),
  cif: z.string().optional(),
  dni: z.string().optional(),
  iban: z.string().optional(),
})

export async function createContact(formData: FormData) {
  const rawData = {
    nombre: formData.get('nombre') as string,
    email: formData.get('email') as string,
    instagram_user: formData.get('instagram_user') as string,
    telefono: formData.get('telefono') as string,
    empresa: formData.get('empresa') as string,
    direccion_fiscal: formData.get('direccion_fiscal') as string,
    ciudad: formData.get('ciudad') as string,
    codigo_postal: formData.get('codigo_postal') as string,
    pais: formData.get('pais') as string,
    cif: formData.get('cif') as string,
    dni: formData.get('dni') as string,
    iban: formData.get('iban') as string,
  }

  const result = contactSchema.safeParse(rawData)
  if (!result.success) {
    return { error: 'Invalid data', details: result.error.errors }
  }

  try {
    await prisma.contact.create({
      data: result.data,
    })
    revalidatePath('/app/contacts')
    return { success: true }
  } catch (error: any) {
    if (error.code === 'P2002') {
      return { error: 'Email or Instagram user already exists' }
    }
    return { error: 'Failed to create contact' }
  }
}

export async function updateContact(id: number, formData: FormData) {
  const rawData = {
    nombre: formData.get('nombre') as string,
    email: formData.get('email') as string,
    instagram_user: formData.get('instagram_user') as string,
    telefono: formData.get('telefono') as string,
    empresa: formData.get('empresa') as string,
    direccion_fiscal: formData.get('direccion_fiscal') as string,
    ciudad: formData.get('ciudad') as string,
    codigo_postal: formData.get('codigo_postal') as string,
    pais: formData.get('pais') as string,
    cif: formData.get('cif') as string,
    dni: formData.get('dni') as string,
    iban: formData.get('iban') as string,
  }

  const result = contactSchema.safeParse(rawData)
  if (!result.success) {
    return { error: 'Invalid data', details: result.error.errors }
  }

  try {
    await prisma.contact.update({
      where: { id },
      data: result.data,
    })
    revalidatePath('/app/contacts')
    revalidatePath(`/app/contacts/${id}`)
    return { success: true }
  } catch (error: any) {
    if (error.code === 'P2002') {
      return { error: 'Email or Instagram user already exists' }
    }
    return { error: 'Failed to update contact' }
  }
}

export async function deleteContact(id: number) {
  try {
    const contact = await prisma.contact.findUnique({
      where: { id },
      select: { id: true },
    })

    if (!contact) {
      return { error: 'Contact not found' }
    }

    await prisma.contact.delete({
      where: { id },
    })
    revalidatePath('/app/contacts')
    return { success: true }
  } catch (error: any) {
    return { error: 'Failed to delete contact' }
  }
}

