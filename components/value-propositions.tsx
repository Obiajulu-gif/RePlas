"use client"

import { useRef, useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Database, LineChart, Coins, Cpu, Recycle, Shield, Globe, Award } from "lucide-react"
import Image from "next/image"
import { AnimatedElement } from "@/components/animation-provider"

export default function ValuePropositions() {
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

  const features = [
    {
      icon: <Database className="h-12 w-12 text-emerald-600" />,
      title: "Blockchain Traceability",
      description: "Immutable tracking of plastic waste from source to recycling, powered by Celo blockchain.",
      image: "/track-icon.png",
    },
    {
      icon: <Shield className="h-12 w-12 text-emerald-600" />,
      title: "Transparent Verification",
      description: "Real-time data and analytics to monitor the environmental impact and recycling processes.",
      image: "/trace-icon.png",
    },
    {
      icon: <Coins className="h-12 w-12 text-emerald-600" />,
      title: "Token Incentives",
      description: "Earn rewards and tokens for participating in sustainable recycling practices.",
      image: "/reward-icon.png",
    },
    {
      icon: <Cpu className="h-12 w-12 text-emerald-600" />,
      title: "AI-Powered Optimization",
      description: "AI-driven optimization of waste collection and recycling logistics.",
      image: "/transform-icon.png",
    },
    {
      icon: <Recycle className="h-12 w-12 text-emerald-600" />,
      title: "Circular Economy",
      description: "Promote and enable a circular economy for plastic materials and products.",
      image: "/recycling-symbols.png",
    },
    {
      icon: <Globe className="h-12 w-12 text-emerald-600" />,
      title: "Global Impact",
      description: "Connect with a worldwide network of recyclers, producers, and sustainability advocates.",
      image: "/diverse-group.png",
    },
    {
      icon: <LineChart className="h-12 w-12 text-emerald-600" />,
      title: "Impact Analytics",
      description: "Measure and visualize your environmental impact with comprehensive analytics.",
      image: "/blockchain-visualization.png",
    },
    {
      icon: <Award className="h-12 w-12 text-emerald-600" />,
      title: "Certification & Compliance",
      description: "Easily meet regulatory requirements and gain sustainability certifications.",
      image: "/digital-token.png",
    },
  ]

  return (
    <section className="py-20 md:py-24 lg:py-32" id="features" ref={sectionRef}>
      <div className="container">
        <AnimatedElement id="features-heading" animation="fade-in-up" className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center justify-center rounded-full bg-emerald-600/10 px-3 py-1 text-sm font-semibold text-emerald-600 mb-4">
            Platform Features
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Transforming Plastic Waste Management</h2>
          <p className="text-xl text-muted-foreground">
            Our blockchain-powered platform offers unique advantages for all participants in the plastic recycling
            ecosystem.
          </p>
        </AnimatedElement>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className={`bg-background/60 backdrop-blur transition-all hover:shadow-lg hover:-translate-y-2 duration-300 group border-emerald-600/10 hover:border-emerald-600/30 ${
                isVisible ? "fade-in-up" : "opacity-0"
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <CardHeader className="pb-2">
                <div className="mb-4 transform transition-transform group-hover:scale-110 duration-300 flex items-center justify-between">
                  {feature.icon}
                  <div className="h-10 w-10 rounded-full bg-emerald-600/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Image
                      src={feature.image || "/placeholder.svg"}
                      alt={feature.title}
                      width={24}
                      height={24}
                      className="object-contain"
                    />
                  </div>
                </div>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
