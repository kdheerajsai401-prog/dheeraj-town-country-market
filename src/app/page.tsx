import { Hero } from "@/components/home/Hero"
import { CategoryStrip } from "@/components/home/CategoryStrip"
import { FeaturedItems } from "@/components/home/FeaturedItems"
import { LocationsPreview } from "@/components/home/LocationsPreview"
import { UberEatsBanner } from "@/components/home/UberEatsBanner"

export default function HomePage() {
  return (
    <main>
      <Hero />
      <CategoryStrip />
      <FeaturedItems />
      <LocationsPreview />
      <UberEatsBanner />
    </main>
  )
}
