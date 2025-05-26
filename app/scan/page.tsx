import type { Metadata } from "next"

import PlasticScanPage from "./plastic-scan-page"

export const metadata: Metadata = {
  title: "Plastic Scanner | RePlas",
  description: "Scan plastic items to identify type and recycling information",
}

export default function ScanPage() {
  return <PlasticScanPage />
}
