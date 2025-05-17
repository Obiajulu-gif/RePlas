"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChartContainer } from "@/components/ui/chart"
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"

// Mock impact data
const monthlyData = [
  { month: "Jan", weight: 22.5, tokens: 225, carbonOffset: 0.7 },
  { month: "Feb", weight: 18.3, tokens: 183, carbonOffset: 0.5 },
  { month: "Mar", weight: 25.7, tokens: 257, carbonOffset: 0.8 },
  { month: "Apr", weight: 30.2, tokens: 302, carbonOffset: 0.9 },
  { month: "May", weight: 28.6, tokens: 286, carbonOffset: 0.8 },
  { month: "Jun", weight: 35.1, tokens: 351, carbonOffset: 1.1 },
  { month: "Jul", weight: 42.3, tokens: 423, carbonOffset: 1.3 },
  { month: "Aug", weight: 38.7, tokens: 387, carbonOffset: 1.2 },
  { month: "Sep", weight: 45.2, tokens: 452, carbonOffset: 1.4 },
  { month: "Oct", weight: 50.8, tokens: 508, carbonOffset: 1.5 },
  { month: "Nov", weight: 47.5, tokens: 475, carbonOffset: 1.4 },
  { month: "Dec", weight: 55.3, tokens: 553, carbonOffset: 1.7 },
]

const plasticTypeData = [
  { name: "PET", value: 45 },
  { name: "HDPE", value: 20 },
  { name: "PVC", value: 5 },
  { name: "LDPE", value: 15 },
  { name: "PP", value: 10 },
  { name: "PS", value: 3 },
  { name: "Other", value: 2 },
]

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d", "#ffc658"]

const impactEquivalents = [
  {
    title: "Trees Saved",
    value: "37",
    description: "Equivalent to the annual oxygen production of 37 trees",
  },
  {
    title: "Water Bottles",
    value: "12,450",
    description: "Number of plastic water bottles kept out of landfills and oceans",
  },
  {
    title: "Oil Saved",
    value: "245 L",
    description: "Amount of petroleum saved through your recycling efforts",
  },
  {
    title: "Energy Saved",
    value: "1,245 kWh",
    description: "Energy conserved through recycling instead of producing new plastic",
  },
]

export default function ImpactMetrics() {
  const [timeRange, setTimeRange] = useState("year")

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Impact Metrics</CardTitle>
          <CardDescription>Visualize the environmental impact of your recycling efforts</CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="month">This Month</SelectItem>
            <SelectItem value="quarter">This Quarter</SelectItem>
            <SelectItem value="year">This Year</SelectItem>
            <SelectItem value="all">All Time</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview">
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="recycling">Recycling</TabsTrigger>
            <TabsTrigger value="carbon">Carbon Offset</TabsTrigger>
            <TabsTrigger value="types">Plastic Types</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {impactEquivalents.map((item, index) => (
                <Card key={index} className="bg-muted/30">
                  <CardContent className="p-4 text-center">
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">{item.title}</h3>
                    <p className="text-3xl font-bold mb-1">{item.value}</p>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader className="pb-0">
                <CardTitle className="text-base">Monthly Recycling Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    weight: {
                      label: "Weight (kg)",
                      color: "hsl(var(--chart-1))",
                    },
                    tokens: {
                      label: "Tokens Earned",
                      color: "hsl(var(--chart-2))",
                    },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis yAxisId="left" orientation="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Legend />
                      <Bar yAxisId="left" dataKey="weight" name="Weight (kg)" fill="var(--color-weight)" />
                      <Bar yAxisId="right" dataKey="tokens" name="Tokens Earned" fill="var(--color-tokens)" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="recycling">
            <Card>
              <CardHeader className="pb-0">
                <CardTitle className="text-base">Recycling Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    weight: {
                      label: "Weight (kg)",
                      color: "hsl(var(--chart-1))",
                    },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="weight"
                        name="Weight (kg)"
                        stroke="var(--color-weight)"
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="carbon">
            <Card>
              <CardHeader className="pb-0">
                <CardTitle className="text-base">Carbon Offset</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    carbonOffset: {
                      label: "Carbon Offset (tons)",
                      color: "hsl(var(--chart-3))",
                    },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="carbonOffset"
                        name="Carbon Offset (tons)"
                        stroke="var(--color-carbonOffset)"
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="types">
            <Card>
              <CardHeader className="pb-0">
                <CardTitle className="text-base">Plastic Types Recycled</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={plasticTypeData}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {plasticTypeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `${value}%`} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
