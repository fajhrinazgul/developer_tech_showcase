'use client'

import { Button } from '@/components/ui/button'
import { Loader2, UserMinus, UserPlus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

export default function FollowButton({
  username,
  initialIsFollowing,
  token,
}: {
  username?: string
  initialIsFollowing: boolean
  token?: string
}) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleFollow = async () => {
    setLoading(true)

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/${username}/follow/`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      )

      if (!response.ok) throw new Error('Failed to toggle follow')

      const data = await response.json()
      setIsFollowing(data.is_following)
      toast.success(isFollowing ? 'Unfollowed' : 'Followed')
      router.refresh()
    } catch (error) {
      toast.error('Something went wrong')
      router.refresh()
    } finally {
      setLoading(false)
      router.refresh()
    }
  }

  return (
    <Button
      onClick={handleFollow}
      disabled={loading}
      className={`w-full md:w-auto font-mono gap-2 ${
        isFollowing || initialIsFollowing
          ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300'
          : 'bg-emerald-600 hover:bg-emerald-700 text-white'
      }`}
    >
      {loading ? (
        <Loader2 size={16} className="animate-spin" />
      ) : isFollowing || initialIsFollowing ? (
        <>
          <UserMinus size={16} /> Unfollow
        </>
      ) : (
        <>
          <UserPlus size={16} /> Follow
        </>
      )}
    </Button>
  )
}
