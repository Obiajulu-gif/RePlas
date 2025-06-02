"use client"

import { useState, useEffect } from "react"
import { QrScanner } from "@/components/qr-scanner/qr-scanner"
import { handleQrCodeData } from "@/lib/qr-code-handler"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Camera, Info, AlertCircle, Scan, QrCode, Sparkles } from "lucide-react"
import Link from "next/link"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { motion } from "framer-motion"

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
    <div className="min-h-screen bg-gradient-to-b from-white to-green-50 dark:from-gray-900 dark:to-green-950/30">
    <div className="container max-w-md mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <Link href="/" passHref>
            <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-800 hover:bg-white/50 dark:text-gray-300 dark:hover:text-gray-100 dark:hover:bg-gray-800/50 backdrop-blur-sm rounded-xl">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center">
            <QrCode className="mr-2 h-6 w-6 text-green-500" />
            QR Code Scanner
          </h1>
        <div className="w-10"></div> {/* Spacer for alignment */}
      </div>

      {!isBrowserSupported ? (
          <Alert variant="destructive" className="mb-6 border-0 bg-red-50 dark:bg-red-950/50 rounded-xl shadow-sm">
          <Camera className="h-4 w-4 mr-2" />
          <AlertTitle>Browser Not Supported</AlertTitle>
          <AlertDescription>
            Your browser doesn't support camera access. Please try using a different browser like Chrome, Firefox, or
            Safari.
          </AlertDescription>
        </Alert>
      ) : (
          <Alert className="mb-6 border-0 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/50 dark:to-emerald-950/50 shadow-sm rounded-xl backdrop-blur-sm">
            <div className="p-1 bg-white dark:bg-gray-800 rounded-full mr-2">
              <Info className="h-4 w-4 text-green-600 dark:text-green-400" />
            </div>
            <AlertTitle className="text-gray-900 dark:text-gray-100 font-medium">Camera Permission Required</AlertTitle>
            <AlertDescription className="text-gray-600 dark:text-gray-300">
            This feature requires camera access. When prompted, please click "Allow" to enable the QR code scanner.
          </AlertDescription>
        </Alert>
      )}

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden mb-6 border border-gray-100 dark:border-gray-700">
        <div className="p-4">
            <div className="flex items-center mb-4 text-amber-600 dark:text-amber-400 bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-950/50 dark:to-amber-900/30 p-3 rounded-lg">
              <div className="p-1 bg-white dark:bg-gray-800 rounded-full mr-2 border border-amber-200 dark:border-amber-800">
                <Scan className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              </div>
            <p className="text-sm">Position the QR code within the frame to scan</p>
          </div>

            <div className="relative">
              <QrScanner 
                onScanSuccess={handleScanSuccess} 
                onScanError={handleScanError} 
                className="mb-4 rounded-xl overflow-hidden border-2 border-green-100 dark:border-green-900/50 shadow-inner" 
              />
              
              {/* Decorative corners */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-green-500 rounded-tl-lg pointer-events-none"></div>
              <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-green-500 rounded-tr-lg pointer-events-none"></div>
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-green-500 rounded-bl-lg pointer-events-none"></div>
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-green-500 rounded-br-lg pointer-events-none"></div>
            </div>

          {scanResult && (
              <div className="mt-4 p-4 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 text-green-800 dark:text-green-300 rounded-lg border border-green-200 dark:border-green-800/50 shadow-sm">
                <div className="flex items-center mb-2">
                  <div className="w-8 h-8 bg-white dark:bg-gray-800 rounded-full border-2 border-green-300 dark:border-green-700 flex items-center justify-center mr-2">
                    <QrCode className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </div>
              <p className="font-medium">QR Code Detected!</p>
                </div>
                <div className="pl-10">
                  <p className="text-sm break-all font-mono bg-white/50 dark:bg-gray-900/50 p-2 rounded border border-green-200 dark:border-green-800 text-gray-800 dark:text-gray-200">{scanResult}</p>
                  {isProcessing && (
                    <div className="flex items-center mt-2 text-sm">
                      <div className="w-4 h-4 border-2 border-green-500 border-t-transparent rounded-full animate-spin mr-2"></div>
                      <p className="italic">Processing and redirecting...</p>
                    </div>
                  )}
                </div>
            </div>
          )}

          {scanError && (
              <div className="mt-4 p-4 bg-gradient-to-r from-red-100 to-red-50 dark:from-red-900/30 dark:to-red-900/20 text-red-800 dark:text-red-300 rounded-lg border border-red-200 dark:border-red-800/50 shadow-sm">
                <div className="flex items-center mb-2">
                  <div className="w-8 h-8 bg-white dark:bg-gray-800 rounded-full border-2 border-red-300 dark:border-red-700 flex items-center justify-center mr-2">
                    <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                  </div>
              <p className="font-medium">Error</p>
                </div>
                <p className="text-sm pl-10">{scanError}</p>
            </div>
          )}
        </div>
      </div>

        <div className="mb-8">
          <div className="flex items-center mb-3">
            <Camera className="h-5 w-5 mr-2 text-green-500" />
            <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">Troubleshooting</h2>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-100 dark:border-gray-700">
            <h3 className="font-medium text-sm mb-3 text-gray-800 dark:text-gray-200">If the scanner doesn't work:</h3>
            <ol className="space-y-3 ml-1">
              <li className="flex items-start">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400 font-medium mr-3 mt-0.5">1</div>
                <div>
                  <strong className="text-gray-800 dark:text-gray-200 text-sm">Check camera permissions</strong> 
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">Look for the camera icon in your browser's address bar and ensure it's allowed</p>
                </div>
            </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400 font-medium mr-3 mt-0.5">2</div>
                <div>
                  <strong className="text-gray-800 dark:text-gray-200 text-sm">Try a different browser</strong>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">Chrome and Safari generally have the best camera support</p>
                </div>
            </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400 font-medium mr-3 mt-0.5">3</div>
                <div>
                  <strong className="text-gray-800 dark:text-gray-200 text-sm">Ensure good lighting</strong>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">QR codes scan best in well-lit environments</p>
                </div>
            </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400 font-medium mr-3 mt-0.5">4</div>
                <div>
                  <strong className="text-gray-800 dark:text-gray-200 text-sm">Hold steady</strong>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">Keep your device still while scanning</p>
                </div>
            </li>
          </ol>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-gray-500 dark:text-gray-400">
          <p>Powering sustainable recycling with AI</p>
          <div className="flex items-center justify-center mt-2">
            <Sparkles className="h-3 w-3 mr-1 text-green-500" />
            <span>RePlas &copy; {new Date().getFullYear()}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
