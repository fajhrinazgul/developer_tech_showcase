'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Lock, Mail, Terminal, User } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
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

// 1. Skema Validasi
const registerSchema = z.object({
  first_name: z.string().min(2, 'Minimal 2 karakter'),
  last_name: z.string().min(2, 'Minimal 2 karakter'),
  username: z.string().min(3, 'Username minimal 3 karakter'),
  email: z.string().email('Format email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
})

export function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false)

  // State untuk Real-time check
  const [availability, setAvailability] = useState({
    username: null,
    email: null,
  })
  const [checking, setChecking] = useState({ username: false, email: false })

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  })

  const username = watch('username')
  const email = watch('email')

  // Effect untuk Cek Username (Debounced)
  useEffect(() => {
    if (username && username.length >= 3) {
      const timer = setTimeout(async () => {
        setChecking((prev) => ({ ...prev, username: true }))
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_SERVER_URL}/api/register/check-availability/?field=username&value=${username}`,
            {}
          )
          const data = await res.json()
          setAvailability((prev) => ({ ...prev, username: data.available }))
        } catch (e) {
          console.error(e)
        }
        setChecking((prev) => ({ ...prev, username: false }))
      }, 500)
      return () => clearTimeout(timer)
    } else {
      setAvailability((prev) => ({ ...prev, username: null }))
    }
  }, [username])

  // Effect untuk Cek Email (Debounced)
  useEffect(() => {
    if (email && email.includes('@')) {
      const timer = setTimeout(async () => {
        setChecking((prev) => ({ ...prev, email: true }))
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_SERVER_URL}/api/register/check-availability/?field=email&value=${email}`,
            {}
          )
          const data = await res.json()
          setAvailability((prev) => ({ ...prev, email: data.available }))
        } catch (e) {
          console.error(e)
        }
        setChecking((prev) => ({ ...prev, email: false }))
      }, 500)
      return () => clearTimeout(timer)
    } else {
      setAvailability((prev) => ({ ...prev, email: null }))
    }
  }, [email])

  const onSubmit = async (data: any) => {
    // Validasi final sebelum kirim
    if (availability.username === false || availability.email === false) {
      toast.error('System: Username atau Email sudah terdaftar.')
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/register/`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        }
      )

      if (response.ok) {
        toast.success(
          'System: Account created successfully! Please check your email.'
        )
      } else {
        const errorData = await response.json()
        toast.error(
          `System Error: ${errorData.message || 'Registration failed'}`
        )
      }
    } catch (error) {
      toast.error('System: Connection Error')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-lg border-zinc-800 bg-zinc-950 text-zinc-100 shadow-2xl">
      <div className="flex items-center gap-2 border-b border-zinc-800 px-4 py-2 bg-zinc-900/50 rounded-t-xl">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
        </div>
        <div className="text-xs text-zinc-500 font-mono ml-2 flex items-center gap-1">
          <Terminal size={12} /> register-user.sh
        </div>
      </div>

      <CardHeader>
        <CardTitle className="text-xl font-mono tracking-tight text-emerald-400">
          $ create_new_user
        </CardTitle>
        <CardDescription className="text-zinc-400 font-mono text-sm">
          // Initialize your developer profile
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label className="font-mono text-zinc-300">First Name</Label>
              <Input
                className="bg-zinc-900 border-zinc-700 font-mono"
                {...register('first_name')}
                disabled={isLoading}
              />
            </div>
            <div className="grid gap-2">
              <Label className="font-mono text-zinc-300">Last Name</Label>
              <Input
                className="bg-zinc-900 border-zinc-700 font-mono"
                {...register('last_name')}
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Username Field dengan Real-time Check */}
          <div className="grid gap-2">
            <Label className="font-mono text-zinc-300 flex items-center gap-2">
              <User size={14} /> username
            </Label>
            <Input
              className="bg-zinc-900 border-zinc-700 font-mono"
              {...register('username')}
              disabled={isLoading}
            />
            {checking.username && (
              <p className="text-yellow-500 text-xs font-mono">
                // Checking availability...
              </p>
            )}
            {availability.username === false && (
              <p className="text-red-400 text-xs font-mono">
                // Username taken
              </p>
            )}
            {availability.username === true && (
              <p className="text-emerald-500 text-xs font-mono">
                // Username available
              </p>
            )}
            {errors.username && (
              <p className="text-red-400 text-xs font-mono">
                {errors.username.message as string}
              </p>
            )}
          </div>

          {/* Email Field dengan Real-time Check */}
          <div className="grid gap-2">
            <Label className="font-mono text-zinc-300 flex items-center gap-2">
              <Mail size={14} /> email
            </Label>
            <Input
              className="bg-zinc-900 border-zinc-700 font-mono"
              {...register('email')}
              disabled={isLoading}
            />
            {checking.email && (
              <p className="text-yellow-500 text-xs font-mono">
                // Checking availability...
              </p>
            )}
            {availability.email === false && (
              <p className="text-red-400 text-xs font-mono">
                // Email already registered
              </p>
            )}
            {availability.email === true && (
              <p className="text-emerald-500 text-xs font-mono">
                // Email available
              </p>
            )}
            {errors.email && (
              <p className="text-red-400 text-xs font-mono">
                {errors.email.message as string}
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <Label className="font-mono text-zinc-300 flex items-center gap-2">
              <Lock size={14} /> password
            </Label>
            <Input
              type="password"
              className="bg-zinc-900 border-zinc-700 font-mono"
              {...register('password')}
              disabled={isLoading}
            />
            {errors.password && (
              <p className="text-red-400 text-xs font-mono">
                {errors.password.message as string}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700 text-white font-mono"
            disabled={
              isLoading ||
              availability.username === false ||
              availability.email === false
            }
          >
            {isLoading ? (
              <Loader2 className="animate-spin mr-2" />
            ) : (
              '> EXECUTE_REGISTRATION'
            )}
          </Button>

          <p className="text-center text-zinc-500 text-xs font-mono mt-4">
            Already have an account?{' '}
            <Link href="/login" className="text-emerald-400 hover:underline">
              Login here
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  )
}
