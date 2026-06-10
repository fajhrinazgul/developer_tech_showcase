'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import Cookies from 'js-cookie'
import { Loader2, Mail, Terminal } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from 'zod'

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
import { Separator } from '@/components/ui/separator'
import { useGoogleLogin } from '@react-oauth/google'
import Link from 'next/link'

const loginSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  password: z.string().min(4, 'Password must be at least 4 characters'),
})

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: any) => {
    setIsLoading(true)
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/auth/token/`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
          credentials: 'include',
        }
      )

      const result = await response.json()

      if (response.ok) {
        Cookies.set('access_token', result.access)
        toast.success('System: Authentication Successful')
        window.location.href = '/dashboard' // Redirect ke dashboard
      } else {
        toast.error('System: Invalid credentials')
      }
    } catch (error) {
      toast.error('System: Connection Error')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      // 1. Kita dapat access_token dari Google
      // 2. Kirim ke backend Django kita
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/auth/google/`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              access_token: tokenResponse.access_token, // Ini token dari Google
            }),
            credentials: 'include',
          }
        )

        const data = await res.json()
        if (res.ok) {
          Cookies.set('access_token', data.access) // Simpan JWT Anda
          window.location.href = '/dashboard'
        } else {
          toast.error('Gagal login dengan Google')
        }
      } catch (err) {
        toast.error('System error')
      }
    },
    onError: () => toast.error('Login Google dibatalkan'),
  })

  return (
    <Card className="w-full max-w-md border-zinc-800 bg-zinc-950 text-zinc-100 shadow-2xl overflow-hidden">
      {/* Terminal Header */}
      <div className="flex items-center gap-2 border-b border-zinc-800 px-4 py-2 bg-zinc-900/80">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
        </div>
        <div className="text-xs text-zinc-500 font-mono ml-2 flex items-center gap-1">
          <Terminal size={12} /> auth-session.sh
        </div>
      </div>

      <CardHeader className="space-y-1">
        <CardTitle className="text-xl font-mono tracking-tight text-emerald-400">
          $ init_session
        </CardTitle>
        <CardDescription className="text-zinc-500 font-mono text-sm">
          // Authentication required to access system
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Google OAuth Button */}
        <Button
          variant="outline"
          className="w-full border-zinc-800 bg-zinc-900 hover:bg-zinc-800 hover:text-white font-mono text-xs"
          onClick={() => handleGoogleLogin()}
          disabled={isGoogleLoading || isLoading}
        >
          {isGoogleLoading ? (
            <Loader2 className="animate-spin mr-2 h-4 w-4" />
          ) : (
            <Mail className="mr-2 h-4 w-4" />
          )}
          Login with Google
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator className="w-full border-zinc-800" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-zinc-950 px-2 text-zinc-600 font-mono">OR</span>
          </div>
        </div>

        {/* Standard Login Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-2">
            <Label
              htmlFor="username"
              className="font-mono text-zinc-400 text-xs"
            >
              USERNAME
            </Label>
            <Input
              id="username"
              className="bg-zinc-900 border-zinc-800 font-mono focus:border-emerald-500 transition-colors"
              placeholder="root"
              {...register('username')}
              disabled={isLoading}
            />
            {errors.username && (
              <p className="text-red-400 text-[10px] font-mono">
                {errors.username.message as string}
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <Label
              htmlFor="password"
              className="font-mono text-zinc-400 text-xs"
            >
              PASSWORD
            </Label>
            <Input
              id="password"
              type="password"
              className="bg-zinc-900 border-zinc-800 font-mono focus:border-emerald-500 transition-colors"
              placeholder="••••••••"
              {...register('password')}
              disabled={isLoading}
            />
            {errors.password && (
              <p className="text-red-400 text-[10px] font-mono">
                {errors.password.message as string}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-mono text-sm mt-2"
            disabled={isLoading || isGoogleLoading}
          >
            {isLoading ? (
              <Loader2 className="animate-spin mr-2 h-4 w-4" />
            ) : (
              '> EXECUTE_LOGIN'
            )}
          </Button>
        </form>

        <div className="text-center mt-4">
          <p className="text-zinc-600 text-[11px] font-mono">
            New session?{' '}
            <Link href="/register" className="text-emerald-500 hover:underline">
              Create account
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
