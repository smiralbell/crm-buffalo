'use client'

import { useState } from 'react'
import { MoreVertical, Edit, Trash2, GripVertical } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { EditStageDialog } from '@/components/edit-stage-dialog'
import { DeleteStageDialog } from '@/components/delete-stage-dialog'

interface Stage {
  id: number
  nombre: string
  color: string | null
  leadCount: number
}

export function StageHeader({ stage }: { stage: Stage }) {
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  return (
    <>
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <GripVertical className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          <span className="font-semibold text-sm truncate">{stage.nombre}</span>
          <Badge variant="secondary" className="flex-shrink-0">
            {stage.leadCount}
          </Badge>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex h-6 w-6 items-center justify-center rounded hover:bg-muted flex-shrink-0">
              <MoreVertical className="h-4 w-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onSelect={() => setEditOpen(true)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={() => setDeleteOpen(true)}
              className="text-destructive focus:text-destructive"
              disabled={stage.leadCount > 0}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <EditStageDialog
        stage={stage}
        open={editOpen}
        onOpenChange={setEditOpen}
      />
      <DeleteStageDialog
        stage={{ ...stage, leadCount: stage.leadCount }}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
      />
    </>
  )
}

