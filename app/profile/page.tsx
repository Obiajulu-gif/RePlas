import type { Metadata } from "next"
import ProfileHeader from "@/components/profile/profile-header"
import ProfileTabs from "@/components/profile/profile-tabs"
import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"

export const metadata: Metadata = {
  title: "User Profile | RePlas",
  description: "View your recycling history, achievements, and impact metrics",
}

export default function ProfilePage() {
  return (
    <div className="container py-6 space-y-8 max-w-5xl">
      <Suspense fallback={<Skeleton className="h-[200px] w-full rounded-lg" />}>
        <ProfileHeader />
      </Suspense>

      <Suspense
        fallback={
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-[400px] w-full rounded-lg" />
          </div>
        }
      >
        <ProfileTabs />
      </Suspense>
    </div>
  )
}
