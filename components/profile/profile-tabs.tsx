"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import RecyclingHistory from "@/components/profile/recycling-history"
import Achievements from "@/components/profile/achievements"
import ImpactMetrics from "@/components/profile/impact-metrics"
import ActivityTimeline from "@/components/profile/activity-timeline"

export default function ProfileTabs() {
  const [activeTab, setActiveTab] = useState("history")

  return (
    <Tabs defaultValue="history" value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full">
        <TabsTrigger value="history">Recycling History</TabsTrigger>
        <TabsTrigger value="achievements">Achievements</TabsTrigger>
        <TabsTrigger value="impact">Impact Metrics</TabsTrigger>
        <TabsTrigger value="activity">Activity</TabsTrigger>
      </TabsList>

      <TabsContent value="history" className="mt-4">
        <RecyclingHistory />
      </TabsContent>

      <TabsContent value="achievements" className="mt-4">
        <Achievements />
      </TabsContent>

      <TabsContent value="impact" className="mt-4">
        <ImpactMetrics />
      </TabsContent>

      <TabsContent value="activity" className="mt-4">
        <ActivityTimeline />
      </TabsContent>
    </Tabs>
  )
}
