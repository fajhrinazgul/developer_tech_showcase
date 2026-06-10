import { UserType } from './types/user'

export const authMe = async (token: string): Promise<UserType | null> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/auth/me/`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
        credentials: 'include',
      }
    )
    if (!response.ok) {
      return null
    }

    const data: UserType = await response.json()
    return data
  } catch (error) {
    console.error(error)
    return null
  }
}

export const getUserByUsername = async (
  username: string
): Promise<UserType | null> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/${username}/`
  )
  if (!res.ok) return null
  return await res.json()
}
