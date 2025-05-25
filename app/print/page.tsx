import { BusinessCard } from "@/components/print/business-card"
import { VerticalBusinessCard } from "@/components/print/vertical-business-card"
import { Brochure } from "@/components/print/brochure"
import { Flyer } from "@/components/print/flyer"

export default function PrintPage() {
  return (
    <div className="container py-12 space-y-16">
      <div>
        <h1 className="text-3xl font-bold mb-6">Business Cards</h1>
        <h2 className="text-xl font-semibold mb-4">Horizontal Design</h2>
        <div className="flex flex-wrap gap-8 mb-8">
          <BusinessCard
            name="Alex Johnson"
            title="CEO & Founder"
            email="alex@replas.com"
            phone="+1 (555) 123-4567"
            website="www.replas.com"
          />
          <BusinessCard
            name="Sam Taylor"
            title="Head of Sustainability"
            email="sam@replas.com"
            phone="+1 (555) 987-6543"
            website="www.replas.com"
          />
        </div>

        <h2 className="text-xl font-semibold mb-4">Vertical Design</h2>
        <div className="flex flex-wrap gap-8">
          <VerticalBusinessCard
            name="Alex Johnson"
            title="CEO & Founder"
            email="alex@replas.com"
            phone="+1 (555) 123-4567"
            website="www.replas.com"
          />
          <VerticalBusinessCard
            name="Sam Taylor"
            title="Head of Sustainability"
            email="sam@replas.com"
            phone="+1 (555) 987-6543"
            website="www.replas.com"
          />
        </div>
      </div>

      <div>
        <h1 className="text-3xl font-bold mb-6">Brochure (A4 Tri-fold)</h1>
        <div className="border border-gray-200 rounded-md overflow-hidden">
          <Brochure />
        </div>
        <p className="mt-4 text-sm text-muted-foreground">
          Note: This is a preview of the tri-fold brochure. For print production, export as PDF at 300 DPI with 3mm
          bleed.
        </p>
      </div>

      <div>
        <h1 className="text-3xl font-bold mb-6">Flyer (A4)</h1>
        <div className="border border-gray-200 rounded-md overflow-hidden">
          <Flyer />
        </div>
        <p className="mt-4 text-sm text-muted-foreground">
          Note: This is a preview of the A4 flyer. For print production, export as PDF at 300 DPI with 3mm bleed.
        </p>
      </div>
    </div>
  )
}
