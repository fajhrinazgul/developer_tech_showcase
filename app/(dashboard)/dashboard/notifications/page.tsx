import NotificationComponent from '@/components/notification-components'
import { authMe } from '@/lib/auth'
import { Metadata, ResolvingMetadata } from 'next'
import { cookies } from 'next/headers'

type Props = {
  params: Promise<{ id: string }>
  searchParams: Promise<{ [key: string]: string | undefined | [] }>
}

export const generateMetadata = async (
  { params, searchParams }: Props,
  _parent: ResolvingMetadata
): Promise<Metadata> => {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value || ''
  const thisUser = await authMe(token)

  // Berikan judul fallback jika user tidak login
  if (!thisUser) {
    return { title: 'Login Required' }
  }

  return {
    title: `${thisUser.first_name} ${thisUser.last_name} Notification's`,
  }
}

export default function NotificationPage() {
  return <NotificationComponent />
}
