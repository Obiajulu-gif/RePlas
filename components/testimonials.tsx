"use client"

import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { AnimatedElement } from "@/components/animation-provider"

export default function Testimonials() {
  const testimonials = [
    {
      quote:
        "RePlas has transformed how we manage our plastic waste. The blockchain traceability gives us complete visibility into our recycling chain.",
      name: "Sarah Johnson",
      title: "Sustainability Director, EcoPackaging Inc.",
      avatar: "/testimonial-avatar-1.jpg",
    },
    {
      quote:
        "As a recycler, the token incentives have significantly increased our collection rates. The AI analytics help us optimize our operations.",
      name: "Michael Chen",
      title: "Operations Manager, GreenRecycle",
      avatar: "/testimonial-avatar-2.jpg",
    },
    {
      quote:
        "The transparency provided by RePlas allows us to confidently report our plastic footprint reduction to stakeholders and regulators.",
      name: "Emma Rodriguez",
      title: "ESG Compliance Officer, Consumer Goods Co.",
      avatar: "/testimonial-avatar-3.jpg",
    },
    {
      quote:
        "I love being able to scan products and see their entire lifecycle. The rewards for recycling make it even more satisfying.",
      name: "David Kim",
      title: "Conscious Consumer",
      avatar: "/testimonial-avatar-4.jpg",
    },
    {
      quote:
        "The integration with Celo blockchain ensures our sustainability claims are verifiable and immutable. Game-changer for our brand.",
      name: "Priya Patel",
      title: "Chief Innovation Officer, FuturePlastics",
      avatar: "/testimonial-avatar-5.jpg",
    },
  ]

  return (
    <section className="py-20 md:py-24 lg:py-32 bg-muted/30" id="testimonials">
      <div className="container">
        <AnimatedElement
          id="testimonials-heading"
          animation="fade-in-up"
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">What Our Users Say</h2>
          <p className="text-xl text-muted-foreground">
            Hear from the people and organizations making a difference with RePlas
          </p>
        </AnimatedElement>

        <AnimatedElement id="testimonials-carousel" animation="fade-in-up" delay={200}>
          <Carousel className="max-w-5xl mx-auto">
            <CarouselContent>
              {testimonials.map((testimonial, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3 p-4">
                  <Card className="h-full transition-all hover:shadow-lg hover:-translate-y-1 duration-300">
                    <CardContent className="pt-6">
                      <div className="mb-4">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg
                            key={star}
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="inline-block h-5 w-5 text-yellow-500 animate-pulse-subtle"
                            style={{ animationDelay: `${star * 0.1}s` }}
                          >
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                          </svg>
                        ))}
                      </div>
                      <blockquote className="text-muted-foreground italic mb-6">"{testimonial.quote}"</blockquote>
                    </CardContent>
                    <CardFooter>
                      <div className="flex items-center gap-3">
                        <Image
                          src={testimonial.avatar || "/placeholder.svg"}
                          alt={testimonial.name}
                          width={48}
                          height={48}
                          className="rounded-full transition-transform hover:scale-110 duration-300"
                        />
                        <div>
                          <p className="font-medium">{testimonial.name}</p>
                          <p className="text-xs text-muted-foreground">{testimonial.title}</p>
                        </div>
                      </div>
                    </CardFooter>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex justify-center mt-8">
              <CarouselPrevious className="relative static translate-y-0 mr-2 transition-transform hover:scale-110 duration-300" />
              <CarouselNext className="relative static translate-y-0 transition-transform hover:scale-110 duration-300" />
            </div>
          </Carousel>
        </AnimatedElement>
      </div>
    </section>
  )
}
