// FAILURE POLICY (explicit):
// PRIMARY (V1 — getStoreV1): If unreachable, returns non-success, or yields fewer
// than 50 products, fetchUberEatsMenu throws. getMenu (unstable_cache) propagates
// the error to the page render, which causes Next.js to FAIL the build/revalidation
// visibly. Vercel keeps the last successful deployment live until a clean
// revalidation succeeds. Serving yesterday's menu is safe; serving an empty or
// partially-populated menu is not. There is no SAMPLE_PRODUCTS fallback.
//
// SECONDARY (V2 — getCatalogPresentationV2): Best-effort per-section expansion that
// captures items hidden inside subsection drilldowns that V1 doesn't surface on the
// storefront landing. Per-section V2 failures (HTTP errors, parse errors, structural
// surprises) are silently swallowed — V1 results still ship. This is intentional:
// V2 is opportunistic uplift, not a reliability dependency. The < 50 products check
// still fires on the merged total, so if BOTH V1 and V2 collapse, the build fails.
import { unstable_cache } from "next/cache"
import type { Category, Product } from "./types"

const STORE_UUID = "0e9689b2-344c-504f-9428-c7c52cd56a8f"
const API_URL = "https://www.ubereats.com/api/getStoreV1"
const CATALOG_V2_URL = "https://www.ubereats.com/_p/api/getCatalogPresentationV2"
const V2_CONCURRENCY = 5

type UberEatsItem = {
  uuid: string
  title: string
  price: number
  imageUrl?: string
  isSoldOut: boolean
  isAvailable: boolean
}

type UberEatsCatalogSection = {
  catalogSectionUUID: string
  payload: {
    standardItemsPayload?: {
      title: { text: string }
      catalogItems: UberEatsItem[]
    }
  }
}

// Promotional section names whose products should be re-assigned to their
// "real" section if that section also appears in the API response.
// Dedup rule: if a product's first-seen category is promotional and a later
// occurrence is from a non-promotional section, we upgrade the category.
const PROMOTIONAL_SECTION_NAMES = new Set(["best sellers", "trending products"])

// Layer 1: exact product-name overrides — partial, case-insensitive match → target section name
const PRODUCT_OVERRIDES: Record<string, string> = {
  "deep'n delicious": "Bakery",
  "deep n delicious": "Bakery",
  "deep and delicious": "Bakery",
  "mc cain deep'n": "Bakery",
  "stouffer": "Frozen Food",
  "lean cuisine": "Frozen Food",
  "hungry-man": "Frozen Food",
  "swanson": "Frozen Food",
}

function reclassifyProducts(categories: Category[], products: Product[]): void {
  // Trust Uber's original category by default.
  // Only override for explicit brand/product matches that are confirmed miscategorizations.
  const nameToId = new Map<string, string>()
  for (const cat of categories) {
    nameToId.set(cat.name.toLowerCase(), cat.id)
  }

  for (const product of products) {
    const nameLower = product.name.toLowerCase()
    for (const [key, targetSection] of Object.entries(PRODUCT_OVERRIDES)) {
      if (nameLower.includes(key)) {
        const targetId = nameToId.get(targetSection.toLowerCase())
        if (targetId && targetId !== product.categoryId) {
          product.categoryId = targetId
        }
        break
      }
    }
  }
}

const SECTION_ICON: Record<string, string> = {
  "Best sellers": "ShoppingBasket",
  "Trending products": "ShoppingBasket",
  "Snacks": "Candy",
  "Snacks & Cookies": "Candy",
  "Sweets & Chocolates": "Candy",
  "Frozen Food": "Snowflake",
  "Fruits & Vegetables": "Leaf",
  "Fresh Fruits": "Leaf",
  "Fresh Vegetables": "Leaf",
  "Bakery": "Croissant",
  "Breakfast": "Croissant",
  "Beverages": "Coffee",
  "Soft Drinks": "Coffee",
  "Dairy & Eggs": "Milk",
  "Pantry & Groceries": "ShoppingBasket",
  "Canned Products": "ShoppingBasket",
  "In Bulk / Loose": "ShoppingBasket",
  "Pasta": "Wheat",
  "Meat, Seafood & Plant-Based": "Salad",
  "Prepared Foods": "Salad",
  "International": "ShoppingBag",
  "Household": "ShoppingBag",
  "Personal Care & Beauty": "ShoppingBag",
  "Medications": "ShoppingBag",
  "Baby": "ShoppingBag",
  "Health & Wellness": "ShoppingBag",
  "Bathroom & Kitchen": "ShoppingBag",
  "Home Decor": "ShoppingBag",
  "Pets": "ShoppingBag",
  "Office & Stationery": "ShoppingBag",
  "Technology": "ShoppingBag",
  "Hardware": "ShoppingBag",
  "Parties & Events": "ShoppingBag",
}

