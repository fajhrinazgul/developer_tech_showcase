'use client'

import { Button } from '@/components/ui/button'
import { UserType } from '@/lib/types/user'
import { IconDashboard } from '@tabler/icons-react'
import Cookies from 'js-cookie'
import {
  LogIn,
  LogOut,
  Menu,
  Terminal,
  TerminalIcon,
  User,
  X,
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface navbarProps {
  user: UserType | null
}
export function Navbar({ user }: navbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const router = useRouter()

  const handleLogout = () => {
    Cookies.remove('access_token')
    router.push('/login')
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 text-emerald-400 font-mono font-bold text-lg"
        >
          <Terminal size={20} />
          <span>DEV_SHOWCASE</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-6">
          <Link
            href="/"
            className="text-zinc-400 hover:text-emerald-400 text-sm font-mono transition-colors"
          >
            ~/projects
          </Link>
          <Link
            href="/about"
            className="text-zinc-400 hover:text-emerald-400 text-sm font-mono transition-colors"
          >
            ~/about
          </Link>
        </div>

        {/* Auth Button (Desktop) */}
        <div className="hidden md:flex gap-4">
          {user ? (
            <>
              <Link
                href="/dashboard"
                className="flex gap-1 items-center text-zinc-400 hover:text-red-400 font-mono"
              >
                <IconDashboard size={16} className="mr-2" /> Dashboard
              </Link>
              <Link
                href={`/profile/${user.username}`}
                className="flex gap-1 items-center text-zinc-400 hover:text-red-400 font-mono"
              >
                <User size={16} className="mr-2" /> Profile
              </Link>
              <Button
                variant="ghost"
                onClick={handleLogout}
                className="flex items-center gap-1 text-zinc-400 hover:text-red-400 font-mono"
              >
                <LogOut size={16} className="mr-2" /> exit_session
              </Button>
            </>
          ) : (
            <Button
              asChild
              variant="outline"
              className="border-zinc-700 hover:bg-zinc-800 font-mono"
            >
              <Link href="/login">
                <LogIn size={16} className="mr-2" /> login
              </Link>
            </Button>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden text-zinc-400"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-zinc-800 bg-zinc-900 p-4 space-y-4">
          <Link href="/" className="block text-zinc-400 font-mono">
            ~/projects
          </Link>
          <Link href="/about" className="block text-zinc-400 font-mono">
            ~/about
          </Link>
          {user ? (
            <>
              <Button
                className="w-full justify-start text-red-400"
                variant="ghost"
              >
                <Link href="/dashboard" className="flex items-center gap-2">
                  <TerminalIcon size={16} className="mr-2" /> Dashboard
                </Link>
              </Button>

              <Button
                className="w-full justify-start text-red-400"
                variant="ghost"
              >
                <Link
                  href={`/profile/${user.username}`}
                  className="flex items-center gap-2"
                >
                  <User size={16} className="mr-2" /> Profile
                </Link>
              </Button>

              <Button
                onClick={handleLogout}
                className="w-full justify-start text-red-400"
                variant="ghost"
              >
                <LogOut size={16} className="mr-2" /> exit_session
              </Button>
            </>
          ) : (
            <Button asChild className="w-full justify-start" variant="outline">
              <Link href="/login">
                <LogIn size={16} className="mr-2" /> login
              </Link>
            </Button>
          )}
        </div>
      )}
    </nav>
  )
}
