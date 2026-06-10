'use client'

import { IconBrandGithub } from '@tabler/icons-react'
import {
  ArrowLeft,
  Bookmark,
  Clock,
  Code2,
  ExternalLink,
  Eye,
  Heart,
  MessageSquare,
  Send,
  User,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { toast } from 'sonner'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { motion } from 'framer-motion'
import { CodeBlock } from './markdown-render'
import { Separator } from './ui/separator'

import Cookies from 'js-cookie'

// Komponen Container
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1, // Jeda 0.1 detik antar elemen
    },
  },
}

// Komponen Item
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

interface Props {
  project: any
  initialComments: any
  thisUser?: any
}

export function ProjectDetail({ project, initialComments, thisUser }: Props) {
  const router = useRouter()

  // State untuk interaksi
  const [isLiked, setIsLiked] = useState(project.is_liked || false)
  const [isBookmarked, setIsBookmarked] = useState(
    project.is_bookmarked || false
  )
  const [likesCount, setLikesCount] = useState<number>(project.likes_count || 0)
  const [comment, setComment] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // comments state
  const [comments, setComments] = useState(initialComments.results || [])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editContent, setEditContent] = useState('')
  const [newId, setNewId] = useState<string>('')

  // Fungsi Helper untuk request API
  const handleAction = async (endpoint: string, body?: any) => {
    const token = Cookies.get('access_token')

    if (!token) {
      toast.error('System: Please login to perform this action.')
      router.push('/login')
      return false
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/projects/${project.id}/${endpoint}/`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: body ? JSON.stringify(body) : null,
          credentials: 'include',
        }
      )

      if (!response.ok) throw new Error('Action failed')
      return await response.json()
    } catch (error) {
      toast.error('System: Connection Error')
      return false
    }
  }

  // Event Handlers
  const toggleLike = async () => {
    const success = await handleAction('like')
    if (success) {
      setIsLiked(!isLiked)
      setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1))
    }
  }

  const toggleBookmark = async () => {
    const success = await handleAction('bookmark')
    if (success) {
      setIsBookmarked(!isBookmarked)
      toast.success(
        isBookmarked ? 'Removed from bookmarks' : 'Added to bookmarks'
      )
    }
  }

  const submitComment = async () => {
    if (!comment.trim()) return

    const tempId = Date.now().toString()

    const newComment = {
      id: tempId,
      user: thisUser?.username || 'You',
      content: comment,
      created_at: new Date().toISOString(),
    }

    // Optimistic UI update
    setComments((prev: any) => [newComment, ...prev])
    setComment('')
    setIsLoading(true)

    const data = await handleAction('comments', { content: comment })

    if (data) {
      setComments((prev: any) =>
        prev.map((c: any) => (c.id === tempId ? { ...data } : c))
      )
    } else {
      // GAGAL: Hapus comment temp
      setComments((prev: any) => prev.filter((c: any) => c.id !== tempId))
      toast.error('Failed to send comment!')
    }

    setIsLoading(false)
  }

  const updateComment = async (commentId: string) => {
    const token = Cookies.get('access_token')

    if (!token) {
      toast.error("System: Please login to perform this action.'")
      return
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/projects/${project.id}/comments/${commentId}/`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ content: editContent }),
          credentials: 'include',
        }
      )

      if (!response.ok) throw new Error('Update failed')

      // Update state lokal
      setComments((prev: any) =>
        prev.map((c: any) =>
          c.id === commentId ? { ...c, content: editContent } : c
        )
      )
      toast.success('Comment updated!')
      setEditingId(null)
    } catch (error) {
      toast.error('Failed to update comment')
    }
  }

  const deleteComment = async (commentId: string) => {
    const token = Cookies.get('access_token')

    if (!confirm('Are you sure you want to delete this comment?')) return

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/projects/${project.id}/comments/${commentId}/`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          credentials: 'include',
        }
      )

      if (!response.ok) throw new Error('Delete failed')

      // Update UI dengan menghapus komentar dari list state
      setComments((prev: any) => prev.filter((c: any) => c.id !== commentId))
      toast.success('Comment deleted!')
    } catch (error) {
      toast.error('System: Failed to delete comment')
    }
  }

  return (
    <main className="container mx-auto py-12 px-4 max-w-4xl">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="text-zinc-500 hover:text-emerald-400 font-mono mb-8 p-0"
      >
        <ArrowLeft size={16} className="mr-2" /> cd ..
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="border border-zinc-800 rounded-xl overflow-hidden bg-zinc-900 shadow-2xl">
            <div className="relative h-64 w-full">
              <Image
                src={project.thumbnail}
                alt={project.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-6">
              <h1 className="text-3xl font-mono font-bold text-zinc-100 mb-4">
                {project.title}
              </h1>
              <Separator />
              <div className="prose prose-invert prose-emerald max-w-none prose-sm font-mono">
                <ReactMarkdown components={{ code: CodeBlock }}>
                  {project.description}
                </ReactMarkdown>
              </div>
            </div>
          </div>

          {/* Comment Section & List */}
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl space-y-6">
            <h3 className="text-sm font-mono text-zinc-300 mb-4 flex items-center gap-2">
              <MessageSquare size={16} /> comment_section
            </h3>

            {/* Input */}
            <div className="flex gap-2">
              <Input
                className="bg-zinc-950 border-zinc-800 font-mono"
                placeholder="Type a comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <Button
                onClick={submitComment}
                disabled={isLoading}
                className="bg-emerald-600"
              >
                <Send size={16} />
              </Button>
            </div>

            {/* List */}
            <div className="space-y-4 pt-4 border-t border-zinc-800">
              {comments.length === 0 ? (
                <p className="text-zinc-600 font-mono text-xs italic">
                  // No comments yet.
                </p>
              ) : (
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {comments.map((c: any) => (
                    <div
                      key={c.id}
                      className="bg-zinc-950/50 p-4 rounded-lg border border-zinc-800/50"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-emerald-500 font-mono text-xs font-bold">
                          {thisUser?.username === c.user ? 'You' : `@${c.user}`}
                        </span>

                        {/* Tombol Edit */}
                        {thisUser?.username === c.user &&
                          editingId !== c.id && (
                            <div className="flex gap-3">
                              <button
                                onClick={() => {
                                  setEditingId(c.id)
                                  setEditContent(c.content)
                                }}
                                className="text-[10px] text-zinc-500 hover:text-emerald-400 font-mono"
                              >
                                [Edit]
                              </button>
                              <button
                                onClick={() => deleteComment(c.id)}
                                className="text-[10px] text-red-500 hover:text-red-400 font-mono"
                              >
                                [Delete]
                              </button>
                            </div>
                          )}
                      </div>

                      {editingId === c.id ? (
                        <div className="flex flex-col gap-2">
                          <Input
                            className="bg-zinc-950 border-zinc-800 font-mono text-sm"
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                          />
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => updateComment(c.id)}
                              className="bg-emerald-600 h-8"
                            >
                              Save
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setEditingId(null)}
                              className="h-8 text-zinc-500"
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-zinc-300 font-mono text-sm">
                          {c.content}
                        </p>
                      )}

                      <span className="text-zinc-600 font-mono text-[10px] flex items-center gap-1 mt-2">
                        <Clock size={10} />{' '}
                        {new Date(c.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </motion.div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          {/* Interaction Row */}
          <Card className="bg-zinc-950 border-zinc-800 p-4 grid grid-cols-3 gap-2">
            <button
              onClick={toggleLike}
              className={`flex flex-col items-center p-2 rounded transition-colors ${isLiked ? 'text-emerald-400' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              <Heart size={20} fill={isLiked ? 'currentColor' : 'none'} />
              <span className="text-[10px] mt-1 font-mono">{likesCount}</span>
            </button>
            <button
              onClick={toggleBookmark}
              className={`flex flex-col items-center p-2 rounded transition-colors ${isBookmarked ? 'text-emerald-400' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              <Bookmark
                size={20}
                fill={isBookmarked ? 'currentColor' : 'none'}
              />
              <span className="text-[10px] mt-1 font-mono">Save</span>
            </button>
            <div className="flex flex-col items-center p-2 text-zinc-500">
              <MessageSquare size={20} />
              <span className="text-[10px] mt-1 font-mono">
                {project.comments_count}
              </span>
            </div>
            <div className="flex flex-col items-center p-2 text-zinc-500">
              <Eye size={20} />
              <span className="text-[10px] mt-1 font-mono">
                {project.view_count}
              </span>
            </div>
          </Card>

          {/* Author Card */}
          <Card className="bg-zinc-950 border-zinc-800 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-emerald-900/20 flex items-center justify-center border border-emerald-900/50">
                <User className="text-emerald-500" size={20} />
              </div>
              <div>
                <p className="text-[10px] text-zinc-500 font-mono uppercase">
                  Author
                </p>
                <p className="text-sm font-mono text-zinc-200">
                  @{project.author.username}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {project.demo_url && (
                <Button
                  asChild
                  className="w-full bg-emerald-600 hover:bg-emerald-700 font-mono"
                >
                  <Link href={project.demo_url} target="_blank">
                    <ExternalLink size={16} className="mr-2" /> Live Demo
                  </Link>
                </Button>
              )}
              {project.source_code_url && (
                <Button
                  asChild
                  variant="outline"
                  className="w-full border-zinc-700 font-mono"
                >
                  <Link href={project.source_code_url} target="_blank">
                    <IconBrandGithub size={16} className="mr-2" /> Source Code
                  </Link>
                </Button>
              )}
            </div>
          </Card>

          {/* Tech Stack */}
          <Card className="bg-zinc-950 border-zinc-800 p-6">
            <h3 className="text-xs text-zinc-500 font-mono mb-4 uppercase flex items-center gap-2">
              <Code2 size={14} /> Tech Stack
            </h3>
            <div className="flex gap-2 flex-wrap">
              {project.tech_stack?.map((tech: any) => (
                <Badge
                  key={tech.id}
                  variant="secondary"
                  className="bg-zinc-800 text-zinc-300 font-mono"
                >
                  {tech.name}
                </Badge>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </main>
  )
}
