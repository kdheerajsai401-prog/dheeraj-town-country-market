import type { Metadata } from "next"
import { Plus_Jakarta_Sans } from "next/font/google"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { SITE, LOCATIONS } from "@/lib/content"
import "./globals.css"

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
})

export const metadata: Metadata = {
  title: {
    default:
      "Town & Country Market — Grocery & Convenience Store | Mississauga, ON | Open 24/7",
    template: "%s | Town & Country Market",
  },
  description:
    "Fresh groceries, everyday essentials, and home-made bakery items at Town & Country Market in Mississauga. Two locations open 24 hours a day, 7 days a week.",
  keywords: [
    "convenience store Mississauga",
    "grocery store Mississauga",
    "24 hour store Mississauga",
    "Town and Country Market",
    "Duke of York store",
    "Hurontario grocery",
    "open 24/7 Mississauga",
  ],
  openGraph: {
    type: "website",
    locale: "en_CA",
    siteName: SITE.name,
    title: "Town & Country Market — Open 24/7 in Mississauga",
    description: SITE.description,
  },
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "GroceryStore",
  name: SITE.name,
  description: SITE.description,
  openingHours: "Mo-Su 00:00-23:59",
  priceRange: "$",
  location: LOCATIONS.map((loc) => ({
    "@type": "Place",
    name: loc.name,
    telephone: loc.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: loc.address,
      addressLocality: "Mississauga",
      addressRegion: "ON",
      addressCountry: "CA",
    },
    hasMap: loc.mapsLink,
  })),
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${plusJakarta.variable} h-full`} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-warm-white text-warm-text font-sans antialiased">
        <Header />
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  )
}
