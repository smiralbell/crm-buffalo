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
import { updateStage } from '@/app/actions/pipelines'
import { useRouter } from 'next/navigation'

interface Stage {
  id: number
  nombre: string
  color?: string | null
}

export function EditStageDialog({
  stage,
  open,
  onOpenChange,
}: {
  stage: Stage
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    try {
      const result = await updateStage(stage.id, formData)
      if (result.success) {
        onOpenChange(false)
        router.refresh()
      } else {
        alert(result.error || 'Failed to update stage')
      }
    } catch (error: any) {
      alert(`Error: ${error.message || 'Failed to update stage'}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={async (e) => {
          e.preventDefault()
          const formData = new FormData(e.currentTarget)
          await handleSubmit(formData)
        }}>
          <DialogHeader>
            <DialogTitle>Edit Stage</DialogTitle>
            <DialogDescription>
              Update stage name and color
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="nombre">Name *</Label>
              <Input
                id="nombre"
                name="nombre"
                defaultValue={stage.nombre}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="color">Color (hex)</Label>
              <Input
                id="color"
                name="color"
                type="color"
                defaultValue={stage.color || '#3b82f6'}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

