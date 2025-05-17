"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
        avatar: "/user-avatar-1.jpg",
        role: "Community Leader",
      },
      category: "collection",
      tags: ["rural", "PET", "community"],
      date: "2023-06-02",
      replies: 12,
      views: 245,
      likes: 38,
      isSticky: true,
    },
    {
      id: 2,
      title: "How to maximize RePlas token earnings from recycling?",
      content:
        "I've been recycling plastic for a few months now and earning RePlas tokens. I'm curious about strategies to maximize token earnings while contributing to environmental sustainability.",
      author: {
        name: "Michael Chen",
        avatar: "/user-avatar-2.jpg",
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
        avatar: "/user-avatar-3.jpg",
        role: "New Member",
      },
      category: "introductions",
      tags: ["new member", "Lagos", "networking"],
      date: "2023-06-08",
      replies: 5,
      views: 87,
      likes: 15,
    },
    {
      id: 4,
      title: "Technical question about QR code scanning",
      content:
        "I'm having trouble scanning some QR codes on plastic products. The app sometimes fails to recognize them. Is there a specific technique or lighting condition that works best?",
      author: {
        name: "Emma Wilson",
        avatar: "/testimonial-avatar-1.jpg",
        role: "Recycler",
      },
      category: "technical",
      tags: ["QR code", "scanning", "troubleshooting"],
      date: "2023-06-07",
      replies: 6,
      views: 112,
      likes: 8,
    },
    {
      id: 5,
      title: "Success story: School recycling program using RePlas",
      content:
        "I wanted to share our success story implementing a school recycling program using the RePlas platform. We've collected over 500kg of plastic in just two months!",
      author: {
        name: "David Thompson",
        avatar: "/testimonial-avatar-2.jpg",
        role: "Educator",
      },
      category: "success stories",
      tags: ["education", "school", "program"],
      date: "2023-06-01",
      replies: 15,
      views: 320,
      likes: 67,
    },
    {
      id: 6,
      title: "Suggestion: Add a plastic type identification feature",
      content:
        "It would be really helpful if the app could use AI to identify plastic types from photos. This would make it easier for new recyclers who aren't familiar with recycling codes.",
      author: {
        name: "Sophia Martinez",
        avatar: "/testimonial-avatar-3.jpg",
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
        avatar: "/testimonial-avatar-4.jpg",
        role: "Event Organizer",
      },
      category: "events",
      tags: ["cleanup", "community", "event"],
      date: "2023-06-06",
      replies: 18,
      views: 290,
      likes: 53,
    },
    {
      id: 8,
      title: "How to properly clean HDPE containers before recycling?",
      content:
        "I'm collecting HDPE containers but unsure about the best way to clean them before submission. Any tips on removing labels and residue efficiently?",
      author: {
        name: "Olivia Brown",
        avatar: "/testimonial-avatar-5.jpg",
        role: "Recycler",
      },
      category: "how-to",
      tags: ["HDPE", "cleaning", "preparation"],
      date: "2023-06-03",
      replies: 11,
      views: 205,
      likes: 31,
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
  const communityPosts = filteredPosts.filter(
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
            {communityPosts.map((post) => (
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
    </div>
  )
}

function PostCard({ post }) {
  return (
    <Card className={`transition-all hover:shadow-md ${post.isSticky ? "border-primary/50 bg-primary/5" : ""}`}>
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
    </Card>
  )
}
