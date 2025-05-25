"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Trophy, Award, MapPin, Recycle, Users, Filter, ChevronRight, ArrowUpRight } from "lucide-react"

export default function LeaderboardPage() {
  const [timeRange, setTimeRange] = useState("month")

  // Sample leaderboard data
  const recyclers = [
    {
      id: 1,
      name: "Sarah Johnson",
      avatar: "/user-avatar-1.jpg",
      location: "Lagos, Nigeria",
      recycled: 1250,
      tokens: 3750,
      streak: 45,
      badges: ["Top Recycler", "PET Master", "Community Leader"],
      rank: 1,
      change: 0,
    },
    {
      id: 2,
      name: "Michael Chen",
      avatar: "/user-avatar-2.jpg",
      location: "Accra, Ghana",
      recycled: 1120,
      tokens: 3360,
      streak: 38,
      badges: ["HDPE Expert", "Consistent Recycler"],
      rank: 2,
      change: 1,
    },
    {
      id: 3,
      name: "Ade Ogunleye",
      avatar: "/user-avatar-3.jpg",
      location: "Lagos, Nigeria",
      recycled: 980,
      tokens: 2940,
      streak: 52,
      badges: ["Streak Master", "Rising Star"],
      rank: 3,
      change: -1,
    },
    {
      id: 4,
      name: "Emma Wilson",
      avatar: "/testimonial-avatar-1.jpg",
      location: "Nairobi, Kenya",
      recycled: 875,
      tokens: 2625,
      streak: 29,
      badges: ["PP Specialist"],
      rank: 4,
      change: 2,
    },
    {
      id: 5,
      name: "David Thompson",
      avatar: "/testimonial-avatar-2.jpg",
      location: "Cape Town, South Africa",
      recycled: 820,
      tokens: 2460,
      streak: 33,
      badges: ["Eco Educator"],
      rank: 5,
      change: -1,
    },
    {
      id: 6,
      name: "Sophia Martinez",
      avatar: "/testimonial-avatar-3.jpg",
      location: "Dakar, Senegal",
      recycled: 780,
      tokens: 2340,
      streak: 25,
      badges: ["Community Organizer"],
      rank: 6,
      change: 1,
    },
    {
      id: 7,
      name: "James Lee",
      avatar: "/testimonial-avatar-4.jpg",
      location: "Kigali, Rwanda",
      recycled: 750,
      tokens: 2250,
      streak: 41,
      badges: ["Cleanup Champion"],
      rank: 7,
      change: -2,
    },
    {
      id: 8,
      name: "Olivia Brown",
      avatar: "/testimonial-avatar-5.jpg",
      location: "Kampala, Uganda",
      recycled: 720,
      tokens: 2160,
      streak: 22,
      badges: ["New Achiever"],
      rank: 8,
      change: 3,
    },
    {
      id: 9,
      name: "Daniel Kimani",
      avatar: "/placeholder.svg?key=user9",
      location: "Mombasa, Kenya",
      recycled: 690,
      tokens: 2070,
      streak: 19,
      badges: ["Consistent Contributor"],
      rank: 9,
      change: 0,
    },
    {
      id: 10,
      name: "Grace Okafor",
      avatar: "/placeholder.svg?key=user10",
      location: "Abuja, Nigeria",
      recycled: 650,
      tokens: 1950,
      streak: 28,
      badges: ["Community Motivator"],
      rank: 10,
      change: 2,
    },
  ]

  const communities = [
    {
      id: 1,
      name: "Lagos Green Initiative",
      avatar: "/placeholder.svg?key=community1",
      location: "Lagos, Nigeria",
      members: 245,
      recycled: 12500,
      tokens: 37500,
      events: 18,
      badges: ["Top Community", "Urban Impact", "Educational Leader"],
      rank: 1,
      change: 0,
    },
    {
      id: 2,
      name: "Accra Recyclers Collective",
      avatar: "/placeholder.svg?key=community2",
      location: "Accra, Ghana",
      members: 187,
      recycled: 9800,
      tokens: 29400,
      events: 12,
      badges: ["Coastal Cleanup", "School Program"],
      rank: 2,
      change: 1,
    },
    {
      id: 3,
      name: "Nairobi Eco Warriors",
      avatar: "/placeholder.svg?key=community3",
      location: "Nairobi, Kenya",
      members: 163,
      recycled: 8750,
      tokens: 26250,
      events: 15,
      badges: ["Innovation Award", "Youth Engagement"],
      rank: 3,
      change: -1,
    },
    {
      id: 4,
      name: "Cape Town Plastic Fighters",
      avatar: "/placeholder.svg?key=community4",
      location: "Cape Town, South Africa",
      members: 142,
      recycled: 7900,
      tokens: 23700,
      events: 10,
      badges: ["Beach Cleanup Champions"],
      rank: 4,
      change: 0,
    },
    {
      id: 5,
      name: "Kigali Green Team",
      avatar: "/placeholder.svg?key=community5",
      location: "Kigali, Rwanda",
      members: 128,
      recycled: 6800,
      tokens: 20400,
      events: 8,
      badges: ["Government Partnership"],
      rank: 5,
      change: 2,
    },
  ]

  const schools = [
    {
      id: 1,
      name: "Green Academy Lagos",
      avatar: "/placeholder.svg?key=school1",
      location: "Lagos, Nigeria",
      students: 850,
      recycled: 5200,
      tokens: 15600,
      programs: 5,
      badges: ["Top School", "Curriculum Integration", "Student Leadership"],
      rank: 1,
      change: 0,
    },
    {
      id: 2,
      name: "Accra International School",
      avatar: "/placeholder.svg?key=school2",
      location: "Accra, Ghana",
      students: 720,
      recycled: 4800,
      tokens: 14400,
      programs: 4,
      badges: ["Innovative Program", "Parent Engagement"],
      rank: 2,
      change: 1,
    },
    {
      id: 3,
      name: "Nairobi Green Schools",
      avatar: "/placeholder.svg?key=school3",
      location: "Nairobi, Kenya",
      students: 680,
      recycled: 4500,
      tokens: 13500,
      programs: 6,
      badges: ["Community Outreach", "STEM Integration"],
      rank: 3,
      change: -1,
    },
    {
      id: 4,
      name: "Cape Town Eco Academy",
      avatar: "/placeholder.svg?key=school4",
      location: "Cape Town, South Africa",
      students: 590,
      recycled: 3900,
      tokens: 11700,
      programs: 3,
      badges: ["Sustainability Curriculum"],
      rank: 4,
      change: 0,
    },
    {
      id: 5,
      name: "Kigali Future Leaders School",
      avatar: "/placeholder.svg?key=school5",
      location: "Kigali, Rwanda",
      students: 510,
      recycled: 3400,
      tokens: 10200,
      programs: 4,
      badges: ["Youth Innovation"],
      rank: 5,
      change: 2,
    },
  ]

  return (
    <div className="container py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Leaderboard</h1>
          <p className="text-muted-foreground">Recognize top recyclers, communities, and schools</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Filter className="h-4 w-4" />
            <span>Filter</span>
          </Button>
          <select
            className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
            <option value="all">All Time</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950 dark:to-amber-900 border-amber-200 dark:border-amber-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-amber-500" />
              <span>Top Recycler</span>
            </CardTitle>
            <CardDescription>Most plastic recycled this {timeRange}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 border-2 border-amber-300 dark:border-amber-700">
                <AvatarImage src={recyclers[0].avatar || "/placeholder.svg"} alt={recyclers[0].name} />
                <AvatarFallback>{recyclers[0].name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-lg font-bold">{recyclers[0].name}</h3>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  <span>{recyclers[0].location}</span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <Badge
                    variant="secondary"
                    className="bg-amber-200 text-amber-800 dark:bg-amber-800 dark:text-amber-200"
                  >
                    {recyclers[0].recycled} kg
                  </Badge>
                  <Badge variant="outline">{recyclers[0].tokens} RPL</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 border-slate-200 dark:border-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-slate-500" />
              <span>Top Community</span>
            </CardTitle>
            <CardDescription>Most active community this {timeRange}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 border-2 border-slate-300 dark:border-slate-700">
                <AvatarImage src={communities[0].avatar || "/placeholder.svg"} alt={communities[0].name} />
                <AvatarFallback>{communities[0].name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-lg font-bold">{communities[0].name}</h3>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  <span>{communities[0].location}</span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <Badge
                    variant="secondary"
                    className="bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-200"
                  >
                    {communities[0].recycled} kg
                  </Badge>
                  <Badge variant="outline">{communities[0].members} members</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-green-500" />
              <span>Top School</span>
            </CardTitle>
            <CardDescription>Most engaged school this {timeRange}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 border-2 border-green-300 dark:border-green-700">
                <AvatarImage src={schools[0].avatar || "/placeholder.svg"} alt={schools[0].name} />
                <AvatarFallback>{schools[0].name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-lg font-bold">{schools[0].name}</h3>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  <span>{schools[0].location}</span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <Badge
                    variant="secondary"
                    className="bg-green-200 text-green-800 dark:bg-green-800 dark:text-green-200"
                  >
                    {schools[0].recycled} kg
                  </Badge>
                  <Badge variant="outline">{schools[0].students} students</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="recyclers" className="space-y-6">
        <TabsList>
          <TabsTrigger value="recyclers">Individual Recyclers</TabsTrigger>
          <TabsTrigger value="communities">Communities</TabsTrigger>
          <TabsTrigger value="schools">Schools</TabsTrigger>
        </TabsList>

        <TabsContent value="recyclers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Recyclers</CardTitle>
              <CardDescription>Individuals with the most recycled plastic this {timeRange}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {recyclers.map((recycler) => (
                  <div key={recycler.id} className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-8 font-bold text-muted-foreground">
                      {recycler.rank}
                    </div>
                    <div className="w-8 text-center">
                      {recycler.change > 0 ? (
                        <span className="text-green-500 text-xs">↑{recycler.change}</span>
                      ) : recycler.change < 0 ? (
                        <span className="text-red-500 text-xs">↓{Math.abs(recycler.change)}</span>
                      ) : (
                        <span className="text-muted-foreground text-xs">-</span>
                      )}
                    </div>
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={recycler.avatar || "/placeholder.svg"} alt={recycler.name} />
                      <AvatarFallback>{recycler.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                        <div>
                          <h3 className="font-medium truncate">{recycler.name}</h3>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            <span>{recycler.location}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="whitespace-nowrap">
                            <Recycle className="h-3 w-3 mr-1" />
                            {recycler.recycled} kg
                          </Badge>
                          <Badge variant="outline" className="whitespace-nowrap">
                            {recycler.tokens} RPL
                          </Badge>
                        </div>
                      </div>
                      <div className="mt-2">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-muted-foreground">Progress to next rank</span>
                          <span className="font-medium">78%</span>
                        </div>
                        <Progress value={78} className="h-1" />
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="shrink-0">
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button variant="outline" className="w-full sm:w-auto">
                View Full Leaderboard
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="communities" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Communities</CardTitle>
              <CardDescription>Communities with the most recycled plastic this {timeRange}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {communities.map((community) => (
                  <div key={community.id} className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-8 font-bold text-muted-foreground">
                      {community.rank}
                    </div>
                    <div className="w-8 text-center">
                      {community.change > 0 ? (
                        <span className="text-green-500 text-xs">↑{community.change}</span>
                      ) : community.change < 0 ? (
                        <span className="text-red-500 text-xs">↓{Math.abs(community.change)}</span>
                      ) : (
                        <span className="text-muted-foreground text-xs">-</span>
                      )}
                    </div>
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={community.avatar || "/placeholder.svg"} alt={community.name} />
                      <AvatarFallback>{community.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                        <div>
                          <h3 className="font-medium truncate">{community.name}</h3>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            <span>{community.location}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="whitespace-nowrap">
                            <Recycle className="h-3 w-3 mr-1" />
                            {community.recycled} kg
                          </Badge>
                          <Badge variant="outline" className="whitespace-nowrap">
                            {community.members} members
                          </Badge>
                        </div>
                      </div>
                      <div className="mt-2">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-muted-foreground">Progress to next rank</span>
                          <span className="font-medium">65%</span>
                        </div>
                        <Progress value={65} className="h-1" />
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="shrink-0">
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button variant="outline" className="w-full sm:w-auto">
                View All Communities
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="schools" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Schools</CardTitle>
              <CardDescription>
                Educational institutions with the most recycled plastic this {timeRange}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {schools.map((school) => (
                  <div key={school.id} className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-8 font-bold text-muted-foreground">
                      {school.rank}
                    </div>
                    <div className="w-8 text-center">
                      {school.change > 0 ? (
                        <span className="text-green-500 text-xs">↑{school.change}</span>
                      ) : school.change < 0 ? (
                        <span className="text-red-500 text-xs">↓{Math.abs(school.change)}</span>
                      ) : (
                        <span className="text-muted-foreground text-xs">-</span>
                      )}
                    </div>
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={school.avatar || "/placeholder.svg"} alt={school.name} />
                      <AvatarFallback>{school.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                        <div>
                          <h3 className="font-medium truncate">{school.name}</h3>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            <span>{school.location}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="whitespace-nowrap">
                            <Recycle className="h-3 w-3 mr-1" />
                            {school.recycled} kg
                          </Badge>
                          <Badge variant="outline" className="whitespace-nowrap">
                            {school.students} students
                          </Badge>
                        </div>
                      </div>
                      <div className="mt-2">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-muted-foreground">Progress to next rank</span>
                          <span className="font-medium">72%</span>
                        </div>
                        <Progress value={72} className="h-1" />
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="shrink-0">
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button variant="outline" className="w-full sm:w-auto">
                View All Schools
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
