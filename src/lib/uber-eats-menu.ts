import type { Category, Product } from "./types"
import { CATEGORIES, SAMPLE_PRODUCTS } from "./content"

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
  const sections: UberEatsCatalogSection[] = Object.values(csm)[0] ?? []
  const paging = json.data.catalogSectionPagingInfo ?? {}
  const nextOffset = sections.length > 0 && paging.offset ? (paging.offset as number) : null

  return { sections, nextOffset }
}

export async function fetchUberEatsMenu(): Promise<{ categories: Category[]; products: Product[] }> {
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

    const categories: Category[] = []
    const products: Product[] = []

    for (const sec of allSections) {
      const sip = sec.payload.standardItemsPayload
      if (!sip || sip.catalogItems.length === 0) continue

      const category: Category = {
        id: sec.catalogSectionUUID,
        name: sip.title.text,
        icon: SECTION_ICON[sip.title.text] ?? "ShoppingBasket",
        description: "",
      }
      categories.push(category)

      for (const item of sip.catalogItems) {
        if (!item.isAvailable || item.isSoldOut) continue
        products.push({
          id: item.uuid,
          categoryId: category.id,
          name: item.title,
          price: item.price / 100,
          image: item.imageUrl,
        })
      }
    }

    return { categories, products }
  } catch (err) {
    console.warn("[uber-eats-menu] Fetch failed, using static fallback:", err)
    return { categories: CATEGORIES, products: SAMPLE_PRODUCTS }
  }
}
