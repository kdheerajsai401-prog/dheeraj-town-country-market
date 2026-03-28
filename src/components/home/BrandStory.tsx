import { Badge } from "@/components/ui/Badge"
import { SectionWrapper } from "@/components/ui/SectionWrapper"
import { Clock, MapPin, ShoppingBag } from "lucide-react"

const STATS = [
  { icon: Clock, label: "Open 24/7", sub: "Every day of the year" },
  { icon: MapPin, label: "Two Locations", sub: "Mississauga, Ontario" },
  { icon: ShoppingBag, label: "Uber Eats Delivery", sub: "Order from anywhere" },
]

export function BrandStory() {
  return (
    <SectionWrapper className="bg-warm-white py-16 sm:py-24">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        {/* Copy */}
        <div className="flex flex-col gap-6">
          <Badge variant="outline">About Us</Badge>
          <h2 className="text-3xl font-bold text-warm-text leading-tight sm:text-4xl">
            A local store,
            <br />
            not a chain.
          </h2>
          <p className="text-warm-muted text-lg leading-relaxed">
            Town & Country Market has been serving Mississauga neighbourhoods around the clock.
            We&apos;re independently owned, proudly stocked, and open every single hour of every
            single day — because life doesn&apos;t keep business hours.
          </p>
          <p className="text-warm-muted text-lg leading-relaxed">
            From our home-made bakery items to fresh produce, dairy to beer and wine — everything
            you need is here, without the big-box experience.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-1">
          {STATS.map(({ icon: Icon, label, sub }) => (
            <div
              key={label}
              className="flex items-center gap-4 bg-warm-surface rounded-card p-5"
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-teal/10 flex items-center justify-center">
                <Icon className="w-5 h-5 text-teal" />
              </div>
              <div>
                <p className="font-semibold text-warm-text">{label}</p>
                <p className="text-sm text-warm-muted">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  )
}
