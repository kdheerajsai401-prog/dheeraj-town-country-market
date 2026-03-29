"use client"

import Link from "next/link"
import { motion } from "motion/react"
import { ChevronRight } from "lucide-react"
import { GlowCard } from "@/components/ui/spotlight-card"
import type { Category, Product } from "@/lib/types"

const FALLBACK_BG: Record<string, string> = {
  "dairy-eggs":         "#e3f2fd",
  "bakery":             "#fff3e0",
  "fruits-vegetables":  "#e0f2f1",
  "beer-wine":          "#e8eaf6",
  "ice-cream":          "#fce4ec",
  "pantry-groceries":   "#f9fbe7",
  "sweets-chocolates":  "#efebe9",
  "frozen-food":        "#e1f5fe",
  "beverages":          "#e8f5e9",
  "snacks":             "#fff8e1",
}

type Props = {
  products: Product[]
  categories: Category[]
}

export function FeaturedItems({ products, categories }: Props) {
  const featured = products.filter((p) => p.image).slice(0, 8)

  if (featured.length === 0) return null

  return (
    <section className="py-12 sm:py-16 bg-warm-surface">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          className="flex items-center justify-between mb-8"
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <div>
            <p className="text-xs font-bold tracking-widest uppercase text-teal mb-1">From the Store</p>
            <h2 className="text-2xl font-bold text-warm-text sm:text-3xl">Popular Items</h2>
          </div>
          <Link
            href="/selection"
            className="flex items-center gap-1 text-sm font-semibold text-teal hover:text-teal-dark transition-colors"
          >
            View All <ChevronRight className="w-4 h-4" />
          </Link>
        </motion.div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {featured.map((product, i) => {
            const cat = categories.find((c) => c.id === product.categoryId)
            const fallback = FALLBACK_BG[product.categoryId] ?? "#f5f5f5"

            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{
                  duration: 0.55,
                  delay: i * 0.07,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <GlowCard customSize glowColor="orange" className="overflow-hidden shadow-sm p-0 h-full">
                  <Link
                    href={`/selection#${product.categoryId}`}
                    className="group flex flex-col h-full"
                  >
                    <div
                      className="relative h-36 sm:h-40 overflow-hidden"
                      style={{ backgroundColor: fallback }}
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    <div className="p-3 flex flex-col gap-1 flex-1">
                      <span className="text-[10px] font-semibold uppercase tracking-widest text-warm-muted">
                        {cat?.name ?? ""}
                      </span>
                      <p className="text-sm font-semibold text-warm-text leading-tight group-hover:text-teal transition-colors">
                        {product.name}
                      </p>
                      {product.price != null && (
                        <div className="flex items-baseline gap-2 mt-auto pt-2">
                          <span className="text-base font-bold text-teal">
                            ${product.price.toFixed(2)}
                          </span>
                        </div>
                      )}
                    </div>
                  </Link>
                </GlowCard>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
