import type { Metadata } from "next"
import QrScannerPage from "./qr-scanner-page"

export const metadata: Metadata = {
  title: "QR Code Scanner | Plastic Waste Management",
  description: "Scan QR codes to track plastic waste batches and products",
}

export default function ScanPage() {
  return <QrScannerPage />
}
