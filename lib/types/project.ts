import { UserType } from './user'

export type TechStackType = {
  id: string
  name: string
}

export type ProjectType = {
  id: string
  title: string
  slug: string
  description: string
  thumbnail: string
  demo_url: string
  source_code_url: string
  tech_stack: TechStackType[]
  is_published: boolean
  is_liked: boolean
  created_at: string
  likes_count: number
  comments_count: number
  bookmarks_count: number
  view_count: number
  is_bookmarked: boolean
  author: UserType
}
