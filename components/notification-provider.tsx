'use client'

import Cookies from 'js-cookie'
import { useEffect } from 'react'
import { toast, Toaster } from 'sonner'
export function NotificationProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const token = Cookies.get('access_token')
  useEffect(() => {
    // URL WebSocket Anda
    const token = Cookies.get('access_token') || ''
    const wsUrl = 'ws://127.0.0.1:8000/ws/notifications/?access_token=' + token
    const socket = new WebSocket(wsUrl)

    socket.onopen = () => {
      console.log('WebSocket Connected')
    }

    // socket.onmessage = (event) => {
    //   const data = JSON.parse(event.data)

    //   // Menampilkan Toast saat ada data masuk
    //   toast(data.message, {
    //     style: {
    //       background: '#18181b', // zinc-900
    //       border: '1px solid #10b981', // emerald-500
    //       color: '#10b981',
    //       fontFamily: 'monospace',
    //     },
    //     icon: '>>',
    //   })

    //   // Opsional: Anda bisa memicu re-fetch data notifikasi di sini
    //   // dengan menggunakan event bus atau state management
    // }
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data)

      if (data.action === 'create') {
        // Tambahkan ke daftar notifikasi
        // setNotifications((prev) => [data, ...prev]);
        toast(data.message, {
          style: {
            background: '#18181b', // zinc-900
            border: '1px solid #10b981', // emerald-500
            color: '#10b981',
            fontFamily: 'monospace',
          },
          icon: '>>',
        })
      } else if (data.action === 'delete') {
        // Hapus dari daftar notifikasi berdasarkan ID
        // toast.info("Delete", {"des"})
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
