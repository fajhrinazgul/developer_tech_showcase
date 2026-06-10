import { LoginForm } from '@/components/login-form'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Login Account',
}

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <LoginForm />
    </main>
  )
}
