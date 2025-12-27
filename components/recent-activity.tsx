'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ChevronDown } from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'

interface Message {
  id: number
  canal: string | null
  contenido: string | null
  timestamp: Date
  contact: {
    id: number
    nombre: string | null
    email: string
  }
}

interface RecentActivityProps {
  initialMessages: Message[]
}

export function RecentActivity({ initialMessages }: RecentActivityProps) {
  const [displayCount, setDisplayCount] = useState(10)
  const [loading, setLoading] = useState(false)

  const displayedMessages = initialMessages.slice(0, displayCount)
  const hasMore = displayCount < initialMessages.length

  const loadMore = () => {
    setLoading(true)
    setTimeout(() => {
      setDisplayCount((prev) => Math.min(prev + 10, initialMessages.length))
      setLoading(false)
    }, 200)
  }

  return (
    <div className="space-y-4">
      {displayedMessages.map((message) => (
        <div
          key={message.id}
          className="group relative rounded-lg border bg-card p-4 transition-all hover:shadow-md hover:border-primary/20"
        >
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <span className="text-sm font-semibold">
                {(message.contact.nombre || message.contact.email)[0].toUpperCase()}
              </span>
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <Link
                  href={`/app/contacts/${message.contact.id}`}
                  className="font-semibold text-foreground hover:text-primary transition-colors"
                >
                  {message.contact.nombre || message.contact.email}
                </Link>
                {message.canal && (
                  <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                    {message.canal}
                  </span>
                )}
                <span className="ml-auto text-xs text-muted-foreground">
                  {format(new Date(message.timestamp), 'MMM d, HH:mm')}
                </span>
              </div>
              {message.contenido && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {message.contenido}
                </p>
              )}
            </div>
          </div>
        </div>
      ))}
      {hasMore && (
        <div className="flex justify-center pt-2">
          <Button
            variant="outline"
            onClick={loadMore}
            disabled={loading}
            className="w-full"
          >
            {loading ? (
              'Loading...'
            ) : (
              <>
                Ver más ({initialMessages.length - displayCount} restantes)
                <ChevronDown className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      )}
      {displayedMessages.length === 0 && (
        <div className="py-12 text-center text-muted-foreground">
          <p>No hay actividad reciente</p>
        </div>
      )}
    </div>
  )
}

