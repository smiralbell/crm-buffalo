import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { EditContactDialog } from '@/components/edit-contact-dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { format } from 'date-fns'

async function getContact(id: number) {
  const contact = await prisma.contact.findUnique({
    where: { id },
    include: {
      leads: true,
      messages: {
        orderBy: { timestamp: 'desc' },
        take: 20,
      },
      tasks: {
        orderBy: { fecha: 'asc' },
      },
    },
  })

  if (!contact) {
    return null
  }

  return contact
}

export default async function ContactDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const contact = await getContact(Number(params.id))

  if (!contact) {
    notFound()
  }

  const lead = contact.leads[0] || null
  const initials = contact.nombre
    ? contact.nombre
        .split(' ')
        .map((n: string) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : contact.email[0].toUpperCase()

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarFallback className="text-lg">{initials}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold">{contact.nombre || contact.email}</h1>
            <p className="text-muted-foreground">{contact.email}</p>
          </div>
        </div>
        <EditContactDialog contact={contact} />
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
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Name</p>
                  <p className="text-sm">{contact.nombre || '-'}</p>
                </div>
                <Separator />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Email</p>
                  <p className="text-sm">{contact.email}</p>
                </div>
                <Separator />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Phone</p>
                  <p className="text-sm">{contact.telefono || '-'}</p>
                </div>
                <Separator />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Company</p>
                  <p className="text-sm">{contact.empresa || '-'}</p>
                </div>
                <Separator />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Instagram</p>
                  <p className="text-sm">{contact.instagram_user || '-'}</p>
                </div>
                <Separator />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Created</p>
                  <p className="text-sm">
                    {format(new Date(contact.created_at), 'PPp')}
                  </p>
                </div>
                {(contact.direccion_fiscal || contact.ciudad || contact.codigo_postal || contact.pais || contact.cif || contact.dni || contact.iban) && (
                  <>
                    <Separator />
                    <div className="pt-2">
                      <p className="text-sm font-semibold mb-3">Datos fiscales</p>
                      <div className="space-y-3">
                        {contact.direccion_fiscal && (
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Dirección Fiscal</p>
                            <p className="text-sm">{contact.direccion_fiscal}</p>
                          </div>
                        )}
                        {(contact.ciudad || contact.codigo_postal) && (
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Ciudad / Código Postal</p>
                            <p className="text-sm">
                              {[contact.ciudad, contact.codigo_postal].filter(Boolean).join(' ') || '-'}
                            </p>
                          </div>
                        )}
                        {contact.pais && (
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">País</p>
                            <p className="text-sm">{contact.pais}</p>
                          </div>
                        )}
                        {contact.cif && (
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">CIF</p>
                            <p className="text-sm">{contact.cif}</p>
                          </div>
                        )}
                        {contact.dni && (
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">DNI</p>
                            <p className="text-sm">{contact.dni}</p>
                          </div>
                        )}
                        {contact.iban && (
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">IBAN</p>
                            <p className="text-sm">{contact.iban}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {lead && (
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
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="messages" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Messages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {contact.messages.map((message: any) => (
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
                {contact.messages.length === 0 && (
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
                {contact.tasks.map((task: any) => (
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
                {contact.tasks.length === 0 && (
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

