"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { SafeImage } from "@/components/ui/safe-image"
import { Skeleton } from "@/components/ui/skeleton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ErrorBoundary } from "@/components/error-boundary"
import { MapPin, Phone, Clock, Star, Search, List, MapIcon } from "lucide-react"
import dynamic from "next/dynamic"
import { recyclingCenters } from "@/components/recycling-centers/data"

// Dynamically import the map component with no SSR
const RecyclingCenterMap = dynamic(() => import("@/components/recycling-centers/recycling-center-map"), {
  ssr: false,
  loading: () => <Skeleton className="h-full w-full" />,
})

export default function RecyclingCentersPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [view, setView] = useState("map")
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [sortBy, setSortBy] = useState("distance")
  const [filteredCenters, setFilteredCenters] = useState(recyclingCenters)
  const [isLoading, setIsLoading] = useState(true)
  const [userLocation, setUserLocation] = useState({ lat: -1.292066, lng: 36.821945 }) // Default to Nairobi

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    // Try to get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
        },
        (error) => {
          console.error("Error getting location:", error)
        },
      )
    }

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    // Filter and sort centers based on user input
    let results = [...recyclingCenters]

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      results = results.filter(
        (center) =>
          center.name.toLowerCase().includes(query) ||
          center.address.toLowerCase().includes(query) ||
          center.city.toLowerCase().includes(query),
      )
    }

    // Apply type filter
    if (filterType !== "all") {
      results = results.filter((center) => center.acceptedMaterials.includes(filterType))
    }

    // Apply sorting
    if (sortBy === "distance") {
      // In a real app, this would calculate actual distance from user location
      // For now, we'll use the mock distance property
      results.sort((a, b) => a.distance - b.distance)
    } else if (sortBy === "rating") {
      results.sort((a, b) => b.rating - a.rating)
    } else if (sortBy === "name") {
      results.sort((a, b) => a.name.localeCompare(b.name))
    }

    setFilteredCenters(results)
  }, [searchQuery, filterType, sortBy])

  const handleCenterClick = (centerId) => {
    router.push(`/recycling-centers/${centerId}`)
  }

  return (
    <ErrorBoundary>
      <div className="container py-8">
        <div className="flex flex-col items-center justify-center text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Recycling Centers</h1>
          <p className="text-muted-foreground max-w-2xl">
            Find and connect with recycling centers near you to drop off your plastic waste or establish partnerships.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6">
          {/* Filters sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Search className="mr-2 h-4 w-4" />
                  Find Centers
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="search" className="text-sm font-medium">
                    Search
                  </label>
                  <Input
                    id="search"
                    placeholder="Search by name or location"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="filter-type" className="text-sm font-medium">
                    Material Type
                  </label>
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger id="filter-type">
                      <SelectValue placeholder="Filter by material" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Materials</SelectItem>
                      <SelectItem value="PET">PET (Type 1)</SelectItem>
                      <SelectItem value="HDPE">HDPE (Type 2)</SelectItem>
                      <SelectItem value="PVC">PVC (Type 3)</SelectItem>
                      <SelectItem value="LDPE">LDPE (Type 4)</SelectItem>
                      <SelectItem value="PP">PP (Type 5)</SelectItem>
                      <SelectItem value="PS">PS (Type 6)</SelectItem>
                      <SelectItem value="Other">Other Plastics</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="sort-by" className="text-sm font-medium">
                    Sort By
                  </label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger id="sort-by">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="distance">Distance</SelectItem>
                      <SelectItem value="rating">Rating</SelectItem>
                      <SelectItem value="name">Name (A-Z)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Center Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Total Centers:</span>
                  <span className="font-medium">{recyclingCenters.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Accepting PET:</span>
                  <span className="font-medium">
                    {recyclingCenters.filter((c) => c.acceptedMaterials.includes("PET")).length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Accepting HDPE:</span>
                  <span className="font-medium">
                    {recyclingCenters.filter((c) => c.acceptedMaterials.includes("HDPE")).length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Partner Centers:</span>
                  <span className="font-medium">{recyclingCenters.filter((c) => c.isPartner).length}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main content */}
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <Tabs value={view} onValueChange={setView} className="w-full">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                  <TabsList>
                    <TabsTrigger value="map" className="flex items-center">
                      <MapIcon className="mr-2 h-4 w-4" />
                      Map View
                    </TabsTrigger>
                    <TabsTrigger value="list" className="flex items-center">
                      <List className="mr-2 h-4 w-4" />
                      List View
                    </TabsTrigger>
                  </TabsList>

                  <div className="text-sm text-muted-foreground">
                    Showing {filteredCenters.length} of {recyclingCenters.length} centers
                  </div>
                </div>

                <TabsContent value="map" className="mt-0">
                  <Card className="overflow-hidden">
                    <div className="h-[600px] relative">
                      {isLoading ? (
                        <Skeleton className="h-full w-full" />
                      ) : (
                        <RecyclingCenterMap
                          centers={filteredCenters}
                          userLocation={userLocation}
                          onCenterClick={handleCenterClick}
                        />
                      )}
                    </div>
                  </Card>
                </TabsContent>

                <TabsContent value="list" className="mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {isLoading ? (
                      Array(6)
                        .fill(0)
                        .map((_, i) => (
                          <Card key={i} className="overflow-hidden">
                            <Skeleton className="h-48 w-full" />
                            <CardHeader>
                              <Skeleton className="h-6 w-3/4" />
                              <Skeleton className="h-4 w-1/2" />
                            </CardHeader>
                            <CardContent>
                              <Skeleton className="h-4 w-full mb-2" />
                              <Skeleton className="h-4 w-full mb-2" />
                              <Skeleton className="h-4 w-2/3" />
                            </CardContent>
                          </Card>
                        ))
                    ) : filteredCenters.length > 0 ? (
                      filteredCenters.map((center) => (
                        <Card key={center.id} className="overflow-hidden hover:shadow-md transition-shadow">
                          <div className="relative h-48">
                            <SafeImage
                              src={center.image}
                              alt={center.name}
                              fill
                              className="object-cover"
                              fallbackSrc="/recycling-center.png"
                            />
                            {center.isPartner && <Badge className="absolute top-2 right-2 bg-green-600">Partner</Badge>}
                          </div>
                          <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                              <span>{center.name}</span>
                              <div className="flex items-center">
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                                <span>{center.rating.toFixed(1)}</span>
                              </div>
                            </CardTitle>
                            <CardDescription className="flex items-center">
                              <MapPin className="h-4 w-4 mr-1" />
                              {center.address}, {center.city}
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-2">
                            <div className="flex items-center text-sm">
                              <Phone className="h-4 w-4 mr-2" />
                              {center.phone}
                            </div>
                            <div className="flex items-center text-sm">
                              <Clock className="h-4 w-4 mr-2" />
                              {center.hours}
                            </div>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {center.acceptedMaterials.map((material) => (
                                <Badge key={material} variant="outline">
                                  {material}
                                </Badge>
                              ))}
                            </div>
                          </CardContent>
                          <CardFooter>
                            <Button className="w-full" onClick={() => handleCenterClick(center.id)}>
                              View Details
                            </Button>
                          </CardFooter>
                        </Card>
                      ))
                    ) : (
                      <div className="col-span-2 flex flex-col items-center justify-center py-12 text-center">
                        <div className="rounded-full bg-muted p-3 mb-4">
                          <Search className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-medium mb-2">No recycling centers found</h3>
                        <p className="text-muted-foreground max-w-md">
                          Try adjusting your search or filter criteria to find recycling centers in your area.
                        </p>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  )
}
