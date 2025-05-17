"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { recyclingCenters } from "./data"

export default function RecyclingCenterMap() {
  const [view, setView] = useState("map")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([])

  const materials = ["PET", "HDPE", "PVC", "LDPE", "PP", "PS", "Other"]

  const toggleMaterial = (material: string) => {
    if (selectedMaterials.includes(material)) {
      setSelectedMaterials(selectedMaterials.filter((m) => m !== material))
    } else {
      setSelectedMaterials([...selectedMaterials, material])
    }
  }

  const filteredCenters = recyclingCenters.filter((center) => {
    // Filter by search query
    const matchesSearch =
      center.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      center.address.toLowerCase().includes(searchQuery.toLowerCase())

    // Filter by selected materials
    const matchesMaterials =
      selectedMaterials.length === 0 ||
      selectedMaterials.some((material) => center.acceptedMaterials.includes(material))

    return matchesSearch && matchesMaterials
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
        <div className="relative flex-1">
          <Input
            placeholder="Search by name or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3"
              onClick={() => setSearchQuery("")}
            >
              Clear
            </Button>
          )}
        </div>

        <Tabs value={view} onValueChange={setView} className="w-[200px]">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="map">Map</TabsTrigger>
            <TabsTrigger value="list">List</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="flex flex-wrap gap-2">
        {materials.map((material) => (
          <Badge
            key={material}
            variant={selectedMaterials.includes(material) ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => toggleMaterial(material)}
          >
            {material}
          </Badge>
        ))}
        {selectedMaterials.length > 0 && (
          <Button variant="ghost" size="sm" onClick={() => setSelectedMaterials([])} className="h-6 px-2 text-xs">
            Clear filters
          </Button>
        )}
      </div>

      <Tabs value={view} className="w-full">
        <TabsContent value="map" className="mt-0">
          <Card>
            <CardContent className="p-0">
              <div className="relative h-[500px] w-full overflow-hidden rounded-md bg-muted">
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-center text-muted-foreground">
                    Interactive map would be displayed here, showing {filteredCenters.length} recycling centers
                    <br />
                    <span className="text-sm">(Map integration requires Google Maps or Mapbox API)</span>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="list" className="mt-0">
          <div className="space-y-4">
            {filteredCenters.length === 0 ? (
              <Card>
                <CardContent className="flex h-40 items-center justify-center">
                  <p className="text-center text-muted-foreground">No recycling centers match your filters</p>
                </CardContent>
              </Card>
            ) : (
              filteredCenters.map((center) => (
                <Card key={center.id} className="overflow-hidden">
                  <div className="flex flex-col sm:flex-row">
                    <div className="h-48 w-full sm:h-auto sm:w-48">
                      <img
                        src={center.image || "/placeholder.svg"}
                        alt={center.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1 p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-semibold">{center.name}</h3>
                          <p className="text-sm text-muted-foreground">{center.address}</p>
                        </div>
                        {center.isPartner && <Badge className="bg-green-600">Partner</Badge>}
                      </div>

                      <div className="mt-2">
                        <p className="text-sm">
                          <span className="font-medium">Hours:</span> {center.hours}
                        </p>
                        <p className="text-sm">
                          <span className="font-medium">Phone:</span> {center.phone}
                        </p>
                      </div>

                      <div className="mt-2">
                        <p className="text-sm font-medium">Accepted Materials:</p>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {center.acceptedMaterials.map((material) => (
                            <Badge key={material} variant="outline" className="text-xs">
                              {material}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="mt-4 flex space-x-2">
                        <Button size="sm" asChild>
                          <a href={`/recycling-centers/${center.id}`}>View Details</a>
                        </Button>
                        <Button size="sm" variant="outline">
                          Get Directions
                        </Button>
                        {!center.isPartner && (
                          <Button size="sm" variant="outline">
                            Connect
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
