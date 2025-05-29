"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SafeImage } from "@/components/ui/safe-image"
import { BookOpen, Video, FileText, ArrowRight, Clock, Calendar, ThumbsUp, Eye } from "lucide-react"
import Link from "next/link"
import { Resource } from "@/types/learn"

interface ResourceCardProps {
  resource: Resource
}

export function ResourceCard({ resource }: ResourceCardProps) {
  // Get icon based on resource type
  const getTypeIcon = (type: string) => {
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

  // Generate slug from title
  const slug = resource.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")

  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      <Link href={`/learn/${resource.type}/${slug}`}>
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
      </Link>
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
        <Link href={`/learn/${resource.type}/${slug}`} className="hover:underline">
          <CardTitle className="text-lg">{resource.title}</CardTitle>
        </Link>
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
        <Link href={`/learn/${resource.type}/${slug}`}>
          <Button size="sm" className="flex items-center gap-1 bg-emerald-600">
            Read More
            <ArrowRight className="h-3 w-3 ml-1" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
