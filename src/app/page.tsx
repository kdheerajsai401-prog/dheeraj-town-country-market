import { Hero } from "@/components/home/Hero"
import { CategoryStrip } from "@/components/home/CategoryStrip"
import { FeaturedItems } from "@/components/home/FeaturedItems"
import { LocationsPreview } from "@/components/home/LocationsPreview"
import { CustomerReviews } from "@/components/home/CustomerReviews"
import { UberEatsBanner } from "@/components/home/UberEatsBanner"

export default function HomePage() {
  return (
    <main>
      <Hero />
      <CategoryStrip />
      <FeaturedItems />
      <LocationsPreview />
      <CustomerReviews />
      <UberEatsBanner />
    </main>
  )
}
