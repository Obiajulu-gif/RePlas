import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { WalletProvider } from "@/components/wallet-provider"
import { Toaster } from "@/components/ui/toaster"
import Navbar from "@/components/navbar"
import { ErrorBoundary } from "@/components/error-boundary"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "RePlas - Decentralized Plastic Waste Management",
  description: "Tokenizing plastic waste traceability on Celo blockchain with AI-powered analytics",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <WalletProvider>
            <ErrorBoundary>
              <div className="flex min-h-screen flex-col">
                <Navbar />
                <main className="flex-1">{children}</main>
              </div>
              <Toaster />
            </ErrorBoundary>
          </WalletProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
