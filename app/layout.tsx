import type React from "react"
import "@/app/globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import Navbar from "@/components/navbar"
import { WalletProvider } from "@/components/wallet-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "RePlas - Blockchain Plastic Recycling Platform",
  description: "Track, trace, and transform plastic waste into value on the blockchain.",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
    generator: 'v0.dev'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <WalletProvider>
            <div className="relative flex min-h-screen flex-col">
              <Navbar />
              {children}
            </div>
          </WalletProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
