"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart, LineChart, PieChart } from "@/components/ui/chart"
import { Badge } from "@/components/ui/badge"
import { Leaf, Droplets, Recycle, TrendingUp, Award, Calendar } from "lucide-react"

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("month");

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground">
            Track your recycling impact and environmental contributions
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select defaultValue={timeRange} onValueChange={setTimeRange}>
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
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Recycled</CardTitle>
            <Recycle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">142.5 kg</div>
            <div className="flex items-center pt-1">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-xs text-green-500">+20.1% from last {timeRange}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CO₂ Offset</CardTitle>
            <Leaf className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">284 kg</div>
            <div className="flex items-center pt-1">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-xs text-green-500">+18.5% from last {timeRange}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Water Saved</CardTitle>
            <Droplets className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,240 L</div>
            <div className="flex items-center pt-1">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-xs text-green-500">+22.3% from last {timeRange}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">RePlas Earned</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">320 RPL</div>
            <div className="flex items-center pt-1">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-xs text-green-500">+15.7% from last {timeRange}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="materials">Materials</TabsTrigger>
          <TabsTrigger value="impact">Environmental Impact</TabsTrigger>
          <TabsTrigger value="tokens">Token Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Recycling Activity</CardTitle>
                <CardDescription>
                  Your plastic recycling over time by type
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <LineChart
                  data={[
                    { name: "Jan", PET: 40, HDPE: 24, PP: 10, Other: 5 },
                    { name: "Feb", PET: 30, HDPE: 20, PP: 15, Other: 8 },
                    { name: "Mar", PET: 45, HDPE: 25, PP: 20, Other: 10 },
                    { name: "Apr", PET: 50, HDPE: 35, PP: 25, Other: 15 },
                    { name: "May", PET: 55, HDPE: 40, PP: 30, Other: 12 },
                    { name: "Jun", PET: 60, HDPE: 45, PP: 35, Other: 18 },
                  ]}
                  categories={["PET", "HDPE", "PP", "Other"]}
                  index="name"
                  colors={["#0ea5e9", "#22c55e", "#f59e0b", "#64748b"]}
                  valueFormatter={(value) => `${value}kg`}
                  yAxisWidth={40}
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Recycling Frequency</CardTitle>
                <CardDescription>
                  How often you recycle
                </CardDescription>
              </CardHeader>
              <CardContent>
                <BarChart
                  data={[
                    { day: "Mon", count: 3 },
                    { day: "Tue", count: 2 },
                    { day: "Wed", count: 5 },
                    { day: "Thu", count: 1 },
                    { day: "Fri", count: 4 },
                    { day: "Sat", count: 7 },
                    { day: "Sun", count: 2 },
                  ]}
                  index="day"
                  categories={["count"]}
                  colors={["#0ea5e9"]}
                  valueFormatter={(value) => `${value} items`}
                  yAxisWidth={30}
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Collection Locations</CardTitle>
                <CardDescription>
                  Where you recycle most
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PieChart
                  data={[
                    { name: "Home", value: 45 },
                    { name: "Work", value: 25 },
                    { name: "School", value: 15 },
                    { name: "Other", value: 15 },
                  ]}
                  index="name"
                  categories={["value"]}
                  colors={["#0ea5e9", "#22c55e", "#f59e0b", "#64748b"]}
                  valueFormatter={(value) => `${value}%`}
                />
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>AI-Generated Insights</CardTitle>
              <CardDescription>
                Personalized recycling insights powered by Gemini 2.5 Pro
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                  <Calendar className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">Recycling Pattern Analysis</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      You recycle most consistently on Saturdays. Setting reminders for mid-week recycling could help you increase your impact and token earnings by approximately 20%.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                  <Recycle className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">Material Optimization</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      You're recycling more PET than other plastic types. Consider focusing on HDPE collection as well, as it has a high token reward rate and is commonly found in household products.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                  <Leaf className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">Environmental Impact</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Your recycling efforts have offset CO₂ equivalent to taking a car off the road for 2 weeks. If you maintain your current rate, you'll reach the equivalent of 1 month by the end of the quarter.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="materials" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Material Breakdown</CardTitle>
                <CardDescription>
                  Distribution of recycled materials
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PieChart
                  data={[
                    { name: "PET", value: 45 },
                    { name: "HDPE", value: 30 },
                    { name: "PP", value: 15 },
                    { name: "Other", value: 10 },
                  ]}
                  index="name"
                  categories={["value"]}
                  colors={["#0ea5e9", "#22c55e", "#f59e0b", "#64748b"]}
                  valueFormatter={(value) => `${value}%`}
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Material Trends</CardTitle>
                <CardDescription>
                  How your recycling mix has changed
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <LineChart
                  data={[
                    { month: "Jan", PET: 40, HDPE: 24, PP: 10, Other: 5 },
                    { month: "Feb", PET: 30, HDPE: 20, PP: 15, Other: 8 },
                    { month: "Mar", PET: 45, HDPE: 25, PP: 20, Other: 10 },
                    { month: "Apr", PET: 50, HDPE: 35, PP: 25, Other: 15 },
                    { month: "May", PET: 55, HDPE: 40, PP: 30, Other: 12 },
                    { month: "Jun", PET: 60, HDPE: 45, PP: 35, Other: 18 },
                  ]}
                  categories={["PET", "HDPE", "PP", "Other"]}
                  index="month"
                  colors={["#0ea5e9", "#22c55e", "#f59e0b", "#64748b"]}
                  valueFormatter={(value) => `${value}kg`}
                  yAxisWidth={40}
                />
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Material Details</CardTitle>
              <CardDescription>
                Detailed breakdown of your recycled materials
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 rounded-full bg-blue-500"></div>
                      <h3 className="font-medium">PET (Type 1)</h3>
                    </div>
                    <Badge>64.1 kg</Badge>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: "45%" }}></div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Polyethylene terephthalate - Water bottles, soda bottles, food containers
                  </p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 rounded-full bg-green-500"></div>
                      <h3 className="font-medium">HDPE (Type 2)</h3>
                    </div>
                    <Badge>42.8 kg</Badge>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: "30%" }}></div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    High-density polyethylene - Milk jugs, detergent bottles, toys
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center

