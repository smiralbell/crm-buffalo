import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Edit } from 'lucide-react'
import { CreatePipelineDialog } from '@/components/create-pipeline-dialog'
import { EditPipelineDialog } from '@/components/edit-pipeline-dialog'
import { PipelineActions } from '@/components/pipeline-actions'

async function getPipelines() {
  if (!(prisma as any).pipeline) {
    return []
  }
  
  try {
    // Intentar con select específico para evitar errores si descripcion no existe
    const pipelines = await (prisma as any).pipeline.findMany({
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
          },
        },
        _count: {
          select: { leads: true },
        },
      },
      orderBy: { created_at: 'desc' },
    })

    // Intentar obtener descripcion si existe
    try {
      const pipelinesWithDesc = await (prisma as any).pipeline.findMany({
        select: {
          id: true,
          descripcion: true,
        },
      })
      const descMap = new Map(pipelinesWithDesc.map((p: any) => [p.id, p.descripcion]))
      return pipelines.map((p: any) => ({
        ...p,
        descripcion: descMap.get(p.id) || null,
      }))
    } catch {
      // Si descripcion no existe, retornar sin ella
      return pipelines.map((p: any) => ({
        ...p,
        descripcion: null,
      }))
    }
  } catch (error: any) {
    // Si falla por descripcion, usar raw query
    if (error.message?.includes('descripcion')) {
      try {
        return await prisma.$queryRaw`
          SELECT 
            p.id,
            p.nombre,
            p.created_at,
            COUNT(DISTINCT ps.id) as stage_count,
            COUNT(DISTINCT l.id) as lead_count
          FROM pipelines p
          LEFT JOIN pipeline_stages ps ON ps.pipeline_id = p.id
          LEFT JOIN leads l ON l.pipeline_id = p.id
          GROUP BY p.id, p.nombre, p.created_at
          ORDER BY p.created_at DESC
        `
      } catch {
        return []
      }
    }
    return []
  }
}

export default async function PipelinesPage() {
  const pipelines = await getPipelines()

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Pipelines</h1>
          <p className="text-muted-foreground mt-2">Manage your sales pipelines</p>
        </div>
        <CreatePipelineDialog />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {pipelines.map((pipeline: any) => (
          <Card key={pipeline.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <CardTitle className="truncate">{pipeline.nombre}</CardTitle>
                  {pipeline.descripcion && (
                    <CardDescription className="truncate">{pipeline.descripcion}</CardDescription>
                  )}
                </div>
                <PipelineActions pipeline={pipeline} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Stages</p>
                  <p className="text-2xl font-bold">{pipeline.stages?.length || pipeline.stage_count || 0}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Leads</p>
                  <p className="text-2xl font-bold">{pipeline._count?.leads || pipeline.lead_count || 0}</p>
                </div>
                <Link href={`/app/pipelines/${pipeline.id}`}>
                  <Button className="w-full">Open Pipeline</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
        {pipelines.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              No pipelines yet. Create your first pipeline to get started.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

