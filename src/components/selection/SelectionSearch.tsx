"use client"

import { useState, useMemo, useEffect, useRef } from "react"
import { useSearchParams } from "next/navigation"
import { Search, X, ChevronUp } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"
import type { Category, Product } from "@/lib/types"
import { CategoryCard } from "./CategoryCard"
import { slugify } from "@/lib/utils"

type Props = {
  categories: Category[]
  products: Product[]
}

export function SelectionSearch({ categories, products }: Props) {
  const searchParams = useSearchParams()
  const [query, setQuery] = useState(searchParams.get("q") ?? "")
  const [activeId, setActiveId] = useState<string>("")
  const [showTop, setShowTop] = useState(false)
  const pillsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 400)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

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
          (p) => p.categoryId === cat.id && p.name.toLowerCase().includes(q)
        ),
      }))
      .filter(({ products: ps }) => ps.length > 0)
  }, [query, categories, products])

  // Track which category section is in view
  useEffect(() => {
    if (query) return // don't track while searching

    const observers: IntersectionObserver[] = []

    categories.forEach((cat) => {
      const el = document.getElementById(slugify(cat.name))
      if (!el) return
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveId(cat.id)
        },
        { rootMargin: "-30% 0px -60% 0px", threshold: 0 }
      )
      obs.observe(el)
      observers.push(obs)
    })

    return () => observers.forEach((o) => o.disconnect())
  }, [categories, query])

  // Scroll active pill into view
  useEffect(() => {
    if (!pillsRef.current || !activeId) return
    const pill = pillsRef.current.querySelector(`[data-catid="${activeId}"]`) as HTMLElement | null
    pill?.scrollIntoView({ block: "nearest", inline: "center" })
  }, [activeId])

  function jumpTo(cat: Category) {
    const el = document.getElementById(slugify(cat.name))
    el?.scrollIntoView({ behavior: "smooth" })
    setActiveId(cat.id)
  }

  return (
    <>
      {/* ── Category pill nav (hidden while searching) ── */}
      {!query && (
        <div
          ref={pillsRef}
          className="sticky top-[112px] z-30 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-2.5 bg-warm-white/90 backdrop-blur-sm border-b border-warm-surface flex gap-2 overflow-x-auto scrollbar-hide"
        >
          {categories.map((cat) => (
            <button
              key={cat.id}
              data-catid={cat.id}
              onClick={() => jumpTo(cat)}
              className={`shrink-0 text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors whitespace-nowrap ${
                activeId === cat.id
                  ? "bg-teal text-white border-teal"
                  : "bg-warm-surface border-warm-surface text-warm-muted hover:border-teal/50 hover:text-teal"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      )}

      {/* ── Search bar ── */}
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
      <div className="flex flex-col gap-14 mt-6">
        {filtered.map(({ cat, products: ps }) => (
          <CategoryCard key={cat.id} category={cat} products={ps} />
        ))}
      </div>

      {/* Scroll to top */}
      <AnimatePresence>
        {showTop && !query && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.15 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="fixed bottom-6 right-5 z-40 w-10 h-10 rounded-full bg-warm-surface/90 backdrop-blur border border-warm-surface shadow-lg flex items-center justify-center text-warm-muted hover:text-gold hover:border-gold transition-colors"
            aria-label="Back to top"
          >
            <ChevronUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  )
}
