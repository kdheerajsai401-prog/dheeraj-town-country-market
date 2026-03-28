import Link from "next/link"
import { SITE, LOCATIONS } from "@/lib/content"

export function Footer() {
  return (
    <footer className="bg-onyx text-cream">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-3">
          {/* Brand */}
          <div className="flex flex-col gap-3">
            <div>
              <p className="text-base font-bold tracking-tight text-cream">Town & Country</p>
              <p className="text-xs font-medium tracking-widest text-cream-muted uppercase">
                Market
              </p>
            </div>
            <p className="text-sm text-cream-muted max-w-xs leading-relaxed">
              Your neighbourhood convenience and grocery store in Mississauga, open 24 hours a
              day, 7 days a week.
            </p>
            <p className="text-xs font-semibold text-teal uppercase tracking-wider">
              {SITE.hours}
            </p>
          </div>

          {/* Locations */}
          {LOCATIONS.map((loc) => (
            <address key={loc.id} className="flex flex-col gap-2 not-italic">
              <p className="text-xs font-semibold text-teal uppercase tracking-wider">
                {loc.name}
              </p>
              <p className="text-sm text-cream leading-relaxed">
                {loc.address}
                <br />
                {loc.city}
              </p>
              <a
                href={loc.phoneHref}
                className="text-sm text-cream-muted hover:text-cream transition-colors"
              >
                {loc.phone}
              </a>
              <Link
                href={loc.mapsLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-cream-muted hover:text-cream underline underline-offset-4 transition-colors"
              >
                Get Directions
              </Link>
            </address>
          ))}
        </div>

        <div className="mt-12 border-t border-cream/10 pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-xs text-cream-muted">
            &copy; {new Date().getFullYear()} {SITE.name}. All rights reserved.
          </p>
          <p className="text-xs text-cream-muted">Mississauga, Ontario, Canada</p>
        </div>
      </div>
    </footer>
  )
}
