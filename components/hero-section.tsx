"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Play } from "lucide-react"
import { Dialog, DialogContent } from "@/components/ui/dialog"

export default function HeroSection() {
  const [videoOpen, setVideoOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Trigger the animation after component mounts
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background to-muted/30 py-20 md:py-24 lg:py-32">
      {/* Background pattern */}
      <div className="absolute inset-0 -z-10 opacity-20 animate-pulse">
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

      <div className="container">
        <div className="grid gap-12 md:grid-cols-2 md:gap-16 items-center">
          <div className={`flex flex-col gap-6 ${isVisible ? "fade-in-left" : "opacity-0"}`}>
            <div>
              <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
                Powered by Celo Blockchain
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
                Revolutionizing Plastic Waste Management with Blockchain and AI
              </h1>
              <p className="text-xl text-muted-foreground">
                Track, Trace, and Transform Plastic Waste into Value on the Celo Network.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" asChild className="group animate-bounce-subtle">
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
            <Image
              src="/sustainable-recycling-hero.png"
              alt="Plastic waste management with blockchain technology"
              fill
              className="object-cover transition-transform hover:scale-105 duration-700"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent"></div>
          </div>
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

function Badge({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
