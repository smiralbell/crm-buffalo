'use client'

import { useState } from 'react'
import Link from 'next/link'
import { MoreVertical, Eye, Edit, Trash2 } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { EditLeadDialog } from '@/components/edit-lead-dialog'
import { DeleteLeadDialog } from '@/components/delete-lead-dialog'

interface Lead {
  id: number
  estado: string
  origen_principal: string | null
  prioridad: string
  score: number | null
  contact: {
    id: number
    nombre: string | null
    email: string
  }
}

export function LeadRowActions({ lead }: { lead: Lead }) {
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-muted">
            <MoreVertical className="h-4 w-4" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <Link href={`/app/leads/${lead.id}`} className="flex items-center">
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => setEditOpen(true)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onSelect={() => setDeleteOpen(true)}
            className="text-destructive focus:text-destructive"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <EditLeadDialog lead={lead} open={editOpen} onOpenChange={setEditOpen} />
      <DeleteLeadDialog lead={lead} open={deleteOpen} onOpenChange={setDeleteOpen} />
    </>
  )
}

