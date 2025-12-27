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
import { createPipeline } from '@/app/actions/pipelines'
import { useRouter } from 'next/navigation'

export function CreatePipelineDialog() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    try {
      const result = await createPipeline(formData)
      
      if (result.success) {
        setOpen(false)
        router.refresh()
      } else {
        const errorMessage = result.error || 'Failed to create pipeline'
        const details = result.details ? `\n\nDetails: ${JSON.stringify(result.details, null, 2)}` : ''
        alert(errorMessage + details)
      }
    } catch (error: any) {
      alert(`Error: ${error.message || 'Failed to create pipeline'}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Pipeline
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={async (e) => {
          e.preventDefault()
          const formData = new FormData(e.currentTarget)
          await handleSubmit(formData)
        }}>
          <DialogHeader>
            <DialogTitle>Create Pipeline</DialogTitle>
            <DialogDescription>
              Create a new sales pipeline
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="nombre">Name *</Label>
              <Input id="nombre" name="nombre" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="descripcion">Description</Label>
              <Input id="descripcion" name="descripcion" />
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

