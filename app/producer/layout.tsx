import type React from "react"
import { cookies } from "next/headers"

export default function ProducerLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // In a real implementation, we would check if the user has producer role
  // For now, we'll just check if they're connected
  const isConnected = cookies().has("walletAddress")

  // Uncomment to enforce producer role check
  // if (!isConnected) {
  //   redirect("/")
  // }

  return <div className="producer-layout">{children}</div>
}
