"use client"

import { useState } from "react"
import { QrCodeGenerator } from "@/components/qr-scanner/qr-code-generator"
import { QrScannerDialog } from "@/components/qr-scanner/qr-scanner-dialog"
import { parseQrCodeData, handleQrCodeData } from "@/lib/qr-code-handler"
import { useRouter } from "next/navigation"

export default function QrTestPageClient() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("generate")
  const [scanResult, setScanResult] = useState<{
    success: boolean
    title: string
    description: string
    url?: string
  } | null>(null)

  const handleScanSuccess = (data: string) => {
    try {
      const parsedData = parseQrCodeData(data)
      const handledData = handleQrCodeData(parsedData)

      setScanResult({
        success: true,
        title: handledData.title,
        description: handledData.description,
        url: handledData.url,
      })
    } catch (err) {
      console.error("Error handling QR code data", err)
      setScanResult({
        success: false,
        title: "Error Processing QR Code",
        description: "There was an error processing the QR code data. Please try again.",
      })
    }
  }

  const handleNavigate = () => {
    if (scanResult?.url) {
      router.push(scanResult.url)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">QR Code Testing</h1>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <QrCodeGenerator className="h-full" />
        </div>

        <div className="flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg p-8">
          <h2 className="text-2xl font-semibold mb-6">Test Scanner</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8 text-center">
            Generate a QR code on the left, then use the scanner below to test scanning functionality.
          </p>

          <QrScannerDialog
            triggerText="Open Scanner"
            title="Test QR Scanner"
            description="Scan the generated QR code to test the functionality"
            size="lg"
          />

          <p className="mt-8 text-sm text-gray-500 dark:text-gray-400 text-center">
            You can also navigate to the{" "}
            <a href="/scan" className="text-blue-500 hover:underline">
              dedicated scanner page
            </a>{" "}
            for a full-screen scanning experience.
          </p>
        </div>
      </div>
    </div>
  )
}