async function fetchPage(offset?: number): Promise<{
  sections: UberEatsCatalogSection[]
  nextOffset: number | null
}> {
  const body: Record<string, unknown> = { storeUuid: STORE_UUID }
  if (offset !== undefined) body.catalogSectionOffset = offset

  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      "x-csrf-token": "x",
    },
    body: JSON.stringify(body),
    next: { revalidate: 86400 },
  })

  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const json = await res.json()
  if (json.status !== "success") throw new Error(json.data?.message ?? "API error")

  const csm = json.data.catalogSectionsMap as Record<string, UberEatsCatalogSection[]>
  const sections: UberEatsCatalogSection[] = Object.values(csm).flat()
  const paging = json.data.catalogSectionPagingInfo ?? {}
  const nextOffset = sections.length > 0 && paging.offset != null && paging.offset !== 0
    ? (paging.offset as number)
    : null

  return { sections, nextOffset }
}

// ── V2 SECONDARY EXPANSION ──────────────────────────────────────────────────
// getCatalogPresentationV2 returns the full per-section item list (including
// items only reachable via subsection drilldowns). V1 only returns what shows
// on the storefront landing. We call V2 once per section discovered by V1.

function extractItemsFromV2Response(json: unknown): UberEatsItem[] {
  // Defensive walker. The V2 response shape is undocumented and may vary by
  // section type — items typically live inside catalogItems arrays nested
  // under standardItemsPayload, sometimes wrapped inside subsection groups.
  // We recursively traverse anything that looks plausible and validate each
  // candidate. Any structural surprise → return [] and let V1 ship.
  const items: UberEatsItem[] = []
  const seenInResponse = new Set<string>()

  function isPlausibleItem(x: unknown): x is UberEatsItem {
    if (!x || typeof x !== "object") return false
    const o = x as Record<string, unknown>
    return (
      typeof o.uuid === "string" &&
      typeof o.title === "string" &&
      typeof o.price === "number"
    )
  }

  function walk(node: unknown): void {
    if (!node || typeof node !== "object") return
    if (Array.isArray(node)) {
      for (const child of node) walk(child)
      return
    }
    const obj = node as Record<string, unknown>
    // Direct catalogItems array
    if (Array.isArray(obj.catalogItems)) {
      for (const candidate of obj.catalogItems) {
        if (isPlausibleItem(candidate) && !seenInResponse.has(candidate.uuid)) {
          seenInResponse.add(candidate.uuid)
          items.push({
            uuid: candidate.uuid,
            title: candidate.title,
            price: candidate.price,
            imageUrl: candidate.imageUrl,
            isSoldOut: candidate.isSoldOut ?? false,
            isAvailable: candidate.isAvailable ?? true,
          })
        }
      }
    }
    // Recurse into all object/array children
    for (const value of Object.values(obj)) {
      if (value && typeof value === "object") walk(value)
    }
  }

  try {
    walk(json)
  } catch {
    return []
  }
  return items
}

async function fetchSectionDetailsV2(sectionUuid: string): Promise<UberEatsItem[]> {
  // Two-attempt strategy: try with sectionTypes filter first, retry without
  // if the first attempt yields zero items. Some sections require the filter,
  // others return nothing when it's present (per reverse-engineering notes).
  for (const includeSectionTypes of [true, false]) {
    const body: Record<string, unknown> = {
      sortAndFilters: null,
      storeFilters: {
        storeUuid: STORE_UUID,
        sectionUuids: [sectionUuid],
        subsectionUuids: null,
      },
    }
    if (includeSectionTypes) {
      body.sectionTypes = ["COLLECTION"]
    }

    try {
      const res = await fetch(CATALOG_V2_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          "x-csrf-token": "x",
        },
        body: JSON.stringify(body),
        next: { revalidate: 86400 },
      })
      if (!res.ok) continue
      const json = await res.json()
      if (json?.status !== "success") continue

      const items = extractItemsFromV2Response(json)
      if (items.length > 0) return items
    } catch {
      continue
    }
  }
  return []
}

