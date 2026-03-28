import type { Metadata } from "next"
import { Suspense } from "react"
import { SectionWrapper } from "@/components/ui/SectionWrapper"
import { SelectionSearch } from "@/components/selection/SelectionSearch"
import { fetchUberEatsMenu } from "@/lib/uber-eats-menu"

export const revalidate = 86400

export const metadata: Metadata = {
  title: "Our Selection | Town & Country Market — Mississauga",
  description:
    "Browse what we carry: fresh produce, home-made bakery, dairy, beer & wine, frozen foods, chocolates, rice, lottery, and more — at Town & Country Market in Mississauga.",
}

export default async function SelectionPage() {
  const { categories, products } = await fetchUberEatsMenu()

  return (
    <main>
      {/* Page header */}
      <div className="bg-warm-surface py-12 sm:py-16 border-b border-warm-text/8">
        <SectionWrapper>
          <p className="text-gold text-sm font-semibold tracking-widest uppercase mb-3">
            What We Carry
          </p>
          <h1 className="text-4xl font-bold text-warm-text sm:text-5xl">Our Selection</h1>
          <p className="text-warm-muted mt-4 max-w-lg text-lg">
            Everything from fresh produce and home-made bakery to beer, wine, and lottery — all
            under one roof, 24 hours a day.
          </p>
        </SectionWrapper>
      </div>

      {/* Searchable category list */}
      <SectionWrapper className="py-12 sm:py-16">
        <Suspense>
          <SelectionSearch categories={categories} products={products} />
        </Suspense>
      </SectionWrapper>
    </main>
  )
}
