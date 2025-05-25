"use client"

import React from "react"

import { Suspense, useState, useMemo, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Leaf, Droplets, Recycle, TrendingUp, Award, Calendar } from "lucide-react"
import { BarChart, LineChart, PieChart } from "@/components/ui/chart"

// Chart loading fallback
function ChartSkeleton() {
  return <div className="w-full h-[300px] bg-muted/20 animate-pulse rounded-md" />
}

// Memoized summary card component
const SummaryCard = React.memo(({ title, value, change, icon, timeRange }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <div className="flex items-center pt-1">
        <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
        <span className="text-xs text-green-500">
          {change} from last {timeRange}
        </span>
      </div>
    </CardContent>
  </Card>
))

// Memoized insight card component
const InsightCard = React.memo(({ icon, title, description }) => (
  <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
    {icon}
    <div>
      <p className="font-medium">{title}</p>
      <p className="text-sm text-muted-foreground mt-1">{description}</p>
    </div>
  </div>
))

// Sample data for charts
const plasticTypeData = [
  { name: "PET", value: 35 },
  { name: "HDPE", value: 25 },
  { name: "PVC", value: 15 },
  { name: "LDPE", value: 10 },
  { name: "PP", value: 10 },
  { name: "PS", value: 5 },
]

const monthlyCollectionData = [
  { month: "Jan", amount: 120 },
  { month: "Feb", amount: 150 },
  { month: "Mar", amount: 180 },
  { month: "Apr", amount: 220 },
  { month: "May", amount: 270 },
  { month: "Jun", amount: 310 },
  { month: "Jul", amount: 350 },
  { month: "Aug", amount: 320 },
  { month: "Sep", amount: 290 },
  { month: "Oct", amount: 260 },
  { month: "Nov", amount: 240 },
  { month: "Dec", amount: 210 },
]

const impactData = [
  { name: "CO2 Reduced", value: 1250, unit: "kg" },
  { name: "Water Saved", value: 3500, unit: "liters" },
  { name: "Energy Saved", value: 750, unit: "kWh" },
  { name: "Landfill Avoided", value: 850, unit: "kg" },
]

