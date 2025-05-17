"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { SafeImage } from "@/components/ui/safe-image"
import {
  Search,
  MessageSquare,
  ThumbsUp,
  Eye,
  Calendar,
  PlusCircle,
  Filter,
  TrendingUp,
  MessageCircle,
  Award,
  MapPin,
  Users,
  Share2,
} from "lucide-react"
import Link from "next/link"

export default function CommunityPage() {
  const [searchQuery, setSearchQuery] = useState("")

  // Sample forum posts
  const posts = [
    {
      id: 1,
      title: "Best practices for collecting PET bottles in rural areas",
      content:
        "I'm working on a community recycling project in a rural area with limited infrastructure. What are some effective strategies for collecting PET bottles in these conditions?",
      author: {
        name: "Sarah Johnson",
        avatar: "/community/avatar-sarah.png",
        role: "Community Leader",
      },
      category: "collection",
      tags: ["rural", "PET", "community"],
      date: "2023-06-02",
      replies: 12,
      views: 245,
      likes: 38,
      isSticky: true,
      image: "/community/rural-collection.png",
    },
    {
      id: 2,
      title: "How to maximize RePlas token earnings from recycling?",
      content:
        "I've been recycling plastic for a few months now and earning RePlas tokens. I'm curious about strategies to maximize token earnings while contributing to environmental sustainability.",
      author: {
        name: "Michael Chen",
        avatar: "/community/avatar-michael.png",
        role: "Recycler",
      },
      category: "tokenomics",
      tags: ["tokens", "earnings", "strategy"],
      date: "2023-06-05",
      replies: 8,
      views: 189,
      likes: 27,
    },
    {
      id: 3,
      title: "Introducing myself: New recycler from Lagos",
      content:
        "Hello everyone! I'm new to the RePlas platform and excited to start my recycling journey. I'm based in Lagos and looking to connect with other recyclers in the area.",
      author: {
        name: "Ade Ogunleye",
        avatar: "/community/avatar-ade.png",
        role: "New Member",
      },
      category: "introductions",
      tags: ["new member", "Lagos", "networking"],
      date: "2023-06-08",
      replies: 5,
      views: 87,
      likes: 15,
      image: "/community/lagos-recycling.png",
    },
    {
      id: 4,
      title: "Technical question about QR code scanning",
      content:
        "I'm having trouble scanning some QR codes on plastic products. The app sometimes fails to recognize them. Is there a specific technique or lighting condition that works best?",
      author: {
        name: "Emma Wilson",
        avatar: "/community/avatar-emma.png",
        role: "Recycler",
      },
      category: "technical",
      tags: ["QR code", "scanning", "troubleshooting"],
      date: "2023-06-07",
      replies: 6,
      views: 112,
      likes: 8,
      image: "/community/qr-scanning.png",
    },
    {
      id: 5,
      title: "Success story: School recycling program using RePlas",
      content:
        "I wanted to share our success story implementing a school recycling program using the RePlas platform. We've collected over 500kg of plastic in just two months!",
      author: {
        name: "David Thompson",
        avatar: "/community/avatar-david.png",
        role: "Educator",
      },
      category: "success stories",
      tags: ["education", "school", "program"],
      date: "2023-06-01",
      replies: 15,
      views: 320,
      likes: 67,
      image: "/community/school-recycling.png",
    },
    {
      id: 6,
      title: "Suggestion: Add a plastic type identification feature",
      content:
        "It would be really helpful if the app could use AI to identify plastic types from photos. This would make it easier for new recyclers who aren't familiar with recycling codes.",
      author: {
        name: "Sophia Martinez",
        avatar: "/community/avatar-sophia.png",
        role: "Recycler",
      },
      category: "suggestions",
      tags: ["feature request", "AI", "identification"],
      date: "2023-06-04",
      replies: 9,
      views: 175,
      likes: 42,
    },
    {
      id: 7,
      title: "Monthly community cleanup event - Join us!",
      content:
        "We're organizing a community cleanup event on the last Saturday of this month. Join us to collect plastic waste and earn RePlas tokens while making a difference!",
      author: {
        name: "James Lee",
        avatar: "/community/avatar-james.png",
        role: "Event Organizer",
      },
      category: "events",
      tags: ["cleanup", "community", "event"],
      date: "2023-06-06",
      replies: 18,
      views: 290,
      likes: 53,
      image: "/community/beach-cleanup.png",
    },
    {
      id: 8,
      title: "How to properly clean HDPE containers before recycling?",
      content:
        "I'm collecting HDPE containers but unsure about the best way to clean them before submission. Any tips on removing labels and residue efficiently?",
      author: {
        name: "Olivia Brown",
        avatar: "/community/avatar-olivia.png",
        role: "Recycler",
      },
      category: "how-to",
      tags: ["HDPE", "cleaning", "preparation"],
      date: "2023-06-03",
      replies: 11,
      views: 205,
      likes: 31,
      image: "/community/hdpe-cleaning.png",
    },
  ]

  const communityPosts = [
    {
      id: 1,
      author: {
        name: "Sarah Johnson",
        avatar: "/community/avatar-sarah.png",
        role: "Recycling Champion",
      },
      title: "Beach Cleanup Success!",
      content: "We collected over 50kg of plastic waste from the beach yesterday. Thanks to everyone who participated!",
      image: "/community/beach-cleanup-success.png",
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
        avatar: "/community/avatar-michael.png",
        role: "Sustainability Expert",
      },
      title: "Workshop on Plastic Upcycling",
      content:
        "Join us next Saturday for a hands-on workshop on creative ways to upcycle plastic waste into useful products.",
      image: "/community/upcycling-workshop.png",
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
        avatar: "/community/avatar-aisha.png",
        role: "Community Leader",
      },
      title: "School Recycling Program Launch",
      content:
        "Excited to announce our new partnership with local schools to implement plastic recycling education programs.",
      image: "/community/school-program.png",
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
      image: "/community/event-beach-cleanup.png",
    },
    {
      id: 2,
      title: "Plastic Upcycling Workshop",
      date: "May 28, 2025",
      time: "2:00 PM - 4:00 PM",
      location: "Community Center",
      attendees: 32,
      image: "/community/event-workshop.png",
    },
    {
      id: 3,
      title: "Sustainable Living Seminar",
      date: "June 5, 2025",
      time: "6:00 PM - 8:00 PM",
      location: "City Library",
      attendees: 28,
      image: "/community/event-seminar.png",
    },
  ]

  // Filter posts based on search query
  const filteredPosts = posts.filter(
    (post) =>
      searchQuery === "" ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  // Group posts by category
  const discussionPosts = filteredPosts.filter(
    (post) =>
      post.category === "collection" ||
      post.category === "tokenomics" ||
      post.category === "technical" ||
      post.category === "how-to",
  )
  const communityFilteredPosts = filteredPosts.filter(
    (post) =>
      post.category === "introductions" ||
      post.category === "success stories" ||
      post.category === "events" ||
      post.category === "suggestions",
  )

  return (
    <div className="container py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Community Forum</h1>
          <p className="text-muted-foreground">Connect, share, and learn with the RePlas community</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Filter className="h-4 w-4" />
            <span>Filter</span>
          </Button>
          <Button size="sm" className="flex items-center gap-1">
            <PlusCircle className="h-4 w-4" />
            <span>New Post</span>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="forum" className="space-y-6">
        <TabsList>
          <TabsTrigger value="forum">Forum</TabsTrigger>
          <TabsTrigger value="feed">Social Feed</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
        </TabsList>

        <TabsContent value="forum" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="md:col-span-2">
              <CardHeader className="pb-3">
                <CardTitle>Search Forum</CardTitle>
                <CardDescription>Find discussions, questions, and community posts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search by title, content, category, or tags..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Community Stats</CardTitle>
                <CardDescription>Activity metrics and engagement</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Total Posts:</span>
                    </div>
                    <span className="font-medium">1,245</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MessageCircle className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Total Replies:</span>
                    </div>
                    <span className="font-medium">8,732</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Award className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Active Members:</span>
                    </div>
                    <span className="font-medium">3,567</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Posts This Week:</span>
                    </div>
                    <span className="font-medium">87</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="all" className="space-y-6">
            <TabsList>
              <TabsTrigger value="all">All Posts</TabsTrigger>
              <TabsTrigger value="discussions">Discussions</TabsTrigger>
              <TabsTrigger value="community">Community</TabsTrigger>
              <TabsTrigger value="popular">Popular</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="space-y-4">
              <div className="space-y-4">
                {filteredPosts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            </TabsContent>
            <TabsContent value="discussions" className="space-y-4">
              <div className="space-y-4">
                {discussionPosts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            </TabsContent>
            <TabsContent value="community" className="space-y-4">
              <div className="space-y-4">
                {communityFilteredPosts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            </TabsContent>
            <TabsContent value="popular" className="space-y-4">
              <div className="space-y-4">
                {filteredPosts
                  .sort((a, b) => b.likes - a.likes)
                  .map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))}
              </div>
            </TabsContent>
          </Tabs>
        </TabsContent>

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
                    <SafeImage
                      src={post.image}
                      alt={post.title}
                      width={800}
                      height={450}
                      className="w-full h-auto object-cover"
                      fallbackSrc="/vibrant-community-gathering.png"
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
              <Card key={event.id} className="overflow-hidden">
                <div className="aspect-video relative">
                  <SafeImage
                    src={event.image}
                    alt={event.title}
                    fill
                    className="object-cover"
                    fallbackSrc="/vibrant-community-gathering.png"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-white font-bold text-xl">{event.title}</h3>
                  </div>
                </div>
                <CardContent className="space-y-3 pt-4">
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
      </Tabs>
    </div>
  )
}

function PostCard({ post }) {
  return (
    <Card className={`transition-all hover:shadow-md ${post.isSticky ? "border-primary/50 bg-primary/5" : ""}`}>
      <div className="grid md:grid-cols-4 gap-4">
        {post.image && (
          <div className="md:col-span-1">
            <div className="aspect-square md:aspect-auto md:h-full relative rounded-l-lg overflow-hidden">
              <SafeImage
                src={post.image}
                alt={post.title}
                fill
                className="object-cover"
                fallbackSrc="/recycling-discussion.png"
              />
            </div>
          </div>
        )}
        <div className={post.image ? "md:col-span-3" : "md:col-span-4"}>
          <CardHeader className="p-4 pb-0">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={post.author.avatar || "/placeholder.svg"} alt={post.author.name} />
                  <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{post.author.name}</div>
                  <div className="text-xs text-muted-foreground">{post.author.role}</div>
                </div>
              </div>
              {post.isSticky && (
                <Badge variant="outline" className="text-primary border-primary">
                  Sticky
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <Link href={`/community/post/${post.id}`} className="hover:underline">
              <h3 className="text-lg font-medium mb-2">{post.title}</h3>
            </Link>
            <p className="text-muted-foreground text-sm line-clamp-2 mb-3">{post.content}</p>
            <div className="flex flex-wrap gap-2 mb-3">
              <Badge variant="secondary" className="capitalize">
                {post.category}
              </Badge>
              {post.tags.map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{post.date}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <MessageSquare className="h-3 w-3" />
                  <span>{post.replies} replies</span>
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  <span>{post.views} views</span>
                </div>
                <div className="flex items-center gap-1">
                  <ThumbsUp className="h-3 w-3" />
                  <span>{post.likes} likes</span>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="p-4 pt-0">
            <Button variant="ghost" size="sm" className="ml-auto" asChild>
              <Link href={`/community/post/${post.id}`}>View Discussion</Link>
            </Button>
          </CardFooter>
        </div>
      </div>
    </Card>
  )
}
