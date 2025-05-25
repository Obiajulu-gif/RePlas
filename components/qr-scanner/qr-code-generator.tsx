"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { QrCodeType } from "@/lib/qr-code-handler"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Download, RefreshCw } from "lucide-react"

interface QrCodeGeneratorProps {
  className?: string
}

export function QrCodeGenerator({ className }: QrCodeGeneratorProps) {
  const [qrType, setQrType] = useState<QrCodeType>(QrCodeType.BATCH)
  const [qrId, setQrId] = useState("")
  const [qrData, setQrData] = useState("")
  const [qrUrl, setQrUrl] = useState("")
  const [generatedQrUrl, setGeneratedQrUrl] = useState<string | null>(null)
  const qrRef = useRef<HTMLDivElement>(null)

  const generateQrCode = () => {
    let data = ""

    switch (qrType) {
      case QrCodeType.BATCH:
        if (qrId) {
          data = JSON.stringify({ type: "batch", batchId: qrId })
        } else if (qrUrl) {
          data = qrUrl
        } else {
          data = JSON.stringify({ type: "batch", batchId: "BATCH-" + Math.floor(Math.random() * 10000) })
        }
        break

      case QrCodeType.PRODUCT:
        if (qrId) {
          data = JSON.stringify({ type: "product", productId: qrId })
        } else if (qrUrl) {
          data = qrUrl
        } else {
          data = JSON.stringify({ type: "product", productId: "PROD-" + Math.floor(Math.random() * 10000) })
        }
        break

      case QrCodeType.RECYCLING_CENTER:
        if (qrId) {
          data = JSON.stringify({ type: "recycling-center", centerId: qrId })
        } else if (qrUrl) {
          data = qrUrl
        } else {
          data = JSON.stringify({ type: "recycling-center", centerId: "RC-" + Math.floor(Math.random() * 10000) })
        }
        break

      case QrCodeType.PROFILE:
        if (qrId) {
          data = JSON.stringify({ type: "profile", profileId: qrId })
        } else if (qrUrl) {
          data = qrUrl
        } else {
          data = JSON.stringify({ type: "profile", profileId: "USER-" + Math.floor(Math.random() * 10000) })
        }
        break

      case QrCodeType.URL:
        data = qrUrl || "https://example.com"
        break

      case QrCodeType.TEXT:
      default:
        data = qrData || "Sample QR Code Text"
        break
    }

    // Generate QR code URL using a QR code API
    const encodedData = encodeURIComponent(data)
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodedData}`
    setGeneratedQrUrl(qrCodeUrl)
  }

  const downloadQrCode = () => {
    if (!generatedQrUrl) return

    // Create a temporary link element
    const link = document.createElement("a")
    link.href = generatedQrUrl
    link.download = `qrcode-${qrType.toLowerCase()}-${Date.now()}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>QR Code Generator</CardTitle>
        <CardDescription>Generate QR codes for testing the scanner</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="qr-type">QR Code Type</Label>
            <Select value={qrType} onValueChange={(value) => setQrType(value as QrCodeType)}>
              <SelectTrigger id="qr-type">
                <SelectValue placeholder="Select QR code type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={QrCodeType.BATCH}>Batch</SelectItem>
                <SelectItem value={QrCodeType.PRODUCT}>Product</SelectItem>
                <SelectItem value={QrCodeType.RECYCLING_CENTER}>Recycling Center</SelectItem>
                <SelectItem value={QrCodeType.PROFILE}>Profile</SelectItem>
                <SelectItem value={QrCodeType.URL}>URL</SelectItem>
                <SelectItem value={QrCodeType.TEXT}>Plain Text</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {qrType !== QrCodeType.URL && qrType !== QrCodeType.TEXT && (
            <div className="space-y-2">
              <Label htmlFor="qr-id">ID (Optional)</Label>
              <Input
                id="qr-id"
                placeholder={`Enter ${qrType.toLowerCase()} ID`}
                value={qrId}
                onChange={(e) => setQrId(e.target.value)}
              />
            </div>
          )}

          {(qrType === QrCodeType.URL ||
            qrType === QrCodeType.BATCH ||
            qrType === QrCodeType.PRODUCT ||
            qrType === QrCodeType.RECYCLING_CENTER ||
            qrType === QrCodeType.PROFILE) && (
            <div className="space-y-2">
              <Label htmlFor="qr-url">URL (Optional)</Label>
              <Input id="qr-url" placeholder="Enter URL" value={qrUrl} onChange={(e) => setQrUrl(e.target.value)} />
            </div>
          )}

          {qrType === QrCodeType.TEXT && (
            <div className="space-y-2">
              <Label htmlFor="qr-data">Text Content</Label>
              <Input
                id="qr-data"
                placeholder="Enter text content"
                value={qrData}
                onChange={(e) => setQrData(e.target.value)}
              />
            </div>
          )}

          <Button onClick={generateQrCode} className="w-full">
            <RefreshCw className="mr-2 h-4 w-4" />
            Generate QR Code
          </Button>

          {generatedQrUrl && (
            <div className="mt-4 flex flex-col items-center" ref={qrRef}>
              <div className="bg-white p-2 rounded-md">
                <img src={generatedQrUrl || "/placeholder.svg"} alt="Generated QR Code" className="w-48 h-48" />
              </div>
              <Button variant="outline" onClick={downloadQrCode} className="mt-2">
                <Download className="mr-2 h-4 w-4" />
                Download QR Code
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
