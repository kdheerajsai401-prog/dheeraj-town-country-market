"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, Search, ShoppingBasket, Phone } from "lucide-react"
import { CATEGORIES } from "@/lib/content"
import { ICON_MAP } from "@/lib/icons"
import { cn } from "@/lib/utils"

const TOP_NAV = [
  { label: "Home", href: "/" },
  { label: "Our Selection", href: "/selection" },
  { label: "Locations", href: "/locations" },
  { label: "Order Online", href: "/order" },
]

export function Header() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* ── Row 1: Top bar ── */}
      <div className="bg-white border-b border-gray-100 shadow-sm">
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
                        : "text-warm-muted hover:text-warm-text hover:bg-gray-50"
                    )}
                  >
                    {item.label}
                  </Link>
                )
              })}
            </nav>

            {/* Search bar — always visible on sm+ */}
            <Link
              href="/selection"
              className="flex-1 max-w-sm mx-auto sm:flex hidden items-center gap-2.5 bg-gray-50 border border-gray-200 rounded-full px-4 py-2 hover:border-teal/50 hover:bg-white transition-all group shadow-sm"
              aria-label="Search our selection"
            >
              <Search className="w-3.5 h-3.5 text-warm-muted group-hover:text-teal transition-colors shrink-0" />
              <span className="text-xs text-warm-muted flex-1">Search products...</span>
              <span className="hidden lg:inline text-[10px] text-warm-muted/60 bg-gray-100 rounded px-1.5 py-0.5 font-mono">
                ↵
              </span>
            </Link>

            {/* Phone (desktop) */}
            <a
              href="tel:+19052758696"
              className="hidden lg:flex items-center gap-1.5 shrink-0 text-xs font-medium text-warm-muted hover:text-teal transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              (905) 275-8696
            </a>

            {/* Mobile: search icon + hamburger */}
            <div className="md:hidden ml-auto flex items-center gap-1">
              <Link
                href="/selection"
                className="flex items-center justify-center w-9 h-9 rounded-lg text-warm-muted hover:text-teal hover:bg-gray-50 transition-colors"
                aria-label="Search"
              >
                <Search className="w-4.5 h-4.5 w-[18px] h-[18px]" />
              </Link>
              <button
                className="flex items-center justify-center w-9 h-9 rounded-lg text-warm-text hover:bg-gray-50 transition-colors"
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
                  href={`/selection#${cat.id}`}
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
          "md:hidden overflow-hidden transition-all duration-300 ease-in-out bg-white border-b border-gray-100",
          open ? "max-h-screen shadow-lg" : "max-h-0"
        )}
      >
        <nav className="flex flex-col px-4 py-3" aria-label="Mobile navigation">
          {/* Search on mobile */}
          <Link
            href="/selection"
            className="flex items-center gap-2.5 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 mb-3 hover:border-teal/50 transition-colors"
            onClick={() => setOpen(false)}
          >
            <Search className="w-4 h-4 text-warm-muted shrink-0" />
            <span className="text-sm text-warm-muted">Search products...</span>
          </Link>

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
                    : "text-warm-text hover:bg-gray-50"
                )}
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            )
          })}

          <div className="mt-3 pt-3 border-t border-gray-100">
            <a
              href="tel:+19052758696"
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-warm-muted hover:text-teal transition-colors rounded-xl hover:bg-gray-50"
            >
              <Phone className="w-4 h-4" />
              (905) 275-8696
            </a>
          </div>
        </nav>
      </div>
    </header>
  )
}
