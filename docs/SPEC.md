# Technical Specification
# Town & Country Market Website

**Version:** 2.0 (Phased)
**Date:** 2026-03-28

---

## Overview

Two-phase delivery:
- **Phase 1:** Static Next.js 15 frontend — all content in `src/lib/content.ts`. No CMS. Deployable in one session.
- **Phase 2:** Sanity v3 CMS integration — content moves from `content.ts` into Sanity. Owner manages via Studio.

---

## Phase 1 — Static Pitch Demo

### Stack

| Concern | Choice |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS |
| Font | Plus Jakarta Sans via `next/font/google` |
| Icons | lucide-react |
| Class utils | clsx + tailwind-merge → `cn()` |
| Content | Static TypeScript (`src/lib/content.ts`) |
| Hosting | Vercel (free tier fine for demo) |
| CMS | None — Phase 2 |

### File Structure (Phase 1)

```
src/
├── app/
│   ├── layout.tsx              # Root: font, metadata, Header/Footer, JSON-LD
│   ├── globals.css             # Tailwind + CSS custom properties
│   ├── page.tsx                # Home
│   ├── selection/page.tsx      # Product categories + sample products
│   ├── locations/page.tsx      # Two locations, maps, click-to-call
│   └── order/page.tsx          # Uber Eats CTA
├── components/
│   ├── layout/
│   │   ├── Header.tsx          # Sticky, logo, nav, mobile menu
│   │   └── Footer.tsx          # Dark, addresses, hours, copyright
│   ├── ui/
│   │   ├── Button.tsx          # primary / secondary / ghost
│   │   ├── Badge.tsx           # Open 24/7, Sale, etc.
│   │   └── SectionWrapper.tsx  # max-w + consistent padding
│   ├── home/
│   │   ├── Hero.tsx
│   │   ├── BrandStory.tsx
│   │   ├── CategoryStrip.tsx
│   │   ├── LocationsPreview.tsx
│   │   └── UberEatsBanner.tsx
│   ├── selection/
│   │   ├── CategoryCard.tsx
│   │   └── ProductCard.tsx     # name, image placeholder, optional price
│   └── locations/
│       ├── LocationCard.tsx    # address, tel: link, directions
│       └── MapEmbed.tsx        # Google Maps iframe
└── lib/
    ├── utils.ts                # cn()
    ├── icons.ts                # ICON_MAP
    ├── types.ts                # All TS interfaces
    └── content.ts              # ALL static content — single source of truth
```

### Content File (`src/lib/content.ts`)

