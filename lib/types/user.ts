export type UserType = {
  id: string
  username: string
  first_name: string
  last_name: string
  email: string
  bio: string
  avatar?: string | null
  github_url: string
  linkedin_url: string
  website_url: string
  followers_count: number
  following_count: number
  projects_count: number
  total_comments_received: number
  date_joined: string
}
