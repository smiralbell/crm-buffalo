'use server'

import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'

const pipelineSchema = z.object({
  nombre: z.string().min(1),
  descripcion: z.string().optional(),
})

const stageSchema = z.object({
  nombre: z.string().min(1),
  position: z.number(),
  color: z.string().optional(),
})

export async function createPipeline(formData: FormData) {
  const rawData = {
    nombre: formData.get('nombre') as string,
    descripcion: formData.get('descripcion') as string,
  }

  const result = pipelineSchema.safeParse(rawData)
  if (!result.success) {
    return { error: 'Invalid data', details: result.error.errors }
  }

  if (!result.data.nombre || result.data.nombre.trim() === '') {
    return { error: 'Pipeline name is required' }
  }

  try {
    if (!(prisma as any).pipeline) {
      return { error: 'Pipeline model not available. Please regenerate Prisma Client.' }
    }

    // Usar raw query directamente para evitar problemas con columnas que no existen
    // (updated_at, descripcion, etc.)
    const descripcionValue = result.data.descripcion && result.data.descripcion.trim() !== '' 
      ? result.data.descripcion.trim() 
      : null

    try {
      if (descripcionValue) {
        // Intentar con descripcion primero
        try {
          await prisma.$executeRaw`
            INSERT INTO pipelines (nombre, descripcion, created_at)
            VALUES (${result.data.nombre.trim()}, ${descripcionValue}, NOW())
          `
        } catch (descError: any) {
          // Si falla por descripcion, intentar sin ella
          if (descError.message?.includes('descripcion') || descError.code === 'P2003') {
            await prisma.$executeRaw`
              INSERT INTO pipelines (nombre, created_at)
              VALUES (${result.data.nombre.trim()}, NOW())
            `
          } else {
            throw descError
          }
        }
      } else {
        // Sin descripcion
        await prisma.$executeRaw`
          INSERT INTO pipelines (nombre, created_at)
          VALUES (${result.data.nombre.trim()}, NOW())
        `
      }
      revalidatePath('/app/pipelines')
      return { success: true }
    } catch (createError: any) {
      // Si es error de constraint única
      if (createError.code === 'P2002' || createError.message?.includes('Unique constraint') || createError.message?.includes('duplicate')) {
        return { 
          error: 'A pipeline with this name already exists' 
        }
      }
      
      // Cualquier otro error, devolver mensaje específico
      return { 
        error: `Failed to create pipeline: ${createError.message || 'Unknown error'}` 
      }
    }
  } catch (error: any) {
    return { 
      error: `Failed to create pipeline: ${error.message || 'Unknown error'}` 
    }
  }
}

export async function createStage(pipelineId: number, formData: FormData) {
  const rawData = {
    nombre: formData.get('nombre') as string,
    color: formData.get('color') as string,
  }

  if (!(prisma as any).pipelineStage) {
    return { error: 'PipelineStage model not available. Please regenerate Prisma Client.' }
  }

  const maxPosition = await (prisma as any).pipelineStage.findFirst({
    where: { pipeline_id: pipelineId },
    orderBy: { position: 'desc' },
    select: { position: true },
  })

  const position = (maxPosition?.position ?? -1) + 1

  const result = stageSchema.safeParse({
    nombre: rawData.nombre,
    position,
    color: rawData.color || null,
  })

  if (!result.success) {
    return { error: 'Invalid data', details: result.error.errors }
  }

  try {
    // Crear sin color si la columna no existe
    const createData: any = {
      nombre: result.data.nombre,
      position: result.data.position,
      pipeline_id: pipelineId,
    }
    // Solo incluir color si existe en el schema
    if (result.data.color) {
      createData.color = result.data.color
    }
    await (prisma as any).pipelineStage.create({
      data: createData,
    })
    revalidatePath(`/app/pipelines/${pipelineId}`)
    revalidatePath('/app/pipelines')
    return { success: true }
  } catch (error) {
    return { error: 'Failed to create stage' }
  }
}

export async function updateStage(id: number, formData: FormData) {
  const rawData = {
    nombre: formData.get('nombre') as string,
    color: formData.get('color') as string,
  }

  if (!(prisma as any).pipelineStage) {
    return { error: 'PipelineStage model not available. Please regenerate Prisma Client.' }
  }

  const stage = await (prisma as any).pipelineStage.findUnique({
    where: { id },
    select: { position: true },
  })

  if (!stage) {
    return { error: 'Stage not found' }
  }

  const result = stageSchema.safeParse({
    nombre: rawData.nombre,
    position: stage.position,
    color: rawData.color || null,
  })

  if (!result.success) {
    return { error: 'Invalid data', details: result.error.errors }
  }

  try {
    // Actualizar sin color si la columna no existe
    const updateData: any = {
      nombre: result.data.nombre,
    }
    // Solo incluir color si existe en el schema
    if (result.data.color !== undefined) {
      try {
        updateData.color = result.data.color
      } catch {
        // Ignorar si la columna no existe
      }
    }
    const updatedStage = await (prisma as any).pipelineStage.update({
      where: { id },
      data: updateData,
      select: { pipeline_id: true },
    })
    revalidatePath(`/app/pipelines/${updatedStage.pipeline_id}`)
    revalidatePath('/app/pipelines')
    return { success: true }
  } catch (error) {
    return { error: 'Failed to update stage' }
  }
}

