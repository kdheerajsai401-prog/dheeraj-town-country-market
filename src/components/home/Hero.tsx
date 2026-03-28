import Link from "next/link"
import { SITE } from "@/lib/content"

export function Hero() {
  return (
    <div className="bg-white py-5 sm:py-7">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/*
         * The banner already has button graphics baked in.
         * We overlay transparent clickable areas exactly on top of each button.
         * Percentages derived from the image's actual button positions.
         */}
        <div className="relative rounded-2xl overflow-hidden shadow-lg">
          <img
            src="/images/banner.png"
            alt="Town & Country Market — Your 24/7 Everyday Market Solution"
            className="w-full h-auto block"
          />

          {/* Invisible interactive layer */}
          <div className="absolute inset-0 pointer-events-none">
            {/* ORDER ON UBER EATS button */}
            <Link
              href={SITE.uberEatsUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Order on Uber Eats"
              className="pointer-events-auto absolute rounded-full hover:bg-white/15 active:bg-white/25 transition-colors"
              style={{
                left: "3.5%",
                top: "62%",
                width: "33%",
                height: "11%",
              }}
            />

            {/* VIEW LOCATIONS button */}
            <Link
              href="/locations"
              aria-label="View Locations"
              className="pointer-events-auto absolute rounded-full hover:bg-white/15 active:bg-white/25 transition-colors"
              style={{
                left: "3.5%",
                top: "76%",
                width: "26%",
                height: "11%",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
