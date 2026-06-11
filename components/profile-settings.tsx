'use client'

import { Loader2, Terminal, User } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { toast } from 'sonner'

// Shadcn UI Components
import { AppSidebar } from '@/components/app-sidebar'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { Textarea } from '@/components/ui/textarea'

// Types
import { UserType } from '@/lib/types/user'

// Extended Interface khusus untuk serializer profile data lengkap
interface ProfileUser {
  id: string
  username: string
  first_name: string
  last_name: string
  email: string
  bio: string
  avatar?: string | null | File
  github_url: string
  linkedin_url: string
  website_url: string
  followers_count: number
  following_count: number
  projects_count: number
  total_comments_received: number
  date_joined: string
  is_following: boolean
}

export const ProfileSettingsComponent = ({
  user,
  token,
}: {
  user: UserType | null
  token: string | undefined
}) => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)

  // State Form terikat penuh ke format UserSerializer Django
  const [profileForm, setProfileForm] = useState<ProfileUser>({
    id: user?.id || '',
    username: user?.username || '',
    email: user?.email || '',
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    bio: user?.bio || '',
    avatar: null,
    github_url: user?.github_url || '',
    linkedin_url: user?.linkedin_url || '',
    website_url: user?.website_url || '',
    followers_count: user?.followers_count || 0,
    following_count: user?.following_count || 0,
    projects_count: user?.projects_count || 0,
    total_comments_received: user?.total_comments_received || 0,
    date_joined: user?.date_joined || '',
    is_following: user?.is_following || false,
  })

  useEffect(() => {
    const fetchFullProfile = async () => {
      if (!token) return
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/auth/me/`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        if (!response.ok) throw new Error('Failed to parse metadata')

        const data = await response.json()

        const sanitizedData = Object.fromEntries(
          Object.entries(data).map(([key, val]) => [
            key,
            val === null ? '' : val,
          ])
        )

        setProfileForm((prev) => ({ ...prev, ...sanitizedData }))

        if (typeof data.avatar === 'string') {
          setAvatarPreview(data.avatar)
        }
      } catch (error) {
        toast.error('Failed to sync profile configuration')
      }
    }

    fetchFullProfile()
  }, [token, user])

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setProfileForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setProfileForm((prev: any) => ({ ...prev, avatar: file }))
      setAvatarPreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData()
    formData.append('first_name', profileForm.first_name || '')
    formData.append('last_name', profileForm.last_name || '')
    formData.append('bio', profileForm.bio || '')
    formData.append('github_url', profileForm.github_url || '')
    formData.append('linkedin_url', profileForm.linkedin_url || '')
    formData.append('website_url', profileForm.website_url || '')

    if (profileForm.avatar instanceof File) {
      formData.append('avatar', profileForm.avatar)
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/${profileForm.username}/`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      )

      if (!response.ok) throw new Error('PATCH execution error')

      const updatedData: ProfileUser = await response.json()
      setProfileForm(updatedData)
      toast.success('Profile codebase compiled successfully')

      router.refresh()
    } catch (error) {
      toast.error('Compilation failed: core registry rejected updates')
    } finally {
      setLoading(false)
    }
  }

  return (
    <SidebarProvider>
      <AppSidebar user={user} />

      <main className="flex-1 bg-zinc-950 min-h-screen p-8 font-mono text-zinc-100">
        <SidebarTrigger className="mb-6 text-zinc-400" />
        <div className="w-full">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-mono text-emerald-400">
                $ ./configure_profile.sh
              </h1>
              <p className="text-xs text-zinc-500 font-mono mt-1">
                Registry ID: {profileForm.id || 'FETCHING...'} | Core Joined:{' '}
                {profileForm.date_joined
                  ? new Date(profileForm.date_joined).toLocaleDateString()
                  : '-'}
              </p>
            </div>

            <div className="flex gap-3 text-xs font-mono w-full md:w-auto">
              <div className="bg-zinc-900 px-4 py-2 border border-zinc-800 text-center min-w-20">
                <span className="text-zinc-500 block text-[10px]">
                  PROJECTS
                </span>
                <span className="font-bold text-emerald-400">
                  {profileForm.projects_count}
                </span>
              </div>
              <div className="bg-zinc-900 px-4 py-2 border border-zinc-800 text-center min-w-20">
                <span className="text-zinc-500 block text-[10px]">
                  FOLLOWERS
                </span>
                <span className="font-bold text-emerald-400">
                  {profileForm.followers_count}
                </span>
              </div>
              <div className="bg-zinc-900 px-4 py-2 border border-zinc-800 text-center min-w-20">
                <span className="text-zinc-500 block text-[10px]">
                  COMMENTS
                </span>
                <span className="font-bold text-emerald-400">
                  {profileForm.total_comments_received}
                </span>
              </div>
            </div>
          </div>

          <Card className="bg-zinc-900 border-zinc-800 rounded-none shadow-2xl">
            <CardHeader className="border-b border-zinc-800 bg-zinc-900/50 p-6">
              <CardTitle className="text-md font-mono text-zinc-300 flex items-center gap-2">
                <Terminal size={16} className="text-emerald-500" /> nano
                profile.conf
              </CardTitle>
              <CardDescription className="text-xs text-zinc-500 font-mono">
                // Modify user metadata settings environment below
              </CardDescription>
            </CardHeader>

            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Upload Avatar Form */}
                <div className="flex flex-col sm:flex-row items-center gap-6 bg-zinc-950 p-4 border border-zinc-800">
                  <Avatar className="w-20 h-20 border border-zinc-700 rounded-none bg-zinc-900">
                    <AvatarImage
                      src={avatarPreview || undefined}
                      className="object-cover"
                    />
                    <AvatarFallback className="bg-zinc-900 text-zinc-700 font-mono text-xs rounded-none">
                      <User size={24} />
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-2 w-full sm:w-auto">
                    <Label
                      htmlFor="avatar"
                      className="text-xs font-bold text-emerald-400 tracking-wider"
                    >
                      // update_avatar_img
                    </Label>
                    <Input
                      id="avatar"
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="bg-transparent border-none text-xs text-zinc-400 file:text-emerald-400 file:bg-zinc-900 file:border-zinc-800 cursor-pointer h-auto p-0"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-zinc-500 tracking-wider">
                      USERNAME (SYSTEM_LOCK)
                    </Label>
                    <Input
                      type="text"
                      value={profileForm.username}
                      disabled
                      className="bg-zinc-950/40 border-zinc-900 text-zinc-600 font-mono cursor-not-allowed select-none rounded-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-zinc-500 tracking-wider">
                      EMAIL_ADDRESS (SYSTEM_LOCK)
                    </Label>
                    <Input
                      type="email"
                      value={profileForm.email}
                      disabled
                      className="bg-zinc-950/40 border-zinc-900 text-zinc-600 font-mono cursor-not-allowed select-none rounded-none"
                    />
                  </div>
                </div>

                <div className="border-t border-zinc-800/50" />

                {/* Editable Identity Inputs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="first_name"
                      className="text-xs font-bold text-emerald-500 tracking-wider"
                    >
                      FIRST_NAME
                    </Label>
                    <Input
                      id="first_name"
                      name="first_name"
                      type="text"
                      value={profileForm.first_name || ''}
                      onChange={handleChange}
                      placeholder="Input first name"
                      className="bg-zinc-950 border-zinc-800 text-zinc-100 placeholder:text-zinc-700 focus-visible:ring-emerald-500 rounded-none font-mono"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="last_name"
                      className="text-xs font-bold text-emerald-500 tracking-wider"
                    >
                      LAST_NAME
                    </Label>
                    <Input
                      id="last_name"
                      name="last_name"
                      type="text"
                      value={profileForm.last_name || ''}
                      onChange={handleChange}
                      placeholder="Input last name"
                      className="bg-zinc-950 border-zinc-800 text-zinc-100 placeholder:text-zinc-700 focus-visible:ring-emerald-500 rounded-none font-mono"
                    />
                  </div>
                </div>

                {/* Core Biography / Markdown Content */}
                <div className="space-y-2">
                  <Label
                    htmlFor="bio"
                    className="text-xs font-bold text-emerald-500 tracking-wider"
                  >
                    CORE_BIOGRAPHY
                  </Label>
                  <Textarea
                    id="bio"
                    name="bio"
                    value={profileForm.bio || ''}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Describe your tech stack parameters..."
                    className="bg-zinc-950 border-zinc-800 text-zinc-100 placeholder:text-zinc-700 focus-visible:ring-emerald-500 resize-none rounded-none font-mono"
                  />
                </div>

                <div className="border-t border-zinc-800/50" />

                {/* Social Networks Endpoints */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-zinc-500 tracking-widest">
                    // NETWORKING_ENDPOINTS
                  </h3>

                  <div className="space-y-2">
                    <Label
                      htmlFor="github_url"
                      className="text-xs font-bold text-emerald-500 tracking-wider"
                    >
                      GITHUB_NODE
                    </Label>
                    <Input
                      id="github_url"
                      name="github_url"
                      type="url"
                      value={profileForm.github_url || ''}
                      onChange={handleChange}
                      placeholder="https://github.com/identity"
                      className="bg-zinc-950 border-zinc-800 text-zinc-100 placeholder:text-zinc-700 focus-visible:ring-emerald-500 rounded-none font-mono"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="linkedin_url"
                      className="text-xs font-bold text-emerald-500 tracking-wider"
                    >
                      LINKEDIN_NODE
                    </Label>
                    <Input
                      id="linkedin_url"
                      name="linkedin_url"
                      type="url"
                      value={profileForm.linkedin_url || ''}
                      onChange={handleChange}
                      placeholder="https://linkedin.com/in/identity"
                      className="bg-zinc-950 border-zinc-800 text-zinc-100 placeholder:text-zinc-700 focus-visible:ring-emerald-500 rounded-none font-mono"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="website_url"
                      className="text-xs font-bold text-emerald-500 tracking-wider"
                    >
                      WAN_HOST_WEBSITE
                    </Label>
                    <Input
                      id="website_url"
                      name="website_url"
                      type="url"
                      value={profileForm.website_url || ''}
                      onChange={handleChange}
                      placeholder="https://domain-anda.dev"
                      className="bg-zinc-950 border-zinc-800 text-zinc-100 placeholder:text-zinc-700 focus-visible:ring-emerald-500 rounded-none font-mono"
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-zinc-800 disabled:text-zinc-600 text-white font-mono font-bold rounded-none tracking-widest px-8 py-5 transition-all"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="animate-spin mr-2" size={16} />{' '}
                        EXECUTING_PATCH...
                      </>
                    ) : (
                      'COMPILE_CHANGES'
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </SidebarProvider>
  )
}
