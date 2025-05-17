"use client"

import { useState, useEffect, useCallback } from "react"
import { SafeImage } from "@/components/ui/safe-image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { AnimatedElement } from "@/components/animation-provider"
import { ErrorBoundary } from "@/components/error-boundary"
import { useInView } from "react-intersection-observer"
import { cn } from "@/lib/utils"

export default function Testimonials() {
  const [mounted, setMounted] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const [autoplay, setAutoplay] = useState(true)
  const { ref, inView } = useInView({
    threshold: 0.3,
    triggerOnce: false,
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  const testimonials = [
    {
      quote:
        "RePlas has transformed how we manage our plastic waste. The blockchain traceability gives us complete visibility into our recycling chain.",
      name: "Sarah Johnson",
      title: "Sustainability Director, EcoPackaging Inc.",
      avatar: "/testimonial-avatar-1.jpg",
      rating: 5,
    },
    {
      quote:
        "As a recycler, the token incentives have significantly increased our collection rates. The AI analytics help us optimize our operations.",
      name: "Michael Chen",
      title: "Operations Manager, GreenRecycle",
      avatar: "/testimonial-avatar-2.jpg",
      rating: 5,
    },
    {
      quote:
        "The transparency provided by RePlas allows us to confidently report our plastic footprint reduction to stakeholders and regulators.",
      name: "Emma Rodriguez",
      title: "ESG Compliance Officer, Consumer Goods Co.",
      avatar: "/testimonial-avatar-3.jpg",
      rating: 5,
    },
    {
      quote:
        "I love being able to scan products and see their entire lifecycle. The rewards for recycling make it even more satisfying.",
      name: "David Kim",
      title: "Conscious Consumer",
      avatar: "/testimonial-avatar-4.jpg",
      rating: 4,
    },
    {
      quote:
        "The integration with Celo blockchain ensures our sustainability claims are verifiable and immutable. Game-changer for our brand.",
      name: "Priya Patel",
      title: "Chief Innovation Officer, FuturePlastics",
      avatar: "/testimonial-avatar-5.jpg",
      rating: 5,
    },
  ]

  // Auto-advance testimonials
  const advanceTestimonial = useCallback(() => {
    if (autoplay && inView) {
      setActiveIndex((current) => (current + 1) % testimonials.length)
    }
  }, [autoplay, inView, testimonials.length])

  useEffect(() => {
    const timer = setInterval(advanceTestimonial, 5000)
    return () => clearInterval(timer)
  }, [advanceTestimonial])

  // Pause autoplay on hover
  const handleMouseEnter = () => setAutoplay(false)
  const handleMouseLeave = () => setAutoplay(true)

  return (
    <section
      ref={ref}
      className="py-20 md:py-24 lg:py-32 bg-muted/30"
      id="testimonials"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
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
          <ErrorBoundary>
            {mounted ? (
              <div className="max-w-5xl mx-auto">
                {/* Featured testimonial */}
                <div className="mb-12">
                  <Card className="overflow-hidden border-0 shadow-lg bg-gradient-to-br from-primary/5 to-primary/10">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="relative h-full min-h-[300px] bg-muted">
                        <SafeImage
                          src={testimonials[activeIndex].avatar}
                          alt={testimonials[activeIndex].name}
                          fill
                          className="object-cover transition-all duration-700 ease-in-out"
                          fallbackSrc="/thoughtful-artist.png"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        <div className="absolute bottom-4 left-4 flex">
                          {[...Array(testimonials[activeIndex].rating)].map((_, i) => (
                            <svg
                              key={i}
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              className="h-5 w-5 text-yellow-400"
                            >
                              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                            </svg>
                          ))}
                        </div>
                      </div>
                      <div className="p-6 flex flex-col justify-center">
                        <div className="mb-6">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="44"
                            height="44"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-primary/40"
                          >
                            <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" />
                            <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" />
                          </svg>
                        </div>
                        <blockquote className="text-xl font-medium mb-6 transition-all duration-700 ease-in-out">
                          "{testimonials[activeIndex].quote}"
                        </blockquote>
                        <div className="mt-auto">
                          <p className="font-bold text-lg">{testimonials[activeIndex].name}</p>
                          <p className="text-muted-foreground">{testimonials[activeIndex].title}</p>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Testimonial navigation */}
                <div className="flex justify-center gap-2 mb-8">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveIndex(index)}
                      className={cn(
                        "w-3 h-3 rounded-full transition-all",
                        activeIndex === index
                          ? "bg-primary scale-125"
                          : "bg-muted-foreground/30 hover:bg-muted-foreground/50",
                      )}
                      aria-label={`View testimonial ${index + 1}`}
                    />
                  ))}
                </div>

                {/* Additional testimonials carousel */}
                <Carousel className="w-full">
                  <CarouselContent>
                    {testimonials.map((testimonial, index) => (
                      <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3 p-4">
                        <Card className="h-full transition-all hover:shadow-lg hover:-translate-y-1 duration-300">
                          <CardContent className="pt-6">
                            <div className="mb-4 flex">
                              {[...Array(testimonial.rating)].map((_, i) => (
                                <svg
                                  key={i}
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="24"
                                  height="24"
                                  viewBox="0 0 24 24"
                                  fill="currentColor"
                                  className="inline-block h-5 w-5 text-yellow-500 animate-pulse-subtle"
                                  style={{ animationDelay: `${i * 0.1}s` }}
                                >
                                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                </svg>
                              ))}
                            </div>
                            <blockquote className="text-muted-foreground italic mb-6">"{testimonial.quote}"</blockquote>
                          </CardContent>
                          <CardFooter>
                            <div className="flex items-center gap-3">
                              <SafeImage
                                src={testimonial.avatar}
                                alt={testimonial.name}
                                width={48}
                                height={48}
                                className="rounded-full transition-transform hover:scale-110 duration-300"
                                fallbackSrc="/diverse-person-avatars.png"
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
              </div>
            ) : (
              <div className="max-w-5xl mx-auto space-y-8">
                <div className="h-[400px] bg-muted rounded-lg animate-pulse"></div>
                <div className="flex justify-center gap-2">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-3 h-3 rounded-full bg-muted"></div>
                  ))}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-[200px] bg-muted rounded-lg animate-pulse"></div>
                  ))}
                </div>
              </div>
            )}
          </ErrorBoundary>
        </AnimatedElement>
      </div>
    </section>
  )
}
