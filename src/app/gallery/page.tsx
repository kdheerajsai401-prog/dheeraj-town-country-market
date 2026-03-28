'use client'

import { motion } from 'motion/react'
import { ZoomParallax } from '@/components/ui/zoom-parallax'
import { SITE } from '@/lib/content'
import Link from 'next/link'
import { ArrowDown, ShoppingBag } from 'lucide-react'

const storeImages = [
  { src: '/images/store/store-1.webp', alt: 'Town & Country Market — store' },
  { src: '/images/store/store-2.webp', alt: 'Town & Country Market — store' },
  { src: '/images/store/store-3.webp', alt: 'Town & Country Market — store' },
  { src: '/images/store/store-4.webp', alt: 'Town & Country Market — store' },
  { src: '/images/store/store-5.webp', alt: 'Town & Country Market — store' },
]

export default function GalleryPage() {
  return (
    <main className="min-h-screen w-full bg-warm-white">

      {/* ── Hero ── */}
      <section className="relative flex h-[70vh] flex-col items-center justify-center overflow-hidden bg-warm-white">
        {/* Radial glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 h-[80vmin] w-[80vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(20,184,166,0.12),transparent_65%)] blur-[40px]"
        />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 flex flex-col items-center text-center px-4"
        >
          <span className="inline-block border border-warm-text/20 text-warm-muted text-xs font-semibold tracking-widest uppercase px-4 py-1.5 rounded-full mb-6">
            Our Store
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-warm-text tracking-tight max-w-2xl leading-[1.1]">
            A look inside<br />
            <span className="text-teal">Town &amp; Country</span>
          </h1>
          <p className="mt-5 text-warm-muted text-base sm:text-lg max-w-md">
            Fresh produce, home-made bakery, and everyday essentials — always stocked, always open.
          </p>
        </motion.div>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-warm-muted"
        >
          <span className="text-xs font-medium tracking-widest uppercase">Scroll to explore</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ArrowDown className="w-4 h-4" />
          </motion.div>
        </motion.div>
      </section>

      {/* ── Zoom Parallax ── */}
      <ZoomParallax images={storeImages} />

      {/* ── CTA section ── */}
      <section className="flex flex-col items-center justify-center gap-6 py-24 px-4 bg-warm-white text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center gap-6"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-warm-text">
            Ready to order or visit us?
          </h2>
          <p className="text-warm-muted max-w-sm">
            Two locations in Mississauga, open 24 hours a day. Or order right now on Uber Eats.
          </p>
          <div className="flex items-center gap-4 flex-wrap justify-center">
            <a
              href={SITE.uberEatsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 text-sm font-bold text-white rounded-full bg-gradient-to-r from-teal to-[#0d9488] shadow-[0_2px_10px_rgba(20,184,166,0.4)] hover:shadow-[0_4px_22px_rgba(20,184,166,0.65)] hover:scale-105 transition-all duration-200 relative overflow-hidden group"
            >
              <ShoppingBag className="w-4 h-4 relative z-10" />
              <span className="relative z-10">Order on Uber Eats</span>
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500 ease-out" />
            </a>
            <Link
              href="/locations"
              className="px-6 py-3 text-sm font-semibold text-warm-text border border-warm-surface rounded-full hover:border-teal/50 hover:text-teal transition-colors"
            >
              Find a Location
            </Link>
          </div>
        </motion.div>
      </section>

    </main>
  )
}
