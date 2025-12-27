'use server'

import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'

const leadSchema = z.object({
  estado: z.string(),
  origen_principal: z.string().optional(),
  prioridad: z.string(),
  score: z.number().optional(),
})

const createLeadSchema = z.object({
  contact_id: z.number(),
  estado: z.string().optional(),
  origen_principal: z.string().optional(),
  prioridad: z.string().optional(),
  score: z.number().optional(),
})

export async function createLead(formData: FormData) {
  const rawData = {
    contact_id: formData.get('contact_id') ? Number(formData.get('contact_id')) : undefined,
    estado: formData.get('estado') as string,
    origen_principal: formData.get('origen_principal') as string,
    prioridad: formData.get('prioridad') as string,
    score: formData.get('score') ? Number(formData.get('score')) : undefined,
  }

  const result = createLeadSchema.safeParse(rawData)
  if (!result.success) {
    return { error: 'Invalid data', details: result.error.errors }
  }

  if (!result.data.contact_id) {
    return { error: 'Contact ID is required' }
  }

  try {
    const existingLead = await prisma.lead.findUnique({
      where: { contact_id: result.data.contact_id },
    })

    if (existingLead) {
      return { error: 'This contact already has a lead' }
    }

    await prisma.lead.create({
      data: {
        contact_id: result.data.contact_id,
        estado: result.data.estado || 'frio',
        origen_principal: result.data.origen_principal || null,
        prioridad: result.data.prioridad || 'media',
        score: result.data.score || null,
      },
    })
    revalidatePath('/app/leads')
    return { success: true }
  } catch (error: any) {
    if (error.code === 'P2002') {
      return { error: 'This contact already has a lead' }
    }
    return { error: 'Failed to create lead' }
  }
}

export async function updateLead(id: number, formData: FormData) {
  const rawData = {
    estado: formData.get('estado') as string,
    origen_principal: formData.get('origen_principal') as string,
    prioridad: formData.get('prioridad') as string,
    score: formData.get('score') ? Number(formData.get('score')) : undefined,
  }

  const result = leadSchema.safeParse(rawData)
  if (!result.success) {
    return { error: 'Invalid data', details: result.error.errors }
  }

  try {
    await prisma.lead.update({
      where: { id },
      data: {
        ...result.data,
        ultima_interaccion: new Date(),
      },
    })
    revalidatePath('/app/leads')
    revalidatePath(`/app/leads/${id}`)
    return { success: true }
  } catch (error) {
    return { error: 'Failed to update lead' }
  }
}

export async function deleteLead(id: number) {
  try {
    const lead = await prisma.lead.findUnique({
      where: { id },
      select: { id: true },
    })

    if (!lead) {
      return { error: 'Lead not found' }
    }

    await prisma.lead.delete({
      where: { id },
    })
    revalidatePath('/app/leads')
    revalidatePath('/app/pipelines')
    return { success: true }
  } catch (error: any) {
    return { error: 'Failed to delete lead' }
  }
}

