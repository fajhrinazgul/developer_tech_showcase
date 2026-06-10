export function ProjectSkeleton() {
  return (
    <div className="container mx-auto py-12 px-4 max-w-4xl space-y-8 animate-pulse">
      {/* Back Button Skeleton */}
      <div className="h-4 w-20 bg-zinc-800 rounded" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Skeleton */}
        <div className="lg:col-span-2 space-y-6">
          <div className="border border-zinc-800 rounded-xl overflow-hidden bg-zinc-900 h-64" />
          <div className="p-6 space-y-4">
            <div className="h-8 w-3/4 bg-zinc-800 rounded" /> {/* Title */}
            <div className="space-y-2">
              <div className="h-4 w-full bg-zinc-800 rounded" />
              <div className="h-4 w-full bg-zinc-800 rounded" />
              <div className="h-4 w-2/3 bg-zinc-800 rounded" />
            </div>
          </div>
        </div>

        {/* Sidebar Skeleton */}
        <div className="space-y-6">
          <div className="h-24 bg-zinc-900 border border-zinc-800 rounded-xl" />{' '}
          {/* Stats */}
          <div className="h-48 bg-zinc-900 border border-zinc-800 rounded-xl" />{' '}
          {/* Author */}
        </div>
      </div>
    </div>
  )
}
