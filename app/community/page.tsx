import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { MessageCircle, ThumbsUp, Share2, Calendar, MapPin, Users } from "lucide-react"

const communityPosts = [
  {
    id: 1,
    author: {
      name: "Sarah Johnson",
      avatar: "/user-avatar-1.jpg",
      role: "Recycling Champion",
    },
    title: "Beach Cleanup Success!",
    content: "We collected over 50kg of plastic waste from the beach yesterday. Thanks to everyone who participated!",
    image: "/community-recycling.png",
    likes: 42,
    comments: 12,
    shares: 8,
    time: "2 hours ago",
    tags: ["BeachCleanup", "PlasticFree"],
  },
  {
    id: 2,
    author: {
      name: "Michael Chen",
      avatar: "/user-avatar-2.jpg",
      role: "Sustainability Expert",
    },
    title: "Workshop on Plastic Upcycling",
    content:
      "Join us next Saturday for a hands-on workshop on creative ways to upcycle plastic waste into useful products.",
    likes: 28,
    comments: 5,
    shares: 15,
    time: "Yesterday",
    tags: ["Workshop", "Upcycling", "CreativeRecycling"],
  },
  {
    id: 3,
    author: {
      name: "Aisha Patel",
      avatar: "/user-avatar-3.jpg",
      role: "Community Leader",
    },
    title: "School Recycling Program Launch",
    content:
      "Excited to announce our new partnership with local schools to implement plastic recycling education programs.",
    image: "/diverse-group.png",
    likes: 56,
    comments: 23,
    shares: 19,
    time: "3 days ago",
    tags: ["Education", "Schools", "YouthEngagement"],
  },
]

const upcomingEvents = [
  {
    id: 1,
    title: "Community Beach Cleanup",
    date: "May 22, 2025",
    time: "9:00 AM - 12:00 PM",
    location: "Sunset Beach",
    attendees: 45,
  },
  {
    id: 2,
    title: "Plastic Upcycling Workshop",
    date: "May 28, 2025",
    time: "2:00 PM - 4:00 PM",
    location: "Community Center",
    attendees: 32,
  },
  {
    id: 3,
    title: "Sustainable Living Seminar",
    date: "June 5, 2025",
    time: "6:00 PM - 8:00 PM",
    location: "City Library",
    attendees: 28,
  },
]

export default function CommunityPage() {
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Community</h1>

      <Tabs defaultValue="feed" className="space-y-6">
        <TabsList>
          <TabsTrigger value="feed">Community Feed</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="groups">Groups</TabsTrigger>
        </TabsList>

        <TabsContent value="feed" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Recent Posts</h2>
            <Button>Create Post</Button>
          </div>

          {communityPosts.map((post) => (
            <Card key={post.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-start gap-4">
                  <Avatar>
                    <AvatarImage src={post.author.avatar || "/placeholder.svg"} alt={post.author.name} />
                    <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{post.author.name}</CardTitle>
                    <CardDescription>
                      {post.author.role} • {post.time}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <h3 className="font-semibold text-lg">{post.title}</h3>
                <p>{post.content}</p>
                {post.image && (
                  <div className="rounded-md overflow-hidden">
                    <img
                      src={post.image || "/placeholder.svg"}
                      alt={post.title}
                      className="w-full h-auto object-cover"
                    />
                  </div>
                )}
                <div className="flex flex-wrap gap-2">
                  {post.tags?.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="border-t pt-4 flex justify-between">
                <Button variant="ghost" size="sm" className="gap-1">
                  <ThumbsUp className="h-4 w-4" />
                  {post.likes}
                </Button>
                <Button variant="ghost" size="sm" className="gap-1">
                  <MessageCircle className="h-4 w-4" />
                  {post.comments}
                </Button>
                <Button variant="ghost" size="sm" className="gap-1">
                  <Share2 className="h-4 w-4" />
                  {post.shares}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="events" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Upcoming Events</h2>
            <Button>Create Event</Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingEvents.map((event) => (
              <Card key={event.id}>
                <CardHeader>
                  <CardTitle>{event.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-emerald-600" />
                    <span>
                      {event.date}, {event.time}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-emerald-600" />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-emerald-600" />
                    <span>{event.attendees} attending</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">RSVP</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="groups" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Community Groups</h2>
            <Button>Create Group</Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Beach Cleanup Crew</CardTitle>
                <CardDescription>324 members</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Dedicated to keeping our beaches clean and plastic-free.</p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  Join Group
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Plastic Upcyclers</CardTitle>
                <CardDescription>156 members</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Creative solutions for turning plastic waste into valuable products.</p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  Join Group
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sustainable Schools</CardTitle>
                <CardDescription>89 members</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Educators and students working to reduce plastic waste in schools.</p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  Join Group
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
