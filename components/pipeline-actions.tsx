'use client'

import { useState } from 'react'
import { MoreVertical, Edit } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { EditPipelineDialog } from '@/components/edit-pipeline-dialog'

interface Pipeline {
  id: number
  nombre: string
  descripcion?: string | null
}

export function PipelineActions({ pipeline }: { pipeline: Pipeline }) {
  const [editOpen, setEditOpen] = useState(false)

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-muted">
            <MoreVertical className="h-4 w-4" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onSelect={() => setEditOpen(true)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <EditPipelineDialog
        pipeline={pipeline}
        open={editOpen}
        onOpenChange={setEditOpen}
      />
    </>
  )
}

