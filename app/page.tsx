"use client"

import dynamic from "next/dynamic"
import { useEffect, useState, Suspense } from "react"
import { AnimationProvider } from "@/components/animation-provider"
import ValuePropositions from "@/components/value-propositions"
import StatsSection from "@/components/stats-section"
import PartnersSection from "@/components/partners-section"
import Footer from "@/components/footer"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ErrorBoundary } from "@/components/error-boundary"

// Loading component
function LoadingComponent({ height = "400px" }) {
  return (
    <div className="w-full py-8" style={{ height }}>
      <Skeleton className="w-full h-full rounded-lg" />
    </div>
  )
}

// Fallback component for when dynamic imports fail
function FallbackComponent({ name }) {
  return (
    <div className="w-full py-12 bg-muted/30">
      <div className="container">
        <div className="flex flex-col items-center justify-center text-center p-6">
          <AlertCircle className="h-12 w-12 text-amber-500 mb-4" />
          <h2 className="text-2xl font-bold mb-2">{name} could not be loaded</h2>
          <p className="text-muted-foreground mb-4">
            There was an issue loading this section. Please try refreshing the page.
          </p>
          <Button onClick={() => window.location.reload()}>Refresh Page</Button>
        </div>
      </div>
    </div>
  )
}

// Import components with error handling
const HeroSection = dynamic(
  () => import("@/components/hero-section").catch(() => () => <FallbackComponent name="Hero Section" />),
  { ssr: false, loading: () => <LoadingComponent height="600px" /> },
)

const HowItWorks = dynamic(
  () => import("@/components/how-it-works").catch(() => () => <FallbackComponent name="How It Works" />),
  { ssr: false, loading: () => <LoadingComponent height="500px" /> },
)

const Tokenomics = dynamic(
  () => import("@/components/tokenomics").catch(() => () => <FallbackComponent name="Tokenomics" />),
  { ssr: false, loading: () => <LoadingComponent height="400px" /> },
)

const Testimonials = dynamic(
  () => import("@/components/testimonials").catch(() => () => <FallbackComponent name="Testimonials" />),
  { ssr: false, loading: () => <LoadingComponent height="400px" /> },
)

const CtaSection = dynamic(
  () => import("@/components/cta-section").catch(() => () => <FallbackComponent name="CTA Section" />),
  { ssr: false, loading: () => <LoadingComponent height="300px" /> },
)

// Client-only wrapper component
function ClientOnly({ children }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return children
}

// Image preloader to ensure images are loaded before rendering
function ImagePreloader() {
  const imagesToPreload = [
    "/sustainable-recycling-hero.png",
    "/user-avatar-1.jpg",
    "/user-avatar-2.jpg",
    "/user-avatar-3.jpg",
    "/logo.png",
    "/recycling-process-diagram.png",
    "/track-icon.png",
    "/trace-icon.png",
    "/transform-icon.png",
    "/reward-icon.png",
  ]

  useEffect(() => {
    // Preload images
    imagesToPreload.forEach((src) => {
      const img = new Image()
      img.src = src
    })
  }, [])

  return null
}

export default function LandingPage() {
  return (
    <ClientOnly>
      <ImagePreloader />
      <AnimationProvider>
        <ErrorBoundary>
          <main className="flex-1">
            <Suspense fallback={<LoadingComponent height="600px" />}>
              <HeroSection />
            </Suspense>

            <ErrorBoundary fallback={<FallbackComponent name="Stats Section" />}>
              <StatsSection />
            </ErrorBoundary>

            <ErrorBoundary fallback={<FallbackComponent name="Value Propositions" />}>
              <ValuePropositions />
            </ErrorBoundary>

            <Suspense fallback={<LoadingComponent height="500px" />}>
              <HowItWorks />
            </Suspense>

            <Suspense fallback={<LoadingComponent height="400px" />}>
              <Tokenomics />
            </Suspense>

            <ErrorBoundary fallback={<FallbackComponent name="Partners Section" />}>
              <PartnersSection />
            </ErrorBoundary>

            <Suspense fallback={<LoadingComponent height="400px" />}>
              <Testimonials />
            </Suspense>

            <Suspense fallback={<LoadingComponent height="300px" />}>
              <CtaSection />
            </Suspense>
          </main>
          <Footer />
        </ErrorBoundary>
      </AnimationProvider>
    </ClientOnly>
  )
}
