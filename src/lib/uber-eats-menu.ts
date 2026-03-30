import { unstable_cache } from "next/cache"
import type { Category, Product } from "./types"

const STORE_UUID = "0e9689b2-344c-504f-9428-c7c52cd56a8f"
const API_URL = "https://www.ubereats.com/api/getStoreV1"

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

// Layer 2: comprehensive keyword taxonomy — first match wins
// fallbacks[] are tried in order if the primary target section doesn't exist in live data
type TaxonomyRule = { keywords: string[]; target: string; fallbacks?: string[] }

const KEYWORD_TAXONOMY: TaxonomyRule[] = [
  // Cookies & biscuits (try "Snacks & Cookies" first, fall back to "Snacks" or "Bakery")
  {
    keywords: [
      "cookie", "cookies", "biscuit", "biscuits", "ladyfinger", "lady finger",
      "wafer", "shortbread", "graham", "fig bar", "animal cracker", "oreo",
      "digestive", "petit beurre", "stroopwafel",
    ],
    target: "Snacks & Cookies",
    fallbacks: ["Snacks", "Bakery"],
  },
  // Bakery — cakes, breads, pastries
  {
    keywords: [
      "cake", "cupcake", "muffin", "donut", "doughnut", "brownie", "tart", "danish",
      "croissant", "eclair", "profiterole", "cheesecake", "pound cake", "coffee cake",
      "bread", "loaf", "bagel", "pita", "wrap", "tortilla", "english muffin",
      "scone", "naan", "brioche", "focaccia", "rye bread", "sourdough", "baguette",
      "ciabatta", "flatbread", "pumpernickel", "challah",
    ],
    target: "Bakery",
  },
  // Ice cream & frozen desserts that appear in Dairy
  {
    keywords: [
      "ice cream", "gelato", "sorbet", "popsicle", "frozen yogurt", "ice bar",
      "fudgesicle", "creamsicle", "drumstick", "ice sandwich", "frozen treat",
    ],
    target: "Frozen Food",
  },
  // Other frozen foods
  {
    keywords: [
      "frozen pizza", "frozen meal", "tv dinner", "pot pie", "hash brown",
      "frozen fries", "frozen waffle", "frozen burger", "frozen burrito",
      "frozen entree", "frozen dinner",
    ],
    target: "Frozen Food",
  },
  // Chocolates & candy
  {
    keywords: [
      "chocolate", "gummy", "lollipop", "jelly bean", "jelly beans", "candy bar",
      "licorice", "gumball", "truffle", "fudge", "toffee", "praline", "nougat",
      "marshmallow", "taffy", "mint chocolate", "peanut brittle", "candy",
    ],
    target: "Sweets & Chocolates",
  },
  // Beverages — hot and cold
  {
    keywords: [
      "juice", "smoothie", "lemonade", "fruit punch", "cocktail juice",
      "tea", "coffee", "water", "soda", "pop", "sparkling", "energy drink",
      "sports drink", "kombucha", "kool-aid", "nestea", "perrier", "latte",
      "hot chocolate", "cider", "coconut water", "almond milk", "oat milk",
      "soy milk", "rice milk",
    ],
    target: "Beverages",
    fallbacks: ["Soft Drinks"],
  },
  // Salty snacks
  {
    keywords: [
      "chips", "pretzels", "popcorn", "pork rinds", "pork cracklings",
      "granola bar", "protein bar", "trail mix", "jerky", "mixed nuts",
      "dried fruit", "seeds", "rice cracker", "veggie straw", "puffed",
    ],
    target: "Snacks",
    fallbacks: ["Snacks & Cookies"],
  },
  // Pasta & noodles
  {
    keywords: [
      "pasta", "spaghetti", "penne", "fusilli", "rigatoni", "linguine",
      "fettuccine", "macaroni", "orzo", "lasagna", "noodle", "vermicelli",
      "rotini", "farfalle", "gnocchi",
    ],
    target: "Pasta",
  },
]

// Layer 3 section gates: if a product is in a gated section and its name contains
// none of the allowed keywords, force it through the taxonomy.
const SECTION_GATES: Record<string, string[]> = {
  "Dairy & Eggs": [
    "milk", "milks", "cheese", "butter", "yogurt", "yoghurt", "cream", "egg", "eggs",
    "cheddar", "mozzarella", "brie", "feta", "parmesan", "ricotta", "kefir",
    "ghee", "margarine", "whipped", "sour cream", "cottage", "custard",
    "quiche", "omelette", "lactose", "dairy", "dip", "spread", "provolone",
    "gouda", "havarti", "colby", "jack cheese", "swiss", "camembert",
  ],
}

// Resolve a target section name to a category id, trying fallbacks if needed
function resolveTarget(
  target: string,
  fallbacks: string[] | undefined,
  nameToId: Map<string, string>
): string | undefined {
  const primary = nameToId.get(target.toLowerCase())
  if (primary) return primary
  for (const fb of fallbacks ?? []) {
    const id = nameToId.get(fb.toLowerCase())
    if (id) return id
  }
  return undefined
}

// Classify a product name through the taxonomy; returns a category id or undefined
function classifyByTaxonomy(
  nameLower: string,
  nameToId: Map<string, string>
): string | undefined {
  for (const rule of KEYWORD_TAXONOMY) {
    if (rule.keywords.some((kw) => nameLower.includes(kw))) {
      return resolveTarget(rule.target, rule.fallbacks, nameToId)
    }
  }
  return undefined
}

function reclassifyProducts(categories: Category[], products: Product[]): void {
  // Build lowercase section-name → category.id lookup
  const nameToId = new Map<string, string>()
  for (const cat of categories) {
    nameToId.set(cat.name.toLowerCase(), cat.id)
  }

  // Build id → lowercase section-name lookup (for gate checks)
  const idToName = new Map<string, string>()
  for (const cat of categories) {
    idToName.set(cat.id, cat.name.toLowerCase())
  }

  for (const product of products) {
    const nameLower = product.name.toLowerCase()

    // Layer 1: exact brand/product overrides
    let targetId: string | undefined
    for (const [key, targetSection] of Object.entries(PRODUCT_OVERRIDES)) {
      if (nameLower.includes(key)) {
        targetId = nameToId.get(targetSection.toLowerCase())
        break
      }
    }

    // Layer 2: comprehensive keyword taxonomy
    if (!targetId) {
      targetId = classifyByTaxonomy(nameLower, nameToId)
    }

    // Apply layers 1 & 2 result
    if (targetId && targetId !== product.categoryId) {
      product.categoryId = targetId
    }
  }

  // Layer 3: section gate pass — catch anything that slipped through
  for (const product of products) {
    const currentSectionName = idToName.get(product.categoryId) ?? ""
    // Find if this product is in a gated section (case-insensitive section name match)
    const gateKey = Object.keys(SECTION_GATES).find(
      (k) => k.toLowerCase() === currentSectionName
    )
    if (!gateKey) continue

    const allowed = SECTION_GATES[gateKey]
    const nameLower = product.name.toLowerCase()
    const belongsHere = allowed.some((kw) => nameLower.includes(kw))
    if (belongsHere) continue

    // Doesn't belong — try taxonomy
    const targetId = classifyByTaxonomy(nameLower, nameToId)
    if (targetId && targetId !== product.categoryId) {
      product.categoryId = targetId
    }
    // If no taxonomy match, leave in place (never orphan)
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