I've created a comprehensive Next.js application for your decentralized plastic waste management platform. Let me explain the key components:

### Core Features Implemented

1. **Authentication & Wallet Integration**
   - Wallet connection with Celo (mocked for demo purposes)
   - User session management with wallet address

2. **User Interface**
   - Responsive dashboard with environmental impact metrics
   - Plastic submission form with verification flow
   - Marketplace for token redemption
   - Scan & Ask feature with Gemini AI integration
   - Analytics dashboard with visualizations

3. **Smart Contract Integration**
   - Token contract interface for RePlas tokens
   - Traceability contract for plastic batch tracking
   - Mock implementations for demonstration

4. **AI Integration**
   - Gemini AI client for plastic identification
   - Chat assistant for recycling information
   - Environmental impact analysis

### Key Pages

1. **Dashboard (Home)** - Shows environmental impact, token balance, and recent activity
2. **Scan & Ask** - AI-powered plastic identification and recycling assistant
3. **Submit Plastic** - Multi-step form for submitting plastic for recycling
4. **Marketplace** - Redeem tokens for eco-friendly products and services
5. **Analytics** - Detailed insights into recycling patterns and environmental impact

### Technical Implementation

- **Frontend**: Next.js with App Router, Tailwind CSS, and shadcn/ui components
- **State Management**: React Context for wallet and authentication
- **Charts**: Recharts integration for data visualization
- **Blockchain**: Mock implementations of Celo contracts (token and traceability)
- **AI**: Mock implementation of Gemini AI client

### Next Steps

1. **Complete the Backend**
   - Implement actual Celo contract integration using ContractKit
   - Set up API routes for plastic submission and verification
   - Integrate with Gemini AI API for real image analysis

2. **Add More Features**
   - QR code generator for producers
   - Leaderboard functionality
   - Community features
   - Role-based access control

3. **Enhance Security**
   - Implement proper authentication with JWT
   - Add transaction signing for blockchain interactions
   - Set up secure API endpoints

Would you like me to explain any specific part of the implementation in more detail or focus on implementing any particular feature next?
\
