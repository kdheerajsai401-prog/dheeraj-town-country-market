import { ICON_MAP } from "@/lib/icons"
import { slugify } from "@/lib/utils"
import type { Category, Product } from "@/lib/types"
import { ProductCard } from "./ProductCard"

type CategoryCardProps = {
  category: Category
  products: Product[]
}

export function CategoryCard({ category, products }: CategoryCardProps) {
  const Icon = ICON_MAP[category.icon]

  return (
    <div id={slugify(category.name)} className="flex flex-col gap-6 scroll-mt-24">
      {/* Category header */}
      <div className="flex items-center gap-4 pb-4 border-b border-warm-surface">
        <div className="w-10 h-10 rounded-full bg-warm-surface flex items-center justify-center flex-shrink-0">
          {Icon ? <Icon className="w-5 h-5 text-gold" /> : null}
        </div>
        <div>
          <h2 className="text-xl font-bold text-warm-text">{category.name}</h2>
          <p className="text-sm text-warm-muted">{category.description}</p>
        </div>
      </div>

      {/* Products grid */}
      {products.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <p className="text-sm text-warm-muted italic">Products coming soon.</p>
      )}
    </div>
  )
}
