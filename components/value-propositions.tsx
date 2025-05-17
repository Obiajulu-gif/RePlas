"use client"

import { useRef, useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Database, LineChart, Coins, Cpu } from "lucide-react"

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
      icon: <Database className="h-12 w-12 text-primary" />,
      title: "Traceability",
      description: "Immutable tracking of plastic waste from source to recycling, powered by Celo blockchain.",
    },
    {
      icon: <LineChart className="h-12 w-12 text-primary" />,
      title: "Transparency",
      description:
        "Real-time data and analytics to monitor the environmental impact and efficiency of recycling processes.",
    },
    {
      icon: <Coins className="h-12 w-12 text-primary" />,
      title: "Incentives",
      description: "Earn rewards and tokens for participating in sustainable practices.",
    },
    {
      icon: <Cpu className="h-12 w-12 text-primary" />,
      title: "Efficiency",
      description: "AI-driven optimization of waste collection and recycling logistics.",
    },
  ]

  return (
    <section className="py-20 md:py-24 lg:py-32" id="features" ref={sectionRef}>
      <div className="container">
        <div className={`text-center max-w-3xl mx-auto mb-16 ${isVisible ? "fade-in-up" : "opacity-0"}`}>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Key Benefits of Our Platform</h2>
          <p className="text-xl text-muted-foreground">
            Our blockchain-powered platform offers unique advantages for all participants in the plastic recycling
            ecosystem.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className={`bg-background/60 backdrop-blur transition-all hover:shadow-lg hover:-translate-y-2 duration-300 group ${isVisible ? "fade-in-up" : "opacity-0"}`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <CardHeader>
                <div className="mb-4 transform transition-transform group-hover:scale-110 duration-300">
                  {feature.icon}
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
