"use client"

import { useState, useEffect } from "react"
import { AnimatedElement } from "@/components/animation-provider"
import dynamic from "next/dynamic"
import { Skeleton } from "@/components/ui/skeleton"
import ValueChain3D from "@/components/value-chain-3d"

// Dynamically import the 3D recycling process component to avoid SSR issues
const RecyclingProcess3D = dynamic(() => import("@/components/3d-recycling-process"), {
  ssr: false,
  loading: () => <Skeleton className="w-full h-[400px] rounded-lg" />,
})

export default function HowItWorks() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])
   const [mounted, setMounted] = useState(false)
  
    // Ensure components only render on client-side
    useEffect(() => {
      setMounted(true)
    }, [])

  return (
    <section className="py-20 md:py-24 lg:py-32 bg-muted/30" id="how-it-works">
      <div className="container">
        <AnimatedElement
          id="how-it-works-heading"
          animation="fade-in-up"
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">How Our Platform Works</h2>
          <p className="text-xl text-muted-foreground">
            Our platform connects all stakeholders in the plastic value chain, from producers to recyclers to consumers,
            creating a transparent and incentivized ecosystem for sustainable plastic management.
          </p>
        </AnimatedElement>

        {/* Value Chain 3D Animation */}
        <AnimatedElement id="value-chain-3d" animation="fade-in" className="mb-16">
          <div className="bg-card rounded-lg shadow-lg p-6 overflow-hidden">
            {mounted && <ValueChain3D height={50} />}
          </div>
        </AnimatedElement>

        <AnimatedElement id="recycling-process" animation="fade-in-up" delay={200}>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-4">Transparent Recycling Process</h3>
              <p className="text-muted-foreground mb-6">
                Every step of the recycling process is tracked on the blockchain, ensuring complete transparency and
                accountability. From collection to processing to reuse, our platform provides real-time visibility into
                the journey of plastic materials.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-emerald-600/10 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-emerald-600 font-medium">1</span>
                  </div>
                  <div>
                    <span className="font-medium">Collection & Sorting</span>
                    <p className="text-sm text-muted-foreground">
                      Plastic waste is collected and sorted by type, with each batch assigned a unique identifier.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-emerald-600/10 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-emerald-600 font-medium">2</span>
                  </div>
                  <div>
                    <span className="font-medium">Processing & Transformation</span>
                    <p className="text-sm text-muted-foreground">
                      Sorted plastic is processed into recycled materials, with quality checks recorded on the
                      blockchain.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-emerald-600/10 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-emerald-600 font-medium">3</span>
                  </div>
                  <div>
                    <span className="font-medium">Verification & Certification</span>
                    <p className="text-sm text-muted-foreground">
                      The recycled material is verified and certified, with tokens issued to reward participants.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-emerald-600/10 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-emerald-600 font-medium">4</span>
                  </div>
                  <div>
                    <span className="font-medium">Reuse & Impact Tracking</span>
                    <p className="text-sm text-muted-foreground">
                      Recycled materials are used in new products, with environmental impact metrics tracked and shared.
                    </p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="bg-card rounded-lg shadow-lg overflow-hidden h-[400px]">
              <img
                src="/recycling-process-diagram.png"
                alt="Recycling Process Diagram"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </AnimatedElement>
      </div>
    </section>
  )
}
