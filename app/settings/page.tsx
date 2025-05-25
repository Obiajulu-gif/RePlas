import type { Metadata } from "next"
import SettingsTabs from "@/components/settings/settings-tabs"
import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"

export const metadata: Metadata = {
  title: "Settings | RePlas",
  description: "Customize your profile and notification preferences",
}

export default function SettingsPage() {
  return (
    <div className="container py-6 max-w-5xl">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">Manage your account settings and preferences.</p>
        </div>

        <Suspense fallback={<Skeleton className="h-[600px] w-full rounded-lg" />}>
          <SettingsTabs />
        </Suspense>
      </div>
    </div>
  )
}
