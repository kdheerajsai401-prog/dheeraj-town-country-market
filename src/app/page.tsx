import { Hero } from "@/components/home/Hero"
import { CategoryStrip } from "@/components/home/CategoryStrip"
import { FeaturedItems } from "@/components/home/FeaturedItems"
import { LocationsPreview } from "@/components/home/LocationsPreview"
import { CustomerReviews } from "@/components/home/CustomerReviews"
import { UberEatsBanner } from "@/components/home/UberEatsBanner"
import { fetchUberEatsMenu } from "@/lib/uber-eats-menu"

export default async function HomePage() {
  const { products, categories } = await fetchUberEatsMenu()

  return (
    <main>
      <Hero />
      <CategoryStrip />
      <FeaturedItems products={products} categories={categories} />
      <LocationsPreview />
      <CustomerReviews />
      <UberEatsBanner />
    </main>
  )
}
