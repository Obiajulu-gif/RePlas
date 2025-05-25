"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { handleQrCodeData } from "@/lib/qr-code-handler"
import { useRouter } from "next/navigation"
import { AlertCircle, QrCode, Search } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface QrScannerFallbackProps {
  className?: string
  onSuccess?: (data: string) => void
}

export function QrScannerFallback({ className, onSuccess }: QrScannerFallbackProps) {
  const [qrCodeValue, setQrCodeValue] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!qrCodeValue.trim()) {
      setError("Please enter a QR code value")
      return
    }

    setIsProcessing(true)
    setError(null)

    try {
      // Process the QR code data
      const result = await handleQrCodeData(qrCodeValue)

      // Call the success callback if provided
      if (onSuccess) {
        onSuccess(qrCodeValue)
      }

      // If the handler returned a URL, navigate to it
      if (result?.url) {
        router.push(result.url)
      }
    } catch (error) {
      console.error("Error handling QR code data:", error)
      setError(error instanceof Error ? error.message : "Failed to process QR code")
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className={className}>
      <Alert variant="warning" className="mb-4">
        <AlertCircle className="h-4 w-4 mr-2" />
        <AlertTitle>Camera Access Not Available</AlertTitle>
        <AlertDescription>
          We couldn't access your camera. You can manually enter a QR code value below.
        </AlertDescription>
      </Alert>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
        <div className="flex justify-center mb-4">
          <QrCode className="h-16 w-16 text-gray-400" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="qr-code-value" className="block text-sm font-medium mb-1">
              Enter QR Code Value
            </label>
            <Input
              id="qr-code-value"
              value={qrCodeValue}
              onChange={(e) => setQrCodeValue(e.target.value)}
              placeholder="Enter the QR code text or URL"
              className="w-full"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 rounded-md">
              <p className="text-sm">{error}</p>
            </div>
          )}

          <Button type="submit" className="w-full" disabled={isProcessing}>
            {isProcessing ? (
              "Processing..."
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" />
                Process QR Code
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  )
}
