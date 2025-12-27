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
import { EditContactDialog } from '@/components/edit-contact-dialog'
import { DeleteContactDialog } from '@/components/delete-contact-dialog'

interface Contact {
  id: number
  nombre: string | null
  email: string
  instagram_user: string | null
  telefono: string | null
  empresa: string | null
  direccion_fiscal?: string | null
  ciudad?: string | null
  codigo_postal?: string | null
  pais?: string | null
  cif?: string | null
  dni?: string | null
  iban?: string | null
}

export function ContactRowActions({ contact }: { contact: Contact }) {
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
            <Link href={`/app/contacts/${contact.id}`} className="flex items-center">
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
      <EditContactDialog contact={contact} open={editOpen} onOpenChange={setEditOpen} />
      <DeleteContactDialog contact={contact} open={deleteOpen} onOpenChange={setDeleteOpen} />
    </>
  )
}

