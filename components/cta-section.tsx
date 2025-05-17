import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowRight } from "lucide-react"
import { AnimatedElement } from "@/components/animation-provider"

export default function CtaSection() {
  return (
    <section className="py-20 md:py-24 lg:py-32 bg-primary/5">
      <div className="container">
        <AnimatedElement id="cta-content" animation="fade-in-up" className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Join the Movement</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Be a part of a sustainable future. Start tracking your plastic waste and making a real impact today.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button size="lg" asChild className="group">
              <Link href="/signup">
                Sign Up Now
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="transition-all hover:bg-primary/10">
              <Link href="/contact">Contact Sales</Link>
            </Button>
          </div>

          <AnimatedElement id="newsletter-form" animation="fade-in-up" delay={300} className="max-w-md mx-auto">
            <p className="text-sm text-muted-foreground mb-4">Stay updated with our newsletter</p>
            <form className="flex gap-2">
              <Input
                type="email"
                placeholder="Enter your email"
                className="flex-1 transition-all focus:ring-2 focus:ring-primary"
                aria-label="Email address"
              />
              <Button type="submit" className="transition-transform hover:scale-105 duration-300">
                Subscribe
              </Button>
            </form>
          </AnimatedElement>
        </AnimatedElement>
      </div>
    </section>
  )
}
