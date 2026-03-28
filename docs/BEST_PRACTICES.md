# Best Practices
# Town & Country Market Website

**Applies to:** All developers working on this codebase
**Last updated:** 2026-03-28

---

## 1. Core Principles

1. **Single source of truth** — All content lives in Sanity. Nothing is hardcoded in components.
2. **Types first** — Define TypeScript types before writing components. If it touches external data, it must be typed.
3. **Mobile first** — Write Tailwind classes for mobile first, layer up with `md:` and `lg:` prefixes.
4. **No premature abstraction** — Three similar lines > one premature helper. Abstract only when a pattern repeats 3+ times.
5. **No unnecessary dependencies** — Every new `npm install` needs a reason. Prefer built-ins.

---

## 2. File & Folder Rules

```
src/
  app/           # Next.js App Router pages only — no business logic here
  components/    # Reusable UI components
    layout/      # Header, Footer — rendered once in layout.tsx
    ui/          # Generic primitives: Button, Badge, SectionWrapper
    home/        # Home page section components
    selection/   # /selection page components
    locations/   # /locations page components
  lib/           # Non-component utilities
    sanity/      # Sanity client, queries, image builder
    types.ts     # All TypeScript interfaces
    icons.ts     # ICON_MAP (single place for all Lucide icon imports)
    utils.ts     # cn() helper only
  sanity/        # Sanity schema definitions
    schemaTypes/ # One file per document type
```

**Rules:**
- Keep files under 500 lines
- One component per file
- Component file name = component name (PascalCase)
- No `index.ts` barrel files — import from specific paths
- Never put business logic in page files — delegate to components and lib

---

## 3. TypeScript Standards

```ts
// ✅ Always type component props explicitly
type HeroProps = {
  tagline: string
  subtext: string
}
export function Hero({ tagline, subtext }: HeroProps) { ... }

// ❌ Never use `any`
const data: any = await fetchSomething()  // NO

// ✅ Type all Sanity query results
const categories = await client.fetch<Category[]>(CATEGORIES_QUERY)

// ✅ Use `satisfies` for config objects
export const SITE = {
  name: "Town & Country Market",
  ...
} satisfies SiteConfig

// ✅ Use `type` not `interface` for data shapes
type Category = {
  _id: string
  name: string
  icon: LucideIconName
}
```

---

## 4. Component Patterns

### Every component:
```tsx
// 1. Imports at top
import { cn } from "@/lib/utils"

// 2. Type definition before the function
type ButtonProps = {
  variant?: "primary" | "secondary" | "ghost"
  children: React.ReactNode
  className?: string
} & React.ButtonHTMLAttributes<HTMLButtonElement>

// 3. Named export (not default)
export function Button({ variant = "primary", children, className, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "base-classes",
        variant === "primary" && "primary-classes",
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}
```

**Rules:**
- Named exports only — no `export default`
- Props typed as `type`, not `interface`
- `className` prop always last, merged with `cn()`
- No inline styles — Tailwind only
- No `React.FC` — just function with typed props

---

## 5. Tailwind Conventions

```tsx
// ✅ Readable class order: layout → spacing → typography → color → state
<div className="flex flex-col gap-4 px-6 py-8 text-sm font-medium text-stone-900 hover:text-amber-700" />

// ✅ Conditional classes via cn()
<div className={cn(
  "rounded-xl p-6",
  isActive && "bg-amber-50 border border-amber-200",
  className
)} />

// ❌ No arbitrary values unless truly necessary
<div className="w-[347px]" />   // NO — use spacing scale or container

// ✅ Mobile-first breakpoints
<div className="text-base md:text-lg lg:text-xl" />
```

**Color usage:**
- Use CSS custom properties (`--color-accent`, `--color-bg`) defined in `globals.css`
- Map them to Tailwind via `tailwind.config.ts`
- Never hardcode hex values in class strings

---

## 6. Sanity Conventions

### Schema files
```ts
// src/sanity/schemaTypes/category.ts
import { defineField, defineType } from "sanity"

export const categorySchema = defineType({
  name: "category",
  title: "Category",
  type: "document",
  fields: [
    defineField({ name: "name", type: "string", validation: Rule => Rule.required() }),
    // ...
  ],
  // Always define orderings for list views
  orderings: [{ title: "Display Order", by: [{ field: "displayOrder", direction: "asc" }] }]
})
```

