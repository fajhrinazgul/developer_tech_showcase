'use client'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { UserType } from '@/lib/types/user'
import Cookies from 'js-cookie'
import {
  FolderKanban,
  LayoutDashboard,
  LogOut,
  MessageCircle,
  Settings2Icon,
  Terminal,
  UserCircle,
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface Props {
  user: UserType | null
}

export function AppSidebar({ user }: Props) {
  const router = useRouter()

  const handleLogout = () => {
    Cookies.remove('access_token')
    router.push('/login')
    router.refresh()
  }

  return (
    <Sidebar className="border-r border-zinc-800 bg-zinc-950">
      <SidebarContent>
        <Link
          href="/"
          className="flex items-center gap-2 px-6 py-6 text-emerald-400 font-mono"
        >
          <Terminal size={20} />
          <span className="font-bold">DEV_DASHBOARD</span>
        </Link>

        <SidebarGroup>
          <SidebarGroupLabel className="text-zinc-500 font-mono">
            NAVIGATION
          </SidebarGroupLabel>
          <SidebarMenu>
            {/* ... Menu items yang sudah ada ... */}
            <SidebarMenuItem>
              <SidebarMenuButton
                className="text-zinc-300 hover:bg-zinc-900"
                asChild
              >
                <Link href="/dashboard">
                  <LayoutDashboard size={16} /> Dashboard
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                className="text-zinc-300 hover:bg-zinc-900"
                asChild
              >
                <Link href="/dashboard/my-projects">
                  <FolderKanban size={16} /> My Projects
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                className="text-zinc-300 hover:bg-zinc-900"
                asChild
              >
                <Link href="/dashboard/notifications">
                  <MessageCircle size={16} /> Notifications
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                className="text-zinc-300 hover:bg-zinc-900"
                asChild
              >
                <Link href="/dashboard/settings">
                  <Settings2Icon size={16} /> Settings
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      {/* Bagian Bawah Sidebar */}
      <SidebarFooter className="border-t border-zinc-800 p-4">
        {user ? (
          <div className="space-y-4">
            <div className="flex items-center gap-3 px-2">
              <div className="w-8 h-8 rounded-full bg-emerald-900/50 flex items-center justify-center text-emerald-500 border border-emerald-900">
                <UserCircle size={20} />
              </div>
              <div className="flex flex-col overflow-hidden">
                <span className="text-sm font-mono text-zinc-100 truncate">
                  {user.username}
                </span>
                <span className="text-[10px] text-zinc-500 font-mono">
                  SESSION_ACTIVE
                </span>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-2 px-2 py-2 text-xs text-zinc-500 hover:text-red-400 hover:bg-zinc-900 rounded transition-colors"
            >
              <LogOut size={14} /> LOGOUT
            </button>
          </div>
        ) : (
          <div className="text-xs text-zinc-600 font-mono px-2">
            AUTH_REQUIRED...
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  )
}
