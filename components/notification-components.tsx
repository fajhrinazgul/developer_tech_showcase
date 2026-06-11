'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { NotificationType } from '@/lib/types/notification'
import { UserType } from '@/lib/types/user'
import { Bell, ExternalLink, Inbox } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { AppSidebar } from './app-sidebar'
import { SidebarProvider, SidebarTrigger } from './ui/sidebar'

interface Props {
  user: UserType | null
  token?: string
}

export default function NotificationComponent({ user, token }: Props) {
  const [notifications, setNotifications] = useState<NotificationType[]>([])
  const [loading, setLoading] = useState(true)

  const router = useRouter()

  useEffect(() => {
    // Ganti dengan URL API Anda
    fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/notifications/`, {
      headers: {
        Authorization: 'Bearer ' + token,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setNotifications(data.results)
        setLoading(false)
      })
      .catch((err) => console.error(err))
  }, [loading])

  const handleRead = async (id: string) => {
    setLoading(true)
    await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/notifications/${id}/read/`,
      {
        method: 'POST',
        headers: { Authorization: 'Bearer ' + token },
      }
    )
    router.refresh()
    setLoading(false)
  }

  return (
    <SidebarProvider>
      <AppSidebar user={user} />
      <main className="flex-1 bg-zinc-950 min-h-screen p-8">
        <SidebarTrigger className="mb-6 text-zinc-400" />
        <div className="p-8 max-w-4xl mx-auto font-mono text-zinc-100">
          <h1 className="text-2xl font-mono text-emerald-400 mb-8">
            $ cat notifications.log
          </h1>

          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="border-b border-zinc-800">
              <CardTitle className="text-sm text-zinc-500 flex items-center gap-2">
                <Bell size={16} /> RECENT_ACTIVITY
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {loading ? (
                <div className="p-8 text-center text-zinc-600 animate-pulse">
                  [loading_notifications...]
                </div>
              ) : notifications.length === 0 ? (
                <div className="p-8 text-center text-zinc-600 flex flex-col items-center gap-2">
                  <Inbox size={48} />
                  <p>No new notifications.</p>
                </div>
              ) : (
                <div className="divide-y divide-zinc-800">
                  {notifications.map((note) => (
                    <div
                      key={note.id}
                      className={`p-4 hover:bg-zinc-800/30 transition-colors flex items-start justify-between gap-4 ${!note.is_read ? 'bg-emerald-950/10' : ''}`}
                    >
                      <div className="flex gap-4">
                        {/* Status Indicator */}
                        <div className="mt-1.5">
                          {!note.is_read && (
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                          )}
                        </div>

                        <div className="space-y-1">
                          <p className="text-sm text-zinc-200">
                            {note.message}
                          </p>
                          <p className="text-xs text-zinc-500">
                            {new Date(note.created_at).toLocaleString()}
                          </p>
                        </div>
                      </div>

                      {!note.is_read && (
                        <button
                          type="button"
                          onClick={() => handleRead(note.id)}
                          className="flex cursor-pointer items-center gap-1 text-xs text-emerald-500 hover:text-emerald-400 shrink-0"
                        >
                          View <ExternalLink size={12} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </SidebarProvider>
  )
}