### GROQ queries
```ts
// src/lib/sanity/queries.ts — all queries live here
export const CATEGORIES_QUERY = `
  *[_type == "category"] | order(displayOrder asc) {
    _id,
    name,
    "slug": slug.current,
    icon,
    description
  }
`
// ✅ Project only fields you use — never fetch `...`
// ✅ Use `| order()` to enforce consistent ordering
// ✅ Alias nested fields: `"slug": slug.current`
```

### Data fetching in pages
```tsx
// app/selection/page.tsx
import { client } from "@/lib/sanity/client"
import { CATEGORIES_QUERY } from "@/lib/sanity/queries"
import type { Category } from "@/lib/types"

export default async function SelectionPage() {
  const categories = await client.fetch<Category[]>(CATEGORIES_QUERY)
  return <CategoryGrid categories={categories} />
}
```

**Rules:**
- Fetch data in Server Components (page files), not in client components
- Always pass Sanity data as typed props to child components
- Never `use client` on a page file — only on interactive leaf components

---

## 7. Icon Usage

All Lucide icons are imported in one file:

```ts
// src/lib/icons.ts
import { Leaf, Croissant, Milk, ... } from "lucide-react"
import type { LucideIcon } from "lucide-react"

export type LucideIconName = keyof typeof ICON_MAP

export const ICON_MAP: Record<string, LucideIcon> = {
  Leaf,
  Croissant,
  // ...
}
```

**Usage in components:**
```tsx
import { ICON_MAP } from "@/lib/icons"

const Icon = ICON_MAP[category.icon]
return Icon ? <Icon className="w-5 h-5" /> : null
```

**Rules:**
- Never import Lucide icons directly in components — always use `ICON_MAP`
- Icon names in Sanity content must exactly match keys in `ICON_MAP`
- `ICON_MAP` is the only file that imports from `lucide-react`

---

## 8. Image Handling

```tsx
import Image from "next/image"
import { urlFor } from "@/lib/sanity/image"

// ✅ Sanity image with fallback
{image ? (
  <Image
    src={urlFor(image).width(800).format("webp").url()}
    alt={name}
    width={800}
    height={600}
    className="object-cover"
  />
) : (
  <div className="w-full aspect-video bg-stone-200" aria-hidden="true" />
)}
```

**Rules:**
- Always check for `null/undefined` image before rendering
- Always provide `alt` text — empty string only for decorative images (`alt=""`)
- Always use `next/image`, never `<img>`
- Always specify `width`/`height` or use `fill` with a positioned parent

---

## 9. SEO Checklist (per page)

Every page file must export a `generateMetadata` function or static `metadata` object:

```tsx
// Minimum required metadata
export const metadata: Metadata = {
  title: "Page Title | Town & Country Market",
  description: "150-character description including 'Mississauga'",
  openGraph: {
    title: "...",
    description: "...",
    type: "website",
  },
}
```

**Additional checklist:**
- [ ] All headings follow hierarchy (one `<h1>` per page)
- [ ] Phone numbers use `<a href="tel:...">`
- [ ] Addresses wrapped in `<address>` element
- [ ] `<main>` wraps page content
- [ ] Images have meaningful `alt` text
- [ ] Interactive elements are keyboard accessible
- [ ] JSON-LD schema in root layout

---

## 10. Performance Rules

- No client-side data fetching (no `useEffect` + `fetch`)
- No large client-side bundles — `"use client"` only for interactive components (mobile menu)
- Images always go through Sanity CDN or `next/image`
- Fonts loaded via `next/font/google` — never `<link rel="stylesheet">`
- No `setTimeout` or `setInterval` in components
- ISR: pages revalidate via Sanity webhook, not on a fixed interval

---

## 11. Accessibility Rules

- All interactive elements must be keyboard-reachable
- Focus styles must be visible (`focus-visible:ring-2`)
- Color contrast: text on background ≥ 4.5:1 ratio
- Mobile menu must trap focus when open
- Icons used as buttons must have `aria-label`

---

## 12. What NOT to Do

| Don't | Do instead |
|---|---|
| Hardcode any store content in components | Fetch from Sanity |
| Use `any` type | Define the correct type |
| Import Lucide icons directly in components | Use `ICON_MAP` |
| Use `export default` for components | Use named exports |
| Add `"use client"` to page files | Keep pages as Server Components |
| Use arbitrary Tailwind values (`w-[347px]`) | Use the spacing scale |
| Add features not in the PRD | Stay in scope |
| Skip the `alt` attribute on images | Always include `alt` |
