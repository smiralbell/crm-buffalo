import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, TrendingUp, CheckSquare, MessageSquare } from 'lucide-react'
import { LeadsOverTimeChart, LeadsByStageChart } from '@/components/dashboard-charts'
import { RecentActivity } from '@/components/recent-activity'

async function getDashboardData() {
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const [
    totalContacts,
    leadsByEstado,
    pendingTasksToday,
    recentMessages,
    leadsOverTime,
    leadsByPipelineStage,
    engagementData,
  ] = await Promise.all([
    prisma.contact.count(),
    prisma.lead.groupBy({
      by: ['estado'],
      _count: true,
    }),
    prisma.task.count({
      where: {
        pendiente: true,
        fecha: {
          lte: new Date(),
        },
      },
    }),
    // Optimizar: solo los últimos 10 mensajes para el componente inicial
    prisma.message.findMany({
      take: 10,
      orderBy: { timestamp: 'desc' },
      select: {
        id: true,
        canal: true,
        contenido: true,
        timestamp: true,
        contact: {
          select: {
            id: true,
            nombre: true,
            email: true,
          },
        },
      },
    }),
    prisma.lead.findMany({
      where: {
        created_at: {
          gte: thirtyDaysAgo,
        },
      },
      select: {
        created_at: true,
      },
      orderBy: {
        created_at: 'asc',
      },
    }),
    (async () => {
      try {
        if (!(prisma as any).pipelineStage) {
          return []
        }
        // Usar raw query para evitar errores si la columna color no existe
        const stages = await (prisma as any).pipelineStage.findMany({
          select: {
            id: true,
            nombre: true,
            position: true,
            _count: {
              select: { leads: true },
            },
          },
          orderBy: {
            position: 'asc',
          },
        })
        return stages
      } catch (error: any) {
        // Si falla por columna inexistente, intentar sin color
        if (error.message?.includes('color')) {
          try {
            return await prisma.$queryRaw`
              SELECT 
                ps.id,
                ps.nombre,
                ps.position,
                COUNT(l.id) as lead_count
              FROM pipeline_stages ps
              LEFT JOIN leads l ON l.pipeline_stage_id = ps.id
              GROUP BY ps.id, ps.nombre, ps.position
              ORDER BY ps.position ASC
            `
          } catch {
            return []
          }
        }
        return []
      }
    })(),
    // Optimizar: usar raw query para contar mensajes por lead de forma eficiente
    prisma.$queryRaw<Array<{ lead_id: number; message_count: bigint }>>`
      SELECT 
        l.id as lead_id,
        COUNT(m.id) as message_count
      FROM leads l
      LEFT JOIN contacts c ON c.id = l.contact_id
      LEFT JOIN messages m ON m.contact_id = c.id
      GROUP BY l.id
    `.then(results => {
      return results.map(r => ({
        _count: {
          messages: Number(r.message_count),
        },
      }))
    }).catch(() => []),
  ])

  const leadsByDay = leadsOverTime.reduce((acc: Record<string, number>, lead: { created_at: Date }) => {
    const date = new Date(lead.created_at).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    })
    acc[date] = (acc[date] || 0) + 1
    return acc
  }, {})

  const leadsOverTimeData = Object.entries(leadsByDay)
    .map(([date, count]) => ({ date, count: count as number }))
    .slice(-14)

  const pipelineStageData = (leadsByPipelineStage || []).map((stage: any) => ({
    name: stage.nombre || stage.name || 'Unknown',
    leads: stage._count?.leads || stage.lead_count || 0,
  }))

  const avgMessagesPerLead =
    engagementData.length > 0
      ? engagementData.reduce((sum: number, lead: { _count: { messages: number } }) => sum + lead._count.messages, 0) /
        engagementData.length
      : 0

  return {
    totalContacts,
    leadsByEstado,
    pendingTasksToday,
    recentMessages,
    leadsOverTimeData,
    pipelineStageData,
    avgMessagesPerLead,
  }
}

export default async function DashboardPage() {
  const data = await getDashboardData()

  return (
    <div className="p-8">

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Contacts</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalContacts}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.leadsByEstado.reduce((acc: number, item: { _count: number }) => acc + item._count, 0)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Tasks Today</CardTitle>
            <CheckSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.pendingTasksToday}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Messages</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.recentMessages.length}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Leads Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <LeadsOverTimeChart data={data.leadsOverTimeData} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Leads by Pipeline Stage</CardTitle>
          </CardHeader>
          <CardContent>
            <LeadsByStageChart data={data.pipelineStageData} />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Leads by Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.leadsByEstado.map((item: { estado: string; _count: number }) => {
                const total = data.leadsByEstado.reduce(
                  (acc: number, i: { _count: number }) => acc + i._count,
                  0
                )
                const percentage = total > 0 ? (item._count / total) * 100 : 0
                const statusColors: Record<string, string> = {
                  frio: 'bg-blue-500',
                  tibio: 'bg-yellow-500',
                  caliente: 'bg-red-500',
                }
                return (
                  <div key={item.estado} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium capitalize text-foreground">
                        {item.estado}
                      </span>
                      <span className="font-semibold text-foreground">{item._count}</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className={`h-full transition-all ${
                          statusColors[item.estado] || 'bg-gray-500'
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                )
              })}
              {data.leadsByEstado.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No leads yet
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Engagement</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-center justify-between rounded-lg bg-muted/50 p-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Avg Messages per Lead
                  </p>
                  <p className="mt-1 text-3xl font-bold text-foreground">
                    {data.avgMessagesPerLead.toFixed(1)}
                  </p>
                </div>
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <MessageSquare className="h-8 w-8 text-primary" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <RecentActivity initialMessages={data.recentMessages} />
        </CardContent>
      </Card>
    </div>
  )
}

