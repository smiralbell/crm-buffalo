import { getAdminCredentials } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

async function getHealthCheck() {
  try {
    await prisma.$queryRaw`SELECT 1`
    return { status: 'healthy', database: 'connected' }
  } catch (error) {
    return { status: 'unhealthy', database: 'disconnected', error: String(error) }
  }
}

export default async function SettingsPage() {
  const credentials = getAdminCredentials()
  const health = await getHealthCheck()

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-2">Application settings and information</p>
      </div>

      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Application Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Version</p>
              <p className="text-sm">1.0.0</p>
            </div>
            <Separator />
            <div>
              <p className="text-sm font-medium text-muted-foreground">Environment</p>
              <p className="text-sm">{process.env.NODE_ENV || 'development'}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Admin Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Admin Email</p>
              <p className="text-sm">{credentials.email}</p>
            </div>
            <Separator />
            <div>
              <p className="text-sm font-medium text-muted-foreground">Password</p>
              <p className="text-sm text-muted-foreground">••••••••</p>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              Configured via CRM_ADMIN_EMAIL and CRM_ADMIN_PASSWORD environment variables
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Health Check</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Status</p>
              <p
                className={`text-sm ${
                  health.status === 'healthy' ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {health.status === 'healthy' ? '✓ Healthy' : '✗ Unhealthy'}
              </p>
            </div>
            <Separator />
            <div>
              <p className="text-sm font-medium text-muted-foreground">Database</p>
              <p
                className={`text-sm ${
                  health.database === 'connected' ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {health.database === 'connected' ? '✓ Connected' : '✗ Disconnected'}
              </p>
            </div>
            {health.error && (
              <>
                <Separator />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Error</p>
                  <p className="text-sm text-red-600">{health.error}</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

