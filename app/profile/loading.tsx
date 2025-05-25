import { Skeleton } from "@/components/ui/skeleton"

export default function ProfileLoading() {
  return (
    <div className="container py-6 space-y-8 max-w-5xl">
      <div className="space-y-4">
        <Skeleton className="h-[200px] w-full rounded-lg" />
        <div className="flex gap-4">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
        </div>
        <Skeleton className="h-[400px] w-full rounded-lg" />
      </div>
    </div>
  )
}
