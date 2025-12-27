import { prisma } from '@/lib/prisma'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CreateLeadDialog } from '@/components/create-lead-dialog'
import { LeadRowActions } from '@/components/lead-row-actions'

async function getLeads(estado?: string, prioridad?: string) {
  const where: any = {}
  if (estado && estado !== 'all') {
    where.estado = estado
  }
  if (prioridad && prioridad !== 'all') {
    where.prioridad = prioridad
  }

  return prisma.lead.findMany({
    where,
    include: {
      contact: {
        select: {
          id: true,
          nombre: true,
          email: true,
        },
      },
    },
    orderBy: { created_at: 'desc' },
  })
}

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: { estado?: string; prioridad?: string }
}) {
  const leads = await getLeads(searchParams.estado, searchParams.prioridad)

  return (
    <div className="p-8">
      <Card>
        <CardHeader>
          <form action="/app/leads" method="get" className="flex gap-2">
            <Select name="estado" defaultValue={searchParams.estado || 'all'}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="frio">Frio</SelectItem>
                <SelectItem value="tibio">Tibio</SelectItem>
                <SelectItem value="caliente">Caliente</SelectItem>
              </SelectContent>
            </Select>
            <Select name="prioridad" defaultValue={searchParams.prioridad || 'all'}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="baja">Baja</SelectItem>
                <SelectItem value="media">Media</SelectItem>
                <SelectItem value="alta">Alta</SelectItem>
              </SelectContent>
            </Select>
            <Button type="submit">Filter</Button>
            <CreateLeadDialog />
          </form>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-3 text-left text-sm font-medium">Contact</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Priority</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Score</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Origin</th>
                  <th className="px-4 py-3 text-right text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead: any) => (
                  <tr key={lead.id} className="border-b hover:bg-muted/50">
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium">
                          {lead.contact.nombre || lead.contact.email}
                        </p>
                        <p className="text-sm text-muted-foreground">{lead.contact.email}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm capitalize">{lead.estado}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm capitalize">{lead.prioridad}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm">{lead.score || '-'}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm">{lead.origen_principal || '-'}</span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <LeadRowActions lead={{
                        id: lead.id,
                        estado: lead.estado,
                        origen_principal: lead.origen_principal,
                        prioridad: lead.prioridad,
                        score: lead.score,
                        contact: lead.contact,
                      }} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {leads.length === 0 && (
              <div className="py-12 text-center text-muted-foreground">
                No leads found
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

