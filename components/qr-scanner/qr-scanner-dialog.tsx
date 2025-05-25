"use client"

import { useState } from "react"
import { Info, Scan, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { QrScanner } from "./qr-scanner"
import { handleQrCodeData } from "@/lib/qr-code-handler"
import { useRouter } from "next/navigation"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface QrScannerDialogProps {
  triggerText?: string
  title?: string
  description?: string
  onScanSuccess?: (data: string, result: any) => void
  className?: string
  variant?: "default" | "outline" | "secondary" | "destructive" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  icon?: boolean
}

export function QrScannerDialog({
  triggerText = "Scan QR Code",
  title = "Scan QR Code",
  description = "Position the QR code within the frame to scan",
  onScanSuccess,
  className,
  variant = "default",
  size = "default",
  icon = true,
}: QrScannerDialogProps) {
  const [open, setOpen] = useState(false)
  const [scanResult, setScanResult] = useState<string | null>(null)
  const [scanError, setScanError] = useState<string | null>(null)
  const router = useRouter()

  const handleScanSuccess = async (decodedText: string, decodedResult: any) => {
    setScanResult(decodedText)
    setScanError(null)

    try {
      // Process the QR code data
      const result = await handleQrCodeData(decodedText)

      // Call the custom success handler if provided
      if (onScanSuccess) {
        onScanSuccess(decodedText, decodedResult)
      }

      // Close the dialog after successful scan
      setTimeout(() => {
        setOpen(false)

        // If the handler returned a URL, navigate to it
        if (result?.url) {
          router.push(result.url)
        }
      }, 1500)
    } catch (error) {
      console.error("Error handling QR code data:", error)
      setScanError(error instanceof Error ? error.message : "Failed to process QR code")
    }
  }

  const handleScanError = (error: Error) => {
    setScanError(error.message)
    setScanResult(null)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={variant} size={size} className={className}>
          {icon && <Scan className="mr-2 h-4 w-4" />}
          {triggerText}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <Alert className="mb-4">
          <Info className="h-4 w-4 mr-2" />
          <AlertDescription>
            This feature requires camera access. When prompted, please click "Allow" to enable the QR code scanner.
          </AlertDescription>
        </Alert>

        <div className="flex flex-col items-center py-4">
          <QrScanner onScanSuccess={handleScanSuccess} onScanError={handleScanError} />

          {scanResult && (
            <div className="mt-4 p-3 bg-green-100 text-green-800 rounded-md w-full">
              <p className="font-medium">QR Code Detected!</p>
              <p className="text-sm truncate">{scanResult}</p>
            </div>
          )}

          {scanError && (
            <div className="mt-4 p-3 bg-red-100 text-red-800 rounded-md w-full">
              <p className="font-medium">Error</p>
              <p className="text-sm">{scanError}</p>
            </div>
          )}
        </div>

        <div className="flex justify-end">
          <Button variant="outline" onClick={() => setOpen(false)}>
            <X className="mr-2 h-4 w-4" />
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
