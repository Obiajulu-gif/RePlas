"use client"

import { useState, useEffect } from "react"
import { QrScanner } from "@/components/qr-scanner/qr-scanner"
import { handleQrCodeData } from "@/lib/qr-code-handler"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Camera, Info } from "lucide-react"
import Link from "next/link"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function QrScannerPage() {
  const [scanResult, setScanResult] = useState<string | null>(null)
  const [scanError, setScanError] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isBrowserSupported, setIsBrowserSupported] = useState(true)
  const router = useRouter()

  // Check browser support
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Check if the browser supports getUserMedia
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setIsBrowserSupported(false)
      }
    }
  }, [])

  const handleScanSuccess = async (decodedText: string, decodedResult: any) => {
    setScanResult(decodedText)
    setScanError(null)
    setIsProcessing(true)

    try {
      // Process the QR code data
      const result = await handleQrCodeData(decodedText)

      // If the handler returned a URL, navigate to it
      if (result?.url) {
        setTimeout(() => {
          router.push(result.url as string)
        }, 1000)
      } else {
        setIsProcessing(false)
      }
    } catch (error) {
      console.error("Error handling QR code data:", error)
      setScanError(error instanceof Error ? error.message : "Failed to process QR code")
      setIsProcessing(false)
    }
  }

  const handleScanError = (error: Error) => {
    setScanError(error.message)
    setScanResult(null)
    setIsProcessing(false)
  }

  return (
    <div className="container max-w-md mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <Link href="/" passHref>
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">QR Code Scanner</h1>
        <div className="w-10"></div> {/* Spacer for alignment */}
      </div>

      {!isBrowserSupported ? (
        <Alert variant="destructive" className="mb-6">
          <Camera className="h-4 w-4 mr-2" />
          <AlertTitle>Browser Not Supported</AlertTitle>
          <AlertDescription>
            Your browser doesn't support camera access. Please try using a different browser like Chrome, Firefox, or
            Safari.
          </AlertDescription>
        </Alert>
      ) : (
        <Alert className="mb-6">
          <Info className="h-4 w-4 mr-2" />
          <AlertTitle>Camera Permission Required</AlertTitle>
          <AlertDescription>
            This feature requires camera access. When prompted, please click "Allow" to enable the QR code scanner.
          </AlertDescription>
        </Alert>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="p-4">
          <div className="flex items-center mb-4 text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 p-3 rounded-md">
            <Info className="h-5 w-5 mr-2 flex-shrink-0" />
            <p className="text-sm">Position the QR code within the frame to scan</p>
          </div>

          <QrScanner onScanSuccess={handleScanSuccess} onScanError={handleScanError} className="mb-4" />

          {scanResult && (
            <div className="mt-4 p-3 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-md">
              <p className="font-medium">QR Code Detected!</p>
              <p className="text-sm break-all">{scanResult}</p>
              {isProcessing && <p className="text-sm mt-2 italic">Processing and redirecting...</p>}
            </div>
          )}

          {scanError && (
            <div className="mt-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 rounded-md">
              <p className="font-medium">Error</p>
              <p className="text-sm">{scanError}</p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6">
        <h2 className="text-lg font-medium mb-2">Troubleshooting</h2>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
          <h3 className="font-medium text-sm mb-2">If the scanner doesn't work:</h3>
          <ol className="list-decimal ml-5 text-sm space-y-2">
            <li>
              <strong>Check camera permissions</strong> - Look for the camera icon in your browser's address bar and
              ensure it's allowed
            </li>
            <li>
              <strong>Try a different browser</strong> - Chrome and Safari generally have the best camera support
            </li>
            <li>
              <strong>Ensure good lighting</strong> - QR codes scan best in well-lit environments
            </li>
            <li>
              <strong>Hold steady</strong> - Keep your device still while scanning
            </li>
          </ol>
        </div>
      </div>
    </div>
  )
}
