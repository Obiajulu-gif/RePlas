import QrTestPageClient from "./QrTestPageClient"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "QR Code Test | Plastic Waste Management",
  description: "Test QR code generation and scanning functionality",
}

export default function QrTestPage() {
  return <QrTestPageClient />
}
