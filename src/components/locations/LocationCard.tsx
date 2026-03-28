import Link from "next/link"
import { Badge } from "@/components/ui/Badge"
import { MapEmbed } from "./MapEmbed"
import type { Location } from "@/lib/types"
import { Phone, MapPin } from "lucide-react"

type LocationCardProps = {
  location: Location
}

export function LocationCard({ location }: LocationCardProps) {
  return (
    <article className="flex flex-col gap-0 bg-white rounded-card overflow-hidden shadow-sm border border-warm-surface/60">
      {/* Map */}
      <MapEmbed src={location.mapsEmbedSrc} title={`Map for ${location.name} location`} />

      {/* Info */}
      <div className="flex flex-col gap-5 p-6 sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold text-gold uppercase tracking-wider mb-1">
              {location.name}
            </p>
            <address className="not-italic">
              <p className="text-lg font-bold text-warm-text">{location.address}</p>
              <p className="text-warm-muted">{location.city}</p>
            </address>
          </div>
          <Badge variant="green">Open 24/7</Badge>
        </div>

        <div className="flex flex-col gap-3">
          <a
            href={location.phoneHref}
            className="flex items-center gap-3 text-warm-muted hover:text-warm-text transition-colors group"
            aria-label={`Call ${location.name} at ${location.phone}`}
          >
            <span className="flex-shrink-0 w-9 h-9 rounded-full bg-warm-surface flex items-center justify-center group-hover:bg-gold/10 transition-colors">
              <Phone className="w-4 h-4 text-warm-muted group-hover:text-gold transition-colors" />
            </span>
            <span className="font-medium">{location.phone}</span>
          </a>

          <Link
            href={location.mapsLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 text-warm-muted hover:text-warm-text transition-colors group"
          >
            <span className="flex-shrink-0 w-9 h-9 rounded-full bg-warm-surface flex items-center justify-center group-hover:bg-gold/10 transition-colors">
              <MapPin className="w-4 h-4 text-warm-muted group-hover:text-gold transition-colors" />
            </span>
            <span className="font-medium">Get Directions</span>
          </Link>
        </div>
      </div>
    </article>
  )
}
