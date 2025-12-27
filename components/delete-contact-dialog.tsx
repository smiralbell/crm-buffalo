'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { AlertTriangle } from 'lucide-react'
import { deleteContact } from '@/app/actions/contacts'
import { useRouter } from 'next/navigation'

interface Contact {
  id: number
  nombre: string | null
  email: string
}

export function DeleteContactDialog({
  contact,
  open,
  onOpenChange,
}: {
  contact: Contact
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const [confirmName, setConfirmName] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const contactName = contact.nombre || contact.email
  const isNameMatch = confirmName === contactName

  async function handleDelete() {
    if (!isNameMatch) {
      return
    }

    setLoading(true)
    const result = await deleteContact(contact.id)
    setLoading(false)

    if (result.success) {
      onOpenChange(false)
      setConfirmName('')
      router.refresh()
    } else {
      alert(result.error || 'Failed to delete contact')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Delete Contact
          </DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete the contact
            and all associated data (leads, messages, tasks).
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Label htmlFor="confirm-name" className="text-sm font-medium">
            To confirm, type the contact name: <span className="font-bold">{contactName}</span>
          </Label>
          <Input
            id="confirm-name"
            value={confirmName}
            onChange={(e) => setConfirmName(e.target.value)}
            placeholder={contactName || ''}
            className="mt-2"
            autoFocus
          />
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              onOpenChange(false)
              setConfirmName('')
            }}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={!isNameMatch || loading}
          >
            {loading ? 'Deleting...' : 'Delete Contact'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

