import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { AnimatedElement } from "@/components/animation-provider"
import RecyclingProcessVisualization from "@/components/3d-recycling-process"

export default function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Track",
      description: "Plastic producers register and tag batches with unique QR codes on the blockchain.",
      icon: "/track-icon.png",
    },
    {
      number: "02",
      title: "Trace",
      description: "Track the journey of plastic waste through the supply chain with complete transparency.",
      icon: "/trace-icon.png",
    },
    {
      number: "03",
      title: "Transform",
      description: "Recycle and convert waste into valuable resources with verified impact.",
      icon: "/transform-icon.png",
    },
    {
      number: "04",
      title: "Reward",
      description: "Earn tokens for participating in sustainable practices and creating positive impact.",
      icon: "/reward-icon.png",
    },
  ]

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
            A simple yet powerful process to revolutionize plastic waste management
          </p>
        </AnimatedElement>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {/* Connecting line */}
          <div className="absolute top-24 left-0 right-0 h-0.5 bg-border hidden lg:block">
            <div className="absolute -top-1.5 left-1/4 h-3 w-3 rounded-full bg-primary animate-ping"></div>
            <div
              className="absolute -top-1.5 left-1/2 h-3 w-3 rounded-full bg-primary animate-ping"
              style={{ animationDelay: "0.5s" }}
            ></div>
            <div
              className="absolute -top-1.5 left-3/4 h-3 w-3 rounded-full bg-primary animate-ping"
              style={{ animationDelay: "1s" }}
            ></div>
            <div
              className="absolute -top-1.5 right-0 h-3 w-3 rounded-full bg-primary animate-ping"
              style={{ animationDelay: "1.5s" }}
            ></div>
          </div>

          {steps.map((step, index) => (
            <AnimatedElement
              key={index}
              id={`step-${index}`}
              animation="fade-in-up"
              delay={index * 200}
              className="flex flex-col items-center text-center"
            >
              <div className="relative mb-8 group">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 transition-all group-hover:bg-primary/20 duration-300">
                  <Image
                    src={step.icon || "/placeholder.svg"}
                    alt={step.title}
                    width={64}
                    height={64}
                    className="h-8 w-8 transition-transform group-hover:scale-110 duration-300"
                  />
                </div>
                <span className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold animate-float">
                  {index + 1}
                </span>
              </div>
              <h3 className="text-xl font-bold mb-2">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>

              {index < steps.length - 1 && (
                <ArrowRight className="h-6 w-6 mt-4 text-primary hidden md:block lg:hidden animate-bounce-horizontal" />
              )}
            </AnimatedElement>
          ))}
        </div>

        <AnimatedElement id="recycling-3d-visualization" animation="fade-in-up" delay={400} className="mt-16">
          <div className="bg-card rounded-xl overflow-hidden shadow-xl">
            <RecyclingProcessVisualization />
          </div>
          <p className="text-center text-muted-foreground mt-4 max-w-2xl mx-auto">
            Our platform connects all stakeholders in the plastic value chain, from producers to recyclers to consumers,
            creating a transparent and incentivized ecosystem for sustainable plastic management.
          </p>
        </AnimatedElement>
      </div>
    </section>
  )
}
