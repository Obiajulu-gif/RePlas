"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Play, ChevronDown } from "lucide-react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Logo } from "@/components/logo"

export default function HeroSection() {
  const [videoOpen, setVideoOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    // Trigger the animation after component mounts
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 100)

    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      clearTimeout(timer)
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background to-muted/30 py-20 md:py-28 lg:py-36">
      {/* Background pattern */}
      <div className="absolute inset-0 -z-10 opacity-20">
        <svg
          className="h-full w-full"
          xmlns="http://www.w3.org/2000/svg"
          width="100%"
          height="100%"
          viewBox="0 0 1000 1000"
          preserveAspectRatio="none"
        >
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Floating elements */}
      <div className="absolute top-40 left-10 w-16 h-16 rounded-full bg-primary/10 animate-pulse-subtle opacity-70"></div>
      <div
        className="absolute bottom-20 right-10 w-24 h-24 rounded-full bg-primary/20 animate-pulse-subtle opacity-70"
        style={{ animationDelay: "1s" }}
      ></div>
      <div
        className="absolute top-40 right-20 w-12 h-12 rounded-full bg-primary/15 animate-pulse-subtle opacity-70"
        style={{ animationDelay: "2s" }}
      ></div>

      <div className="container">
        <div className="grid gap-12 md:grid-cols-2 md:gap-16 items-center">
          <div className={`flex flex-col gap-6 ${isVisible ? "fade-in-left" : "opacity-0"}`}>
            
            <div>
              <div className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-sm font-semibold text-primary mb-4">
                Powered by Celo Blockchain
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
                Revolutionizing Plastic Waste Management
              </h1>
              <p className="text-xl text-muted-foreground">
                Track, Trace, and Transform Plastic Waste into Value on the Blockchain.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" asChild className="group bg-primary hover:bg-primary/90">
                <Link href="/signup">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => setVideoOpen(true)}
                className="group transition-all hover:bg-primary/10"
              >
                <Play className="mr-2 h-4 w-4 transition-transform group-hover:scale-125" />
                Watch Demo
              </Button>
            </div>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex -space-x-2">
                <Image
                  src="/user-avatar-1.jpg"
                  alt="User"
                  width={32}
                  height={32}
                  className="rounded-full border-2 border-background"
                />
                <Image
                  src="/user-avatar-2.jpg"
                  alt="User"
                  width={32}
                  height={32}
                  className="rounded-full border-2 border-background"
                />
                <Image
                  src="/user-avatar-3.jpg"
                  alt="User"
                  width={32}
                  height={32}
                  className="rounded-full border-2 border-background"
                />
                <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-muted text-xs font-medium">
                  +2K
                </div>
              </div>
              <p>Join over 2,000 users already making an impact</p>
            </div>
          </div>

          <div
            className={`relative aspect-video rounded-xl overflow-hidden shadow-2xl ${isVisible ? "fade-in-right" : "opacity-0"}`}
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent z-10"></div>
            <Image
              src="/sustainable-recycling-hero.png"
              alt="Plastic waste management with blockchain technology"
              fill
              className="object-cover transition-transform hover:scale-105 duration-700"
              priority
            />
            <div className="absolute bottom-4 left-4 right-4 bg-background/80 backdrop-blur-sm p-4 rounded-lg z-20">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium">Transparent Supply Chain</h3>
                  <p className="text-sm text-muted-foreground">Track plastic from collection to recycling</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          className={`flex justify-center mt-16 ${scrolled ? "opacity-0" : "opacity-100"} transition-opacity duration-300`}
        >
          <Button
            variant="ghost"
            size="sm"
            className="animate-bounce-subtle"
            onClick={() => {
              window.scrollTo({
                top: window.innerHeight,
                behavior: "smooth",
              })
            }}
          >
            <ChevronDown className="h-5 w-5" />
            <span className="sr-only">Scroll down</span>
          </Button>
        </div>
      </div>

      <Dialog open={videoOpen} onOpenChange={setVideoOpen}>
        <DialogContent className="sm:max-w-[800px] p-0 overflow-hidden">
          <div className="aspect-video w-full">
            <iframe
              width="100%"
              height="100%"
              src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
              title="RePlas Demo Video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  )
}
