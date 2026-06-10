import { DashboardComponentHome } from '@/components/dashboard-components'
import { authMe } from '@/lib/auth'
import { Metadata, ResolvingMetadata } from 'next'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

type Props = {
  params: Promise<{ id: string }>
  searchParams: Promise<{ [key: string]: string | undefined | [] }>
}

export const generateMetadata = async (
  { params, searchParams }: Props,
  _parent: ResolvingMetadata
): Promise<Metadata> => {
  const cookieStore = await cookies()
  const token = cookieStore.get('access_token')?.value || ''
  if (!token) redirect('/login')
  const thisUser = await authMe(token)

  // Berikan judul fallback jika user tidak login
  if (!thisUser) {
    return { title: 'Login Required' }
  }

  return {
    title: `Dashboard ${thisUser.first_name} ${thisUser.last_name}`,
  }
}

const DashboardPage = async ({ params, searchParams }: Props) => {
  const cookieStore = await cookies()
  const token = cookieStore.get('access_token')?.value
  if (!token) {
    redirect('/login')
  }
  const thisUser = await authMe(token)

  // Jika tidak ada user, arahkan ke login
  if (!thisUser) {
    redirect('/login')
  }

  // Setelah baris di atas, TypeScript tahu bahwa thisUser pasti bukan null
  return <DashboardComponentHome user={thisUser} />
}

export default DashboardPage
