"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

// Mock achievements data
const achievements = {
  earned: [
    {
      id: 1,
      name: "First Recycling",
      description: "Completed your first plastic recycling submission",
      icon: "🌱",
      date: "January 15, 2023",
      category: "Beginner",
    },
    {
      id: 2,
      name: "Recycling Enthusiast",
      description: "Recycled 10 batches of plastic waste",
      icon: "♻️",
      date: "March 22, 2023",
      category: "Intermediate",
    },
    {
      id: 3,
      name: "Plastic Pioneer",
      description: "Recycled over 100kg of plastic waste",
      icon: "🚀",
      date: "May 10, 2023",
      category: "Advanced",
    },
    {
      id: 4,
      name: "Community Leader",
      description: "Referred 5 friends to the platform",
      icon: "👥",
      date: "June 5, 2023",
      category: "Community",
    },
    {
      id: 5,
      name: "Eco Warrior",
      description: "Recycled consistently for 3 months",
      icon: "🛡️",
      date: "July 18, 2023",
      category: "Dedication",
    },
    {
      id: 6,
      name: "Plastic Diversity",
      description: "Recycled 5 different types of plastic",
      icon: "🌈",
      date: "August 30, 2023",
      category: "Diversity",
    },
  ],
  inProgress: [
    {
      id: 7,
      name: "Recycling Champion",
      description: "Recycle 500kg of plastic waste",
      icon: "🏆",
      progress: 65,
      category: "Advanced",
    },
    {
      id: 8,
      name: "Sustainability Advocate",
      description: "Participate in 3 community clean-up events",
      icon: "🌍",
      progress: 33,
      category: "Community",
    },
    {
      id: 9,
      name: "Plastic Master",
      description: "Recycle all 7 types of plastic",
      icon: "🧙",
      progress: 85,
      category: "Diversity",
    },
    {
      id: 10,
      name: "Recycling Streak",
      description: "Recycle plastic for 6 consecutive months",
      icon: "🔥",
      progress: 50,
      category: "Dedication",
    },
  ],
}

export default function Achievements() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Achievements & Badges</CardTitle>
        <CardDescription>Track your progress and earn badges for your recycling efforts</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="earned">
          <TabsList className="mb-4">
            <TabsTrigger value="earned">Earned ({achievements.earned.length})</TabsTrigger>
            <TabsTrigger value="inProgress">In Progress ({achievements.inProgress.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="earned">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {achievements.earned.map((achievement) => (
                <Card key={achievement.id} className="overflow-hidden">
                  <div className="bg-primary/10 p-4 flex items-center justify-center text-4xl">{achievement.icon}</div>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold">{achievement.name}</h3>
                      <Badge variant="outline" className="text-xs">
                        {achievement.category}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{achievement.description}</p>
                    <p className="text-xs text-muted-foreground">Earned on {achievement.date}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="inProgress">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {achievements.inProgress.map((achievement) => (
                <Card key={achievement.id} className="overflow-hidden">
                  <div className="bg-muted p-4 flex items-center justify-center text-4xl opacity-70">
                    {achievement.icon}
                  </div>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold">{achievement.name}</h3>
                      <Badge variant="outline" className="text-xs">
                        {achievement.category}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{achievement.description}</p>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span>Progress</span>
                        <span>{achievement.progress}%</span>
                      </div>
                      <Progress value={achievement.progress} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