```ts
export const SITE = {
  name: "Town & Country Market",
  tagline: "Your neighbourhood, always open.",
  description: "Fresh groceries, everyday essentials, and home-made bakery items — 24 hours a day, 7 days a week in Mississauga.",
  hours: "Open 24 Hours · 7 Days a Week",
  uberEatsUrl: "https://www.ubereats.com",  // placeholder — update with real URL
} satisfies SiteContent

export const LOCATIONS: Location[] = [
  {
    id: "duke-of-york",
    name: "Duke of York",
    address: "3885 Duke of York Blvd",
    city: "Mississauga, ON",
    phone: "(905) 275-8696",
    phoneHref: "tel:+19052758696",
    mapsLink: "https://maps.google.com/?q=3885+Duke+of+York+Blvd+Mississauga+ON",
    mapsEmbedSrc: "",  // Google Maps embed src — to be added
  },
  {
    id: "hurontario",
    name: "Hurontario",
    address: "4033 Hurontario Rd",
    city: "Mississauga, ON",
    phone: "(905) 275-9699",
    phoneHref: "tel:+19052759699",
    mapsLink: "https://maps.google.com/?q=4033+Hurontario+Rd+Mississauga+ON",
    mapsEmbedSrc: "",  // Google Maps embed src — to be added
  },
]

export const CATEGORIES: Category[] = [
  { id: "produce",   name: "Fresh Produce",    icon: "Leaf",          description: "Seasonal fruits and vegetables, fresh daily." },
  { id: "bakery",    name: "Home-Made Bakery",  icon: "Croissant",     description: "Fresh-baked goods made in-house every day." },
  { id: "dairy",     name: "Dairy",             icon: "Milk",          description: "Milk, butter, cheese, eggs, and more." },
  { id: "grocery",   name: "Grocery",           icon: "ShoppingBasket",description: "Pantry staples and everyday essentials." },
  { id: "chai",      name: "Chai & Coffee",     icon: "Coffee",        description: "Premium teas, coffees, and hot beverages." },
  { id: "bread",     name: "Bread",             icon: "Wheat",         description: "Sliced bread, rolls, and artisan loaves." },
  { id: "beer-wine", name: "Beer & Wine",       icon: "Wine",          description: "A curated selection of beers and wines." },
  { id: "frozen",    name: "Frozen Foods",      icon: "Snowflake",     description: "Frozen meals, vegetables, and convenience items." },
  { id: "ice-cream", name: "Ice Cream",         icon: "IceCream2",     description: "Scoops, bars, and tubs from top brands." },
  { id: "chocolate", name: "Chocolates",        icon: "Candy",         description: "Imported and local chocolate selections." },
  { id: "rice",      name: "Rice & Grains",     icon: "Salad",         description: "Basmati, jasmine, and specialty rice varieties." },
  { id: "lottery",   name: "Lottery",           icon: "Ticket",        description: "OLG lottery tickets available in-store." },
]

// Sample products for demo — a few per category to show the design
export const SAMPLE_PRODUCTS: Product[] = [
  // Dairy
  { id: "p1", categoryId: "dairy",   name: "Whole Milk 2L",         price: 4.99 },
  { id: "p2", categoryId: "dairy",   name: "Free Range Eggs 12pk",  price: 6.49, salePrice: 5.49 },
  // Bakery
  { id: "p3", categoryId: "bakery",  name: "Fresh Croissants (4pk)",price: 5.99 },
  { id: "p4", categoryId: "bakery",  name: "Sourdough Loaf",        price: 7.49 },
  // Produce
  { id: "p5", categoryId: "produce", name: "Bananas (bunch)",       price: 1.99 },
  { id: "p6", categoryId: "produce", name: "Roma Tomatoes (1kg)",   price: 3.49, salePrice: 2.99 },
  // Beer & Wine
  { id: "p7", categoryId: "beer-wine", name: "Heineken 6-Pack",     price: 14.99 },
  { id: "p8", categoryId: "beer-wine", name: "Yellow Tail Shiraz",  price: 12.99 },
  // Ice Cream
  { id: "p9",  categoryId: "ice-cream", name: "Häagen-Dazs Vanilla 500ml", price: 8.99, salePrice: 6.99 },
  { id: "p10", categoryId: "ice-cream", name: "Ben & Jerry's Choc Fudge",  price: 9.49 },
]
```

---

## TypeScript Types (`src/lib/types.ts`)

```ts
export type SiteContent = {
  name: string
  tagline: string
  description: string
  hours: string
  uberEatsUrl: string
}

export type Location = {
  id: string
  name: string
  address: string
  city: string
  phone: string       // display: "(905) 275-8696"
  phoneHref: string   // href: "tel:+19052758696"
  mapsLink: string
  mapsEmbedSrc: string
}

export type Category = {
  id: string
  name: string
  icon: string        // key into ICON_MAP
  description: string
}

export type Product = {
  id: string
  categoryId: string
  name: string
  image?: string      // URL or undefined → shows placeholder
  price?: number      // undefined = no price shown
  salePrice?: number  // undefined = not on sale
}
```

---

## Design System

