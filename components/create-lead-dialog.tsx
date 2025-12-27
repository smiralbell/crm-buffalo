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
  DialogTrigger,
} from '@/components/ui/dialog'
import { Plus } from 'lucide-react'
import { createLead } from '@/app/actions/leads'
import { useRouter } from 'next/navigation'

export function CreateLeadDialog() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [contacts, setContacts] = useState<Array<{ id: number; nombre: string | null; email: string }>>([])
  const router = useRouter()

  const loadContacts = async () => {
    const response = await fetch('/api/contacts-without-leads')
    const data = await response.json()
    setContacts(data)
  }

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    const result = await createLead(formData)
    setLoading(false)
    
    if (result.success) {
      setOpen(false)
      router.refresh()
    } else {
      alert(result.error || 'Failed to create lead')
    }
  }

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      setOpen(newOpen)
      if (newOpen) {
        loadContacts()
      }
    }}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Lead
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={async (e) => {
          e.preventDefault()
          const formData = new FormData(e.currentTarget)
          await handleSubmit(formData)
        }}>
          <DialogHeader>
            <DialogTitle>Create Lead</DialogTitle>
            <DialogDescription>
              Create a new lead from an existing contact
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="contact_id">Contact *</Label>
              <select
                id="contact_id"
                name="contact_id"
                required
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="">Select a contact</option>
                {contacts.map((contact) => (
                  <option key={contact.id} value={contact.id}>
                    {contact.nombre || contact.email}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="estado">Status</Label>
              <select
                id="estado"
                name="estado"
                defaultValue="frio"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="frio">Frio</option>
                <option value="tibio">Tibio</option>
                <option value="caliente">Caliente</option>
              </select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="prioridad">Priority</Label>
              <select
                id="prioridad"
                name="prioridad"
                defaultValue="media"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="baja">Baja</option>
                <option value="media">Media</option>
                <option value="alta">Alta</option>
              </select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="score">Score</Label>
              <Input id="score" name="score" type="number" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="origen_principal">Origin</Label>
              <Input id="origen_principal" name="origen_principal" />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

