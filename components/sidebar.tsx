'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Users, 
  TrendingUp, 
  CheckSquare, 
  Settings,
  LogOut,
  Workflow
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { logoutAction } from '@/app/actions/auth'
import { Button } from '@/components/ui/button'

const navigation = [
  { name: 'Dashboard', href: '/app/dashboard', icon: LayoutDashboard },
  { name: 'Contacts', href: '/app/contacts', icon: Users },
  { name: 'Leads', href: '/app/leads', icon: TrendingUp },
  { name: 'Pipelines', href: '/app/pipelines', icon: Workflow },
  { name: 'Tasks', href: '/app/tasks', icon: CheckSquare },
  { name: 'Settings', href: '/app/settings', icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-screen w-64 flex-col border-r bg-card">
      <div className="flex h-16 items-center border-b px-6">
        <h1 className="text-xl font-semibold">CRM</h1>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>
      <div className="border-t p-4">
        <form action={logoutAction}>
          <Button
            type="submit"
            variant="ghost"
            className="w-full justify-start gap-3"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </Button>
        </form>
      </div>
    </div>
  )
}