async function fetchUberEatsMenu(): Promise<{ categories: Category[]; products: Product[] }> {
  try {
    const allSections: UberEatsCatalogSection[] = []

    // Paginate through all section pages (offsets discovered dynamically)
    const firstPage = await fetchPage()
    allSections.push(...firstPage.sections)

    let nextOffset = firstPage.nextOffset
    while (nextOffset !== null) {
      const page = await fetchPage(nextOffset)
      if (page.sections.length === 0) break
      allSections.push(...page.sections)
      nextOffset = page.nextOffset
    }

    // Category dedup: keyed by catalogSectionUUID so paginated duplicates are merged.
    const categoryMap = new Map<string, Category>()
    // Product dedup: keyed by item UUID so products shared across sections appear once.
    // Dedup rule for categoryId: if the existing assignment is from a promotional section
    // (e.g. "Best sellers") and the current occurrence is from a non-promotional section,
    // upgrade to the non-promotional category. Otherwise keep first-seen.
    // Dedup rule for availability: mark available if ANY occurrence is available.
    const productMap = new Map<string, Product>()

    for (const sec of allSections) {
      const sip = sec.payload.standardItemsPayload
      if (!sip || sip.catalogItems.length === 0) continue

      // Category dedup: only register a category once per UUID
      if (!categoryMap.has(sec.catalogSectionUUID)) {
        categoryMap.set(sec.catalogSectionUUID, {
          id: sec.catalogSectionUUID,
          name: sip.title.text,
          icon: SECTION_ICON[sip.title.text] ?? "ShoppingBasket",
          description: "",
        })
      }
      const category = categoryMap.get(sec.catalogSectionUUID)!

      for (const item of sip.catalogItems) {
        const isUnavailable = !item.isAvailable || item.isSoldOut

        if (productMap.has(item.uuid)) {
          const existing = productMap.get(item.uuid)!

          // Availability: if any occurrence is available, mark as available
          if (!isUnavailable) {
            existing.unavailable = false
          }

          // Category: upgrade from promotional to specific when possible
          const existingCat = categoryMap.get(existing.categoryId)
          const existingIsPromotional =
            existingCat !== undefined &&
            PROMOTIONAL_SECTION_NAMES.has(existingCat.name.toLowerCase())
          const currentIsPromotional = PROMOTIONAL_SECTION_NAMES.has(
            category.name.toLowerCase()
          )
          if (existingIsPromotional && !currentIsPromotional) {
            existing.categoryId = category.id
          }
        } else {
          productMap.set(item.uuid, {
            id: item.uuid,
            categoryId: category.id,
            name: item.title,
            price: item.price / 100,
            image: item.imageUrl,
            ...(isUnavailable ? { unavailable: true } : {}),
          })
        }
      }
    }

    // ── V2 expansion (best-effort) ────────────────────────────────────────
    // V1 only returns items shown on the storefront landing page. V2 fetches
    // the full per-section item list including subsection drilldowns.
    // Failures here NEVER break the build — V1 results still ship.
    const sectionUuids = Array.from(categoryMap.keys())
    const v2Stats = { sectionsZero: 0, sectionsErrored: 0, itemsAdded: 0 }

    for (let i = 0; i < sectionUuids.length; i += V2_CONCURRENCY) {
      const batch = sectionUuids.slice(i, i + V2_CONCURRENCY)
      const results = await Promise.all(
        batch.map(async (uuid) => {
          try {
            const items = await fetchSectionDetailsV2(uuid)
            return { uuid, items, errored: false }
          } catch {
            return { uuid, items: [] as UberEatsItem[], errored: true }
          }
        })
      )
      for (const { uuid, items, errored } of results) {
        if (errored) v2Stats.sectionsErrored++
        else if (items.length === 0) v2Stats.sectionsZero++

        const category = categoryMap.get(uuid)!
        for (const item of items) {
          if (!productMap.has(item.uuid)) {
            const isUnavailable = !item.isAvailable || item.isSoldOut
            productMap.set(item.uuid, {
              id: item.uuid,
              categoryId: category.id,
              name: item.title,
              price: item.price / 100,
              image: item.imageUrl,
              ...(isUnavailable ? { unavailable: true } : {}),
            })
            v2Stats.itemsAdded++
          }
        }
      }
    }

    if (process.env.NODE_ENV !== "production") {
      console.log("[uber-eats-menu V2 expansion]", v2Stats)
    }

    const categories = Array.from(categoryMap.values())
    const products = Array.from(productMap.values())

    reclassifyProducts(categories, products)

    if (products.length < 50) {
      throw new Error(
        `[uber-eats-menu] Suspiciously low product count: ${products.length}. Possible API change or empty response.`
      )
    }

    return { categories, products }
  } catch (err) {
    throw new Error(`[uber-eats-menu] Failed to fetch menu: ${err}`)
  }
}

// One shared fetch result per build/revalidation cycle.
// Both home (/) and /selection call getMenu() — they hit the same cache key,
// so the Uber Eats API is called exactly once per 24 h cycle regardless of
// which page revalidates first.
// unstable_cache is deprecated in Next.js 16 in favour of "use cache", but
// "use cache" requires cacheComponents: true and its runtime in-memory store
// does not persist across serverless invocations, making it unsuitable for
// cross-page deduplication on Vercel without a remote cache backend.
// unstable_cache hooks into Vercel's incremental cache (Data Cache) which
// DOES persist across invocations and is the correct tool here.
export const getMenu = unstable_cache(
  fetchUberEatsMenu,
  ["uber-eats-menu"],
  { revalidate: 86400 }
)
