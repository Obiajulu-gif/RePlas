"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LineChart } from "@/components/ui/chart"
import { Leaf, Droplets, Recycle } from "lucide-react"

export default function ImpactOverview() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card className="lg:col-span-2">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Environmental Impact</CardTitle>
              <CardDescription>Your contribution to sustainability</CardDescription>
            </div>
            <Tabs defaultValue="month" className="w-[200px]">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="week">Week</TabsTrigger>
                <TabsTrigger value="month">Month</TabsTrigger>
                <TabsTrigger value="year">Year</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent className="pl-2">
          <LineChart
            data={[
              { date: "Jan", "CO₂ Offset": 120, "Water Saved": 400, "Plastic Recycled": 35 },
              { date: "Feb", "CO₂ Offset": 150, "Water Saved": 450, "Plastic Recycled": 40 },
              { date: "Mar", "CO₂ Offset": 180, "Water Saved": 510, "Plastic Recycled": 45 },
              { date: "Apr", "CO₂ Offset": 220, "Water Saved": 590, "Plastic Recycled": 55 },
              { date: "May", "CO₂ Offset": 250, "Water Saved": 650, "Plastic Recycled": 60 },
              { date: "Jun", "CO₂ Offset": 280, "Water Saved": 720, "Plastic Recycled": 70 },
            ]}
            categories={["CO₂ Offset", "Water Saved", "Plastic Recycled"]}
            index="date"
            colors={["#16a34a", "#0ea5e9", "#f59e0b"]}
            valueFormatter={(value) => `${value}`}
            yAxisWidth={40}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Impact Metrics</CardTitle>
          <CardDescription>Your environmental contributions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                <Leaf className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm font-medium leading-none">CO₂ Offset</p>
                <p className="text-2xl font-bold">284 kg</p>
                <p className="text-xs text-muted-foreground">Equivalent to 1.2 trees planted yearly</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                <Droplets className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm font-medium leading-none">Water Saved</p>
                <p className="text-2xl font-bold">1,240 L</p>
                <p className="text-xs text-muted-foreground">Through plastic recycling efforts</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900">
                <Recycle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-sm font-medium leading-none">Plastic Recycled</p>
                <p className="text-2xl font-bold">142.5 kg</p>
                <p className="text-xs text-muted-foreground">Prevented from entering landfills</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
