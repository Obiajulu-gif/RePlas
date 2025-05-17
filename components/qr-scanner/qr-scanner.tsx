"use client"

import { useState, useEffect, useRef } from "react"
import { Html5Qrcode, Html5QrcodeScannerState } from "html5-qrcode"
import { AlertCircle, Camera, CheckCircle2, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export interface QrScannerProps {
  onScanSuccess: (decodedText: string, decodedResult: any) => void
  onScanFailure?: (error: string) => void
  onScanError?: (error: Error) => void
  className?: string
  scanDelay?: number
  constraints?: MediaTrackConstraints
  qrbox?: number | { width: number; height: number }
  aspectRatio?: string
  disableFlip?: boolean
}

export function QrScanner({
  onScanSuccess,
  onScanFailure,
  onScanError,
  className,
  scanDelay = 500,
  constraints = { facingMode: "environment" },
  qrbox,
  aspectRatio = "4/3",
  disableFlip = false,
}: QrScannerProps) {
  const [scanning, setScanning] = useState(false)
  const [permissionDenied, setPermissionDenied] = useState(false)
  const [permissionDismissed, setPermissionDismissed] = useState(false)
  const [scannerInitialized, setScannerInitialized] = useState(false)
  const [facingMode, setFacingMode] = useState<"environment" | "user">("environment")
  const [lastScanned, setLastScanned] = useState<string | null>(null)
  const [scannerMessage, setScannerMessage] = useState<string | null>(null)
  const [scannerStatus, setScannerStatus] = useState<"idle" | "scanning" | "success" | "error">("idle")
  const [cameraSupported, setCameraSupported] = useState(true)

  const scannerRef = useRef<Html5Qrcode | null>(null)
  const scannerContainerId = "qr-scanner-container"

  // Check camera support
  useEffect(() => {
    if (typeof window === "undefined") return

    // Check if camera is available
    if (!navigator?.mediaDevices?.getUserMedia) {
      setCameraSupported(false)
      setScannerMessage("Camera access is not supported by your browser")
      setScannerStatus("error")
      return
    }

    // Test camera access without starting scanner
    const testCameraAccess = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true })
        // Stop the stream immediately after testing
        stream.getTracks().forEach((track) => track.stop())
        setPermissionDenied(false)
        setPermissionDismissed(false)
      } catch (error) {
        console.log("Camera permission test failed:", error)
        if (error instanceof Error) {
          if (error.name === "NotAllowedError") {
            setPermissionDenied(true)
          } else if (error.name === "NotFoundError") {
            setCameraSupported(false)
            setScannerMessage("No camera found on this device")
          }
        }
      }
    }

    testCameraAccess()
  }, [])

  // Initialize scanner
  useEffect(() => {
    if (typeof window === "undefined" || !cameraSupported) return

    // Initialize scanner
    if (!scannerRef.current) {
      scannerRef.current = new Html5Qrcode(scannerContainerId)
      setScannerInitialized(true)
    }

    // Cleanup on unmount
    return () => {
      if (scannerRef.current?.getState() === Html5QrcodeScannerState.SCANNING) {
        scannerRef.current.stop().catch((error) => console.error("Error stopping scanner:", error))
      }
      scannerRef.current?.clear()
    }
  }, [cameraSupported])

  // Start/stop scanning based on scanning state
  useEffect(() => {
    if (!scannerInitialized || !cameraSupported || permissionDenied) return

    const startScanning = async () => {
      try {
        setScannerStatus("scanning")
        setScannerMessage("Scanning for QR code...")

        await scannerRef.current?.start(
          { facingMode },
          {
            fps: 10,
            qrbox,
            aspectRatio,
            disableFlip,
          },
          (decodedText, decodedResult) => {
            // Prevent duplicate scans
            if (lastScanned === decodedText) return

            setLastScanned(decodedText)
            setScannerStatus("success")
            setScannerMessage("QR code detected!")

            // Call success callback
            onScanSuccess(decodedText, decodedResult)

            // Reset after success
            setTimeout(() => {
              setLastScanned(null)
              setScannerStatus("scanning")
              setScannerMessage("Scanning for QR code...")
            }, 2000)
          },
          (errorMessage) => {
            // This is called for non-fatal scanning failures
            if (onScanFailure) onScanFailure(errorMessage)
          },
        )
      } catch (error) {
        console.error("Error starting scanner:", error)

        // Check if error is permission denied
        if (error instanceof Error) {
          if (error.message.includes("permission") || error.name === "NotAllowedError") {
            setPermissionDenied(true)
            setScannerMessage("Camera permission denied. Please allow camera access.")
          } else if (error.message.includes("dismissed") || error.message.includes("getUserMedia")) {
            setPermissionDismissed(true)
            setScannerMessage("Camera permission request was dismissed. Please try again.")
          } else {
            setScannerMessage(`Error: ${error.message}`)
          }
        } else {
          setScannerMessage("Failed to start scanner")
        }

        setScannerStatus("error")
        setScanning(false)
        if (onScanError && error instanceof Error) onScanError(error)
      }
    }

    const stopScanning = async () => {
      if (scannerRef.current?.getState() === Html5QrcodeScannerState.SCANNING) {
        try {
          await scannerRef.current.stop()
          setScannerStatus("idle")
          setScannerMessage(null)
        } catch (error) {
          console.error("Error stopping scanner:", error)
        }
      }
    }

    if (scanning) {
      startScanning()
    } else {
      stopScanning()
    }
  }, [
    scanning,
    scannerInitialized,
    facingMode,
    qrbox,
    aspectRatio,
    disableFlip,
    lastScanned,
    onScanSuccess,
    onScanFailure,
    onScanError,
    cameraSupported,
    permissionDenied,
  ])

  // Toggle camera
  const toggleCamera = () => {
    if (scanning) {
      // Stop scanner first
      if (scannerRef.current?.getState() === Html5QrcodeScannerState.SCANNING) {
        scannerRef.current
          .stop()
          .then(() => {
            setFacingMode((prev) => (prev === "environment" ? "user" : "environment"))
          })
          .catch((error) => console.error("Error stopping scanner:", error))
      }
    } else {
      setFacingMode((prev) => (prev === "environment" ? "user" : "environment"))
    }
  }

  // Reset permission state and try again
  const handleRetry = () => {
    setPermissionDenied(false)
    setPermissionDismissed(false)
    setScannerStatus("idle")
    setScannerMessage(null)
  }

  // Render camera not supported message
  if (!cameraSupported) {
    return (
      <div className={cn("flex flex-col items-center p-4", className)}>
        <div className="bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 p-4 rounded-md mb-4 w-full">
          <h3 className="font-medium flex items-center">
            <AlertCircle className="w-5 h-5 mr-2" />
            Camera Not Available
          </h3>
          <p className="mt-2 text-sm">
            Your device or browser doesn't support camera access. Please try using a different device or browser.
          </p>
        </div>
        <div className="aspect-[4/3] w-full max-w-md bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
          <div className="text-center p-4">
            <Camera className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-500 dark:text-gray-400">Camera access is not available</p>
          </div>
        </div>
      </div>
    )
  }

  // Render permission denied message
  if (permissionDenied) {
    return (
      <div className={cn("flex flex-col items-center p-4", className)}>
        <div className="bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 p-4 rounded-md mb-4 w-full">
          <h3 className="font-medium flex items-center">
            <AlertCircle className="w-5 h-5 mr-2" />
            Camera Permission Required
          </h3>
          <p className="mt-2 text-sm">
            Camera access was denied. Please enable camera access in your browser settings and try again.
          </p>
          <div className="mt-3 text-sm">
            <strong>How to enable camera access:</strong>
            <ol className="list-decimal ml-5 mt-1 space-y-1">
              <li>Click the camera or lock icon in your browser's address bar</li>
              <li>Select "Allow" for camera access</li>
              <li>Refresh the page and try again</li>
            </ol>
          </div>
        </div>
        <div className="aspect-[4/3] w-full max-w-md bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
          <div className="text-center p-4">
            <Camera className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-500 dark:text-gray-400 mb-4">Camera access is blocked</p>
            <Button onClick={handleRetry} className="mx-auto">
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={cn("flex flex-col items-center", className)}>
      <div className="relative w-full max-w-md overflow-hidden rounded-lg bg-black">
        {/* Scanner container */}
        <div id={scannerContainerId} className="aspect-[4/3] w-full" />

        {/* Scanner overlay */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Scanner frame */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-2/3 h-2/3 border-2 border-white/50 rounded-lg">
              {/* Scanner corners */}
              <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-green-500"></div>
              <div className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 border-green-500"></div>
              <div className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 border-green-500"></div>
              <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-green-500"></div>
            </div>
          </div>

          {/* Scanner animation */}
          {scanning && scannerStatus === "scanning" && (
            <div className="absolute inset-x-0 top-1/2 h-0.5 bg-green-500 animate-scan-line"></div>
          )}

          {/* Status indicator */}
          <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
            <div className="flex items-center gap-2 text-white">
              {scannerStatus === "scanning" && <Camera className="w-5 h-5 text-white animate-pulse" />}
              {scannerStatus === "success" && <CheckCircle2 className="w-5 h-5 text-green-500" />}
              {scannerStatus === "error" && <AlertCircle className="w-5 h-5 text-red-500" />}
              <span>{scannerMessage || "Ready to scan"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-2 mt-4">
        <Button
          variant={scanning ? "destructive" : "default"}
          onClick={() => setScanning(!scanning)}
          className="flex-1"
        >
          {scanning ? "Stop Scanning" : "Start Scanning"}
        </Button>

        {!disableFlip && (
          <Button variant="outline" onClick={toggleCamera} disabled={!scannerInitialized}>
            Flip Camera
          </Button>
        )}
      </div>

      {/* Permission dismissed message */}
      {permissionDismissed && (
        <div className="mt-4 p-3 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 rounded-md">
          <p className="text-sm font-medium">Camera permission request was dismissed</p>
          <p className="text-xs mt-1">Please click "Start Scanning" again and allow camera access when prompted.</p>
        </div>
      )}
    </div>
  )
}
