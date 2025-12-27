import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { KanbanBoard } from '@/components/kanban-board'
import { CreateStageDialog } from '@/components/create-stage-dialog'

async function getPipeline(id: number) {
  if (!(prisma as any).pipeline) {
    return null
  }
  
  try {
    const pipeline = await (prisma as any).pipeline.findUnique({
      where: { id },
      select: {
        id: true,
        nombre: true,
        created_at: true,
        stages: {
          orderBy: { position: 'asc' },
          select: {
            id: true,
            nombre: true,
            position: true,
            leads: {
              where: {
                pipeline_id: id,
              },
              orderBy: [
                { position: 'asc' },
                { created_at: 'desc' },
              ],
              select: {
                id: true,
                valor: true,
                prioridad: true,
                ultima_interaccion: true,
                contact: {
                  select: {
                    id: true,
                    nombre: true,
                    email: true,
                    empresa: true,
                  },
                },
              },
            },
          },
        },
      },
    })

    if (!pipeline) {
      return null
    }

    // Intentar obtener descripcion si existe
    try {
      const pipelineWithDesc = await (prisma as any).pipeline.findUnique({
        where: { id },
        select: { descripcion: true },
      })
      pipeline.descripcion = pipelineWithDesc?.descripcion || null
    } catch {
      pipeline.descripcion = null
    }

    // Si las stages tienen color, incluirlo, si no, ignorar el error
    if (pipeline.stages && pipeline.stages.length > 0) {
      try {
        const stagesWithColor = await (prisma as any).pipelineStage.findMany({
          where: { pipeline_id: id },
          select: { id: true, color: true },
        })
        const colorMap = new Map(stagesWithColor.map((s: any) => [s.id, s.color]))
        pipeline.stages = pipeline.stages.map((stage: any) => ({
          ...stage,
          color: colorMap.get(stage.id) || null,
        }))
      } catch {
        // Si color no existe, simplemente no incluirlo
        pipeline.stages = pipeline.stages.map((stage: any) => ({
          ...stage,
          color: null,
        }))
      }
    }

    return pipeline
  } catch (error) {
    return null
  }
}

export default async function PipelineDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const pipeline = await getPipeline(Number(params.id))

  if (!pipeline) {
    notFound()
  }

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{pipeline.nombre}</h1>
          {pipeline.descripcion && (
            <p className="text-muted-foreground mt-2">{pipeline.descripcion}</p>
          )}
        </div>
        <CreateStageDialog pipelineId={pipeline.id} />
      </div>

      <KanbanBoard pipeline={pipeline} />
    </div>
  )
}

