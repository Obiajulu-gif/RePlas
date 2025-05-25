"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Edit, MapPin, Calendar, Award, Share2 } from "lucide-react"
import { useWallet } from "@/components/wallet-provider"
import { SafeImage } from "@/components/ui/safe-image"

// Mock user data
const userData = {
  name: "Sarah Johnson",
  username: "@sarahj",
  avatar: "/user-avatar-1.jpg",
  coverImage: "/recycling-facility.png",
  location: "Nairobi, Kenya",
  joinedDate: "January 2023",
  bio: "Environmental activist and plastic recycling enthusiast. Working to create a cleaner future for our communities.",
  level: 24,
  totalRecycled: "1,245 kg",
  carbonOffset: "3.7 tons",
  badges: [
    { id: 1, name: "Early Adopter", icon: "🌱" },
    { id: 2, name: "Recycling Champion", icon: "🏆" },
    { id: 3, name: "Community Leader", icon: "👥" },
    { id: 4, name: "Plastic Pioneer", icon: "🚀" },
    { id: 5, name: "Eco Warrior", icon: "🛡️" },
  ],
  isVerified: true,
}

export default function ProfileHeader() {
  const { address } = useWallet()
  const [isEditing, setIsEditing] = useState(false)

  return (
    <Card className="overflow-hidden">
      <div className="relative h-48 md:h-64 w-full">
        <SafeImage
          src={userData.coverImage}
          alt="Profile cover"
          className="object-cover w-full h-full"
          fallback="/placeholder-0a0b1.png"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
      </div>

      <CardContent className="relative pt-0">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-end -mt-16 md:-mt-20 mb-4 relative z-10">
          <Avatar className="h-24 w-24 md:h-32 md:w-32 border-4 border-background">
            <AvatarImage src={userData.avatar || "/placeholder.svg"} alt={userData.name} />
            <AvatarFallback>{userData.name.charAt(0)}</AvatarFallback>
          </Avatar>

          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">{userData.name}</h1>
              {userData.isVerified && (
                <Badge variant="success" className="h-5">
                  Verified
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground">{userData.username}</p>
            <p className="text-sm max-w-md">{userData.bio}</p>
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground pt-1">
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{userData.location}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>Joined {userData.joinedDate}</span>
              </div>
              <div className="flex items-center gap-1">
                <Award className="h-4 w-4" />
                <span>Level {userData.level}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-2 self-end md:self-start md:ml-auto">
            <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <Card className="bg-muted/50">
            <CardContent className="p-4 text-center">
              <p className="text-muted-foreground text-sm">Total Recycled</p>
              <p className="text-2xl font-bold">{userData.totalRecycled}</p>
            </CardContent>
          </Card>
          <Card className="bg-muted/50">
            <CardContent className="p-4 text-center">
              <p className="text-muted-foreground text-sm">Carbon Offset</p>
              <p className="text-2xl font-bold">{userData.carbonOffset}</p>
            </CardContent>
          </Card>
          <Card className="bg-muted/50">
            <CardContent className="p-4 text-center">
              <p className="text-muted-foreground text-sm">Wallet Address</p>
              <p className="text-sm font-mono truncate">{address || "Not connected"}</p>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          {userData.badges.map((badge) => (
            <Badge key={badge.id} variant="outline" className="px-3 py-1 text-sm">
              <span className="mr-1">{badge.icon}</span> {badge.name}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
