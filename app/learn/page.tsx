"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { SafeImage } from "@/components/ui/safe-image"
import { Search, BookOpen, Video, FileText, ArrowRight, Clock, Calendar, ThumbsUp, Eye, Filter } from "lucide-react"

export default function LearnPage() {
  const [searchQuery, setSearchQuery] = useState("")

  // Sample educational resources
  const resources = [
    {
      id: 1,
      title: "Understanding Plastic Types and Recycling Codes",
      description:
        "Learn about the different types of plastic, their properties, and how to identify them using recycling codes.",
      type: "article",
      category: "basics",
      readTime: "5 min read",
      date: "2023-04-15",
      author: "Dr. Sarah Johnson",
      likes: 245,
      views: 1820,
      image: "/learn/plastic-types.png",
    },
    {
      id: 2,
      title: "The Journey of Plastic: From Production to Recycling",
      description:
        "Follow the lifecycle of plastic products from manufacturing to disposal and recycling in this comprehensive guide.",
      type: "article",
      category: "process",
      readTime: "8 min read",
      date: "2023-05-02",
      author: "Michael Chen",
      likes: 189,
      views: 1540,
      image: "/learn/plastic-journey.png",
    },
    {
      id: 3,
      title: "Blockchain Technology in Plastic Waste Management",
      description:
        "Discover how blockchain is revolutionizing plastic waste management by enabling transparency and traceability.",
      type: "article",
      category: "technology",
      readTime: "6 min read",
      date: "2023-05-20",
      author: "Alex Rivera",
      likes: 312,
      views: 2150,
      image: "/learn/blockchain-waste.png",
    },
    {
      id: 4,
      title: "How to Properly Sort and Prepare Plastics for Recycling",
      description:
        "A step-by-step guide on how to sort different types of plastic and prepare them for effective recycling.",
      type: "video",
      category: "how-to",
      duration: "12:45",
      date: "2023-03-18",
      author: "Emma Wilson",
      likes: 567,
      views: 8920,
      image: "/learn/sorting-plastics.png",
    },
    {
      id: 5,
      title: "The Environmental Impact of Plastic Pollution",
      description: "An in-depth look at how plastic pollution affects our environment, wildlife, and human health.",
      type: "video",
      category: "environment",
      duration: "18:30",
      date: "2023-04-05",
      author: "Prof. David Thompson",
      likes: 823,
      views: 12450,
      image: "/learn/plastic-pollution.png",
    },
    {
      id: 6,
      title: "RePlas Token Economy: How It Works",
      description:
        "Understand how the RePlas token economy incentivizes plastic recycling and creates value for participants.",
      type: "guide",
      category: "tokenomics",
      pages: 15,
      date: "2023-05-10",
      author: "RePlas Team",
      likes: 178,
      views: 2340,
      image: "/learn/token-economy.png",
    },
    {
      id: 7,
      title: "Community-Based Recycling Initiatives",
      description: "Explore successful community-based recycling programs and learn how to start one in your area.",
      type: "guide",
      category: "community",
      pages: 22,
      date: "2023-02-28",
      author: "Sophia Martinez",
      likes: 291,
      views: 3560,
      image: "/learn/community-recycling.png",
    },
    {
      id: 8,
      title: "AI in Plastic Identification and Sorting",
      description:
        "Learn how artificial intelligence is being used to improve plastic identification and sorting processes.",
      type: "article",
      category: "technology",
      readTime: "7 min read",
      date: "2023-06-01",
      author: "Dr. James Lee",
      likes: 156,
      views: 1890,
      image: "/learn/ai-sorting.png",
    },
  ]

  // Filter resources based on search query
  const filteredResources = resources.filter(
    (resource) =>
      searchQuery === "" ||
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.category.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Group resources by type
  const articles = filteredResources.filter((resource) => resource.type === "article")
  const videos = filteredResources.filter((resource) => resource.type === "video")
  const guides = filteredResources.filter((resource) => resource.type === "guide")

  return (
    <div className="container py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Educational Resources</h1>
          <p className="text-muted-foreground">Learn about plastic recycling, blockchain, and sustainability</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Filter className="h-4 w-4" />
            <span>Filter</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="md:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle>Search Resources</CardTitle>
            <CardDescription>Find articles, videos, and guides on plastic recycling</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by title, description, or category..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-0">
          <CardHeader>
            <CardTitle>Featured Course</CardTitle>
            <CardDescription>Most popular educational content</CardDescription>
          </CardHeader>
          <CardContent className="pb-0">
            <div className="rounded-lg overflow-hidden mb-4">
              <SafeImage
                src="/learn/featured-course.png"
                alt="Plastic Recycling Fundamentals"
                width={400}
                height={225}
                className="w-full h-auto object-cover transition-transform hover:scale-105 duration-500"
                fallbackSrc="/recycling-course.png"
              />
            </div>
            <h3 className="font-bold text-lg mb-2">Plastic Recycling Fundamentals</h3>
            <p className="text-sm text-muted-foreground">
              A comprehensive introduction to plastic recycling principles, processes, and best practices.
            </p>
          </CardContent>
          <CardFooter className="pt-4">
            <Button className="w-full">Start Learning</Button>
          </CardFooter>
        </Card>
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">All Resources</TabsTrigger>
          <TabsTrigger value="articles">Articles</TabsTrigger>
          <TabsTrigger value="videos">Videos</TabsTrigger>
          <TabsTrigger value="guides">Guides</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map((resource) => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="articles" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((resource) => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="videos" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((resource) => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="guides" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {guides.map((resource) => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function ResourceCard({ resource }) {
  // Get icon based on resource type
  const getTypeIcon = (type) => {
    switch (type) {
      case "article":
        return <BookOpen className="h-4 w-4" />
      case "video":
        return <Video className="h-4 w-4" />
      case "guide":
        return <FileText className="h-4 w-4" />
      default:
        return <BookOpen className="h-4 w-4" />
    }
  }

  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      <div className="aspect-video relative overflow-hidden bg-muted">
        <SafeImage
          src={resource.image}
          alt={resource.title}
          fill
          className="object-cover transition-transform hover:scale-105 duration-500"
          fallbackSrc={`/placeholder.svg?height=200&width=350&query=${encodeURIComponent(resource.title)}`}
        />
        <Badge className="absolute top-2 right-2" variant="secondary">
          {getTypeIcon(resource.type)}
          <span className="ml-1 capitalize">{resource.type}</span>
        </Badge>
      </div>
      <CardHeader className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="outline" className="capitalize">
            {resource.category}
          </Badge>
          <div className="flex items-center text-xs text-muted-foreground">
            {resource.type === "article" && (
              <>
                <Clock className="h-3 w-3 mr-1" />
                <span>{resource.readTime}</span>
              </>
            )}
            {resource.type === "video" && (
              <>
                <Clock className="h-3 w-3 mr-1" />
                <span>{resource.duration}</span>
              </>
            )}
            {resource.type === "guide" && (
              <>
                <FileText className="h-3 w-3 mr-1" />
                <span>{resource.pages} pages</span>
              </>
            )}
          </div>
        </div>
        <CardTitle className="text-lg">{resource.title}</CardTitle>
        <CardDescription className="line-clamp-2">{resource.description}</CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>{resource.date}</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              <span>{resource.views}</span>
            </div>
            <div className="flex items-center gap-1">
              <ThumbsUp className="h-3 w-3" />
              <span>{resource.likes}</span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        <div className="text-sm">By {resource.author}</div>
        <Button size="sm" className="flex items-center gap-1">
          Read More
          <ArrowRight className="h-3 w-3 ml-1" />
        </Button>
      </CardFooter>
    </Card>
  )
}
