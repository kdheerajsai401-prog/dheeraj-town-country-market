"use client"

import Link from "next/link"
import { motion } from "motion/react"
import { SectionWrapper } from "@/components/ui/SectionWrapper"
import { Badge } from "@/components/ui/Badge"
import { LOCATIONS } from "@/lib/content"
import { MapPin, Phone } from "lucide-react"

export function LocationsPreview() {
  return (
    <SectionWrapper className="bg-warm-surface py-16 sm:py-24">
      <div className="flex flex-col gap-10">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="text-gold text-sm font-semibold tracking-widest uppercase mb-3">
            Find Us
          </p>
          <h2 className="text-3xl font-bold text-warm-text sm:text-4xl">
            Two locations in Mississauga
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {LOCATIONS.map((loc, i) => (
            <motion.div
              key={loc.id}
              initial={{ opacity: 0, x: i === 0 ? -60 : 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.65, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="bg-white rounded-card p-6 sm:p-8 flex flex-col gap-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold text-teal uppercase tracking-wider mb-1">
                    {loc.name}
                  </p>
                  <address className="not-italic">
                    <p className="font-semibold text-warm-text">{loc.address}</p>
                    <p className="text-warm-muted text-sm">{loc.city}</p>
                  </address>
                </div>
                <Badge variant="green">Open 24/7</Badge>
              </div>

              <div className="flex flex-col gap-3">
                <a
                  href={loc.phoneHref}
                  className="flex items-center gap-3 text-warm-muted hover:text-warm-text transition-colors group"
                >
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-warm-surface flex items-center justify-center group-hover:bg-teal/10 transition-colors">
                    <Phone className="w-4 h-4 text-warm-muted group-hover:text-teal transition-colors" />
                  </span>
                  <span className="text-sm font-medium">{loc.phone}</span>
                </a>
              </div>

              <Link
                href={loc.mapsLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm font-semibold text-teal hover:text-teal-dark transition-colors"
              >
                <MapPin className="w-4 h-4" />
                Get Directions
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Link
            href="/locations"
            className="text-sm font-semibold text-warm-muted hover:text-warm-text underline underline-offset-4 transition-colors"
          >
            View maps &amp; more location info
          </Link>
        </motion.div>
      </div>
    </SectionWrapper>
  )
}
