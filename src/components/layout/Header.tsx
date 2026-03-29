"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Menu, X, Search, ShoppingBasket } from "lucide-react"
import { CATEGORIES, SITE } from "@/lib/content"
import { ICON_MAP } from "@/lib/icons"
import { cn, slugify } from "@/lib/utils"
import { ThemeToggle } from "@/components/ui/ThemeToggle"

const TOP_NAV = [
  { label: "Home", href: "/" },
  { label: "Our Selection", href: "/selection" },
  { label: "Locations", href: "/locations" },
  { label: "Gallery", href: "/gallery" },
]

export function Header() {
  const [open, setOpen] = useState(false)
  const [navSearch, setNavSearch] = useState("")
  const pathname = usePathname()
  const router = useRouter()

  function handleNavSearch(e: React.FormEvent) {
    e.preventDefault()
    const q = navSearch.trim()
    router.push(q ? `/selection?q=${encodeURIComponent(q)}` : "/selection")
    setNavSearch("")
    setOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* ── Row 1: Top bar ── */}
      <div className="bg-warm-white border-b border-warm-surface shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-14 items-center gap-4">

            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2.5 shrink-0"
              onClick={() => setOpen(false)}
            >
              <div className="w-8 h-8 rounded-lg bg-teal flex items-center justify-center">
                <ShoppingBasket className="w-4.5 h-4.5 text-white w-[18px] h-[18px]" />
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-[13px] font-extrabold text-warm-text tracking-tight">
                  Town &amp; Country
                </span>
                <span className="text-[9px] font-bold tracking-[0.2em] text-warm-muted uppercase">
                  Market
                </span>
              </div>
            </Link>

            {/* Desktop nav links */}
            <nav className="hidden md:flex items-center gap-1 ml-4" aria-label="Site navigation">
              {TOP_NAV.map((item) => {
                const active = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "px-3 py-1.5 text-[13px] font-semibold rounded-lg transition-colors",
                      active
                        ? "bg-teal/10 text-teal"
                        : "text-warm-muted hover:text-warm-text hover:bg-warm-surface/60"
                    )}
                  >
                    {item.label}
                  </Link>
                )
              })}
            </nav>

            {/* Search bar — always visible on sm+ */}
            <form
              onSubmit={handleNavSearch}
              className="flex-1 max-w-sm mx-auto sm:flex hidden items-center gap-2.5 bg-warm-surface/60 border border-warm-surface rounded-full px-4 py-2 hover:border-teal/50 hover:bg-warm-white transition-all group shadow-sm focus-within:border-teal/50 focus-within:bg-warm-white"
            >
              <Search className="w-3.5 h-3.5 text-warm-muted group-hover:text-teal transition-colors shrink-0" />
              <input
                type="text"
                value={navSearch}
                onChange={(e) => setNavSearch(e.target.value)}
                placeholder="Search products..."
                className="text-xs text-warm-text flex-1 bg-transparent outline-none placeholder:text-warm-muted"
              />
              <span className="hidden lg:inline text-[10px] text-warm-muted/60 bg-warm-surface rounded px-1.5 py-0.5 font-mono">
                ↵
              </span>
            </form>

            {/* Order Now button (sm+) */}
            <a
              href={SITE.uberEatsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-2 shrink-0 px-4 py-2 text-[12px] font-bold text-white rounded-full bg-gradient-to-r from-teal to-[#0d9488] shadow-[0_2px_10px_rgba(20,184,166,0.4)] hover:shadow-[0_4px_22px_rgba(20,184,166,0.65)] hover:scale-105 transition-all duration-200 ease-out relative overflow-hidden group"
            >
              <span className="relative z-10 hidden lg:inline">Order Now</span>
              <span className="relative z-10 lg:hidden">Order</span>
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500 ease-out" />
            </a>

            {/* Theme toggle */}
            <ThemeToggle />

            {/* Mobile: search icon + hamburger */}
            <div className="md:hidden flex items-center gap-1">
              <Link
                href="/selection"
                className="flex items-center justify-center w-9 h-9 rounded-lg text-warm-muted hover:text-teal hover:bg-warm-surface/60 transition-colors"
                aria-label="Search"
              >
                <Search className="w-4.5 h-4.5 w-[18px] h-[18px]" />
              </Link>
              <button
                className="flex items-center justify-center w-9 h-9 rounded-lg text-warm-text hover:bg-warm-surface/60 transition-colors"
                onClick={() => setOpen(!open)}
                aria-label={open ? "Close menu" : "Open menu"}
                aria-expanded={open}
              >
                {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Row 2: Category strip ── */}
      <div className="bg-teal">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto scrollbar-hide gap-0.5 py-1.5">
            {CATEGORIES.map((cat) => {
              const Icon = ICON_MAP[cat.icon]
              return (
                <Link
                  key={cat.id}
                  href={`/selection#${slugify(cat.name)}`}
                  className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/15 transition-colors"
                >
                  {Icon && <Icon className="w-3.5 h-3.5 flex-shrink-0" />}
                  <span className="text-[11px] font-medium whitespace-nowrap">{cat.name}</span>
                </Link>
              )
            })}
          </div>
        </div>
      </div>

      {/* ── Mobile drawer ── */}
      <div
        className={cn(
          "md:hidden overflow-hidden transition-all duration-300 ease-in-out bg-warm-white border-b border-warm-surface",
          open ? "max-h-screen shadow-lg" : "max-h-0"
        )}
      >
        <nav className="flex flex-col px-4 py-3" aria-label="Mobile navigation">
          {/* Order Now — top of drawer */}
          <a
            href={SITE.uberEatsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3 mb-3 text-sm font-bold text-white rounded-xl bg-gradient-to-r from-teal to-[#0d9488] shadow-[0_2px_10px_rgba(20,184,166,0.35)] relative overflow-hidden group"
            onClick={() => setOpen(false)}
          >
            <span className="relative z-10">Order Now on Uber Eats</span>
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500 ease-out" />
          </a>

          {/* Search on mobile */}
          <form
            onSubmit={handleNavSearch}
            className="flex items-center gap-2.5 bg-warm-surface/60 border border-warm-surface rounded-xl px-4 py-2.5 mb-3 focus-within:border-teal/50 transition-colors"
          >
            <Search className="w-4 h-4 text-warm-muted shrink-0" />
            <input
              type="text"
              value={navSearch}
              onChange={(e) => setNavSearch(e.target.value)}
              placeholder="Search products..."
              className="text-sm text-warm-text flex-1 bg-transparent outline-none placeholder:text-warm-muted"
            />
          </form>

          {TOP_NAV.map((item) => {
            const active = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "px-4 py-3 text-[15px] font-semibold rounded-xl transition-colors",
                  active
                    ? "bg-teal/10 text-teal"
                    : "text-warm-text hover:bg-warm-surface/60"
                )}
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>
      </div>
    </header>
  )
}
