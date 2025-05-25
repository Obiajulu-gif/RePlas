import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function ExplorerLoading() {
  return (
    <div className="container py-8">
      <Skeleton className="h-10 w-64 mb-6" />

      <div className="mb-8">
        <div className="flex gap-2 mb-4">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-10 w-10" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array(3)
            .fill(null)
            .map((_, i) => (
              <Card key={i}>
                <CardHeader className="pb-2">
                  <Skeleton className="h-6 w-40" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-24" />
                </CardContent>
              </Card>
            ))}
        </div>
      </div>

      <Skeleton className="h-10 w-96 mb-6" />

      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array(5)
              .fill(null)
              .map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-64" />
                    <Skeleton className="h-4 w-40" />
                  </div>
                  <Skeleton className="h-6 w-24" />
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
