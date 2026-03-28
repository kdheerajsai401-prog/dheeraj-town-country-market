import { SectionWrapper } from "@/components/ui/SectionWrapper"
import { Button } from "@/components/ui/Button"
import { SITE } from "@/lib/content"
import { ShoppingBag } from "lucide-react"

export function UberEatsBanner() {
  return (
    <SectionWrapper className="bg-teal py-16 sm:py-20" innerClassName="">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-6 text-center">
          <p className="text-white/80 text-sm font-semibold uppercase tracking-widest">
            Delivery Available
          </p>
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Order from us on Uber Eats
          </h2>
          <p className="max-w-md text-white/80">
            Can&apos;t make it in? Get your groceries and essentials delivered straight to your
            door — any time, day or night.
          </p>
          <Button
            href={SITE.uberEatsUrl}
            external
            size="lg"
            className="bg-white hover:bg-teal-light text-teal font-bold"
          >
            <ShoppingBag className="w-5 h-5" />
            Order on Uber Eats
          </Button>
        </div>
      </div>
    </SectionWrapper>
  )
}
