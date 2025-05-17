"use client"

import { useEffect, useState, useRef } from "react"

export default function StatsSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => {
      observer.disconnect()
    }
  }, [])

  return (
    <section className="border-y bg-muted/30" ref={sectionRef}>
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div
            className={`flex flex-col transform transition-all hover:scale-105 hover:-translate-y-1 duration-300 ${isVisible ? "fade-in-up" : "opacity-0"}`}
            style={{ transitionDelay: "0ms" }}
          >
            <span className="text-3xl md:text-4xl font-bold text-primary animate-count-up" data-value="142">
              142K+
            </span>
            <span className="text-sm text-muted-foreground mt-1">Tons of Plastic Recycled</span>
          </div>
          <div
            className={`flex flex-col transform transition-all hover:scale-105 hover:-translate-y-1 duration-300 ${isVisible ? "fade-in-up" : "opacity-0"}`}
            style={{ transitionDelay: "200ms" }}
          >
            <span className="text-3xl md:text-4xl font-bold text-primary animate-count-up" data-value="284">
              284K+
            </span>
            <span className="text-sm text-muted-foreground mt-1">Tons of CO₂ Offset</span>
          </div>
          <div
            className={`flex flex-col transform transition-all hover:scale-105 hover:-translate-y-1 duration-300 ${isVisible ? "fade-in-up" : "opacity-0"}`}
            style={{ transitionDelay: "400ms" }}
          >
            <span className="text-3xl md:text-4xl font-bold text-primary animate-count-up" data-value="1.2">
              $1.2M+
            </span>
            <span className="text-sm text-muted-foreground mt-1">Value Generated</span>
          </div>
          <div
            className={`flex flex-col transform transition-all hover:scale-105 hover:-translate-y-1 duration-300 ${isVisible ? "fade-in-up" : "opacity-0"}`}
            style={{ transitionDelay: "600ms" }}
          >
            <span className="text-3xl md:text-4xl font-bold text-primary animate-count-up" data-value="12">
              12K+
            </span>
            <span className="text-sm text-muted-foreground mt-1">Active Participants</span>
          </div>
        </div>
      </div>
    </section>
  )
}
