"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function RecentActivity() {
  const activities = [
    {
      id: 1,
      type: "collection",
      title: "PET Bottle Collection",
      description: "Submitted 2.5kg of PET bottles",
      date: "Today, 10:30 AM",
      tokens: 25,
      status: "verified",
    },
    {
      id: 2,
      type: "reward",
      title: "Token Reward",
      description: "Received tokens for recycling",
      date: "Yesterday, 3:45 PM",
      tokens: 15,
      status: "completed",
    },
    {
      id: 3,
      type: "redemption",
      title: "Marketplace Purchase",
      description: "Redeemed tokens for eco-friendly water bottle",
      date: "Jun 12, 2023",
      tokens: -50,
      status: "completed",
    },
    {
      id: 4,
      type: "collection",
      title: "HDPE Collection",
      description: "Submitted 1.8kg of HDPE plastic",
      date: "Jun 10, 2023",
      tokens: 18,
      status: "verified",
    },
    {
      id: 5,
      type: "collection",
      title: "Mixed Plastic Collection",
      description: "Submitted 3.2kg of mixed plastics",
      date: "Jun 5, 2023",
      tokens: 20,
      status: "pending",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Your latest recycling and token activities</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-4">
              <Avatar className="h-9 w-9">
                <AvatarImage
                  src={`/abstract-geometric-shapes.png?key=v6ekm&height=36&width=36&query=${activity.type}`}
                  alt={activity.type}
                />
                <AvatarFallback>
                  {activity.type === "collection" ? "RC" : activity.type === "reward" ? "RW" : "RD"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium leading-none">{activity.title}</p>
                  <Badge
                    variant={
                      activity.status === "verified" ? "success" : activity.status === "pending" ? "outline" : "default"
                    }
                  >
                    {activity.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{activity.description}</p>
                <p className="text-xs text-muted-foreground">{activity.date}</p>
              </div>
              <div
                className={`text-sm font-medium ${activity.tokens > 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
              >
                {activity.tokens > 0 ? `+${activity.tokens}` : activity.tokens} RPL
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
