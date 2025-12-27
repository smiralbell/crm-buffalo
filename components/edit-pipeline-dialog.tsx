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
import { Edit } from 'lucide-react'
import { updatePipeline } from '@/app/actions/pipelines'
import { useRouter } from 'next/navigation'

interface Pipeline {
  id: number
  nombre: string
  descripcion?: string | null
}

export function EditPipelineDialog({
  pipeline,
  open,
  onOpenChange,
}: {
  pipeline: Pipeline
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    try {
      const result = await updatePipeline(pipeline.id, formData)
      if (result.success) {
        onOpenChange(false)
        router.refresh()
      } else {
        alert(result.error || 'Failed to update pipeline')
      }
    } catch (error: any) {
      alert(`Error: ${error.message || 'Failed to update pipeline'}`)
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
            <DialogTitle>Edit Pipeline</DialogTitle>
            <DialogDescription>
              Update pipeline name and description
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="nombre">Name *</Label>
              <Input
                id="nombre"
                name="nombre"
                defaultValue={pipeline.nombre}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="descripcion">Description</Label>
              <Input
                id="descripcion"
                name="descripcion"
                defaultValue={pipeline.descripcion || ''}
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

