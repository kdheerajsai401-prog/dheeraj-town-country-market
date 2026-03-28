import type { Metadata } from "next"
import { SectionWrapper } from "@/components/ui/SectionWrapper"
import { LocationCard } from "@/components/locations/LocationCard"
import { LOCATIONS } from "@/lib/content"

export const metadata: Metadata = {
  title: "Store Locations | Town & Country Market — Mississauga, ON",
  description:
    "Find Town & Country Market in Mississauga: 3885 Duke of York Blvd and 4033 Hurontario Rd. Both locations open 24 hours, 7 days a week. Click to call or get directions.",
}

export default function LocationsPage() {
  return (
    <main>
      {/* Page header */}
      <div className="bg-warm-surface py-12 sm:py-16 border-b border-warm-text/8">
        <SectionWrapper>
          <p className="text-gold text-sm font-semibold tracking-widest uppercase mb-3">
            Find Us
          </p>
          <h1 className="text-4xl font-bold text-warm-text sm:text-5xl">Our Locations</h1>
          <p className="text-warm-muted mt-4 max-w-lg text-lg">
            Two stores in Mississauga, Ontario — both open 24 hours a day, 7 days a week.
          </p>
        </SectionWrapper>
      </div>

      {/* Location cards */}
      <SectionWrapper className="py-12 sm:py-16">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {LOCATIONS.map((loc) => (
            <LocationCard key={loc.id} location={loc} />
          ))}
        </div>
      </SectionWrapper>
    </main>
  )
}
