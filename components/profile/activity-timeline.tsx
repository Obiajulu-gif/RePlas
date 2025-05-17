"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CalendarDays, MessageSquare, Award, Recycle, Coins, ArrowRight, ThumbsUp, Users } from "lucide-react"

// Mock activity data
const activityData = [
  {
    id: 1,
    type: "recycling",
    title: "Submitted 12.5kg of PET Bottles",
    description: "Recycled at Nairobi Central Collection Center",
    date: "2 days ago",
    icon: Recycle,
    iconColor: "text-green-500",
    iconBg: "bg-green-100 dark:bg-green-900/20",
  },
  {
    id: 2,
    type: "achievement",
    title: "Earned 'Consistent Recycler' Badge",
    description: "Recycled plastic for 3 consecutive months",
    date: "1 week ago",
    icon: Award,
    iconColor: "text-yellow-500",
    iconBg: "bg-yellow-100 dark:bg-yellow-900/20",
  },
  {
    id: 3,
    type: "community",
    title: "Commented on Community Forum",
    description: "Replied to 'Best practices for sorting plastic waste'",
    date: "1 week ago",
    icon: MessageSquare,
    iconColor: "text-blue-500",
    iconBg: "bg-blue-100 dark:bg-blue-900/20",
  },
  {
    id: 4,
    type: "token",
    title: "Received 125 RPL Tokens",
    description: "Reward for recycling PET bottles",
    date: "2 weeks ago",
    icon: Coins,
    iconColor: "text-purple-500",
    iconBg: "bg-purple-100 dark:bg-purple-900/20",
  },
  {
    id: 5,
    type: "event",
    title: "Registered for Beach Cleanup",
    description: "Mombasa Beach Cleanup Event on July 15",
    date: "2 weeks ago",
    icon: CalendarDays,
    iconColor: "text-indigo-500",
    iconBg: "bg-indigo-100 dark:bg-indigo-900/20",
  },
  {
    id: 6,
    type: "social",
    title: "Liked EcoWarrior's Post",
    description: "How to reduce single-use plastic in daily life",
    date: "3 weeks ago",
    icon: ThumbsUp,
    iconColor: "text-pink-500",
    iconBg: "bg-pink-100 dark:bg-pink-900/20",
  },
  {
    id: 7,
    type: "community",
    title: "Joined Plastic Fighters Group",
    description: "Community group focused on plastic pollution solutions",
    date: "1 month ago",
    icon: Users,
    iconColor: "text-orange-500",
    iconBg: "bg-orange-100 dark:bg-orange-900/20",
  },
]

export default function ActivityTimeline() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity Timeline</CardTitle>
        <CardDescription>Your recent activities and interactions on the platform</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-muted" />

          <div className="space-y-8">
            {activityData.map((activity) => (
              <div key={activity.id} className="relative pl-10">
                <div className={`absolute left-0 p-2 rounded-full ${activity.iconBg}`}>
                  <activity.icon className={`h-4 w-4 ${activity.iconColor}`} />
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="font-medium">{activity.title}</h3>
                    <p className="text-sm text-muted-foreground">{activity.description}</p>
                  </div>
                  <Badge variant="outline" className="self-start sm:self-auto">
                    {activity.date}
                  </Badge>
                </div>

                {activity.type === "community" && (
                  <div className="mt-3 p-3 rounded-lg bg-muted/50">
                    <div className="flex items-start gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="/user-avatar-2.jpg" alt="User" />
                        <AvatarFallback>U</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">EcoWarrior</span>
                          <span className="text-xs text-muted-foreground">3 weeks ago</span>
                        </div>
                        <p className="text-sm mt-1">
                          Has anyone tried the new biodegradable plastic alternatives? I'm curious about their
                          durability and actual environmental impact.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 mt-3 pl-6">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="/user-avatar-1.jpg" alt="User" />
                        <AvatarFallback>S</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">You</span>
                          <span className="text-xs text-muted-foreground">1 week ago</span>
                        </div>
                        <p className="text-sm mt-1">
                          I've been using PLA-based products for a few months. They're good for most uses but break down
                          faster in hot liquids. The environmental impact is better than traditional plastics but still
                          requires industrial composting.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {activity.type === "event" && (
                  <div className="mt-3">
                    <Button variant="outline" size="sm" className="gap-1">
                      View Event Details
                      <ArrowRight className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Button variant="outline">Load More Activity</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
