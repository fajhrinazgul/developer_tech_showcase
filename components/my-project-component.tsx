'use client'

import Cookies from 'js-cookie'
import {
  AlertCircle,
  Edit,
  Eye,
  Loader2,
  MoreVertical,
  Trash,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

// Shadcn UI Components
import { AppSidebar } from '@/components/app-sidebar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { Textarea } from '@/components/ui/textarea'

// Types
import { ProjectType } from '@/lib/types/project'

export const MyProjectsComponent = ({
  projects,
}: {
  projects: ProjectType[] | undefined | null
}) => {
  const router = useRouter()

  // 1. States untuk Modal
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [activeProject, setActiveProject] = useState<ProjectType | null>(null)
  const [loading, setLoading] = useState(false)

  // 2. State untuk Form
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    demo_url: '',
    source_code_url: '',
    is_published: false,
  })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  // 3. API Handler
  const handleApiCall = async (
    id: string,
    method: 'PATCH' | 'DELETE',
    body?: FormData | null
  ) => {
    setLoading(true)
    const token = Cookies.get('access_token')

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/projects/${id}/`,
        {
          method: method,
          headers: {
            // PENTING: Jangan set Content-Type saat menggunakan FormData,
            // browser akan mengaturnya secara otomatis dengan boundary yang benar
            Authorization: `Bearer ${token}`,
          },
          body: body,
          credentials: 'include',
        }
      )

      if (!response.ok) throw new Error(`Failed to ${method}`)

      toast.success(
        `Project ${method === 'DELETE' ? 'deleted' : 'updated'} successfully`
      )
      setIsEditOpen(false)
      setIsDeleteOpen(false)
      setSelectedFile(null) // Reset file input
      router.refresh()
    } catch (error) {
      toast.error('Operation failed')
    } finally {
      setLoading(false)
    }
  }

  // 4. Submit Handler (Mengonversi Object ke FormData)
  const handleSubmit = () => {
    if (!activeProject) return

    const formData = new FormData()
    formData.append('title', editForm.title)
    formData.append('description', editForm.description)
    formData.append('demo_url', editForm.demo_url)
    formData.append('source_code_url', editForm.source_code_url)
    formData.append('is_published', editForm.is_published ? 'true' : 'false')

    // Hanya append thumbnail jika user memilih file baru
    if (selectedFile) {
      formData.append('thumbnail', selectedFile)
    }

    handleApiCall(activeProject.id, 'PATCH', formData)
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1 bg-zinc-950 min-h-screen p-8">
        <SidebarTrigger className="mb-6 text-zinc-400" />

        <h1 className="text-2xl font-mono text-emerald-400 mb-6">
          $ ./list_projects
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {!projects || projects.length === 0 ? (
            <div className="text-zinc-600 font-mono border border-zinc-800 p-8 rounded-lg text-center">
              // No projects in repository
            </div>
          ) : (
            projects.map((p) => (
              <Card
                key={p.id}
                className="bg-zinc-900 border-zinc-800 hover:border-emerald-900 transition-colors relative"
              >
                <div className="absolute top-4 right-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-zinc-400 hover:text-white"
                      >
                        <MoreVertical size={16} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-zinc-900 border-zinc-800 w-40">
                      <DropdownMenuItem
                        onClick={() => router.push(`/projects/${p.id}`)}
                      >
                        <Eye className="mr-2 h-4 w-4" /> View
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          setActiveProject(p)
                          setEditForm({
                            title: p.title,
                            description: p.description,
                            demo_url: p.demo_url || '',
                            source_code_url: p.source_code_url || '',
                            is_published: p.is_published,
                          })
                          setIsEditOpen(true)
                        }}
                      >
                        <Edit className="mr-2 h-4 w-4" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-500 focus:text-red-500"
                        onClick={() => {
                          setActiveProject(p)
                          setIsDeleteOpen(true)
                        }}
                      >
                        <Trash className="mr-2 h-4 w-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <CardHeader>
                  <CardTitle className="text-md text-zinc-100 font-mono truncate pr-8">
                    {p.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-zinc-400 text-sm mb-4 font-mono truncate min-h-5">
                    {p.description}
                  </p>
                  <Badge
                    className={
                      p.is_published
                        ? 'bg-emerald-950/30 text-emerald-500'
                        : 'bg-pink-950/30 text-pink-500'
                    }
                  >
                    {p.is_published ? 'Published' : 'Drafted'}
                  </Badge>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Edit Dialog */}
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent className="bg-zinc-900 border-zinc-800 text-zinc-100">
            <DialogHeader>
              <DialogTitle>Edit Project</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <Input
                value={editForm.title}
                onChange={(e) =>
                  setEditForm({ ...editForm, title: e.target.value })
                }
                placeholder="Title"
                className="bg-zinc-950 border-zinc-800"
              />
              <Textarea
                value={editForm.description}
                onChange={(e) =>
                  setEditForm({ ...editForm, description: e.target.value })
                }
                placeholder="Description with Markdown"
                className="bg-zinc-950 border-zinc-800"
              />
              <Input
                value={editForm.demo_url}
                onChange={(e) =>
                  setEditForm({ ...editForm, demo_url: e.target.value })
                }
                placeholder="Demo URL"
                className="bg-zinc-950 border-zinc-800"
              />
              <Input
                value={editForm.source_code_url}
                onChange={(e) =>
                  setEditForm({ ...editForm, source_code_url: e.target.value })
                }
                placeholder="Source Code URL"
                className="bg-zinc-950 border-zinc-800"
              />

              {/* File Upload */}
              <div className="space-y-2">
                <label className="text-xs text-zinc-500 font-mono">
                  Thumbnail
                </label>
                <Input
                  type="file"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  className="bg-zinc-950 border-zinc-800 text-zinc-300 file:text-emerald-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <Checkbox
                  checked={editForm.is_published}
                  onCheckedChange={(checked) =>
                    setEditForm({ ...editForm, is_published: !!checked })
                  }
                />
                <span className="text-sm">Published</span>
              </div>
            </div>
            <DialogFooter>
              <Button variant="ghost" onClick={() => setIsEditOpen(false)}>
                Cancel
              </Button>
              <Button
                className="bg-emerald-600"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="animate-spin mr-2" size={16} />
                ) : (
                  'Save Changes'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Dialog */}
        <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
          <DialogContent className="bg-zinc-900 border-zinc-800 text-zinc-100">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <AlertCircle className="text-red-500" /> Delete Project?
              </DialogTitle>
              <DialogDescription className="text-zinc-400">
                Are you sure you want to delete this project? This action cannot
                be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="ghost" onClick={() => setIsDeleteOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() =>
                  activeProject &&
                  handleApiCall(activeProject.id, 'DELETE', null)
                }
                disabled={loading}
              >
                {loading ? 'Deleting...' : 'Confirm Delete'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </SidebarProvider>
  )
}
