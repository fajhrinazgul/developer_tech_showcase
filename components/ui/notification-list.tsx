'use client'
import { NotificationType } from '@/lib/types/notification'
import Cookies from 'js-cookie'
import { ExternalLink } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function NotificationList({ note }: { note: NotificationType }) {
  const router = useRouter()
  const token = Cookies.get('token')
  const handleRead = async (id: string) => {
    await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/notifications/${id}/read/`,
      {
        method: 'POST',
        headers: { Authorization: 'Bearer ' + token },
        credentials: 'include',
      }
    )
    router.refresh()
  }

  return (
    <div
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
          <p className="text-sm text-zinc-200">{note.message}</p>
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
  )
}
