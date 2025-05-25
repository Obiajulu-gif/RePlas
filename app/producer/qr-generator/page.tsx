"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"
import { useWallet } from "@/components/wallet-provider"
import { RePlasTraceability } from "@/lib/contracts/traceability-contract"
import { DataTable } from "./data-table"
import { columns } from "./columns"
import { QrCodeGenerator } from "./qr-code-generator"
import { Download, Printer, QrCode, Plus, History, ArrowRight, Check, AlertTriangle } from "lucide-react"

export default function QrGeneratorPage() {
  const { isConnected, address } = useWallet()
  const { toast } = useToast()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("generate")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedQR, setGeneratedQR] = useState<null | {
    batchId: string
    data: string
  }>(null)

  const [formData, setFormData] = useState({
    productName: "",
    plasticType: "",
    weight: "",
    manufacturingDate: new Date().toISOString().split("T")[0],
    additionalInfo: "",
  })

  // Mock batch history data
  const batchHistory = [
    {
      id: "BATCH-8742",
      productName: "Water Bottle 500ml",
      plasticType: "PET",
      weight: "0.5",
      date: "2023-05-15",
      status: "active",
    },
    {
      id: "BATCH-6531",
      productName: "Detergent Container",
      plasticType: "HDPE",
      weight: "0.8",
      date: "2023-05-10",
      status: "active",
    },
    {
      id: "BATCH-4219",
      productName: "Yogurt Container",
      plasticType: "PP",
      weight: "0.3",
      date: "2023-05-05",
      status: "active",
    },
    {
      id: "BATCH-3107",
      productName: "Shampoo Bottle",
      plasticType: "HDPE",
      weight: "0.6",
      date: "2023-04-28",
      status: "active",
    },
    {
      id: "BATCH-2095",
      productName: "Food Container",
      plasticType: "PP",
      weight: "0.4",
      date: "2023-04-20",
      status: "inactive",
    },
  ]

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleGenerateQR = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsGenerating(true)

    try {
      // Generate a random batch ID
      const batchId = `BATCH-${Math.floor(Math.random() * 10000)}`

      // Create the data to be encoded in the QR code
      const qrData = JSON.stringify({
        batchId,
        productName: formData.productName,
        plasticType: formData.plasticType,
        weight: formData.weight,
        manufacturingDate: formData.manufacturingDate,
        producerAddress: address,
        timestamp: Date.now(),
      })

      // In a real implementation, we would call the traceability contract
      const traceabilityContract = new RePlasTraceability()
      await traceabilityContract.logPlasticBatch(batchId, formData.weight, formData.plasticType, address || "0x0000")

      // Set the generated QR code data
      setGeneratedQR({
        batchId,
        data: qrData,
      })

      toast({
        title: "QR Code Generated",
        description: `Batch ID ${batchId} has been created and registered on the blockchain.`,
      })
    } catch (error) {
      console.error("Failed to generate QR code:", error)
      toast({
        title: "Generation Failed",
        description: "Could not generate QR code. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const resetForm = () => {
    setFormData({
      productName: "",
      plasticType: "",
      weight: "",
      manufacturingDate: new Date().toISOString().split("T")[0],
      additionalInfo: "",
    })
    setGeneratedQR(null)
  }

  if (!isConnected) {
    return (
      <div className="container mx-auto py-6">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Producer Access Required</CardTitle>
            <CardDescription>You need to connect your wallet with producer access to use this feature</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center py-6">
            <AlertTriangle className="h-16 w-16 text-amber-500" />
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={() => router.push("/")}>
              Go to Home Page
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold">QR Code Generator</h1>
          <p className="text-muted-foreground">Create and manage QR codes for plastic batch traceability</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-sm">
            Producer Account
          </Badge>
          <Button variant="outline" size="sm" onClick={() => setActiveTab("history")}>
            <History className="mr-2 h-4 w-4" />
            View Batch History
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="generate">Generate QR Code</TabsTrigger>
          <TabsTrigger value="history">Batch History</TabsTrigger>
        </TabsList>

        <TabsContent value="generate" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Batch Information</CardTitle>
                <CardDescription>Enter details about the plastic batch</CardDescription>
              </CardHeader>
              <CardContent>
                <form id="qr-form" onSubmit={handleGenerateQR} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="productName">Product Name</Label>
                    <Input
                      id="productName"
                      name="productName"
                      placeholder="e.g., Water Bottle 500ml"
                      value={formData.productName}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="plasticType">Plastic Type</Label>
                    <select
                      id="plasticType"
                      name="plasticType"
                      value={formData.plasticType}
                      onChange={handleChange}
                      className="w-full rounded-md border border-input bg-background px-3 py-2"
                      required
                    >
                      <option value="">Select plastic type</option>
                      <option value="PET">PET (Type 1)</option>
                      <option value="HDPE">HDPE (Type 2)</option>
                      <option value="PVC">PVC (Type 3)</option>
                      <option value="LDPE">LDPE (Type 4)</option>
                      <option value="PP">PP (Type 5)</option>
                      <option value="PS">PS (Type 6)</option>
                      <option value="OTHER">Other (Type 7)</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="weight">Batch Weight (kg)</Label>
                    <Input
                      id="weight"
                      name="weight"
                      type="number"
                      placeholder="Total weight in kg"
                      min="0.1"
                      step="0.1"
                      value={formData.weight}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="manufacturingDate">Manufacturing Date</Label>
                    <Input
                      id="manufacturingDate"
                      name="manufacturingDate"
                      type="date"
                      value={formData.manufacturingDate}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="additionalInfo">Additional Information (Optional)</Label>
                    <Textarea
                      id="additionalInfo"
                      name="additionalInfo"
                      placeholder="Any additional details about the batch"
                      value={formData.additionalInfo}
                      onChange={handleChange}
                    />
                  </div>
                </form>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={resetForm} disabled={isGenerating}>
                  Reset
                </Button>
                <Button type="submit" form="qr-form" disabled={isGenerating}>
                  {isGenerating ? (
                    <>Generating...</>
                  ) : (
                    <>
                      Generate QR Code
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>QR Code Preview</CardTitle>
                <CardDescription>
                  {generatedQR ? "Your generated QR code for the batch" : "QR code will appear here after generation"}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center min-h-[300px]">
                {generatedQR ? (
                  <div className="text-center">
                    <QrCodeGenerator value={generatedQR.data} size={200} />
                    <div className="mt-4">
                      <p className="font-medium">Batch ID: {generatedQR.batchId}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {formData.productName} - {formData.plasticType}
                      </p>
                      <div className="flex items-center justify-center mt-2">
                        <Badge
                          variant="outline"
                          className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                        >
                          <Check className="mr-1 h-3 w-3" />
                          Registered on Blockchain
                        </Badge>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center p-6">
                    <QrCode className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">
                      Fill out the form and click "Generate QR Code" to create a new batch QR code
                    </p>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-center gap-4">
                <Button
                  variant="outline"
                  disabled={!generatedQR}
                  onClick={() => {
                    toast({
                      title: "QR Code Downloaded",
                      description: "The QR code has been downloaded successfully.",
                    })
                  }}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
                <Button
                  disabled={!generatedQR}
                  onClick={() => {
                    toast({
                      title: "Printing QR Code",
                      description: "Sending QR code to printer.",
                    })
                  }}
                >
                  <Printer className="mr-2 h-4 w-4" />
                  Print
                </Button>
              </CardFooter>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>How It Works</CardTitle>
              <CardDescription>Understanding the QR code generation process</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-3">
                <div className="flex flex-col items-center text-center p-4">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Plus className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-medium mb-2">1. Create Batch</h3>
                  <p className="text-sm text-muted-foreground">
                    Enter details about your plastic batch including type, weight, and manufacturing date.
                  </p>
                </div>

                <div className="flex flex-col items-center text-center p-4">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <QrCode className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-medium mb-2">2. Generate QR Code</h3>
                  <p className="text-sm text-muted-foreground">
                    The system generates a unique QR code containing batch information and registers it on the
                    blockchain.
                  </p>
                </div>

                <div className="flex flex-col items-center text-center p-4">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Printer className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-medium mb-2">3. Apply to Products</h3>
                  <p className="text-sm text-muted-foreground">
                    Download or print the QR code and apply it to your plastic products for traceability.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Batch History</CardTitle>
              <CardDescription>View and manage your previously generated QR codes</CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable columns={columns} data={batchHistory} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
