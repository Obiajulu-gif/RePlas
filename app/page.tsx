"use client"

import dynamic from "next/dynamic"
import { useEffect, useState } from "react"
import { AnimationProvider } from "@/components/animation-provider"
import ValuePropositions from "@/components/value-propositions"
import StatsSection from "@/components/stats-section"
import PartnersSection from "@/components/partners-section"
import Footer from "@/components/footer"

// Import components with Three.js with no SSR
const HeroSection = dynamic(() => import("@/components/hero-section"), { ssr: false })
const HowItWorks = dynamic(() => import("@/components/how-it-works"), { ssr: false })
const Tokenomics = dynamic(() => import("@/components/tokenomics"), { ssr: false })
const Testimonials = dynamic(() => import("@/components/testimonials"), { ssr: false })
const CtaSection = dynamic(() => import("@/components/cta-section"), { ssr: false })

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

export default function LandingPage() {
  return (
    <ClientOnly>
      <AnimationProvider>
        <main className="flex-1">
          <HeroSection />
          <StatsSection />
          <ValuePropositions />
          <HowItWorks />
          <Tokenomics />
          <PartnersSection />
          <Testimonials />
          <CtaSection />
        </main>
        <Footer />
      </AnimationProvider>
    </ClientOnly>
  )
}