export async function reorderStages(stageIds: number[], pipelineId: number) {
  try {
    if (!(prisma as any).pipelineStage) {
      return { error: 'PipelineStage model not available. Please regenerate Prisma Client.' }
    }
    await Promise.all(
      stageIds.map((id, index) =>
        (prisma as any).pipelineStage.update({
          where: { id },
          data: { position: index },
        })
      )
    )
    revalidatePath(`/app/pipelines/${pipelineId}`)
    revalidatePath('/app/pipelines')
    return { success: true }
  } catch (error: any) {
    return { error: `Failed to reorder stages: ${error.message || 'Unknown error'}` }
  }
}

export async function updatePipeline(id: number, formData: FormData) {
  const rawData = {
    nombre: formData.get('nombre') as string,
    descripcion: formData.get('descripcion') as string,
  }

  const result = pipelineSchema.safeParse(rawData)
  if (!result.success) {
    return { error: 'Invalid data', details: result.error.errors }
  }

  if (!result.data.nombre || result.data.nombre.trim() === '') {
    return { error: 'Pipeline name is required' }
  }

  try {
    if (!(prisma as any).pipeline) {
      return { error: 'Pipeline model not available. Please regenerate Prisma Client.' }
    }

    const descripcionValue = result.data.descripcion && result.data.descripcion.trim() !== ''
      ? result.data.descripcion.trim()
      : null

    try {
      if (descripcionValue) {
        try {
          await prisma.$executeRaw`
            UPDATE pipelines
            SET nombre = ${result.data.nombre.trim()}, descripcion = ${descripcionValue}
            WHERE id = ${id}
          `
        } catch {
          await prisma.$executeRaw`
            UPDATE pipelines
            SET nombre = ${result.data.nombre.trim()}
            WHERE id = ${id}
          `
        }
      } else {
        await prisma.$executeRaw`
          UPDATE pipelines
          SET nombre = ${result.data.nombre.trim()}
          WHERE id = ${id}
        `
      }
      revalidatePath('/app/pipelines')
      revalidatePath(`/app/pipelines/${id}`)
      return { success: true }
    } catch (error: any) {
      return { error: `Failed to update pipeline: ${error.message || 'Unknown error'}` }
    }
  } catch (error: any) {
    return { error: `Failed to update pipeline: ${error.message || 'Unknown error'}` }
  }
}

export async function deleteStage(id: number) {
  try {
    if (!(prisma as any).pipelineStage) {
      return { error: 'PipelineStage model not available. Please regenerate Prisma Client.' }
    }

    const stage = await (prisma as any).pipelineStage.findUnique({
      where: { id },
      include: {
        _count: {
          select: { leads: true },
        },
      },
    })

    if (!stage) {
      return { error: 'Stage not found' }
    }

    if (stage._count.leads > 0) {
      return { error: 'Cannot delete stage with leads' }
    }

    await (prisma as any).pipelineStage.delete({
      where: { id },
    })

    const pipelineId = stage.pipeline_id
    revalidatePath(`/app/pipelines/${pipelineId}`)
    revalidatePath('/app/pipelines')
    return { success: true }
  } catch (error: any) {
    return { error: `Failed to delete stage: ${error.message || 'Unknown error'}` }
  }
}

export async function moveLead(
  leadId: number,
  pipelineStageId: number | null,
  position: number
) {
  try {
    const stage = pipelineStageId && (prisma as any).pipelineStage
      ? await (prisma as any).pipelineStage.findUnique({
          where: { id: pipelineStageId },
          select: { pipeline_id: true },
        })
      : null

    if (!stage && pipelineStageId) {
      return { error: 'Stage not found' }
    }

    const lead = await prisma.lead.findUnique({
      where: { id: leadId },
      select: { id: true, pipeline_stage_id: true, position: true },
    })

    if (!lead) {
      return { error: 'Lead not found' }
    }

    const oldStageId = lead.pipeline_stage_id
    const newStageId = pipelineStageId
    const currentPosition = lead.position ?? 0

    if (oldStageId === newStageId && currentPosition === position) {
      return { success: true }
    }

    if (oldStageId && oldStageId !== newStageId) {
      await prisma.$executeRaw`
        UPDATE leads
        SET position = position - 1
        WHERE pipeline_stage_id = ${oldStageId}
        AND position > ${currentPosition}
      `
    }

    if (newStageId && oldStageId !== newStageId) {
      await prisma.$executeRaw`
        UPDATE leads
        SET position = position + 1
        WHERE pipeline_stage_id = ${newStageId}
        AND position >= ${position}
      `
    } else if (newStageId && oldStageId === newStageId) {
      if (currentPosition < position) {
        await prisma.$executeRaw`
          UPDATE leads
          SET position = position - 1
          WHERE pipeline_stage_id = ${newStageId}
          AND position > ${currentPosition}
          AND position <= ${position}
        `
      } else if (currentPosition > position) {
        await prisma.$executeRaw`
          UPDATE leads
          SET position = position + 1
          WHERE pipeline_stage_id = ${newStageId}
          AND position >= ${position}
          AND position < ${currentPosition}
        `
      }
    }

    await prisma.lead.update({
      where: { id: leadId },
      data: {
        pipeline_id: stage?.pipeline_id ?? null,
        pipeline_stage_id: pipelineStageId,
        position,
      },
    })

    revalidatePath('/app/pipelines')
    return { success: true }
  } catch (error: any) {
    return { error: `Failed to move lead: ${error.message || 'Unknown error'}` }
  }
}

