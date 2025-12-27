import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { EditLeadDialog } from '@/components/edit-lead-dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { format } from 'date-fns'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

async function getLead(id: number) {
  const lead = await prisma.lead.findUnique({
    where: { id },
    include: {
      contact: true,
      messages: {
        orderBy: { timestamp: 'desc' },
        take: 20,
      },
      tasks: {
        orderBy: { fecha: 'asc' },
      },
    },
  })

  if (!lead) {
    return null
  }

  return lead
}

export default async function LeadDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const lead = await getLead(Number(params.id))

  if (!lead) {
    notFound()
  }

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Lead Details</h1>
          <p className="text-muted-foreground mt-2">
            <Link href={`/app/contacts/${lead.contact.id}`} className="hover:underline">
              {lead.contact.nombre || lead.contact.email}
            </Link>
          </p>
        </div>
        <EditLeadDialog lead={lead} />
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="messages">Messages</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Lead Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Status</p>
                  <p className="text-sm capitalize">{lead.estado}</p>
                </div>
                <Separator />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Priority</p>
                  <p className="text-sm capitalize">{lead.prioridad}</p>
                </div>
                <Separator />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Score</p>
                  <p className="text-sm">{lead.score || '-'}</p>
                </div>
                <Separator />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Origin</p>
                  <p className="text-sm">{lead.origen_principal || '-'}</p>
                </div>
                <Separator />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Last Interaction</p>
                  <p className="text-sm">
                    {lead.ultima_interaccion
                      ? format(new Date(lead.ultima_interaccion), 'PPp')
                      : '-'}
                  </p>
                </div>
                <Separator />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Created</p>
                  <p className="text-sm">
                    {format(new Date(lead.created_at), 'PPp')}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Name</p>
                  <p className="text-sm">{lead.contact.nombre || '-'}</p>
                </div>
                <Separator />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Email</p>
                  <p className="text-sm">{lead.contact.email}</p>
                </div>
                <Separator />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Phone</p>
                  <p className="text-sm">{lead.contact.telefono || '-'}</p>
                </div>
                <Separator />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Company</p>
                  <p className="text-sm">{lead.contact.empresa || '-'}</p>
                </div>
                <Separator />
                <div>
                  <Link href={`/app/contacts/${lead.contact.id}`}>
                    <Button variant="outline" size="sm">
                      View Full Contact
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="messages" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Messages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {lead.messages.map((message: any) => (
                  <div key={message.id} className="border-b pb-4 last:border-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{message.canal || 'Unknown'}</span>
                        {message.direccion && (
                          <span className="text-xs text-muted-foreground">
                            ({message.direccion})
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(message.timestamp), 'PPp')}
                      </span>
                    </div>
                    <p className="text-sm">{message.contenido || '-'}</p>
                  </div>
                ))}
                {lead.messages.length === 0 && (
                  <p className="text-sm text-muted-foreground">No messages yet</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tasks" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {lead.tasks.map((task: any) => (
                  <div key={task.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                    <div className="flex-1">
                      <p className="text-sm font-medium">{task.tarea}</p>
                      {task.fecha && (
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(task.fecha), 'PPp')}
                        </p>
                      )}
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        task.pendiente
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {task.pendiente ? 'Pending' : 'Completed'}
                    </span>
                  </div>
                ))}
                {lead.tasks.length === 0 && (
                  <p className="text-sm text-muted-foreground">No tasks yet</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

