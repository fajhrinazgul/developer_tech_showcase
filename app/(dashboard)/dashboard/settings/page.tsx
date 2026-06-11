import { ProfileSettingsComponent } from '@/components/profile-settings'
import { authMe } from '@/lib/auth'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function SettingPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get('access_token')?.value || ''
  const user = await authMe(token)
  if (!user) {
    redirect('/login')
  }
  return <ProfileSettingsComponent user={user} token={token} />
}
