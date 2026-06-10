import { ProjectType } from './types/project'

export const getProject = async (
  id: string,
  token: string | undefined
): Promise<ProjectType | null> => {
  if (token != undefined) {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/projects/${id}/`,
      {
        cache: 'no-store',
        headers: {
          Authorization: 'Bearer ' + token,
        },
        credentials: 'include',
      }
    )
    if (!res.ok) return null
    return res.json()
  } else {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/projects/${id}/`,
      {
        cache: 'no-store',
      }
    )
    if (!res.ok) return null
    return res.json()
  }
}

export async function getProjectData(id: string, token: string | undefined) {
  if (token != undefined) {
    const [projectRes, commentRes] = await Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/projects/${id}/`, {
        cache: 'no-store',
        headers: { Authorization: `Bearer ${token}` },
        credentials: 'include',
      }),
      fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/projects/${id}/comments/`,
        {
          cache: 'no-store',
          headers: { Authorization: 'Bearer ' + token },
          credentials: 'include',
        }
      ),
    ])

    const project = projectRes.ok ? await projectRes.json() : null
    const comments = commentRes.ok
      ? await commentRes.json()
      : { count: 0, results: [] }

    return { project, comments }
  } else {
    const [projectRes, commentRes] = await Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/projects/${id}/`, {
        cache: 'no-store',
      }),
      fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/projects/${id}/comments/`,
        { cache: 'no-store' }
      ),
    ])

    const project = projectRes.ok ? await projectRes.json() : null
    const comments = commentRes.ok
      ? await commentRes.json()
      : { count: 0, results: [] }

    return { project, comments }
  }
}

export const getProjectsUser = async (
  token: string,
  author: string
): Promise<{
  count: number
  next: string | null
  previous: string | null
  results: ProjectType[]
} | null> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/projects/?author=${author}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        credentials: 'include',
        cache: 'no-store',
      }
    )

    const data = await response.json()
    return data
  } catch (error) {
    console.error(error)
    return null
  }
}
