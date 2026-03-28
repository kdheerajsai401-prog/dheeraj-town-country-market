import Link from "next/link"
import { CATEGORIES } from "@/lib/content"
import { ICON_MAP } from "@/lib/icons"
import { ChevronRight } from "lucide-react"

const CARD_COLORS = [
  { bg: "#e0f2f1", color: "#00796b" },
  { bg: "#fff3e0", color: "#e65100" },
  { bg: "#e3f2fd", color: "#1565c0" },
  { bg: "#f3e5f5", color: "#6a1b9a" },
  { bg: "#fbe9e7", color: "#bf360c" },
  { bg: "#fffde7", color: "#f57f17" },
  { bg: "#e8eaf6", color: "#283593" },
  { bg: "#e1f5fe", color: "#01579b" },
  { bg: "#fce4ec", color: "#880e4f" },
  { bg: "#efebe9", color: "#4e342e" },
  { bg: "#f9fbe7", color: "#33691e" },
  { bg: "#f3e8ff", color: "#7e22ce" },
]

export function CategoryStrip() {
  return (
    <section className="py-12 sm:py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-warm-text sm:text-3xl">Featured Top Category</h2>
          <Link
            href="/selection"
            className="flex items-center gap-1 text-sm font-semibold text-teal hover:text-teal-dark transition-colors"
          >
            See All <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
          {CATEGORIES.map((cat, i) => {
            const Icon = ICON_MAP[cat.icon]
            const palette = CARD_COLORS[i % CARD_COLORS.length]
            return (
              <Link
                key={cat.id}
                href={`/selection#${cat.id}`}
                className="group flex flex-col items-center gap-3 rounded-card p-4 sm:p-5 text-center transition-transform hover:scale-105"
                style={{ backgroundColor: palette.bg }}
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white/60 flex items-center justify-center">
                  {Icon && (
                    <Icon className="w-6 h-6 sm:w-7 sm:h-7" style={{ color: palette.color }} />
                  )}
                </div>
                <span
                  className="text-xs sm:text-sm font-semibold leading-tight"
                  style={{ color: palette.color }}
                >
                  {cat.name}
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
