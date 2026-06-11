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
  username: string,
  token: string | undefined
): Promise<UserType | null> => {
  if (token) {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/${username}/`,
      {
        headers: { Authorization: 'Bearer ' + token },
      }
    )
    if (!res.ok) return null
    return await res.json()
  } else {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/${username}/`
    )
    if (!res.ok) return null
    return await res.json()
  }
}
