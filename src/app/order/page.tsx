import type { Metadata } from "next"
import { SectionWrapper } from "@/components/ui/SectionWrapper"
import { UberEatsButton } from "@/components/ui/UberEatsButton"
import { Badge } from "@/components/ui/Badge"
import { SITE } from "@/lib/content"
import { ShoppingBag, Clock, MapPin, Zap } from "lucide-react"

export const metadata: Metadata = {
  title: "Order Online via Uber Eats | Town & Country Market — Mississauga",
  description:
    "Order groceries and convenience items from Town & Country Market for delivery in Mississauga via Uber Eats. Available 24 hours a day, 7 days a week.",
}

const FEATURES = [
  {
    icon: Clock,
    title: "Available 24/7",
    body: "Order any time — day or night. Both our locations are always on.",
  },
  {
    icon: MapPin,
    title: "Mississauga Delivery",
    body: "We deliver to homes and businesses across Mississauga via Uber Eats.",
  },
  {
    icon: Zap,
    title: "Fast & Reliable",
    body: "Groceries, snacks, drinks, and essentials — delivered quickly to your door.",
  },
]

export default function OrderPage() {
  return (
    <main>
      {/* Hero */}
      <div className="bg-onyx py-20 sm:py-28">
        <SectionWrapper>
          <div className="flex flex-col items-center text-center gap-6 max-w-2xl mx-auto">
            <Badge variant="dark">Delivery Available</Badge>
            <h1 className="text-4xl font-bold text-cream sm:text-5xl">
              Order from Town & Country on Uber Eats
            </h1>
            <p className="text-cream-muted text-lg leading-relaxed">
              Can&apos;t make it in? Get your groceries, snacks, beverages, and everyday
              essentials delivered straight to your door — any time of day or night.
            </p>
            <UberEatsButton
              webUrl={SITE.uberEatsUrl}
              className="inline-flex items-center justify-center gap-2 font-semibold rounded-pill transition-colors duration-200 bg-teal text-white hover:bg-teal-dark px-8 py-4 text-base"
            >
              <ShoppingBag className="w-5 h-5" />
              Open on Uber Eats
            </UberEatsButton>
          </div>
        </SectionWrapper>
      </div>

      {/* Features */}
      <SectionWrapper className="py-16 sm:py-24 bg-warm-white">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, body }) => (
            <div key={title} className="flex flex-col gap-4 bg-warm-surface rounded-card p-6">
              <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center">
                <Icon className="w-5 h-5 text-gold" />
              </div>
              <div>
                <h2 className="font-semibold text-warm-text mb-1">{title}</h2>
                <p className="text-sm text-warm-muted leading-relaxed">{body}</p>
              </div>
            </div>
          ))}
        </div>
      </SectionWrapper>

      {/* Note */}
      <SectionWrapper className="pb-16 sm:pb-24 bg-warm-white" innerClassName="">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-warm-muted">
            You&apos;ll be taken to the Uber Eats app to complete your order. Pricing and
            availability shown there.
          </p>
        </div>
      </SectionWrapper>
    </main>
  )
}
