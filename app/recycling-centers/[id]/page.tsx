"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { SafeImage } from "@/components/ui/safe-image"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { ErrorBoundary } from "@/components/error-boundary"
import {
  MapPin,
  Phone,
  Clock,
  Star,
  Calendar,
  ArrowLeft,
  Send,
  ThumbsUp,
  MessageSquare,
  Share2,
  Building,
  Truck,
  Users,
  CheckCircle2,
} from "lucide-react"
import { recyclingCenters } from "@/components/recycling-centers/data"
import RecyclingCenterMap from "@/components/recycling-centers/recycling-center-map"
import ReviewCard from "@/components/recycling-centers/review-card"

export default function RecyclingCenterDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [center, setCenter] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [connectionStatus, setConnectionStatus] = useState("none") // none, pending, connected
  const [connectionMessage, setConnectionMessage] = useState("")
  const [activeTab, setActiveTab] = useState("about")

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      const foundCenter = recyclingCenters.find((c) => c.id === params.id)
      setCenter(foundCenter || null)
      setConnectionStatus(foundCenter?.isPartner ? "connected" : "none")
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [params.id])

  const handleConnect = () => {
    setConnectionStatus("pending")
  }

  const handleSubmitMessage = () => {
    if (connectionMessage.trim()) {
      // In a real app, this would send the message to the backend
      alert("Your connection request has been sent!")
      setConnectionMessage("")
      setConnectionStatus("pending")
    }
  }

  if (isLoading) {
    return <RecyclingCenterDetailSkeleton />
  }

  if (!center) {
    return (
      <div className="container py-12">
        <div className="flex flex-col items-center justify-center text-center">
          <h1 className="text-3xl font-bold mb-4">Recycling Center Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The recycling center you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => router.push("/recycling-centers")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Recycling Centers
          </Button>
        </div>
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <div className="container py-8">
        <Button variant="ghost" className="mb-6" onClick={() => router.push("/recycling-centers")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Recycling Centers
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-6">
          {/* Main content */}
          <div className="space-y-6">
            <Card className="overflow-hidden">
              <div className="relative h-64 md:h-80">
                <SafeImage
                  src={center.image}
                  alt={center.name}
                  fill
                  className="object-cover"
                  fallbackSrc="/recycling-center.png"
                />
                {center.isPartner && (
                  <Badge className="absolute top-4 right-4 bg-green-600 text-white px-3 py-1">Official Partner</Badge>
                )}
              </div>

              <CardHeader>
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                  <div>
                    <CardTitle className="text-2xl md:text-3xl">{center.name}</CardTitle>
                    <CardDescription className="flex items-center mt-2">
                      <MapPin className="h-4 w-4 mr-1" />
                      {center.address}, {center.city}
                    </CardDescription>
                  </div>
                  <div className="flex items-center bg-muted rounded-md px-3 py-2">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400 mr-1" />
                    <span className="text-xl font-bold">{center.rating.toFixed(1)}</span>
                    <span className="text-muted-foreground ml-1">({center.reviews.length} reviews)</span>
                  </div>
                </div>
              </CardHeader>

              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <CardContent>
                  <TabsList className="grid grid-cols-4 mb-6">
                    <TabsTrigger value="about">About</TabsTrigger>
                    <TabsTrigger value="materials">Materials</TabsTrigger>
                    <TabsTrigger value="reviews">Reviews</TabsTrigger>
                    <TabsTrigger value="location">Location</TabsTrigger>
                  </TabsList>

                  <TabsContent value="about" className="space-y-6 mt-0">
                    <div>
                      <h3 className="text-lg font-medium mb-3">About {center.name}</h3>
                      <p className="text-muted-foreground">{center.description}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-start">
                        <div className="bg-primary/10 p-2 rounded-full mr-3">
                          <Clock className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium">Operating Hours</h4>
                          <p className="text-sm text-muted-foreground">{center.hours}</p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <div className="bg-primary/10 p-2 rounded-full mr-3">
                          <Phone className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium">Contact</h4>
                          <p className="text-sm text-muted-foreground">{center.phone}</p>
                          <p className="text-sm text-muted-foreground">{center.email}</p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <div className="bg-primary/10 p-2 rounded-full mr-3">
                          <Calendar className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium">Established</h4>
                          <p className="text-sm text-muted-foreground">{center.established}</p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <div className="bg-primary/10 p-2 rounded-full mr-3">
                          <Users className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium">Capacity</h4>
                          <p className="text-sm text-muted-foreground">{center.capacity} tons of plastic per month</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-3">Services</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {center.services.map((service, index) => (
                          <div key={index} className="flex items-start">
                            <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                            <span>{service}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-3">Certifications</h3>
                      <div className="flex flex-wrap gap-2">
                        {center.certifications.map((cert, index) => (
                          <Badge key={index} variant="secondary">
                            {cert}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="materials" className="space-y-6 mt-0">
                    <div>
                      <h3 className="text-lg font-medium mb-3">Accepted Materials</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {center.acceptedMaterialsDetails.map((material, index) => (
                          <Card key={index}>
                            <CardHeader className="pb-2">
                              <CardTitle className="text-base">{material.type}</CardTitle>
                              <CardDescription>{material.code}</CardDescription>
                            </CardHeader>
                            <CardContent>
                              <p className="text-sm text-muted-foreground mb-2">{material.description}</p>
                              <div className="flex items-center text-sm">
                                <span className="font-medium mr-2">Examples:</span>
                                {material.examples}
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-3">Preparation Guidelines</h3>
                      <Card>
                        <CardContent className="pt-6">
                          <ul className="space-y-2">
                            {center.preparationGuidelines.map((guideline, index) => (
                              <li key={index} className="flex items-start">
                                <span className="bg-primary/10 text-primary font-medium rounded-full w-6 h-6 flex items-center justify-center mr-2 flex-shrink-0">
                                  {index + 1}
                                </span>
                                <span>{guideline}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value="reviews" className="space-y-6 mt-0">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium">Customer Reviews</h3>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button>Write a Review</Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Write a Review</DialogTitle>
                            <DialogDescription>Share your experience with {center.name}</DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div className="flex items-center justify-center space-x-2">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className="h-8 w-8 cursor-pointer text-muted-foreground hover:text-yellow-400 hover:fill-yellow-400"
                                />
                              ))}
                            </div>
                            <Textarea placeholder="Write your review here..." className="min-h-[100px]" />
                          </div>
                          <DialogFooter>
                            <Button type="submit">Submit Review</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>

                    <div className="space-y-4">
                      {center.reviews.map((review) => (
                        <ReviewCard key={review.id} review={review} />
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="location" className="mt-0">
                    <div className="h-[400px] rounded-md overflow-hidden">
                      <RecyclingCenterMap
                        centers={[center]}
                        userLocation={{ lat: -1.292066, lng: 36.821945 }}
                        singleCenter
                      />
                    </div>
                    <div className="mt-4 space-y-2">
                      <h3 className="text-lg font-medium">Directions</h3>
                      <p className="text-muted-foreground">{center.directions}</p>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span>
                          Coordinates: {center.location.lat.toFixed(6)}, {center.location.lng.toFixed(6)}
                        </span>
                      </div>
                    </div>
                  </TabsContent>
                </CardContent>
              </Tabs>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Connect with Center</CardTitle>
                <CardDescription>Establish a partnership or schedule a drop-off</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {connectionStatus === "none" && (
                  <>
                    <p className="text-sm text-muted-foreground">
                      Connect with {center.name} to establish a partnership for regular plastic waste collection or to
                      schedule a drop-off.
                    </p>
                    <div className="space-y-2">
                      <Textarea
                        placeholder="Write a message to the recycling center..."
                        value={connectionMessage}
                        onChange={(e) => setConnectionMessage(e.target.value)}
                        className="min-h-[100px]"
                      />
                    </div>
                  </>
                )}

                {connectionStatus === "pending" && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                    <h4 className="font-medium text-yellow-800 flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      Connection Request Pending
                    </h4>
                    <p className="text-sm text-yellow-700 mt-1">
                      Your connection request has been sent to {center.name}. They will review your request and respond
                      soon.
                    </p>
                  </div>
                )}

                {connectionStatus === "connected" && (
                  <div className="bg-green-50 border border-green-200 rounded-md p-4">
                    <h4 className="font-medium text-green-800 flex items-center">
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Connected Partner
                    </h4>
                    <p className="text-sm text-green-700 mt-1">
                      You are officially connected with {center.name}. You can schedule drop-offs and access special
                      partner benefits.
                    </p>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                {connectionStatus === "none" && (
                  <Button className="w-full" onClick={handleSubmitMessage} disabled={!connectionMessage.trim()}>
                    <Send className="mr-2 h-4 w-4" />
                    Send Connection Request
                  </Button>
                )}

                {connectionStatus === "pending" && (
                  <Button className="w-full" variant="outline">
                    Check Request Status
                  </Button>
                )}

                {connectionStatus === "connected" && <Button className="w-full">Schedule Drop-off</Button>}
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <Phone className="mr-2 h-4 w-4" />
                  Call Center
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Send Message
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Share2 className="mr-2 h-4 w-4" />
                  Share Center
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Center Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start">
                  <div className="bg-primary/10 p-2 rounded-full mr-3">
                    <Building className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">Facility Size</h4>
                    <p className="text-sm text-muted-foreground">{center.facilitySize} sq. meters</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-primary/10 p-2 rounded-full mr-3">
                    <Truck className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">Collection Radius</h4>
                    <p className="text-sm text-muted-foreground">{center.collectionRadius} km</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-primary/10 p-2 rounded-full mr-3">
                    <ThumbsUp className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">Satisfaction Rate</h4>
                    <p className="text-sm text-muted-foreground">{center.satisfactionRate}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  )
}

function RecyclingCenterDetailSkeleton() {
  return (
    <div className="container py-8">
      <Skeleton className="h-10 w-40 mb-6" />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-6">
        {/* Main content skeleton */}
        <div className="space-y-6">
          <Card className="overflow-hidden">
            <Skeleton className="h-64 md:h-80 w-full" />
            <CardHeader>
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                <div>
                  <Skeleton className="h-8 w-64 mb-2" />
                  <Skeleton className="h-4 w-48" />
                </div>
                <Skeleton className="h-12 w-32" />
              </div>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-10 w-full mb-6" />
              <div className="space-y-6">
                <Skeleton className="h-6 w-48 mb-3" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Array(4)
                    .fill(0)
                    .map((_, i) => (
                      <div key={i} className="flex items-start">
                        <Skeleton className="h-10 w-10 rounded-full mr-3" />
                        <div className="space-y-2">
                          <Skeleton className="h-5 w-32" />
                          <Skeleton className="h-4 w-48" />
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar skeleton */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48 mb-2" />
              <Skeleton className="h-4 w-64" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-24 w-full" />
            </CardContent>
            <CardFooter>
              <Skeleton className="h-10 w-full" />
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent className="space-y-2">
              {Array(3)
                .fill(0)
                .map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent className="space-y-4">
              {Array(3)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className="flex items-start">
                    <Skeleton className="h-10 w-10 rounded-full mr-3" />
                    <div className="space-y-2">
                      <Skeleton className="h-5 w-32" />
                      <Skeleton className="h-4 w-48" />
                    </div>
                  </div>
                ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
