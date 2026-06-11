'use client'

import { UserType } from '@/lib/types/user'
import React, { useEffect } from 'react'
import { toast, Toaster } from 'sonner'

interface Props {
  children?: React.ReactNode
  user: UserType | null
  token?: string
}

export function NotificationProvider({ children, user, token }: Props) {
  if (!user) {
    return (
      <>
        <Toaster theme="dark" position="top-right" expand={true} richColors />
        {children}
      </>
    )
  } else {
    useEffect(() => {
      const wsUrl = `${process.env.NEXT_PUBLIC_WEBSOCKET_URL}/ws/notifications/?access_token=${token}`
      const socket = new WebSocket(wsUrl)

      socket.onopen = () => {
        console.log('WebSocket Connected')
      }
      socket.onmessage = (event) => {
        const data = JSON.parse(event.data)
        console.log('Notification for me:', data)

        if (data.action === 'create' && user.id === data.to_user) {
          // Tambahkan ke daftar notifikasi
          // setNotifications((prev) => [data, ...prev]);
          toast(data.message, {
            id: data.notification_id,
            style: {
              background: '#18181b', // zinc-900
              border: '1px solid #10b981', // emerald-500
              color: '#10b981',
              fontFamily: 'monospace',
            },
            icon: '>>',
          })
        } else if (data.action === 'delete' && user.id === data.to_user) {
          toast.dismiss(data.notification_id)
        }
      }

      socket.onclose = () => {
        console.log('WebSocket Disconnected')
      }

      return () => {
        socket.close()
      }
    }, [])

    return (
      <>
        <Toaster theme="dark" position="top-right" expand={true} richColors />
        {children}
      </>
    )
  }
}
