// app/profile/[slug]/page.tsx

import { authMe, getUserByUsername } from '@/lib/auth'
import { dateFormat } from '@/lib/utils'
import { IconBrandGithub, IconBrandLinkedin } from '@tabler/icons-react'
import {
  Calendar,
  Folder,
  Globe,
  Mail,
  MessageSquare,
  UserCheck2,
  Users,
} from 'lucide-react'
import { cookies } from 'next/headers'

// Tipe untuk props params
interface ProfileProps {
  params: Promise<{ slug: string }>
}

export default async function ProfilePage({ params }: ProfileProps) {
  // Mengakses params dengan await karena Next.js 15+
  const { slug } = await params
  const cookieStore = await cookies()
  const token = cookieStore.get('access_token')?.value || ''
  const user = await getUserByUsername(slug)
  const thisUser = await authMe(token)

  return (
    <div className="max-w-3xl mx-auto p-6 mt-10">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        {/* Header Profil */}
        <div className="flex items-start gap-6">
          <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
            {user?.first_name}
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900">
              {user?.first_name} {user?.last_name}
            </h1>
            <p className="text-gray-500 font-medium">@{user?.username}</p>
            <p className="text-gray-400 text-sm mt-1 flex items-center gap-1">
              <Mail size={14} /> {user?.email}
            </p>
          </div>
        </div>

        {/* Bio */}
        <div className="mt-6 text-gray-600">
          {user?.bio || (
            <span className="italic text-gray-400">Bio belum diatur.</span>
          )}
        </div>

        {/* Statistik */}
        <div className="grid grid-cols-4 gap-4 mt-8 border-y py-6">
          <StatItem
            label="Proyek"
            value={user?.projects_count || 0}
            icon={<Folder size={18} />}
          />
          <StatItem
            label="Pengikut"
            value={user?.followers_count || 0}
            icon={<Users size={18} />}
          />
          <StatItem
            label="Mengikuti"
            value={user?.following_count || 0}
            icon={<UserCheck2 size={18} />}
          />
          <StatItem
            label="Komentar"
            value={user?.total_comments_received || 0}
            icon={<MessageSquare size={18} />}
          />
        </div>

        {/* Links */}
        <div className="mt-6 flex gap-4">
          {user?.website_url && (
            <a
              href={user?.website_url}
              className="text-blue-600 hover:underline flex items-center gap-2"
            >
              <Globe size={16} /> Website
            </a>
          )}
          {user?.github_url && (
            <a
              href={user?.github_url}
              className="text-gray-800 hover:underline flex items-center gap-2"
            >
              <IconBrandGithub size={16} /> GitHub
            </a>
          )}
          {user?.linkedin_url && (
            <a
              href={user?.linkedin_url}
              className="text-blue-700 hover:underline flex items-center gap-2"
            >
              <IconBrandLinkedin size={16} /> LinkedIn
            </a>
          )}
        </div>

        <div className="mt-6 text-xs text-gray-400 flex items-center gap-2">
          <Calendar size={14} /> Bergabung sejak{' '}
          {dateFormat(user?.date_joined || '')}
        </div>
      </div>
    </div>
  )
}

// Komponen Pembantu untuk Statistik
function StatItem({
  label,
  value,
  icon,
}: {
  label: string
  value: number
  icon?: React.ReactNode
}) {
  return (
    <div className="text-center">
      <div className="flex justify-center text-gray-500 mb-1">{icon}</div>
      <div className="text-xl font-bold text-gray-900">{value}</div>
      <div className="text-xs text-gray-500 uppercase">{label}</div>
    </div>
  )
}
