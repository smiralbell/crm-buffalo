import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CreateTaskDialog } from '@/components/create-task-dialog'
import { ToggleTaskButton } from '@/components/toggle-task-button'
import { format } from 'date-fns'
import Link from 'next/link'

async function getTasks(pendiente?: string) {
  const where: any = {}
  if (pendiente === 'true') {
    where.pendiente = true
  } else if (pendiente === 'false') {
    where.pendiente = false
  }

  return prisma.task.findMany({
    where,
    include: {
      contact: {
        select: {
          id: true,
          nombre: true,
          email: true,
        },
      },
      lead: {
        include: {
          contact: {
            select: {
              id: true,
              nombre: true,
              email: true,
            },
          },
        },
      },
    },
    orderBy: [
      { pendiente: 'desc' },
      { fecha: 'asc' },
    ],
  })
}

export default async function TasksPage({
  searchParams,
}: {
  searchParams: { pendiente?: string }
}) {
  const tasks = await getTasks(searchParams.pendiente)

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Tasks</h1>
          <p className="text-muted-foreground mt-2">Manage your tasks</p>
        </div>
        <CreateTaskDialog />
      </div>

      <Card>
        <CardHeader>
          <div className="flex gap-2">
            <Link href="/app/tasks">
              <Button
                variant={searchParams.pendiente === undefined ? 'default' : 'outline'}
                size="sm"
              >
                All
              </Button>
            </Link>
            <Link href="/app/tasks?pendiente=true">
              <Button
                variant={searchParams.pendiente === 'true' ? 'default' : 'outline'}
                size="sm"
              >
                Pending
              </Button>
            </Link>
            <Link href="/app/tasks?pendiente=false">
              <Button
                variant={searchParams.pendiente === 'false' ? 'default' : 'outline'}
                size="sm"
              >
                Completed
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {tasks.map((task: any) => {
              const relatedEntity = task.contact || task.lead?.contact
              return (
                <div
                  key={task.id}
                  className="flex items-center justify-between border-b pb-4 last:border-0"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">{task.tarea}</p>
                      {relatedEntity && (
                        <Link
                          href={
                            task.contact_id
                              ? `/app/contacts/${task.contact_id}`
                              : `/app/leads/${task.lead_id}`
                          }
                          className="text-xs text-primary hover:underline"
                        >
                          ({relatedEntity.nombre || relatedEntity.email})
                        </Link>
                      )}
                    </div>
                    {task.fecha && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Due: {format(new Date(task.fecha), 'PPp')}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        task.pendiente
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {task.pendiente ? 'Pending' : 'Completed'}
                    </span>
                    <ToggleTaskButton taskId={task.id} currentStatus={task.pendiente} />
                  </div>
                </div>
              )
            })}
            {tasks.length === 0 && (
              <div className="py-12 text-center text-muted-foreground">
                No tasks found
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

