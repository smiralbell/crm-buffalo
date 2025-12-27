'use client'

import { Button } from '@/components/ui/button'
import { Check, X } from 'lucide-react'
import { toggleTask } from '@/app/actions/tasks'
import { useRouter } from 'next/navigation'

export function ToggleTaskButton({
  taskId,
  currentStatus,
}: {
  taskId: number
  currentStatus: boolean
}) {
  const router = useRouter()

  async function handleToggle() {
    const result = await toggleTask(taskId, !currentStatus)
    if (result.success) {
      router.refresh()
    } else {
      alert(result.error || 'Failed to update task')
    }
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleToggle}
      title={currentStatus ? 'Mark as completed' : 'Mark as pending'}
    >
      {currentStatus ? (
        <Check className="h-4 w-4" />
      ) : (
        <X className="h-4 w-4" />
      )}
    </Button>
  )
}

