import { MyProjectsComponent } from '@/components/my-project-component'
import { authMe } from '@/lib/auth'
import { getProjectsUser } from '@/lib/projects'
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
  const token = cookieStore.get('token')?.value || ''
  const thisUser = await authMe(token)

  // Berikan judul fallback jika user tidak login
  if (!thisUser) {
    return { title: 'Login Required' }
  }

  return {
    title: `${thisUser.first_name} ${thisUser.last_name} Project's`,
  }
}

const MyProjectPage = async ({ params, searchParams }: Props) => {
  const cookieStore = await cookies()
  const token = cookieStore.get('access_token')?.value || ''
  const thisUser = await authMe(token)

  // Jika tidak ada user, arahkan ke login
  if (!thisUser) {
    redirect('/login')
  }

  const projects = await getProjectsUser(token, thisUser.username)

  // Setelah baris di atas, TypeScript tahu bahwa thisUser pasti bukan null
  return <MyProjectsComponent projects={projects?.results} />
}

export default MyProjectPage
