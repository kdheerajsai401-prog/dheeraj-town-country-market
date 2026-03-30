"use client"

import { Badge } from "@/components/ui/Badge"
import { GlowCard } from "@/components/ui/spotlight-card"
import type { Product } from "@/lib/types"

type ProductCardProps = {
  product: Product
}

function formatPrice(price: number) {
  return `$${price.toFixed(2)}`
}

export function ProductCard({ product }: ProductCardProps) {
  const isUnavailable = product.unavailable === true
  const isOnSale = !isUnavailable && product.salePrice !== undefined && product.salePrice < (product.price ?? Infinity)

  return (
    <GlowCard
      customSize
      glowColor="orange"
      className={`flex flex-col gap-3 p-4 shadow-sm${isUnavailable ? " opacity-60" : ""}`}
    >
      {/* Image area */}
      <div className="relative w-full aspect-square rounded-lg bg-warm-surface overflow-hidden flex items-center justify-center">
        {product.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.image}
            alt={product.name}
            className={`w-full h-full object-cover${isUnavailable ? " grayscale" : ""}`}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-10 h-10 rounded-full bg-warm-text/5" aria-hidden="true" />
          </div>
        )}
        {isUnavailable && (
          <div className="absolute top-2 left-2">
            <Badge variant="unavailable">Unavailable</Badge>
          </div>
        )}
        {isOnSale && (
          <div className="absolute top-2 left-2">
            <Badge variant="sale">Sale</Badge>
          </div>
        )}
      </div>

      {/* Name */}
      <p className="text-sm font-medium text-warm-text leading-snug line-clamp-2">
        {product.name}
      </p>

      {/* Price — hidden for unavailable items to avoid misleading CTAs */}
      {!isUnavailable && product.price !== undefined && (
        <div className="flex items-baseline gap-2 mt-auto">
          {isOnSale ? (
            <>
              <span className="text-base font-bold text-sale">
                {formatPrice(product.salePrice!)}
              </span>
              <span className="text-xs text-warm-muted line-through">
                {formatPrice(product.price)}
              </span>
            </>
          ) : (
            <span className="text-base font-bold text-warm-text">
              {formatPrice(product.price)}
            </span>
          )}
        </div>
      )}
    </GlowCard>
  )
}
