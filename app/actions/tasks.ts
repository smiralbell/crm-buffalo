'use server'

import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'

const taskSchema = z.object({
  tarea: z.string().min(1),
  pendiente: z.boolean(),
  fecha: z.string().optional(),
  contact_id: z.number().optional(),
  lead_id: z.number().optional(),
})

export async function createTask(formData: FormData) {
  const rawData = {
    tarea: formData.get('tarea') as string,
    pendiente: formData.get('pendiente') === 'true',
    fecha: formData.get('fecha') as string,
    contact_id: formData.get('contact_id') ? Number(formData.get('contact_id')) : undefined,
    lead_id: formData.get('lead_id') ? Number(formData.get('lead_id')) : undefined,
  }

  const result = taskSchema.safeParse(rawData)
  if (!result.success) {
    return { error: 'Invalid data', details: result.error.errors }
  }

  try {
    await prisma.task.create({
      data: {
        tarea: result.data.tarea,
        pendiente: result.data.pendiente,
        fecha: result.data.fecha ? new Date(result.data.fecha) : null,
        contact_id: result.data.contact_id || null,
        lead_id: result.data.lead_id || null,
      },
    })
    revalidatePath('/app/tasks')
    return { success: true }
  } catch (error) {
    return { error: 'Failed to create task' }
  }
}

export async function toggleTask(id: number, pendiente: boolean) {
  try {
    await prisma.task.update({
      where: { id },
      data: { pendiente },
    })
    revalidatePath('/app/tasks')
    return { success: true }
  } catch (error) {
    return { error: 'Failed to update task' }
  }
}

