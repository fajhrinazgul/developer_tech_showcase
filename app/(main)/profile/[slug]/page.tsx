import FollowButton from '@/components/follow-button'
import { authMe, getUserByUsername } from '@/lib/auth'
import { getProjectsUser } from '@/lib/projects'
import { ProjectType } from '@/lib/types/project'
import { dateFormat, stripMarkdownAndTruncate } from '@/lib/utils'
import { IconBrandGithub, IconBrandLinkedin } from '@tabler/icons-react'
import {
  Calendar,
  ExternalLink,
  Folder,
  Globe,
  Mail,
  MessageSquare,
  Terminal,
  UserCheck2,
  Users,
} from 'lucide-react'
import { cookies } from 'next/headers' // Perbaikan ambil cookie di Server Component
import Image from 'next/image'
import Link from 'next/link'

interface ProfileProps {
  params: Promise<{ slug: string }>
}

export default async function ProfilePage({ params }: ProfileProps) {
  const { slug } = await params
  const cookieStore = await cookies()
  const token = cookieStore.get('access_token')?.value
  const username = slug
  const user = await getUserByUsername(username, token)
  const thisUser = await authMe(token || '')
  const projectsData = await getProjectsUser(token, username)
  const projects = projectsData?.results

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 font-mono text-zinc-300 bg-zinc-950 min-h-screen">
      {/* Header Ala Tab Terminal */}
      <div className="flex items-center justify-between border border-zinc-800 bg-zinc-900/50 px-4 py-2 rounded-t-xl text-xs text-zinc-500">
        <div className="flex items-center gap-2">
          <Terminal size={14} className="text-emerald-500" />
          <span>usr_profile_info: @{user?.username}.sh</span>
        </div>
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
          <div className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/30" />
        </div>
      </div>

      {/* Main Profile Box */}
      <div className="bg-zinc-900/20 border-x border-b border-zinc-800 p-6 md:p-8 rounded-b-xl space-y-8">
        {/* Profile Identity */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 text-center md:text-left">
          <div className="relative w-24 h-24 bg-zinc-900 border-2 border-emerald-500/50 rounded-xl flex items-center justify-center text-emerald-400 text-3xl font-bold font-mono shadow-[0_0_15px_rgba(16,185,129,0.1)] overflow-hidden">
            {user?.avatar ? (
              <Image
                src={user.avatar}
                alt={`${user?.username}'s avatar`}
                fill
                className="object-cover"
                sizes="96px"
                priority
              />
            ) : (
              // Fallback jika tidak ada avatar dari backend
              <span>
                {user?.first_name ? user.first_name[0].toUpperCase() : '?'}
              </span>
            )}
          </div>
          <div className="flex-1 space-y-2">
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-zinc-100 tracking-tight">
                {user?.first_name} {user?.last_name}
              </h1>
              <p className="text-emerald-400 font-semibold text-sm">
                @{user?.username}
              </p>
            </div>

            {thisUser?.username != username && user && (
              <FollowButton
                username={user?.username}
                token={token}
                initialIsFollowing={user?.is_following}
              />
            )}

            <p className="text-zinc-400 text-xs flex items-center justify-center md:justify-start gap-2 bg-zinc-900/50 w-fit px-3 py-1.5 rounded border border-zinc-800/60">
              <Mail size={12} className="text-zinc-600" /> {user?.email}
            </p>
          </div>
        </div>

        {/* Bio Section */}
        <div className="bg-zinc-900/40 border border-zinc-800/80 p-4 rounded-lg relative overflow-hidden">
          <div className="text-[10px] uppercase text-zinc-600 tracking-widest mb-2 block select-none">
            // user_bio_metadata
          </div>
          <p className="text-sm text-zinc-300 leading-relaxed">
            {user?.bio || (
              <span className="italic text-zinc-600">
                No biography initialized yet.
              </span>
            )}
          </p>
        </div>

        {/* Grid Statistik Dashboard Style */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatItem
            label="Projects"
            value={user?.projects_count || 0}
            icon={<Folder size={16} />}
          />
          <StatItem
            label="Followers"
            value={user?.followers_count || 0}
            icon={<Users size={16} />}
          />
          <StatItem
            label="Following"
            value={user?.following_count || 0}
            icon={<UserCheck2 size={16} />}
          />
          <StatItem
            label="Comments"
            value={user?.total_comments_received || 0}
            icon={<MessageSquare size={16} />}
          />
        </div>

        {/* Social Links & Join Date */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-4 border-t border-zinc-800/60 text-xs">
          <div className="flex flex-wrap gap-3">
            {user?.website_url && (
              <a
                href={user?.website_url}
                target="_blank"
                className="bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-emerald-400 border border-zinc-800 px-3 py-2 rounded flex items-center gap-2 transition-all"
              >
                <Globe size={14} /> Link
              </a>
            )}
            {user?.github_url && (
              <a
                href={user?.github_url}
                target="_blank"
                className="bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-emerald-400 border border-zinc-800 px-3 py-2 rounded flex items-center gap-2 transition-all"
              >
                <IconBrandGithub size={14} /> GitHub
              </a>
            )}
            {user?.linkedin_url && (
              <a
                href={user?.linkedin_url}
                target="_blank"
                className="bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-emerald-400 border border-zinc-800 px-3 py-2 rounded flex items-center gap-2 transition-all"
              >
                <IconBrandLinkedin size={14} /> LinkedIn
              </a>
            )}
          </div>

          <div className="text-zinc-600 flex items-center gap-2 font-mono">
            <Calendar size={12} /> INITIALIZED:{' '}
            {dateFormat(user?.date_joined || '')}
          </div>
        </div>
      </div>

      {/* ================= PROJECTS SECTION ================= */}
      <div className="mt-12 space-y-6">
        <div className="flex items-center gap-2 text-emerald-400 text-sm font-semibold tracking-wider uppercase">
          <span>$ ls ./projects --deployed</span>
          <span className="w-2 h-4 bg-emerald-400 animate-pulse inline-block" />
        </div>

        {projects && projects.length === 0 ? (
          <div className="border border-dashed border-zinc-800 p-8 rounded-xl text-center text-zinc-600 text-sm">
            [No active repositories/projects found for this system]
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {projects &&
              projects.map((proj: ProjectType, index: number) => (
                <div
                  key={index}
                  className="border border-zinc-800 bg-zinc-900/30 hover:bg-zinc-900/60 hover:border-emerald-500/40 p-5 rounded-xl transition-all group flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="text-zinc-100 font-bold group-hover:text-emerald-400 transition-colors text-base truncate">
                        {proj.title.slice(0, 20)}...
                      </h3>
                      <Link
                        href={`/projects/${proj.id}`}
                        className="text-zinc-600 hover:text-zinc-400"
                      >
                        <ExternalLink size={14} />
                      </Link>
                    </div>
                    <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                      {stripMarkdownAndTruncate(proj.description, 40) ||
                        'No description provided for this codebase.'}
                    </p>
                    {proj.tech_stack.length > 0 && (
                      <div className="flex items-center gap-2 mt-3">
                        {proj.tech_stack.map((value, index) => (
                          <span
                            key={index}
                            className="bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800 text-zinc-400 text-xs"
                          >
                            {value.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-zinc-800/40 flex items-center justify-between text-[10px] text-zinc-500">
                    <span>{dateFormat(proj.created_at)}</span>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  )
}

// Komponen Pembantu untuk Statistik Ala Terminal Box
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
    <div className="bg-zinc-900/70 border border-zinc-800 p-4 rounded-xl text-center flex flex-col items-center justify-center group hover:border-zinc-700/80 transition-colors">
      <div className="text-zinc-500 mb-1.5 group-hover:text-emerald-500 transition-colors">
        {icon}
      </div>
      <div className="text-lg font-bold text-zinc-100 font-mono tracking-tight">
        {value}
      </div>
      <div className="text-[10px] text-zinc-600 tracking-wider font-semibold uppercase mt-0.5">
        {label}
      </div>
    </div>
  )
}
