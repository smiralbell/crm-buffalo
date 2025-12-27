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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Edit } from 'lucide-react'
import { updateLead } from '@/app/actions/leads'
import { useRouter } from 'next/navigation'

interface Lead {
  id: number
  estado: string
  origen_principal: string | null
  prioridad: string
  score: number | null
}

export function EditLeadDialog({ 
  lead,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange
}: { 
  lead: Lead
  open?: boolean
  onOpenChange?: (open: boolean) => void
}) {
  const [internalOpen, setInternalOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const open = controlledOpen !== undefined ? controlledOpen : internalOpen
  const setOpen = controlledOnOpenChange || setInternalOpen

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    const result = await updateLead(lead.id, formData)
    setLoading(false)
    
    if (result.success) {
      setOpen(false)
      router.refresh()
    } else {
      alert(result.error || 'Failed to update lead')
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {controlledOpen === undefined && (
        <DialogTrigger asChild>
          <Button variant="outline">
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
        </DialogTrigger>
      )}
      <DialogContent>
        <form onSubmit={async (e) => {
          e.preventDefault()
          const formData = new FormData(e.currentTarget)
          await handleSubmit(formData)
        }}>
          <DialogHeader>
            <DialogTitle>Edit Lead</DialogTitle>
            <DialogDescription>
              Update lead information
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="estado">Status</Label>
              <Select name="estado" defaultValue={lead.estado}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="frio">Frio</SelectItem>
                  <SelectItem value="tibio">Tibio</SelectItem>
                  <SelectItem value="caliente">Caliente</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="prioridad">Priority</Label>
              <Select name="prioridad" defaultValue={lead.prioridad}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="baja">Baja</SelectItem>
                  <SelectItem value="media">Media</SelectItem>
                  <SelectItem value="alta">Alta</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="score">Score</Label>
              <Input
                id="score"
                name="score"
                type="number"
                defaultValue={lead.score || ''}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="origen_principal">Origin</Label>
              <Input
                id="origen_principal"
                name="origen_principal"
                defaultValue={lead.origen_principal || ''}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Updating...' : 'Update'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

