"use client"

import { useState, useEffect, useRef } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Navigation } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

// Mock map component that simulates a real map without external dependencies
export default function RecyclingCenterMap({ centers, userLocation, onCenterClick }) {
  const [selectedCenter, setSelectedCenter] = useState(null)
  const canvasRef = useRef(null)
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 })

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        const { width, height } = canvasRef.current.getBoundingClientRect()
        setDimensions({ width, height })
        renderMap()
      }
    }

    window.addEventListener("resize", handleResize)
    handleResize() // Initial size

    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Render map when centers or user location changes
  useEffect(() => {
    renderMap()
  }, [centers, userLocation, dimensions, selectedCenter])

  // Render the map on canvas
  const renderMap = () => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    const { width, height } = dimensions

    // Set canvas dimensions
    canvas.width = width
    canvas.height = height

    // Clear canvas
    ctx.clearRect(0, 0, width, height)

    // Draw background
    ctx.fillStyle = "#f3f4f6"
    ctx.fillRect(0, 0, width, height)

    // Draw grid lines
    ctx.strokeStyle = "#e5e7eb"
    ctx.lineWidth = 1

    // Horizontal grid lines
    for (let i = 0; i < height; i += 40) {
      ctx.beginPath()
      ctx.moveTo(0, i)
      ctx.lineTo(width, i)
      ctx.stroke()
    }

    // Vertical grid lines
    for (let i = 0; i < width; i += 40) {
      ctx.beginPath()
      ctx.moveTo(i, 0)
      ctx.lineTo(i, height)
      ctx.stroke()
    }

    // Draw roads (simulated)
    ctx.strokeStyle = "#d1d5db"
    ctx.lineWidth = 3

    // Main roads
    ctx.beginPath()
    ctx.moveTo(width * 0.2, height * 0.5)
    ctx.lineTo(width * 0.8, height * 0.5)
    ctx.stroke()

    ctx.beginPath()
    ctx.moveTo(width * 0.5, height * 0.2)
    ctx.lineTo(width * 0.5, height * 0.8)
    ctx.stroke()

    // Secondary roads
    ctx.strokeStyle = "#e5e7eb"
    ctx.lineWidth = 2

    ctx.beginPath()
    ctx.moveTo(width * 0.3, height * 0.3)
    ctx.lineTo(width * 0.7, height * 0.7)
    ctx.stroke()

    ctx.beginPath()
    ctx.moveTo(width * 0.3, height * 0.7)
    ctx.lineTo(width * 0.7, height * 0.3)
    ctx.stroke()

    // Draw user location
    const centerX = width / 2
    const centerY = height / 2

    // User location circle (outer)
    ctx.fillStyle = "rgba(59, 130, 246, 0.2)"
    ctx.beginPath()
    ctx.arc(centerX, centerY, 50, 0, 2 * Math.PI)
    ctx.fill()

    // User location circle (middle)
    ctx.fillStyle = "rgba(59, 130, 246, 0.5)"
    ctx.beginPath()
    ctx.arc(centerX, centerY, 15, 0, 2 * Math.PI)
    ctx.fill()

    // User location circle (inner)
    ctx.fillStyle = "#ffffff"
    ctx.beginPath()
    ctx.arc(centerX, centerY, 7, 0, 2 * Math.PI)
    ctx.fill()

    // Draw centers
    centers.forEach((center, index) => {
      // Calculate position (in a real map, this would be based on geo coordinates)
      // For our simulation, we'll place them in a circle around the user
      const angle = index * ((2 * Math.PI) / centers.length)
      const distance = 100 + (index % 3) * 50 // Vary distances
      const x = centerX + Math.cos(angle) * distance
      const y = centerY + Math.sin(angle) * distance

      // Store position for click detection
      center.mapPosition = { x, y }

      // Draw center marker
      const isSelected = selectedCenter && selectedCenter.id === center.id

      // Marker shadow
      ctx.fillStyle = "rgba(0, 0, 0, 0.2)"
      ctx.beginPath()
      ctx.arc(x, y + 2, 10, 0, 2 * Math.PI)
      ctx.fill()

      // Marker background
      ctx.fillStyle = center.isPartner ? "#059669" : "#ef4444"
      ctx.beginPath()
      ctx.arc(x, y, isSelected ? 12 : 10, 0, 2 * Math.PI)
      ctx.fill()

      // Marker icon (simplified pin)
      ctx.fillStyle = "#ffffff"
      ctx.beginPath()
      ctx.arc(x, y, 5, 0, 2 * Math.PI)
      ctx.fill()

      // Selected marker highlight
      if (isSelected) {
        ctx.strokeStyle = "#ffffff"
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.arc(x, y, 14, 0, 2 * Math.PI)
        ctx.stroke()
      }
    })
  }

  // Handle canvas click
  const handleCanvasClick = (e) => {
    const rect = canvasRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    // Find if a center was clicked
    const clickedCenter = centers.find((center) => {
      const { mapPosition } = center
      if (!mapPosition) return false

      const distance = Math.sqrt(Math.pow(mapPosition.x - x, 2) + Math.pow(mapPosition.y - y, 2))

      return distance <= 15 // Click radius
    })

    setSelectedCenter(clickedCenter || null)
  }

  return (
    <div className="relative w-full h-full">
      <canvas ref={canvasRef} className="w-full h-full rounded-md" onClick={handleCanvasClick} />

      {/* Map controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
        <Button size="sm" variant="outline" className="bg-background shadow-md">
          <Navigation className="h-4 w-4 mr-2" />
          Center Map
        </Button>
      </div>

      {/* Info card for selected center */}
      {selectedCenter && (
        <Card className="absolute bottom-4 left-4 w-72 bg-background/95 backdrop-blur-sm shadow-lg z-10">
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-medium">{selectedCenter.name}</h3>
                <p className="text-sm text-muted-foreground flex items-center mt-1">
                  <MapPin className="h-3 w-3 mr-1" />
                  {selectedCenter.address}
                </p>
              </div>
              {selectedCenter.isPartner && <Badge className="bg-green-600">Partner</Badge>}
            </div>

            <div className="mt-3 flex flex-wrap gap-1">
              {selectedCenter.acceptedMaterials.slice(0, 3).map((material) => (
                <Badge key={material} variant="outline" className="text-xs">
                  {material}
                </Badge>
              ))}
              {selectedCenter.acceptedMaterials.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{selectedCenter.acceptedMaterials.length - 3} more
                </Badge>
              )}
            </div>

            <Button size="sm" className="w-full mt-3" onClick={() => onCenterClick(selectedCenter.id)}>
              View Details
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Legend */}
      <div className="absolute bottom-4 right-4 bg-background/90 backdrop-blur-sm p-3 rounded-md text-sm shadow-md z-10">
        <div className="flex items-center mb-2">
          <span className="h-3 w-3 rounded-full bg-green-600 mr-2"></span>
          <span>Partner Centers</span>
        </div>
        <div className="flex items-center">
          <span className="h-3 w-3 rounded-full bg-red-500 mr-2"></span>
          <span>Regular Centers</span>
        </div>
      </div>
    </div>
  )
}
