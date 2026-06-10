import { ProjectCard } from '@/components/project-card'

async function getProjects() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/api/projects/`,
    {
      cache: 'no-store',
    }
  )

  if (!res.ok) return { results: [] }
  return res.json()
}

export default async function HomePage() {
  const data = await getProjects()
  const projects = data.results || [] // Mengambil array dari 'results'

  return (
    <main className="container mx-auto py-12 px-4">
      <header className="mb-12">
        <h1 className="text-3xl font-mono text-emerald-400">
          $ ls -la /projects
        </h1>
        <p className="text-zinc-400 font-mono text-sm mt-2">
          // System scan: {data.count || 0} repositories found
        </p>
      </header>

      {projects.length === 0 ? (
        <div className="text-zinc-600 font-mono border border-zinc-800 p-8 rounded-lg text-center">
          // No projects in repository
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project: any) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </main>
  )
}