const COLORS = ["#10B981", "#059669", "#047857", "#065F46", "#064E3B", "#022C22"]

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("month")
  const [activeTab, setActiveTab] = useState("overview")

  // Memoize data based on time range to prevent recalculations
  const chartData = useMemo(() => {
    // This would normally fetch from an API based on timeRange
    return {
      recyclingActivity: [
        { name: "Jan", PET: 40, HDPE: 24, PP: 10, Other: 5 },
        { name: "Feb", PET: 30, HDPE: 20, PP: 15, Other: 8 },
        { name: "Mar", PET: 45, HDPE: 25, PP: 20, Other: 10 },
        { name: "Apr", PET: 50, HDPE: 35, PP: 25, Other: 15 },
        { name: "May", PET: 55, HDPE: 40, PP: 30, Other: 12 },
        { name: "Jun", PET: 60, HDPE: 45, PP: 35, Other: 18 },
      ],
      recyclingFrequency: [
        { day: "Mon", count: 3 },
        { day: "Tue", count: 2 },
        { day: "Wed", count: 5 },
        { day: "Thu", count: 1 },
        { day: "Fri", count: 4 },
        { day: "Sat", count: 7 },
        { day: "Sun", count: 2 },
      ],
      collectionLocations: [
        { name: "Home", value: 45 },
        { name: "Work", value: 25 },
        { name: "School", value: 15 },
        { name: "Other", value: 15 },
      ],
      environmentalImpact: [
        { month: "Jan", co2: 40, water: 240, energy: 30 },
        { month: "Feb", co2: 30, water: 180, energy: 25 },
        { month: "Mar", co2: 45, water: 270, energy: 35 },
        { month: "Apr", co2: 50, water: 300, energy: 40 },
        { month: "May", co2: 55, water: 330, energy: 45 },
        { month: "Jun", co2: 60, water: 360, energy: 50 },
      ],
      tokenEarnings: [
        { month: "Jan", tokens: 40 },
        { month: "Feb", tokens: 35 },
        { month: "Mar", tokens: 50 },
        { month: "Apr", tokens: 55 },
        { month: "May", tokens: 65 },
        { month: "Jun", tokens: 75 },
      ],
      tokenByMaterial: [
        { name: "PET", value: 45 },
        { name: "HDPE", value: 30 },
        { name: "PP", value: 15 },
        { name: "Other", value: 10 },
      ],
      tokenRedemption: [
        { category: "Products", amount: 120 },
        { category: "Services", amount: 80 },
        { category: "Donations", amount: 60 },
        { category: "Savings", amount: 40 },
      ],
    }
  }, [timeRange])

  // Memoize summary data
  const summaryData = useMemo(
    () => [
      {
        title: "Total Recycled",
        value: "142.5 kg",
        change: "+20.1%",
        icon: <Recycle className="h-4 w-4 text-muted-foreground" />,
      },
      {
        title: "CO₂ Offset",
        value: "284 kg",
        change: "+18.5%",
        icon: <Leaf className="h-4 w-4 text-muted-foreground" />,
      },
      {
        title: "Water Saved",
        value: "1,240 L",
        change: "+22.3%",
        icon: <Droplets className="h-4 w-4 text-muted-foreground" />,
      },
      {
        title: "RePlas Earned",
        value: "320 RPL",
        change: "+15.7%",
        icon: <Award className="h-4 w-4 text-muted-foreground" />,
      },
    ],
    [],
  )

  // Memoize insights data
  const insightsData = useMemo(
    () => [
      {
        icon: <Calendar className="h-5 w-5 text-primary mt-0.5" />,
        title: "Recycling Pattern Analysis",
        description:
          "You recycle most consistently on Saturdays. Setting reminders for mid-week recycling could help you increase your impact and token earnings by approximately 20%.",
      },
      {
        icon: <Recycle className="h-5 w-5 text-primary mt-0.5" />,
        title: "Material Optimization",
        description:
          "You're recycling more PET than other plastic types. Consider focusing on HDPE collection as well, as it has a high token reward rate and is commonly found in household products.",
      },
      {
        icon: <Leaf className="h-5 w-5 text-primary mt-0.5" />,
        title: "Environmental Impact",
        description:
          "Your recycling efforts have offset CO₂ equivalent to taking a car off the road for 2 weeks. If you maintain your current rate, you'll reach the equivalent of 1 month by the end of the quarter.",
      },
    ],
    [],
  )

  // Memoize token activity data
  const tokenActivityData = useMemo(
    () => [
      {
        type: "reward",
        title: "Recycling Reward",
        date: "June 15, 2023",
        amount: "+25 RPL",
        category: "PET Bottles",
        icon: <Recycle className="h-4 w-4 text-green-600" />,
        iconBg: "bg-green-100",
      },
      {
        type: "reward",
        title: "Recycling Reward",
        date: "June 12, 2023",
        amount: "+18 RPL",
        category: "HDPE Containers",
        icon: <Recycle className="h-4 w-4 text-green-600" />,
        iconBg: "bg-green-100",
      },
      {
        type: "redemption",
        title: "Token Redemption",
        date: "June 10, 2023",
        amount: "-50 RPL",
        category: "Eco-friendly Products",
        icon: <Award className="h-4 w-4 text-red-600" />,
        iconBg: "bg-red-100",
      },
      {
        type: "reward",
        title: "Recycling Reward",
        date: "June 8, 2023",
        amount: "+30 RPL",
        category: "Mixed Plastics",
        icon: <Recycle className="h-4 w-4 text-green-600" />,
        iconBg: "bg-green-100",
      },
      {
        type: "bonus",
        title: "Bonus Reward",
        date: "June 5, 2023",
        amount: "+15 RPL",
        category: "Consistency Bonus",
        icon: <Award className="h-4 w-4 text-blue-600" />,
        iconBg: "bg-blue-100",
      },
    ],
    [],
  )

  // Memoize material details data
  const materialDetailsData = useMemo(
    () => [
      {
        name: "PET (Type 1)",
        value: "64.1 kg",
        percentage: 45,
        color: "bg-blue-500",
        description: "Polyethylene terephthalate - Water bottles, soda bottles, food containers",
      },
      {
        name: "HDPE (Type 2)",
        value: "42.8 kg",
        percentage: 30,
        color: "bg-green-500",
        description: "High-density polyethylene - Milk jugs, detergent bottles, toys",
      },
      {
        name: "PP (Type 5)",
        value: "21.4 kg",
        percentage: 15,
        color: "bg-amber-500",
        description: "Polypropylene - Yogurt containers, medicine bottles, bottle caps",
      },
      {
        name: "Other Plastics",
        value: "14.2 kg",
        percentage: 10,
        color: "bg-slate-500",
        description: "Various other plastic types - Mixed packaging, disposable items",
      },
    ],
    [],
  )

  // Memoize impact breakdown data
  const impactBreakdownData = useMemo(
    () => [
      {
        title: "CO₂ Emissions Reduction",
        percentage: 65,
        color: "bg-green-500",
        description:
          "Your recycling has reduced carbon emissions by 284kg, which is 65% of your monthly carbon footprint from plastic consumption.",
      },
      {
        title: "Water Conservation",
        percentage: 48,
        color: "bg-blue-500",
        description:
          "You've saved 1,240 liters of water through recycling, which is 48% of the water used in plastic production for your consumption.",
      },
      {
        title: "Energy Savings",
        percentage: 72,
        color: "bg-amber-500",
        description:
          "Your recycling efforts have saved 180 kWh of energy, which is 72% of the energy required to produce new plastic for your consumption.",
      },
      {
        title: "Landfill Reduction",
        percentage: 85,
        color: "bg-purple-500",
        description: "You've diverted 142.5kg of plastic from landfills, which is 85% of your total plastic waste.",
      },
    ],
    [],
  )

  // Optimize tab change handler
  const handleTabChange = useCallback((value) => {
    setActiveTab(value)
  }, [])

  // Optimize time range change handler
  const handleTimeRangeChange = useCallback((value) => {
    setTimeRange(value)
  }, [])

  // Memoized value formatter functions to prevent recreation on each render
  const kgFormatter = useCallback((value) => `${value}kg`, [])
  const itemsFormatter = useCallback((value) => `${value} items`, [])
  const percentFormatter = useCallback((value) => `${value}%`, [])
  const unitsFormatter = useCallback((value) => `${value} units`, [])
  const tokenFormatter = useCallback((value) => `${value} RPL`, [])

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground">Track your recycling impact and environmental contributions</p>
        </div>
        <div className="flex items-center gap-2">
          <Select defaultValue={timeRange} onValueChange={handleTimeRangeChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Last 7 days</SelectItem>
              <SelectItem value="month">Last 30 days</SelectItem>
              <SelectItem value="quarter">Last 3 months</SelectItem>
              <SelectItem value="year">Last 12 months</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
        {summaryData.map((item, index) => (
          <SummaryCard
            key={index}
            title={item.title}
            value={item.value}
            change={item.change}
            icon={item.icon}
            timeRange={timeRange}
          />
        ))}
      </div>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={handleTabChange} className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="materials">Materials</TabsTrigger>
          <TabsTrigger value="impact">Environmental Impact</TabsTrigger>
          <TabsTrigger value="tokens">Token Analytics</TabsTrigger>
        </TabsList>

        {/* Only render the active tab content to reduce initial load time */}
        {activeTab === "overview" && (
          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Recycling Activity</CardTitle>
                  <CardDescription>Your plastic recycling over time by type</CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                  <Suspense fallback={<ChartSkeleton />}>
                    <LineChart
                      data={chartData.recyclingActivity}
                      categories={["PET", "HDPE", "PP", "Other"]}
                      index="name"
                      colors={["#0ea5e9", "#22c55e", "#f59e0b", "#64748b"]}
                      valueFormatter={kgFormatter}
                      yAxisWidth={40}
                    />
                  </Suspense>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recycling Frequency</CardTitle>
                  <CardDescription>How often you recycle</CardDescription>
                </CardHeader>
                <CardContent>
                  <Suspense fallback={<ChartSkeleton />}>
                    <BarChart
                      data={chartData.recyclingFrequency}
                      index="day"
                      categories={["count"]}
                      colors={["#0ea5e9"]}
                      valueFormatter={itemsFormatter}
                      yAxisWidth={30}
                    />
                  </Suspense>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Collection Locations</CardTitle>
                  <CardDescription>Where you recycle most</CardDescription>
                </CardHeader>
                <CardContent>
                  <Suspense fallback={<ChartSkeleton />}>
                    <PieChart
                      data={chartData.collectionLocations}
                      index="name"
                      categories={["value"]}
                      colors={["#0ea5e9", "#22c55e", "#f59e0b", "#64748b"]}
                      valueFormatter={percentFormatter}
                    />
                  </Suspense>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>AI-Generated Insights</CardTitle>
                <CardDescription>Personalized recycling insights powered by Gemini 2.5 Pro</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {insightsData.map((insight, index) => (
                    <InsightCard
                      key={index}
                      icon={insight.icon}
                      title={insight.title}
                      description={insight.description}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {activeTab === "materials" && (
          <TabsContent value="materials" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Material Breakdown</CardTitle>
                  <CardDescription>Distribution of recycled materials</CardDescription>
                </CardHeader>
                <CardContent>
                  <Suspense fallback={<ChartSkeleton />}>
                    <PieChart
                      data={chartData.tokenByMaterial}
                      index="name"
                      categories={["value"]}
                      colors={["#0ea5e9", "#22c55e", "#f59e0b", "#64748b"]}
                      valueFormatter={percentFormatter}
                    />
                  </Suspense>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Material Trends</CardTitle>
                  <CardDescription>How your recycling mix has changed</CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                  <Suspense fallback={<ChartSkeleton />}>
                    <LineChart
                      data={chartData.recyclingActivity}
                      categories={["PET", "HDPE", "PP", "Other"]}
                      index="name"
                      colors={["#0ea5e9", "#22c55e", "#f59e0b", "#64748b"]}
                      valueFormatter={kgFormatter}
                      yAxisWidth={40}
                    />
                  </Suspense>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Material Details</CardTitle>
                <CardDescription>Detailed breakdown of your recycled materials</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {materialDetailsData.map((material, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`h-4 w-4 rounded-full ${material.color}`}></div>
                          <h3 className="font-medium">{material.name}</h3>
                        </div>
                        <Badge>{material.value}</Badge>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className={`${material.color} h-2 rounded-full`}
                          style={{ width: `${material.percentage}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-muted-foreground">{material.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {activeTab === "impact" && (
          <TabsContent value="impact" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Environmental Impact Over Time</CardTitle>
                  <CardDescription>Your contribution to environmental conservation</CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                  <Suspense fallback={<ChartSkeleton />}>
                    <LineChart
                      data={chartData.environmentalImpact}
                      categories={["co2", "water", "energy"]}
                      index="month"
                      colors={["#0ea5e9", "#22c55e", "#f59e0b"]}
                      valueFormatter={unitsFormatter}
                      yAxisWidth={40}
                    />
                  </Suspense>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>CO₂ Emissions Saved</CardTitle>
                  <CardDescription>Equivalent to trees planted</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center justify-center h-[200px]">
                    <div className="text-5xl font-bold text-green-500">284</div>
                    <div className="text-sm text-muted-foreground mt-2">kg of CO₂ saved</div>
                    <div className="text-sm font-medium mt-4">Equivalent to</div>
                    <div className="text-2xl font-bold mt-1">12 trees</div>
                    <div className="text-sm text-muted-foreground">planted for one year</div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Water Conservation</CardTitle>
                  <CardDescription>Liters of water saved through recycling</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center justify-center h-[200px]">
                    <div className="text-5xl font-bold text-blue-500">1,240</div>
                    <div className="text-sm text-muted-foreground mt-2">liters of water saved</div>
                    <div className="text-sm font-medium mt-4">Equivalent to</div>
                    <div className="text-2xl font-bold mt-1">8 days</div>
                    <div className="text-sm text-muted-foreground">of drinking water for one person</div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Impact Breakdown</CardTitle>
                <CardDescription>Detailed analysis of your environmental impact</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {impactBreakdownData.map((impact, index) => (
                    <div key={index} className="space-y-2">
                      <h3 className="font-medium">{impact.title}</h3>
                      <div className="flex items-center gap-2">
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className={`${impact.color} h-2 rounded-full`}
                            style={{ width: `${impact.percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">{impact.percentage}%</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{impact.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {activeTab === "tokens" && (
          <TabsContent value="tokens" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Token Earnings Over Time</CardTitle>
                  <CardDescription>Your RePlas token earnings history</CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                  <Suspense fallback={<ChartSkeleton />}>
                    <LineChart
                      data={chartData.tokenEarnings}
                      categories={["tokens"]}
                      index="month"
                      colors={["#8b5cf6"]}
                      valueFormatter={tokenFormatter}
                      yAxisWidth={40}
                    />
                  </Suspense>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Token Earnings by Material</CardTitle>
                  <CardDescription>Which materials earn you the most tokens</CardDescription>
                </CardHeader>
                <CardContent>
                  <Suspense fallback={<ChartSkeleton />}>
                    <PieChart
                      data={chartData.tokenByMaterial}
                      index="name"
                      categories={["value"]}
                      colors={["#0ea5e9", "#22c55e", "#f59e0b", "#64748b"]}
                      valueFormatter={percentFormatter}
                    />
                  </Suspense>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Token Redemption History</CardTitle>
                  <CardDescription>How you've used your tokens</CardDescription>
                </CardHeader>
                <CardContent>
                  <Suspense fallback={<ChartSkeleton />}>
                    <BarChart
                      data={chartData.tokenRedemption}
                      index="category"
                      categories={["amount"]}
                      colors={["#8b5cf6"]}
                      valueFormatter={tokenFormatter}
                      yAxisWidth={40}
                    />
                  </Suspense>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Token Activity</CardTitle>
                <CardDescription>Recent token transactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {tokenActivityData.map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`h-8 w-8 rounded-full ${activity.iconBg} flex items-center justify-center`}>
                          {activity.icon}
                        </div>
                        <div>
                          <p className="font-medium">{activity.title}</p>
                          <p className="text-xs text-muted-foreground">{activity.date}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p
                          className={`font-medium ${activity.amount.startsWith("+") ? "text-green-600" : "text-red-600"}`}
                        >
                          {activity.amount}
                        </p>
                        <p className="text-xs text-muted-foreground">{activity.category}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}
