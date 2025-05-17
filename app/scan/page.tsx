"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Camera, QrCode, Send, Upload, ImageIcon, Info } from "lucide-react"

export default function ScanPage() {
  const [activeTab, setActiveTab] = useState("scan")
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hello! I can help you identify plastic types and provide recycling information. Upload a photo or scan a QR code to get started.",
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [scanResult, setScanResult] = useState<null | {
    type: string
    recyclable: boolean
    description: string
    tokenReward: number
  }>(null)

  const handleSend = async () => {
    if (!input.trim()) return

    // Add user message
    const userMessage = { role: "user", content: input }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "Based on your description, that sounds like PET (Type 1) plastic. It's highly recyclable and can be processed at most recycling facilities. You can earn about 5-10 RePlas tokens per kg.",
        "HDPE (Type 2) plastic is commonly used for milk jugs and detergent bottles. It's valuable for recycling and can earn you 4-8 RePlas tokens per kg.",
        "PP (Type 5) is becoming more widely accepted for recycling. It's used for yogurt containers and bottle caps. Make sure to clean it before recycling!",
        "To maximize your token rewards, separate different plastic types and ensure they're clean and dry before submission.",
        "The QR code on plastic products can be scanned to verify its origin and track it through the recycling process on our blockchain.",
      ]

      const randomResponse = responses[Math.floor(Math.random() * responses.length)]
      setMessages((prev) => [...prev, { role: "assistant", content: randomResponse }])
      setIsLoading(false)
    }, 1000)
  }

  const handleImageUpload = () => {
    setIsLoading(true)

    // Simulate processing delay
    setTimeout(() => {
      const plasticTypes = [
        {
          type: "PET (Type 1)",
          recyclable: true,
          description: "Polyethylene terephthalate, commonly used for water and soda bottles.",
          tokenReward: 8,
        },
        {
          type: "HDPE (Type 2)",
          recyclable: true,
          description: "High-density polyethylene, used for milk jugs and detergent bottles.",
          tokenReward: 6,
        },
        {
          type: "PVC (Type 3)",
          recyclable: false,
          description: "Polyvinyl chloride, used for pipes and some food packaging. Limited recyclability.",
          tokenReward: 2,
        },
        {
          type: "LDPE (Type 4)",
          recyclable: true,
          description: "Low-density polyethylene, used for plastic bags and squeeze bottles.",
          tokenReward: 4,
        },
        {
          type: "PP (Type 5)",
          recyclable: true,
          description: "Polypropylene, used for yogurt containers and bottle caps.",
          tokenReward: 5,
        },
      ]

      const randomType = plasticTypes[Math.floor(Math.random() * plasticTypes.length)]
      setScanResult(randomType)

      setMessages((prev) => [
        ...prev,
        {
          role: "user",
          content: "I've uploaded an image of a plastic item for identification.",
        },
        {
          role: "assistant",
          content: `I've analyzed your image and identified it as ${randomType.type}. ${randomType.description} ${randomType.recyclable ? "This is recyclable and can earn you approximately " + randomType.tokenReward + " RePlas tokens per kg." : "This has limited recyclability in most programs."}`,
        },
      ])

      setIsLoading(false)
    }, 2000)
  }

  const handleQRScan = () => {
    setIsLoading(true)

    // Simulate processing delay
    setTimeout(() => {
      const qrData = {
        batchId: "BATCH-" + Math.floor(Math.random() * 10000),
        producer: "EcoPlastics Manufacturing",
        productType: "Water Bottle",
        material: "PET (Type 1)",
        manufactureDate: "2023-05-15",
        recyclable: true,
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "user",
          content: "I've scanned a QR code on a plastic product.",
        },
        {
          role: "assistant",
          content: `QR Code scanned successfully! This product is from batch ${qrData.batchId} produced by ${qrData.producer}. It's a ${qrData.productType} made from ${qrData.material} manufactured on ${qrData.manufactureDate}. ${qrData.recyclable ? "This product is recyclable and eligible for RePlas tokens." : "This product has limited recyclability."}`,
        },
      ])

      setIsLoading(false)
    }, 1500)
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Scan & Ask</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="md:row-span-2 flex flex-col h-[600px]">
          <CardHeader className="pb-2">
            <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="scan">Scan & Identify</TabsTrigger>
                <TabsTrigger value="chat">Chat Assistant</TabsTrigger>
              </TabsList>

              <TabsContent value="scan" className="h-full flex flex-col mt-4">
                <div className="p-4 flex-1">
                  <div className="border-2 border-dashed rounded-lg h-[300px] flex items-center justify-center mb-4">
                    {scanResult ? (
                      <div className="p-4 text-center">
                        <div className="mb-2 flex justify-center">
                          <div
                            className={`h-16 w-16 rounded-full flex items-center justify-center ${scanResult.recyclable ? "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400" : "bg-amber-100 text-amber-600 dark:bg-amber-900 dark:text-amber-400"}`}
                          >
                            <Info className="h-8 w-8" />
                          </div>
                        </div>
                        <h3 className="text-xl font-bold">{scanResult.type}</h3>
                        <p className="text-sm text-muted-foreground mb-2">{scanResult.description}</p>
                        <div
                          className={`text-sm font-medium ${scanResult.recyclable ? "text-green-600 dark:text-green-400" : "text-amber-600 dark:text-amber-400"}`}
                        >
                          {scanResult.recyclable ? "Recyclable" : "Limited Recyclability"}
                        </div>
                        {scanResult.recyclable && (
                          <div className="mt-2 text-sm">
                            Potential reward: <span className="font-bold">{scanResult.tokenReward} RPL/kg</span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center p-4">
                        <ImageIcon className="h-10 w-10 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-muted-foreground">Upload an image or use camera to identify plastic</p>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Button onClick={handleImageUpload} className="flex items-center gap-2">
                      <Upload className="h-4 w-4" />
                      Upload Image
                    </Button>
                    <Button onClick={handleQRScan} variant="outline" className="flex items-center gap-2">
                      <QrCode className="h-4 w-4" />
                      Scan QR Code
                    </Button>
                  </div>

                  {scanResult && (
                    <div className="mt-4">
                      <Button className="w-full">Submit for Recycling</Button>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="chat" className="h-full flex flex-col mt-4">
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {messages.map((message, index) => (
                      <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                        <div
                          className={`flex max-w-[80%] gap-2 ${
                            message.role === "user" ? "flex-row-reverse" : "flex-row"
                          }`}
                        >
                          <Avatar className="h-8 w-8">
                            {message.role === "user" ? (
                              <AvatarImage src="/placeholder.svg?key=5klof" alt="User" />
                            ) : (
                              <AvatarImage src="/placeholder.svg?key=hqw9v" alt="Assistant" />
                            )}
                            <AvatarFallback>{message.role === "user" ? "U" : "AI"}</AvatarFallback>
                          </Avatar>
                          <div
                            className={`rounded-lg px-3 py-2 text-sm ${
                              message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                            }`}
                          >
                            {message.content}
                          </div>
                        </div>
                      </div>
                    ))}
                    {isLoading && (
                      <div className="flex justify-start">
                        <div className="flex max-w-[80%] gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src="/placeholder.svg?key=up287" alt="Assistant" />
                            <AvatarFallback>AI</AvatarFallback>
                          </Avatar>
                          <div className="rounded-lg bg-muted px-3 py-2 text-sm">
                            <div className="flex gap-1">
                              <div className="h-2 w-2 animate-bounce rounded-full bg-foreground/50"></div>
                              <div className="h-2 w-2 animate-bounce rounded-full bg-foreground/50 [animation-delay:0.4s]"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>

                <div className="p-4 border-t">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault()
                      handleSend()
                    }}
                    className="flex items-center gap-2"
                  >
                    <Button
                      type="button"
                      size="icon"
                      variant="outline"
                      className="shrink-0"
                      onClick={handleImageUpload}
                    >
                      <Camera className="h-4 w-4" />
                      <span className="sr-only">Attach image</span>
                    </Button>
                    <Input
                      placeholder="Ask about plastic types or recycling..."
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      className="flex-1"
                    />
                    <Button type="submit" size="icon" className="shrink-0">
                      <Send className="h-4 w-4" />
                      <span className="sr-only">Send</span>
                    </Button>
                  </form>
                </div>
              </TabsContent>
            </Tabs>
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden p-0">
            {/* Content is now inside the TabsContent components above */}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Plastic Types Guide</CardTitle>
            <CardDescription>Learn about different plastic types and their recyclability</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                  <span className="text-blue-600 dark:text-blue-400 font-bold">1</span>
                </div>
                <div>
                  <p className="font-medium">PET (Polyethylene Terephthalate)</p>
                  <p className="text-sm text-muted-foreground">Water bottles, soda bottles</p>
                  <div className="text-xs text-green-600 dark:text-green-400 mt-1">Highly Recyclable • 5-10 RPL/kg</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                  <span className="text-green-600 dark:text-green-400 font-bold">2</span>
                </div>
                <div>
                  <p className="font-medium">HDPE (High-Density Polyethylene)</p>
                  <p className="text-sm text-muted-foreground">Milk jugs, detergent bottles</p>
                  <div className="text-xs text-green-600 dark:text-green-400 mt-1">Highly Recyclable • 4-8 RPL/kg</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 dark:bg-red-900">
                  <span className="text-red-600 dark:text-red-400 font-bold">3</span>
                </div>
                <div>
                  <p className="font-medium">PVC (Polyvinyl Chloride)</p>
                  <p className="text-sm text-muted-foreground">Pipes, food wrapping</p>
                  <div className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                    Limited Recyclability • 1-3 RPL/kg
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900">
                  <span className="text-amber-600 dark:text-amber-400 font-bold">4</span>
                </div>
                <div>
                  <p className="font-medium">LDPE (Low-Density Polyethylene)</p>
                  <p className="text-sm text-muted-foreground">Plastic bags, squeeze bottles</p>
                  <div className="text-xs text-green-600 dark:text-green-400 mt-1">Recyclable • 3-6 RPL/kg</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900">
                  <span className="text-purple-600 dark:text-purple-400 font-bold">5</span>
                </div>
                <div>
                  <p className="font-medium">PP (Polypropylene)</p>
                  <p className="text-sm text-muted-foreground">Yogurt containers, bottle caps</p>
                  <div className="text-xs text-green-600 dark:text-green-400 mt-1">Recyclable • 3-7 RPL/kg</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Submit Plastic</CardTitle>
            <CardDescription>Log your recycling to earn RePlas tokens</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Plastic Type</label>
                <select className="w-full rounded-md border border-input bg-background px-3 py-2">
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
                <label className="text-sm font-medium">Weight (kg)</label>
                <Input type="number" placeholder="Enter weight in kg" min="0.1" step="0.1" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Collection Location</label>
                <Input placeholder="Enter location" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Notes</label>
                <Textarea placeholder="Any additional information about the plastic" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Upload Photo Evidence</label>
                <div className="border-2 border-dashed rounded-lg p-4 text-center">
                  <Camera className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Drag & drop or click to upload</p>
                </div>
              </div>

              <Button className="w-full">Submit for Verification</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
