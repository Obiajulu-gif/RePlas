"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin } from "lucide-react"
import { useRouter } from "next/navigation"
import dynamic from "next/dynamic"

// Dynamically import Leaflet components with no SSR to avoid hydration issues
const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false })
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false })
const Marker = dynamic(() => import("react-leaflet").then((mod) => mod.Marker), { ssr: false })
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), { ssr: false })
const ZoomControl = dynamic(() => import("react-leaflet").then((mod) => mod.ZoomControl), { ssr: false })
const Circle = dynamic(() => import("react-leaflet").then((mod) => mod.Circle), { ssr: false })
const useMap = dynamic(() => import("react-leaflet").then((mod) => mod.useMap), { ssr: false })

// Custom hook to set map view
function SetViewOnChange({ coords }) {
  const map = useMap()
  useEffect(() => {
    if (coords && map) {
      map.setView([coords.lat, coords.lng], 13)
    }
  }, [coords, map])
  return null
}

export default function RecyclingCenterMap({ centers, userLocation, onCenterClick }) {
  const [selectedCenter, setSelectedCenter] = useState(null)
  const [mapReady, setMapReady] = useState(false)
  const router = useRouter()

  // Create custom marker icons
  const createMarkerIcon = (isPartner) => {
    if (typeof window === "undefined" || typeof L === "undefined") return null

    return L.divIcon({
      className: "custom-marker-icon",
      html: `<div class="w-8 h-8 rounded-full flex items-center justify-center ${
        isPartner ? "bg-green-600" : "bg-red-500"
      } text-white shadow-md border-2 border-white">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
          <circle cx="12" cy="10" r="3"></circle>
        </svg>
      </div>`,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32],
    })
  }

  const createUserLocationIcon = () => {
    if (typeof window === "undefined" || typeof L === "undefined") return null

    return L.divIcon({
      className: "custom-user-icon",
      html: `<div class="w-8 h-8 rounded-full bg-blue-500 border-2 border-white shadow-md flex items-center justify-center">
        <div class="w-4 h-4 rounded-full bg-white"></div>
      </div>`,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    })
  }

  // Handle client-side only code
  useEffect(() => {
    // Import Leaflet CSS
    import("leaflet/dist/leaflet.css")

    // Import Leaflet globally for icon creation
    import("leaflet").then((L) => {
      window.L = L.default
      setMapReady(true)
    })

    return () => {
      // Clean up
      if (window.L && window.L.map) {
        window.L.map.remove()
      }
    }
  }, [])

  if (!mapReady) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading map...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Add Leaflet CSS */}
      <style jsx global>{`
        .leaflet-container {
          height: 100%;
          width: 100%;
          border-radius: 0.5rem;
        }
        .custom-marker-icon, .custom-user-icon {
          background: transparent;
          border: none;
        }
        .leaflet-popup-content-wrapper {
          border-radius: 0.5rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        }
        .leaflet-popup-content {
          margin: 0.5rem;
          min-width: 200px;
        }
      `}</style>

      <MapContainer
        center={[userLocation.lat, userLocation.lng]}
        zoom={13}
        zoomControl={false}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ZoomControl position="topright" />
        <SetViewOnChange coords={userLocation} />

        {/* User location marker */}
        <Marker position={[userLocation.lat, userLocation.lng]} icon={createUserLocationIcon()}>
          <Popup>
            <div className="p-1">
              <p className="font-medium">Your Location</p>
            </div>
          </Popup>
        </Marker>

        {/* User location radius */}
        <Circle
          center={[userLocation.lat, userLocation.lng]}
          radius={2000} // 2km radius
          pathOptions={{ color: "#3b82f6", fillColor: "#3b82f6", fillOpacity: 0.1, weight: 1 }}
        />

        {/* Recycling center markers */}
        {centers.map((center) => {
          // In a real app, these would be actual coordinates
          // For demo, we'll generate positions around the user location
          const lat = userLocation.lat + (Math.random() - 0.5) * 0.05
          const lng = userLocation.lng + (Math.random() - 0.5) * 0.05

          return (
            <Marker
              key={center.id}
              position={[lat, lng]}
              icon={createMarkerIcon(center.isPartner)}
              eventHandlers={{
                click: () => setSelectedCenter(center),
              }}
            >
              <Popup>
                <div className="p-2">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-medium text-base">{center.name}</h3>
                    {center.isPartner && <Badge className="bg-green-600 text-white">Partner</Badge>}
                  </div>

                  <p className="text-sm text-muted-foreground flex items-center mb-2">
                    <MapPin className="h-3 w-3 mr-1" />
                    {center.address}, {center.city}
                  </p>

                  <div className="flex flex-wrap gap-1 mb-3">
                    {center.acceptedMaterials.slice(0, 3).map((material) => (
                      <Badge key={material} variant="outline" className="text-xs">
                        {material}
                      </Badge>
                    ))}
                    {center.acceptedMaterials.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{center.acceptedMaterials.length - 3} more
                      </Badge>
                    )}
                  </div>

                  <Button size="sm" className="w-full" onClick={() => onCenterClick(center.id)}>
                    View Details
                  </Button>
                </div>
              </Popup>
            </Marker>
          )
        })}
      </MapContainer>

      {/* Legend */}
      <div className="absolute bottom-4 right-4 bg-background/90 backdrop-blur-sm p-3 rounded-md text-sm z-[1000]">
        <div className="flex items-center mb-2">
          <span className="h-3 w-3 rounded-full bg-green-600 mr-2"></span>
          <span>Partner Centers</span>
        </div>
        <div className="flex items-center">
          <span className="h-3 w-3 rounded-full bg-red-500 mr-2"></span>
          <span>Regular Centers</span>
        </div>
      </div>
    </>
  )
}
