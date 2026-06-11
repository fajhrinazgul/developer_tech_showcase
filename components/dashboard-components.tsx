'use client'

import { AppSidebar } from '@/components/app-sidebar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { UserStatsGraph } from '@/components/user-stats-graph'
import { UserType } from '@/lib/types/user'
import { IconBrandGithub, IconBrandLinkedin } from '@tabler/icons-react'
import { Globe, Mail, User } from 'lucide-react'
import Link from 'next/link'

interface DashboardComponentHome {
  user: UserType
}

export const DashboardComponentHome = ({ user }: DashboardComponentHome) => {
  return (
    <SidebarProvider>
      <AppSidebar user={user} />
      <main className="flex-1 bg-zinc-950 p-8 text-zinc-100">
        <SidebarTrigger className="mb-6 text-zinc-500" />

        <h1 className="text-2xl font-mono text-emerald-400 mb-8">
          $ cat profile.json
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Info Card - Sekarang aman karena sudah ada pengecekan !user di atas */}
          <Card className="bg-zinc-900 border-zinc-800 lg:col-span-1">
            <CardHeader>
              <CardTitle className="font-mono text-lg flex items-center gap-2">
                <User size={18} /> @{user.username}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm font-mono text-zinc-400">
                <p>
                  {user.first_name} {user.last_name}
                </p>
                <Link
                  href={`mailto://${user.email}`}
                  className="flex items-center gap-2 mt-2 underline"
                >
                  <Mail size={14} /> {user.email}
                </Link>
                {user.website_url ? (
                  <Link
                    href={user.website_url}
                    className="hover:underline flex items-center gap-2 mt-2"
                  >
                    <Globe size={14} /> {user.website_url}
                  </Link>
                ) : (
                  <p className="flex items-center gap-2 mt-2">
                    <Globe size={14} /> No website
                  </p>
                )}
                {user.github_url && (
                  <Link
                    href={user.github_url}
                    className="hover:underline flex items-center gap-2 mt-2"
                  >
                    <IconBrandGithub size={14} /> {user.github_url}
                  </Link>
                )}
                {user.linkedin_url && (
                  <Link
                    href={user.linkedin_url}
                    className="hover:underline flex items-center gap-2 mt-2"
                  >
                    <IconBrandLinkedin size={14} /> {user.linkedin_url}
                  </Link>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Graph Section */}
          <Card className="bg-zinc-900 border-zinc-800 lg:col-span-2">
            <CardHeader>
              <CardTitle className="font-mono text-sm text-zinc-500">
                // user_activity_metrics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <UserStatsGraph user={user} />
            </CardContent>
          </Card>
        </div>
      </main>
    </SidebarProvider>
  )
}