```
Page bg:        #faf9f7   warm off-white
Card surface:   #f0ede8   warm light grey
Text:           #1a1916   near-black warm
Muted text:     #6b645a
Accent gold:    #b8894e   CTAs, highlighted prices
Fresh green:    #3d6b4a   In-stock badge, produce
Sale red:       #c0392b   Sale price badge

Dark sections (hero, footer, CTA band):
  bg:           #0f0f0e
  surface:      #1c1b18
  text:         #f5f0e8

Font:           Plus Jakarta Sans 400/500/600/700
Radius cards:   0.75rem
Radius pills:   9999px
Max width:      80rem (1280px)
```

---

## Navigation

| Label | Type | Href |
|---|---|---|
| Our Selection | Link | `/selection` |
| Locations | Link | `/locations` |
| Order Now | Primary button | `/order` |

Mobile: hamburger → full-screen overlay drawer.

---

## Homepage Sections

```
1. Hero              — dark, tagline, 2 CTAs
2. BrandStory        — light, neighbourhood copy, 3 stat badges
3. CategoryStrip     — all 12 categories, icon + label
4. LocationsPreview  — 2 location cards, warm surface bg
5. UberEatsBanner    — dark CTA band
6. Footer            — dark, 2-col addresses
```

---

## Price Display Logic

```tsx
// ProductCard price rendering:

if (!product.price) → show nothing (price TBC)
if (product.salePrice) → show strikethrough original + sale price in accent red
if (product.price only) → show price normally
```

Demo shows a mix — some products priced, some not — demonstrating both states.

---

## Local SEO

### JSON-LD (`layout.tsx`)
```json
{
  "@context": "https://schema.org",
  "@type": "GroceryStore",
  "name": "Town & Country Market",
  "openingHours": "Mo-Su 00:00-23:59",
  "location": [
    {
      "@type": "Place",
      "name": "Duke of York",
      "telephone": "+1-905-275-8696",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "3885 Duke of York Blvd",
        "addressLocality": "Mississauga",
        "addressRegion": "ON",
        "postalCode": "L5B 0G5",
        "addressCountry": "CA"
      }
    },
    {
      "@type": "Place",
      "name": "Hurontario",
      "telephone": "+1-905-275-9699",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "4033 Hurontario Rd",
        "addressLocality": "Mississauga",
        "addressRegion": "ON",
        "addressCountry": "CA"
      }
    }
  ]
}
```

### Page Metadata
| Page | Title |
|---|---|
| `/` | Town & Country Market — Grocery & Convenience Store \| Mississauga, ON \| Open 24/7 |
| `/selection` | Our Selection \| Town & Country Market — Mississauga |
| `/locations` | Store Locations \| Town & Country Market — Mississauga, ON |
| `/order` | Order Online via Uber Eats \| Town & Country Market |

---

## Phase 2 Additions (After Owner Sign-Off)

- Replace `content.ts` with Sanity GROQ queries
- Add `src/lib/sanity/` — client, queries, image builder
- Add `src/sanity/` — schema definitions
- Add `/studio` route for embedded Sanity Studio
- Add `/api/revalidate` webhook endpoint
- Logo and photos uploaded to Sanity image CDN
- Custom domain connected in Vercel
- Seed real product catalogue in Studio

---

## Phase 1 Implementation Order

1. Scaffold Next.js 15
2. Install: `lucide-react clsx tailwind-merge`
3. Read generated config → extend Tailwind + globals
4. Write `src/lib/utils.ts` → `cn()`
5. Write `src/lib/icons.ts` → `ICON_MAP`
6. Write `src/lib/types.ts`
7. Write `src/lib/content.ts` (all static content)
8. Build UI primitives: Button, Badge, SectionWrapper
9. Build Header, Footer
10. Build home sections (5 components)
11. Assemble `app/page.tsx`
12. Build `/selection` — categories + product grid with price logic
13. Build `/locations` — location cards + map embeds
14. Build `/order` — Uber Eats CTA
15. Write root `layout.tsx` — font, metadata, JSON-LD
16. Verify `npm run build`

---

## Environment Variables (Phase 1)

None required. All content is static.

## Environment Variables (Phase 2)

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_READ_TOKEN=
SANITY_WEBHOOK_SECRET=
```
