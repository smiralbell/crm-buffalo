'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { AlertTriangle } from 'lucide-react'
import { deleteStage } from '@/app/actions/pipelines'
import { useRouter } from 'next/navigation'

interface Stage {
  id: number
  nombre: string
  leadCount: number
}

export function DeleteStageDialog({
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

  async function handleDelete() {
    if (stage.leadCount > 0) {
      alert('Cannot delete stage with leads. Please move or delete leads first.')
      return
    }

    setLoading(true)
    try {
      const result = await deleteStage(stage.id)
      if (result.success) {
        onOpenChange(false)
        router.refresh()
      } else {
        alert(result.error || 'Failed to delete stage')
      }
    } catch (error: any) {
      alert(`Error: ${error.message || 'Failed to delete stage'}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Delete Stage
          </DialogTitle>
          <DialogDescription>
            {stage.leadCount > 0
              ? `This stage has ${stage.leadCount} lead(s). Please move or delete them first.`
              : 'This action cannot be undone. This will permanently delete the stage.'}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={loading || stage.leadCount > 0}
          >
            {loading ? 'Deleting...' : 'Delete Stage'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

