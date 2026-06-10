import { ProjectDetail } from '@/components/project-detail'
import { authMe } from '@/lib/auth'
import { getProject, getProjectData } from '@/lib/projects'
import { Metadata, ResolvingMetadata } from 'next'
import { cookies } from 'next/headers'

type Props = {
  params: Promise<{ id: string }>
}

export async function generateMetadata(
  { params }: Props,
  _parent: ResolvingMetadata
): Promise<Metadata> {
  const { id } = await params
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value
  const project = await getProject(id, token)

  // 3. Clean the description for meta tags (Remove markdown symbols)
  const description =
    project?.description &&
    project.description
      .replace(/[#*`[\]]/g, '') // Removes basic markdown characters
      .substring(0, 160) // SEO descriptions should be < 160 chars

  // 4. Return complete metadata
  return {
    title: project?.title,
    description: description,

    // Open Graph (WhatsApp, Discord, LinkedIn, etc.)
    openGraph: {
      title: project?.title,
      description: description,
      images: [project?.thumbnail || ''],
      type: 'article',
    },

    // Twitter (X)
    twitter: {
      card: 'summary_large_image',
      title: project?.title || '',
      description: description,
      images: [project?.thumbnail || ''],
    },

    // Best practice for SEO: Canonical URL
    alternates: {
      canonical: `/projects/${id}`,
    },
  }
}

export default async function ProjectDetailPage({ params }: Props) {
  const { id } = await params
  const cookieStore = await cookies()
  const token = cookieStore.get('access_token')?.value
  const { project, comments } = await getProjectData(id, token)

  const thisUser = await authMe(token || '')

  if (!project)
    return (
      <div className="text-zinc-500 font-mono p-10">
        404: Project not found.
      </div>
    )

  return (
    <ProjectDetail
      project={project}
      initialComments={comments}
      thisUser={thisUser}
    />
  )
}
