"use client"

import { useState, useMemo } from "react"
import { useSearchParams } from "next/navigation"
import { Search, X } from "lucide-react"
import type { Category, Product } from "@/lib/types"
import { CategoryCard } from "./CategoryCard"

type Props = {
  categories: Category[]
  products: Product[]
}

export function SelectionSearch({ categories, products }: Props) {
  const searchParams = useSearchParams()
  const [query, setQuery] = useState(searchParams.get("q") ?? "")

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim()
    if (!q) return categories.map((cat) => ({
      cat,
      products: products.filter((p) => p.categoryId === cat.id),
    }))

    return categories
      .map((cat) => ({
        cat,
        products: products.filter(
          (p) =>
            p.categoryId === cat.id &&
            (p.name.toLowerCase().includes(q) || cat.name.toLowerCase().includes(q))
        ),
      }))
      .filter(({ cat, products: ps }) =>
        cat.name.toLowerCase().includes(q) ||
        cat.description?.toLowerCase().includes(q) ||
        ps.length > 0
      )
  }, [query, categories, products])

  return (
    <>
      {/* Search bar */}
      <div className="relative max-w-xl mt-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-muted" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products or categories..."
          className="w-full pl-11 pr-10 py-3 rounded-xl border border-warm-text/15 bg-white text-warm-text text-sm placeholder:text-warm-muted focus:outline-none focus:ring-2 focus:ring-teal/40 focus:border-teal transition"
          aria-label="Search products"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-warm-muted hover:text-warm-text transition-colors"
            aria-label="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Results count when searching */}
      {query && (
        <p className="mt-3 text-sm text-warm-muted">
          {filtered.length === 0
            ? "No results found."
            : `Showing ${filtered.length} categor${filtered.length === 1 ? "y" : "ies"} matching "${query}"`}
        </p>
      )}

      {/* Category list */}
      <div className="flex flex-col gap-14 mt-0">
        {filtered.map(({ cat, products: ps }) => (
          <CategoryCard key={cat.id} category={cat} products={ps} />
        ))}
      </div>
    </>
  )
}
