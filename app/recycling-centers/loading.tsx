import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function RecyclingCentersLoading() {
  return (
    <div className="container py-8">
      <div className="flex flex-col items-center justify-center text-center mb-8">
        <Skeleton className="h-10 w-64 mb-4" />
        <Skeleton className="h-4 w-96 mb-2" />
        <Skeleton className="h-4 w-80" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6">
        {/* Filters sidebar skeleton */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-10 w-full" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-40" />
            </CardHeader>
            <CardContent className="space-y-4">
              {Array(4)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className="flex justify-between">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-8" />
                  </div>
                ))}
            </CardContent>
          </Card>
        </div>

        {/* Main content skeleton */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <Skeleton className="h-10 w-48" />
            <Skeleton className="h-4 w-40" />
          </div>

          <div className="h-[600px]">
            <Skeleton className="h-full w-full" />
          </div>
        </div>
      </div>
    </div>
  )
}
