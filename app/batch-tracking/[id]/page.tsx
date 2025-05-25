"use client"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeft,
  CheckCircle,
  AlertTriangle,
  Clock,
  Download,
  Share2,
  MapPin,
  Calendar,
  BarChart2,
  Factory,
  Recycle,
  FileText,
  Users,
  ShieldCheck,
} from "lucide-react"
import Link from "next/link"

export default function BatchDetailsPage() {
  const params = useParams()
  const batchId = params.id

  // Sample batch data - in a real app, this would be fetched from an API
  const batchData = {
    id: batchId,
    producer: "EcoPlastics Inc.",
    material: "PET (Type 1)",
    weight: "500 kg",
    status: "verified",
    date: "2023-05-15",
    location: "Lagos, Nigeria",
    carbonOffset: "750 kg",
    recyclingRate: "98%",
    description:
      "This batch consists of post-consumer PET bottles collected from community recycling centers in Lagos. The material has been sorted, cleaned, and processed according to international standards.",
    certifications: ["ISO 14001", "Global Recycled Standard", "Blockchain Verified"],
    timeline: [
      {
        date: "2023-05-01",
        event: "Collection",
        description: "Plastic collected from community recycling centers",
        location: "Lagos, Nigeria",
      },
      {
        date: "2023-05-05",
        event: "Sorting & Cleaning",
        description: "Material sorted by type and cleaned",
        location: "EcoPlastics Facility, Lagos",
      },
      {
        date: "2023-05-10",
        event: "Processing",
        description: "Material processed into flakes",
        location: "EcoPlastics Facility, Lagos",
      },
      {
        date: "2023-05-12",
        event: "Quality Control",
        description: "Material tested for purity and quality",
        location: "EcoPlastics Lab, Lagos",
      },
      {
        date: "2023-05-15",
        event: "Verification",
        description: "Batch verified and recorded on blockchain",
        location: "Celo Blockchain",
      },
    ],
    participants: [
      {
        name: "EcoPlastics Inc.",
        role: "Producer",
        verified: true,
      },
      {
        name: "GreenVerify",
        role: "Verifier",
        verified: true,
      },
      {
        name: "RecycleChain",
        role: "Blockchain Provider",
        verified: true,
      },
    ],
    documents: [
      {
        name: "Certificate of Recycling",
        type: "PDF",
        size: "1.2 MB",
      },
      {
        name: "Quality Test Results",
        type: "PDF",
        size: "0.8 MB",
      },
      {
        name: "Chain of Custody",
        type: "PDF",
        size: "1.5 MB",
      },
    ],
  }

  // Get status badge based on status
  const getStatusBadge = (status) => {
    switch (status) {
      case "verified":
        return (
          <Badge className="bg-green-500 hover:bg-green-600">
            <CheckCircle className="h-3 w-3 mr-1" /> Verified
          </Badge>
        )
      case "in-progress":
        return (
          <Badge className="bg-blue-500 hover:bg-blue-600">
            <Clock className="h-3 w-3 mr-1" /> In Progress
          </Badge>
        )
      case "pending":
        return (
          <Badge variant="outline" className="text-amber-500 border-amber-500">
            <Clock className="h-3 w-3 mr-1" /> Pending
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="destructive">
            <AlertTriangle className="h-3 w-3 mr-1" /> Rejected
          </Badge>
        )
      default:
        return <Badge>{status}</Badge>
    }
  }

  return (
    <div className="container py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/batch-tracking">
              <ArrowLeft className="h-4 w-4 mr-1" /> Back to Batches
            </Link>
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Share2 className="h-4 w-4" />
            <span>Share</span>
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Download className="h-4 w-4" />
            <span>Export</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl">{batchData.id}</CardTitle>
                <CardDescription className="mt-1">{batchData.material} Plastic Batch</CardDescription>
              </div>
              {getStatusBadge(batchData.status)}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-muted-foreground">{batchData.description}</p>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Factory className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Producer:</span>
                  <span className="text-sm font-medium">{batchData.producer}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Recycle className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Material:</span>
                  <span className="text-sm font-medium">{batchData.material}</span>
                </div>
                <div className="flex items-center gap-2">
                  <BarChart2 className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Weight:</span>
                  <span className="text-sm font-medium">{batchData.weight}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Date:</span>
                  <span className="text-sm font-medium">{batchData.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Location:</span>
                  <span className="text-sm font-medium">{batchData.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Recycling Rate:</span>
                  <span className="text-sm font-medium">{batchData.recyclingRate}</span>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-sm font-medium mb-2">Certifications</h3>
                <div className="flex flex-wrap gap-2">
                  {batchData.certifications.map((cert, index) => (
                    <Badge key={index} variant="outline">
                      {cert}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Environmental Impact</CardTitle>
            <CardDescription>Impact metrics for this batch</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <h3 className="text-sm font-medium text-green-600 dark:text-green-400 mb-1">Carbon Offset</h3>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">{batchData.carbonOffset}</p>
                <p className="text-xs text-muted-foreground mt-1">Equivalent to planting 35 trees for one year</p>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Water Saved</span>
                    <span className="font-medium">2,500 liters</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: "75%" }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Energy Saved</span>
                    <span className="font-medium">850 kWh</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-amber-500 h-2 rounded-full" style={{ width: "65%" }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Landfill Reduced</span>
                    <span className="font-medium">3.2 m³</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-purple-500 h-2 rounded-full" style={{ width: "85%" }}></div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="timeline" className="space-y-4">
        <TabsList>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="participants">Participants</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="blockchain">Blockchain</TabsTrigger>
        </TabsList>

        <TabsContent value="timeline" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Batch Timeline</CardTitle>
              <CardDescription>Track the journey of this plastic batch</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-muted"></div>
                <div className="space-y-8">
                  {batchData.timeline.map((event, index) => (
                    <div key={index} className="relative pl-10">
                      <div className="absolute left-0 top-1 h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        {index === batchData.timeline.length - 1 ? (
                          <CheckCircle className="h-4 w-4 text-primary" />
                        ) : (
                          <div className="h-2 w-2 rounded-full bg-primary"></div>
                        )}
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-medium">{event.event}</h3>
                          <Badge variant="outline" className="text-xs">
                            {event.date}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{event.description}</p>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          <span>{event.location}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="participants" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Participants</CardTitle>
              <CardDescription>Organizations involved in this batch</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {batchData.participants.map((participant, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">{participant.name}</h3>
                        <p className="text-sm text-muted-foreground">{participant.role}</p>
                      </div>
                    </div>
                    {participant.verified && (
                      <Badge className="bg-green-500 hover:bg-green-600">
                        <CheckCircle className="h-3 w-3 mr-1" /> Verified
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Documents</CardTitle>
              <CardDescription>Certificates and documentation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {batchData.documents.map((doc, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">{doc.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {doc.type} • {doc.size}
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                      <Download className="h-4 w-4" />
                      <span>Download</span>
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="blockchain" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Blockchain Verification</CardTitle>
              <CardDescription>Immutable record on the Celo blockchain</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="p-4 bg-muted rounded-lg">
                  <h3 className="text-sm font-medium mb-2">Transaction Hash</h3>
                  <div className="flex items-center gap-2">
                    <code className="text-xs bg-background p-2 rounded w-full overflow-x-auto">
                      0x7f9fade1c0d57a7af66ab4ead79fade1c0d57a7af66ab4ead7c2c2eb7b11a91385
                    </code>
                    <Button variant="ghost" size="icon" className="shrink-0">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium mb-2">Block Number</h3>
                    <p className="text-sm">15,482,021</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium mb-2">Timestamp</h3>
                    <p className="text-sm">2023-05-15 14:32:45 UTC</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium mb-2">Network</h3>
                    <p className="text-sm">Celo Mainnet</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium mb-2">Contract</h3>
                    <p className="text-sm">RePlas Traceability</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-2">Verification Status</h3>
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="h-5 w-5" />
                    <span className="font-medium">Verified on blockchain</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    This batch has been cryptographically verified on the Celo blockchain, ensuring data integrity and
                    immutability.
                  </p>
                </div>

                <Button className="w-full">View on Celo Explorer</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
