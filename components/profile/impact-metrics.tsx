"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LineChart, BarChart, PieChart } from "@/components/ui/chart"

// Mock data for the charts
const monthlyData = [
  { month: "Jan", plastic: 45, carbon: 12 },
  { month: "Feb", plastic: 52, carbon: 14 },
  { month: "Mar", plastic: 49, carbon: 13 },
  { month: "Apr", plastic: 62, carbon: 17 },
  { month: "May", plastic: 55, carbon: 15 },
  { month: "Jun", plastic: 75, carbon: 20 },
  { month: "Jul", plastic: 85, carbon: 23 },
  { month: "Aug", plastic: 70, carbon: 19 },
  { month: "Sep", plastic: 95, carbon: 26 },
  { month: "Oct", plastic: 110, carbon: 30 },
  { month: "Nov", plastic: 120, carbon: 33 },
  { month: "Dec", plastic: 135, carbon: 37 },
]

const plasticTypeData = [
  { name: "PET", value: 45 },
  { name: "HDPE", value: 28 },
  { name: "PVC", value: 12 },
  { name: "LDPE", value: 20 },
  { name: "PP", value: 18 },
  { name: "PS", value: 7 },
]

const impactEquivalentsData = [
  { category: "Trees Saved", value: 12 },
  { category: "Water Saved (L)", value: 2500 },
  { category: "Energy Saved (kWh)", value: 350 },
  { category: "CO2 Reduced (kg)", value: 180 },
  { category: "Landfill Space Saved (m³)", value: 5 },
]

export default function ImpactMetrics() {
  const [timeRange, setTimeRange] = useState("year")

  // Format values for charts
  const formatPlastic = (value: number) => `${value}kg`
  const formatCarbon = (value: number) => `${value}kg CO₂`

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Environmental Impact</h2>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="month">This Month</SelectItem>
            <SelectItem value="quarter">This Quarter</SelectItem>
            <SelectItem value="year">This Year</SelectItem>
            <SelectItem value="all">All Time</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recycling Progress</CardTitle>
            <CardDescription>Plastic recycled and carbon offset over time</CardDescription>
          </CardHeader>
          <CardContent>
            <LineChart
              data={monthlyData}
              index="month"
              categories={["plastic", "carbon"]}
              colors={["#10b981", "#3b82f6"]}
              valueFormatter={formatPlastic}
              yAxisWidth={45}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Plastic Type Breakdown</CardTitle>
            <CardDescription>Distribution of recycled plastic types</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <PieChart
              data={plasticTypeData}
              index="name"
              categories={["value"]}
              colors={["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"]}
              valueFormatter={formatPlastic}
            />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Impact Equivalents</CardTitle>
          <CardDescription>Environmental impact in relatable terms</CardDescription>
        </CardHeader>
        <CardContent>
          <BarChart
            data={impactEquivalentsData}
            index="category"
            categories={["value"]}
            colors={["#10b981"]}
            yAxisWidth={60}
          />
        </CardContent>
      </Card>
    </div>
  )
}
