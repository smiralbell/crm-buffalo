'use client'

import { useState } from 'react'
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
  useDroppable,
} from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { moveLead } from '@/app/actions/pipelines'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { StageHeader } from '@/components/stage-header'

interface Lead {
  id: number
  valor: number | null
  prioridad: string
  ultima_interaccion: Date | null
  contact: {
    id: number
    nombre: string | null
    email: string
    empresa: string | null
  }
}

interface Stage {
  id: number
  nombre: string
  color: string | null
  position: number
  leads: Lead[]
}

interface Pipeline {
  id: number
  stages: Stage[]
}

export function KanbanBoard({ pipeline }: { pipeline: Pipeline }) {
  const [activeId, setActiveId] = useState<number | null>(null)
  const router = useRouter()
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as number)
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    setActiveId(null)
    const { active, over } = event

    if (!over) return

    const leadId = Number(String(active.id).replace('lead-', ''))
    const overId = String(over.id)

    let targetStageId: number | null = null
    let targetPosition = 0

    if (overId.startsWith('stage-')) {
      targetStageId = Number(overId.replace('stage-', ''))
      const targetStage = pipeline.stages.find((s) => s.id === targetStageId)
      if (targetStage) {
        targetPosition = targetStage.leads.length
      }
    } else if (overId.startsWith('lead-')) {
      const targetLeadId = Number(overId.replace('lead-', ''))
      const targetStage = pipeline.stages.find((s) =>
        s.leads.some((l) => l.id === targetLeadId)
      )
      if (targetStage) {
        targetStageId = targetStage.id
        const targetLeadIndex = targetStage.leads.findIndex((l) => l.id === targetLeadId)
        targetPosition = targetLeadIndex >= 0 ? targetLeadIndex : targetStage.leads.length
      }
    }

    if (targetStageId !== null) {
      const result = await moveLead(leadId, targetStageId, targetPosition)
      if (result.success) {
        router.refresh()
      } else {
        alert(result.error || 'Failed to move lead')
      }
    }
  }

  if (pipeline.stages.length === 0) {
    return (
      <Card>
        <CardContent className="py-16 text-center">
          <p className="text-muted-foreground mb-4">No stages yet</p>
          <p className="text-sm text-muted-foreground">Create your first stage to start organizing leads</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-3 overflow-x-auto pb-4 -mx-2 px-2">
        {pipeline.stages.map((stage) => (
          <StageColumn key={stage.id} stage={stage} />
        ))}
      </div>
      <DragOverlay>
        {activeId ? (
          <LeadCard
            lead={pipeline.stages
              .flatMap((s) => s.leads)
              .find((l) => l.id === activeId)!}
            isDragging
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}

function StageColumn({ stage }: { stage: Stage }) {
  const stageLeadIds = stage.leads.map((lead) => lead.id)
  const { setNodeRef } = useDroppable({
    id: `stage-${stage.id}`,
  })

  return (
    <div className="flex-shrink-0 w-80">
      <Card className="h-full flex flex-col bg-muted/30">
        <CardHeader
          className="sticky top-0 bg-card z-10 border-b px-4 py-3"
          style={{
            ...(stage.color ? {
              borderLeftColor: stage.color,
              borderLeftWidth: '4px',
            } : {}),
          }}
        >
          <StageHeader
            stage={{
              id: stage.id,
              nombre: stage.nombre,
              color: stage.color,
              leadCount: stage.leads.length,
            }}
          />
        </CardHeader>
        <CardContent
          ref={setNodeRef}
          className="flex-1 overflow-y-auto p-3 space-y-2 min-h-[500px] max-h-[calc(100vh-250px)]"
        >
          <SortableContext items={stageLeadIds} strategy={verticalListSortingStrategy}>
            {stage.leads.length === 0 ? (
              <div className="text-xs text-muted-foreground text-center py-12 border-2 border-dashed rounded-md bg-background/50">
                Drop leads here
              </div>
            ) : (
              stage.leads.map((lead) => <LeadCard key={lead.id} lead={lead} />)
            )}
          </SortableContext>
        </CardContent>
      </Card>
    </div>
  )
}

function LeadCard({ lead, isDragging }: { lead: Lead; isDragging?: boolean }) {
  const { setNodeRef, attributes, listeners, transform, transition } = useSortable({
    id: `lead-${lead.id}`,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const priorityColors: Record<string, string> = {
    alta: 'bg-red-100 text-red-800',
    media: 'bg-yellow-100 text-yellow-800',
    baja: 'bg-green-100 text-green-800',
  }

  const daysSinceInteraction = lead.ultima_interaccion
    ? formatDistanceToNow(new Date(lead.ultima_interaccion), { addSuffix: true })
    : 'Never'

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="cursor-grab active:cursor-grabbing"
    >
      <Link href={`/app/leads/${lead.id}`} className="block">
        <Card className="hover:shadow-md transition-all duration-200 bg-background border-border">
          <CardContent className="p-3 space-y-2.5">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-foreground truncate">
                  {lead.contact.nombre || lead.contact.email}
                </p>
                {lead.contact.empresa && (
                  <p className="text-xs text-muted-foreground truncate mt-0.5">
                    {lead.contact.empresa}
                  </p>
                )}
              </div>
              <Badge
                className={`${priorityColors[lead.prioridad] || 'bg-gray-100 text-gray-800'} text-xs flex-shrink-0`}
                variant="secondary"
              >
                {lead.prioridad}
              </Badge>
            </div>
            {lead.valor && (
              <div className="pt-1">
                <p className="text-sm font-semibold text-primary">
                  €{lead.valor.toLocaleString('es-ES', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                </p>
              </div>
            )}
            <div className="pt-0.5">
              <p className="text-xs text-muted-foreground">
                {daysSinceInteraction}
              </p>
            </div>
          </CardContent>
        </Card>
      </Link>
    </div>
  )
}

