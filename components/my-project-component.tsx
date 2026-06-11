'use client'

import {
  AlertCircle,
  Edit,
  Eye,
  Loader2,
  MoreVertical,
  Plus,
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
import { UserType } from '@/lib/types/user'

export const MyProjectsComponent = ({
  projects,
  user,
  token,
}: {
  projects: ProjectType[] | undefined | null
  user: UserType | null
  token: string | undefined
}) => {
  const router = useRouter()

  // 1. States untuk Modal (Ditambahkan isCreateOpen)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [activeProject, setActiveProject] = useState<ProjectType | null>(null)
  const [loading, setLoading] = useState(false)

  // 2. State untuk Form Create & Edit
  const [createForm, setCreateForm] = useState({
    title: '',
    description: '',
    demo_url: '',
    source_code_url: '',
    is_published: false,
  })
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    demo_url: '',
    source_code_url: '',
    is_published: false,
  })

  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  // 3. API Handler (Kini Fleksibel mendukung POST tanpa ID)
  const handleApiCall = async (
    method: 'POST' | 'PATCH' | 'DELETE',
    id?: string,
    body?: FormData | null
  ) => {
    setLoading(true)

    // Jika ada ID berarti targetnya detail url, jika tidak berarti endpoint root (POST)
    const url = id
      ? `${process.env.NEXT_PUBLIC_SERVER_URL}/api/projects/${id}/`
      : `${process.env.NEXT_PUBLIC_SERVER_URL}/api/projects/`

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: body,
      })

      if (!response.ok) throw new Error(`Failed to ${method}`)

      let successMessage = 'Operation successful'
      if (method === 'POST') successMessage = 'Project initialized successfully'
      if (method === 'PATCH') successMessage = 'Project codebase updated'
      if (method === 'DELETE') successMessage = 'Project purged from system'

      toast.success(successMessage)

      // Close all dialogs
      setIsCreateOpen(false)
      setIsEditOpen(false)
      setIsDeleteOpen(false)
      setSelectedFile(null)

      // Reset Create Form jika berhasil
      if (method === 'POST') {
        setCreateForm({
          title: '',
          description: '',
          demo_url: '',
          source_code_url: '',
          is_published: false,
        })
      }

      router.refresh()
    } catch (error) {
      toast.error('Operation failed')
    } finally {
      setLoading(false)
    }
  }

  // 4. Submit Handler untuk Tambah Proyek (POST)
  const handleCreateSubmit = () => {
    if (!createForm.title.trim()) {
      toast.error('Title repository cannot be empty')
      return
    }

    const formData = new FormData()
    formData.append('title', createForm.title)
    formData.append('description', createForm.description)
    formData.append('demo_url', createForm.demo_url)
    formData.append('source_code_url', createForm.source_code_url)
    formData.append('is_published', createForm.is_published ? 'true' : 'false')

    if (selectedFile) {
      formData.append('thumbnail', selectedFile)
    }

    handleApiCall('POST', undefined, formData)
  }

  // 5. Submit Handler untuk Edit Proyek (PATCH)
  const handleEditSubmit = () => {
    if (!activeProject) return

    const formData = new FormData()
    formData.append('title', editForm.title)
    formData.append('description', editForm.description)
    formData.append('demo_url', editForm.demo_url)
    formData.append('source_code_url', editForm.source_code_url)
    formData.append('is_published', editForm.is_published ? 'true' : 'false')

    if (selectedFile) {
      formData.append('thumbnail', selectedFile)
    }

    handleApiCall('PATCH', activeProject.id, formData)
  }

  return (
    <SidebarProvider>
      <AppSidebar user={user} />
      <main className="flex-1 bg-zinc-950 min-h-screen p-8">
        <SidebarTrigger className="mb-6 text-zinc-400" />

        {/* Section Header dengan Tombol Tambah Proyek */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-mono text-emerald-400">
            $ ./list_projects
          </h1>
          <Button
            onClick={() => {
              setSelectedFile(null)
              setIsCreateOpen(true)
            }}
            className="bg-zinc-900 hover:bg-zinc-800 text-emerald-400 border border-zinc-800 hover:border-emerald-500/50 font-mono text-xs gap-2 transition-all shadow-[0_0_10px_rgba(16,185,129,0.05)]"
          >
            <Plus size={14} /> initialize_new_project.sh
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {!projects || projects.length === 0 ? (
            <div className="text-zinc-600 font-mono border border-zinc-800 p-8 rounded-lg text-center col-span-full">
              // No projects in repository
            </div>
          ) : (
            projects.map((p) => (
              <Card
                key={p.id}
                className="bg-zinc-900 border-zinc-800 hover:border-emerald-900/50 transition-colors relative"
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
                          setSelectedFile(null)
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
                        ? 'bg-emerald-950/30 text-emerald-500 border border-emerald-500/20'
                        : 'bg-pink-950/30 text-pink-500 border border-pink-500/20'
                    }
                  >
                    {p.is_published ? 'Published' : 'Drafted'}
                  </Badge>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* ================= NEW CREATE DIALOG ================= */}
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogContent className="bg-zinc-900 border-zinc-800 text-zinc-100 font-mono">
            <DialogHeader>
              <DialogTitle className="text-emerald-400">
                $ nano new_project.conf
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <Input
                value={createForm.title}
                onChange={(e) =>
                  setCreateForm({ ...createForm, title: e.target.value })
                }
                placeholder="Repository Title (Required)"
                className="bg-zinc-950 border-zinc-800 focus-visible:ring-emerald-500"
              />
              <Textarea
                value={createForm.description}
                onChange={(e) =>
                  setCreateForm({ ...createForm, description: e.target.value })
                }
                placeholder="Description / README metadata"
                className="bg-zinc-950 border-zinc-800 focus-visible:ring-emerald-500 h-28"
              />
              <Input
                value={createForm.demo_url}
                onChange={(e) =>
                  setCreateForm({ ...createForm, demo_url: e.target.value })
                }
                placeholder="Live Demo Deployment URL"
                className="bg-zinc-950 border-zinc-800 focus-visible:ring-emerald-500"
              />
              <Input
                value={createForm.source_code_url}
                onChange={(e) =>
                  setCreateForm({
                    ...createForm,
                    source_code_url: e.target.value,
                  })
                }
                placeholder="Source Code Repository URL (e.g. GitHub)"
                className="bg-zinc-950 border-zinc-800 focus-visible:ring-emerald-500"
              />

              {/* File Upload untuk Create */}
              <div className="space-y-2">
                <label className="text-xs text-zinc-500">
                  // static_thumbnail_image
                </label>
                <Input
                  type="file"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  className="bg-zinc-950 border-zinc-800 text-zinc-300 file:text-emerald-400 file:bg-zinc-900 file:border-zinc-800 cursor-pointer"
                  required
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <Checkbox
                  id="create_publish"
                  checked={createForm.is_published}
                  onCheckedChange={(checked) =>
                    setCreateForm({ ...createForm, is_published: !!checked })
                  }
                />
                <label
                  htmlFor="create_publish"
                  className="text-sm text-zinc-400 cursor-pointer select-none"
                >
                  Set as published (visible on public timeline)
                </label>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="ghost"
                className="border border-zinc-800 hover:bg-zinc-800"
                onClick={() => setIsCreateOpen(false)}
              >
                Abort
              </Button>
              <Button
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
                onClick={handleCreateSubmit}
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="animate-spin mr-2" size={16} />
                ) : (
                  'Build Proyek'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent className="bg-zinc-900 border-zinc-800 text-zinc-100 font-mono">
            <DialogHeader>
              <DialogTitle className="text-amber-500">
                $ nano edit_project.conf
              </DialogTitle>
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
                <label className="text-xs text-zinc-500">
                  // update_thumbnail_image
                </label>
                <Input
                  type="file"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  className="bg-zinc-950 border-zinc-800 text-zinc-300 file:text-emerald-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <Checkbox
                  id="edit_publish"
                  checked={editForm.is_published}
                  onCheckedChange={(checked) =>
                    setEditForm({ ...editForm, is_published: !!checked })
                  }
                />
                <label
                  htmlFor="edit_publish"
                  className="text-sm text-zinc-400 cursor-pointer"
                >
                  Published
                </label>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="ghost"
                className="border border-zinc-800"
                onClick={() => setIsEditOpen(false)}
              >
                Cancel
              </Button>
              <Button
                className="bg-emerald-600"
                onClick={handleEditSubmit}
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
          <DialogContent className="bg-zinc-900 border-zinc-800 text-zinc-100 font-mono">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-red-500">
                <AlertCircle /> $ rm -rf project_files?
              </DialogTitle>
              <DialogDescription className="text-zinc-400 font-mono">
                Are you sure you want to delete this project? This action cannot
                be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="ghost"
                className="border border-zinc-800"
                onClick={() => setIsDeleteOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() =>
                  activeProject &&
                  handleApiCall('DELETE', activeProject.id, null)
                }
                disabled={loading}
              >
                {loading ? 'Deleting...' : 'Confirm Purge'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </SidebarProvider>
  )
}
