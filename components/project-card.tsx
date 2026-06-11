import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { stripMarkdownAndTruncate } from '@/lib/utils'
import { Eye, Heart, MessageSquare, User } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export function ProjectCard({ project }: { project: any }) {
  const cleanDescription = stripMarkdownAndTruncate(project.description, 40)
  return (
    <Link href={`/projects/${project.id}`}>
      <Card className="p-0 bg-zinc-900 min-h-full border-zinc-800 overflow-hidden hover:border-emerald-900 transition-all group flex flex-col">
        {/* Thumbnail */}
        <div className="relative h-60 w-full bg-zinc-950 overflow-hidden">
          <Image
            src={project.thumbnail}
            alt={project.title}
            width={1920}
            height={1080}
            className="group-hover:scale-105 transition-transform duration-500"
          />
        </div>

        <CardHeader className="p-4 pb-2">
          <div className="text-emerald-500/80 text-[10px] font-mono flex items-center gap-1 mb-1">
            <User size={12} /> @{project.author.username}
          </div>
          <h3 className="text-md font-mono font-bold text-zinc-100 line-clamp-2 leading-tight">
            {project.title}
          </h3>
        </CardHeader>

        <CardContent className="p-4 pt-0 grow">
          <p className="text-xs text-zinc-400 font-mono line-clamp-2 mb-4">
            {cleanDescription}
          </p>
          <div className="flex gap-2 flex-wrap">
            {project.tech_stack?.map((tech: any) => (
              <Badge
                key={tech.id}
                variant="outline"
                className="text-[10px] border-zinc-700 text-zinc-400 font-mono"
              >
                {tech.name}
              </Badge>
            ))}
          </div>
        </CardContent>

        <CardFooter className="py-2 px-4 border-t border-zinc-800/50 flex justify-between items-center text-zinc-500">
          <div className="flex gap-4 items-center">
            <div className="flex items-center gap-1 text-[10px] font-mono">
              <Eye size={12} /> {project.view_count}
            </div>
            <div className="flex items-center gap-1 text-[10px] font-mono">
              <Heart size={12} /> {project.likes_count}
            </div>
            <div className="flex items-center gap-1 text-[10px] font-mono">
              <MessageSquare size={12} /> {project.comments_count}
            </div>
          </div>
        </CardFooter>
      </Card>
    </Link>
  )
}
