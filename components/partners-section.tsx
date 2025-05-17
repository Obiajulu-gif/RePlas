import { SafeImage } from "@/components/ui/safe-image"
import { AnimatedElement } from "@/components/animation-provider"

export default function PartnersSection() {
  const partners = [
    {
      name: "Celo Foundation",
      logo: "/celo-logo.png",
    },
    {
      name: "EcoRecycle",
      logo: "/eco-recycle-logo.png",
    },
    {
      name: "GreenTech Innovations",
      logo: "/greentech-logo.png",
    },
    {
      name: "Sustainable Packaging Alliance",
      logo: "/sustainable-packaging-logo.png",
    },
    {
      name: "Ocean Cleanup Initiative",
      logo: "/ocean-cleanup-logo.png",
    },
    {
      name: "Circular Economy Institute",
      logo: "/circular-economy-logo.png",
    },
  ]

  return (
    <section className="py-16 md:py-20" id="partners">
      <div className="container">
        <AnimatedElement id="partners-heading" animation="fade-in-up" className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-4">Trusted by Industry Leaders</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We're partnering with organizations across the plastic value chain to create a more sustainable future
          </p>
        </AnimatedElement>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center">
          {partners.map((partner, index) => (
            <AnimatedElement
              key={index}
              id={`partner-${index}`}
              animation="fade-in-up"
              delay={index * 100}
              className="flex justify-center"
            >
              <SafeImage
                src={partner.logo}
                alt={partner.name}
                width={180}
                height={60}
                className="h-12 w-auto grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all hover:scale-110 duration-300"
                fallbackSrc="/placeholder.svg"
              />
            </AnimatedElement>
          ))}
        </div>
      </div>
    </section>
  )
}
