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
  "Snacks": "Candy",
  "Snacks & Cookies": "Candy",
  "Frozen Food": "Snowflake",
  "Fruits & Vegetables": "Leaf",
  "Fresh Fruits": "Leaf",
  "Fresh Vegetables": "Leaf",
  "Bakery": "Croissant",
  "Beverages": "Coffee",
  "Dairy & Eggs": "Milk",
  "Pantry & Groceries": "ShoppingBasket",
  "Pasta": "Wheat",
}

export async function fetchUberEatsMenu(): Promise<{ categories: Category[]; products: Product[] }> {
  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        "x-csrf-token": "x",
      },
      body: JSON.stringify({ storeUuid: STORE_UUID }),
      next: { revalidate: 86400 },
    })

    if (!res.ok) throw new Error(`HTTP ${res.status}`)

    const json = await res.json()
    if (json.status !== "success") throw new Error(json.data?.message ?? "API error")

    const catalogSectionsMap = json.data.catalogSectionsMap as Record<string, UberEatsCatalogSection[]>
    const sections: UberEatsCatalogSection[] = Object.values(catalogSectionsMap)[0]

    const categories: Category[] = []
    const products: Product[] = []

    for (const sec of sections) {
      const sip = sec.payload.standardItemsPayload
      if (!sip) continue

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
