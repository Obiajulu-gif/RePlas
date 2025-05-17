"use client"

import { useEffect, useState } from "react"
import { SafeImage } from "@/components/ui/safe-image"
import { AnimatedElement } from "@/components/animation-provider"
import { cn } from "@/lib/utils"

export default function PartnersSection() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const partners = [
    {
      name: "Celo Foundation",
      logo: "/celo-logo.png",
    },
    {
      name: "EcoRecycle",
      logo: "/eco-recycle-logo.png",
    },
    {
      name: "GreenTech Innovations",
      logo: "/greentech-logo.png",
    },
    {
      name: "Sustainable Packaging Alliance",
      logo: "/sustainable-packaging-logo.png",
    },
    {
      name: "Ocean Cleanup Initiative",
      logo: "/ocean-cleanup-logo.png",
    },
    {
      name: "Circular Economy Institute",
      logo: "/circular-economy-logo.png",
    },
    // Duplicate partners for continuous scrolling effect
    {
      name: "Celo Foundation",
      logo: "/celo-logo.png",
    },
    {
      name: "EcoRecycle",
      logo: "/eco-recycle-logo.png",
    },
    {
      name: "GreenTech Innovations",
      logo: "/greentech-logo.png",
    },
    {
      name: "Sustainable Packaging Alliance",
      logo: "/sustainable-packaging-logo.png",
    },
    {
      name: "Ocean Cleanup Initiative",
      logo: "/ocean-cleanup-logo.png",
    },
    {
      name: "Circular Economy Institute",
      logo: "/circular-economy-logo.png",
    },
  ]

  return (
    <section className="py-16 md:py-20" id="partners">
      <div className="container">
        <AnimatedElement id="partners-heading" animation="fade-in-up" className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-4">Trusted by Industry Leaders</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We're partnering with organizations across the plastic value chain to create a more sustainable future
          </p>
        </AnimatedElement>

        {/* Marquee effect for partner logos */}
        <div className="relative w-full overflow-hidden py-6 bg-muted/30 rounded-lg">
          {/* Gradient overlays for smooth fade effect */}
          <div className="absolute left-0 top-0 bottom-0 w-16 z-10 bg-gradient-to-r from-background to-transparent"></div>
          <div className="absolute right-0 top-0 bottom-0 w-16 z-10 bg-gradient-to-l from-background to-transparent"></div>

          <div className={cn("flex items-center gap-12 w-max animate-marquee", mounted ? "opacity-100" : "opacity-0")}>
            {partners.map((partner, index) => (
              <div key={index} className="flex justify-center px-4">
                <SafeImage
                  src={partner.logo}
                  alt={partner.name}
                  width={180}
                  height={60}
                  className="h-12 w-auto transition-all hover:scale-110 duration-300 filter hover:brightness-125"
                  fallbackSrc="/generic-company-logo.png"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
