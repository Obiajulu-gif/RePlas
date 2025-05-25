import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="container py-12">
      <div className="space-y-8">
        <div className="space-y-4">
          <Skeleton className="h-12 w-3/4 md:w-1/2" />
          <Skeleton className="h-6 w-full md:w-3/4" />
          <Skeleton className="h-6 w-full md:w-2/3" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <Skeleton className="h-64 w-full rounded-xl" />
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-5/6" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-64 w-full rounded-xl" />
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-5/6" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-48 w-full rounded-lg" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
