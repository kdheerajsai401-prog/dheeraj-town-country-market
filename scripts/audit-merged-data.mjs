/**
 * audit-merged-data.mjs — one-shot QA audit of V1 + V2 merged dataset.
 * Read-only. Does not modify any production code.
 *
 * Reports:
 *   1. Sample of 20 products across categories
 *   2. Noise heuristics: modifiers, low-price items, junk patterns, dup names
 *   3. Image/price coverage
 */

const STORE_UUID = "0e9689b2-344c-504f-9428-c7c52cd56a8f"
const V1_URL = "https://www.ubereats.com/api/getStoreV1"
const V2_URL = "https://www.ubereats.com/_p/api/getCatalogPresentationV2"
const V2_CONCURRENCY = 5

const HEADERS = {
  "Content-Type": "application/json",
  Accept: "application/json",
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  "x-csrf-token": "x",
}

// ─── V1 fetch (mirror of uber-eats-menu.ts) ─────────────────────────────────

async function fetchV1Page(offset) {
  const body = { storeUuid: STORE_UUID }
  if (offset !== undefined) body.catalogSectionOffset = offset
  const res = await fetch(V1_URL, { method: "POST", headers: HEADERS, body: JSON.stringify(body) })
  if (!res.ok) throw new Error(`V1 HTTP ${res.status}`)
  const json = await res.json()
  if (json.status !== "success") throw new Error("V1 non-success")
  const csm = json.data?.catalogSectionsMap ?? {}
  const sections = Object.values(csm).flat()
  const paging = json.data?.catalogSectionPagingInfo ?? {}
  const nextOffset = sections.length > 0 && paging.offset != null && paging.offset !== 0 ? paging.offset : null
  return { sections, nextOffset }
}

async function fetchAllV1() {
  const allSections = []
  const first = await fetchV1Page()
  allSections.push(...first.sections)
  let next = first.nextOffset
  while (next !== null) {
    const page = await fetchV1Page(next)
    if (page.sections.length === 0) break
    allSections.push(...page.sections)
    next = page.nextOffset
  }
  return allSections
}

// ─── V2 fetch (mirror) ──────────────────────────────────────────────────────

function extractV2(json) {
  const items = []
  const seen = new Set()
  function walk(node) {
    if (!node || typeof node !== "object") return
    if (Array.isArray(node)) { for (const c of node) walk(c); return }
    if (Array.isArray(node.catalogItems)) {
      for (const c of node.catalogItems) {
        if (c?.uuid && c?.title && typeof c.price === "number" && !seen.has(c.uuid)) {
          seen.add(c.uuid)
          items.push(c)
        }
      }
    }
    for (const v of Object.values(node)) if (v && typeof v === "object") walk(v)
  }
  try { walk(json) } catch { return [] }
  return items
}

async function fetchSectionV2(sectionUuid) {
  for (const includeSectionTypes of [true, false]) {
    const body = {
      sortAndFilters: null,
      storeFilters: { storeUuid: STORE_UUID, sectionUuids: [sectionUuid], subsectionUuids: null },
    }
    if (includeSectionTypes) body.sectionTypes = ["COLLECTION"]
    try {
      const res = await fetch(V2_URL, { method: "POST", headers: HEADERS, body: JSON.stringify(body) })
      if (!res.ok) continue
      const json = await res.json()
      if (json?.status !== "success") continue
      const items = extractV2(json)
      if (items.length > 0) return items
    } catch { continue }
  }
  return []
}

// ─── build merged dataset (mirror of fetchUberEatsMenu) ─────────────────────

async function buildMerged() {
  const sections = await fetchAllV1()

  const categoryMap = new Map()   // uuid → { id, name }
  const productMap = new Map()    // itemUuid → { id, categoryId, categoryName, name, price, image, source: 'V1'|'V2' }

  // Phase A: V1
  for (const sec of sections) {
    const sip = sec.payload?.standardItemsPayload
    if (!sip || sip.catalogItems.length === 0) continue
    if (!categoryMap.has(sec.catalogSectionUUID)) {
      categoryMap.set(sec.catalogSectionUUID, { id: sec.catalogSectionUUID, name: sip.title.text })
    }
    const category = categoryMap.get(sec.catalogSectionUUID)
    for (const item of sip.catalogItems) {
      if (!productMap.has(item.uuid)) {
        productMap.set(item.uuid, {
          id: item.uuid,
          categoryId: category.id,
          categoryName: category.name,
          name: item.title,
          price: item.price / 100,
          image: item.imageUrl ?? null,
          source: "V1",
          isAvailable: item.isAvailable,
          isSoldOut: item.isSoldOut,
        })
      }
    }
  }

  // Phase B: V2 expansion
  const sectionUuids = Array.from(categoryMap.keys())
  for (let i = 0; i < sectionUuids.length; i += V2_CONCURRENCY) {
    const batch = sectionUuids.slice(i, i + V2_CONCURRENCY)
    const results = await Promise.all(batch.map(async (uuid) => ({ uuid, items: await fetchSectionV2(uuid) })))
    for (const { uuid, items } of results) {
      const category = categoryMap.get(uuid)
      for (const item of items) {
        if (!productMap.has(item.uuid)) {
          productMap.set(item.uuid, {
            id: item.uuid,
            categoryId: category.id,
            categoryName: category.name,
            name: item.title,
            price: item.price / 100,
            image: item.imageUrl ?? null,
            source: "V2",
            isAvailable: item.isAvailable ?? true,
            isSoldOut: item.isSoldOut ?? false,
          })
        }
      }
    }
  }

  return { categories: Array.from(categoryMap.values()), products: Array.from(productMap.values()) }
}

// ─── audit logic ────────────────────────────────────────────────────────────

function pad(s, n) { return String(s).padEnd(n).slice(0, n) }

async function main() {
  console.log("Fetching V1 + V2 merged dataset...")
  const { categories, products } = await buildMerged()
  console.log(`Done. ${products.length} unique products across ${categories.length} categories.\n`)

  // ─── 1. SAMPLE OF 20 ──────────────────────────────────────────────────────
  // Spread sample across categories: pick ~1 from each of the top 20 categories by size,
  // pick from middle of category to avoid always-best-sellers.
  const byCategory = new Map()
  for (const p of products) {
    if (!byCategory.has(p.categoryName)) byCategory.set(p.categoryName, [])
    byCategory.get(p.categoryName).push(p)
  }
  const cats = Array.from(byCategory.entries()).sort((a, b) => b[1].length - a[1].length)
  const sample = []
  let idx = 0
  while (sample.length < 20 && idx < cats.length) {
    const [, items] = cats[idx]
    if (items.length > 0) {
      // Pick from middle so we don't always grab same items
      sample.push(items[Math.floor(items.length / 2)])
    }
    idx++
  }
  // Pad with random items if fewer than 20 categories
  while (sample.length < 20) {
    sample.push(products[Math.floor(Math.random() * products.length)])
  }

  console.log("═".repeat(115))
  console.log(" 1. SAMPLE AUDIT — 20 products across mixed categories")
  console.log("═".repeat(115))
  console.log(
    `  ${pad("Name", 50)} | ${pad("Category", 22)} | ${pad("Price", 8)} | Src | Notes`
  )
  console.log("  " + "─".repeat(110))
  for (const p of sample) {
    const notes = []
    if (!p.image) notes.push("no image")
    if (p.price === 0) notes.push("$0")
    if (p.price < 0.5) notes.push("very low price")
    if (p.isSoldOut) notes.push("sold out")
    if (!p.isAvailable) notes.push("unavailable")
    const lower = p.name.toLowerCase()
    if (/^(add|extra|side of|choose|pick)\b/.test(lower)) notes.push("modifier-like")
    if (/\b(test|do not|internal|sample)\b/.test(lower)) notes.push("test/junk-like")
    console.log(
      `  ${pad(p.name, 50)} | ${pad(p.categoryName, 22)} | ${pad("$" + p.price.toFixed(2), 8)} | ${p.source}  | ${notes.join(", ") || "—"}`
    )
  }

  // ─── 2. NOISE HEURISTICS ──────────────────────────────────────────────────
  console.log("\n" + "═".repeat(115))
  console.log(" 2. NOISE HEURISTICS — full dataset scan")
  console.log("═".repeat(115))

  const noImage = products.filter((p) => !p.image)
  const zeroPrice = products.filter((p) => p.price === 0)
  const veryLowPrice = products.filter((p) => p.price > 0 && p.price < 0.5)
  const modifierLike = products.filter((p) => /^(add|extra|side of|choose|pick)\b/i.test(p.name))
  const junkLike = products.filter((p) => /\b(test|do not|internal|sample only|delete me)\b/i.test(p.name))
  const veryShortName = products.filter((p) => p.name.trim().length < 4)
  const unavailable = products.filter((p) => !p.isAvailable || p.isSoldOut)

  // Duplicate names (different UUID, same name)
  const nameCount = new Map()
  for (const p of products) {
    const k = p.name.toLowerCase().trim()
    nameCount.set(k, (nameCount.get(k) ?? 0) + 1)
  }
  const dupNames = Array.from(nameCount.entries()).filter(([, c]) => c > 1)

  console.log(`  Items missing image           : ${noImage.length} / ${products.length} (${(noImage.length / products.length * 100).toFixed(1)}%)`)
  console.log(`  Items with $0 price           : ${zeroPrice.length}`)
  console.log(`  Items with price < $0.50      : ${veryLowPrice.length}`)
  console.log(`  Modifier-like names           : ${modifierLike.length}  (e.g. "Add cheese", "Extra sauce")`)
  console.log(`  Test/junk-like names          : ${junkLike.length}`)
  console.log(`  Very short names (<4 chars)   : ${veryShortName.length}`)
  console.log(`  Unavailable / sold-out items  : ${unavailable.length}`)
  console.log(`  Duplicate-name pairs          : ${dupNames.length}  (same name, different UUID)`)

  if (modifierLike.length > 0) {
    console.log("\n  Modifier-like items found:")
    for (const p of modifierLike.slice(0, 10)) {
      console.log(`    - "${p.name}"  (${p.categoryName}, $${p.price.toFixed(2)}, ${p.source})`)
    }
    if (modifierLike.length > 10) console.log(`    ... +${modifierLike.length - 10} more`)
  }

  if (zeroPrice.length > 0) {
    console.log("\n  $0-price items (first 10):")
    for (const p of zeroPrice.slice(0, 10)) {
      console.log(`    - "${p.name}"  (${p.categoryName}, ${p.source})`)
    }
    if (zeroPrice.length > 10) console.log(`    ... +${zeroPrice.length - 10} more`)
  }

  if (junkLike.length > 0) {
    console.log("\n  Junk-like items:")
    for (const p of junkLike.slice(0, 10)) {
      console.log(`    - "${p.name}"  (${p.categoryName}, ${p.source})`)
    }
  }

  if (dupNames.length > 0) {
    console.log("\n  Duplicate names (first 10):")
    for (const [name, count] of dupNames.slice(0, 10)) {
      const samples = products.filter((p) => p.name.toLowerCase().trim() === name).slice(0, 2)
      console.log(`    - "${samples[0].name}" appears ${count}× across:`)
      for (const s of samples) {
        console.log(`        in ${s.categoryName}, $${s.price.toFixed(2)}, ${s.source}, uuid=${s.id.slice(0, 8)}`)
      }
    }
    if (dupNames.length > 10) console.log(`    ... +${dupNames.length - 10} more`)
  }

  // ─── 3. SOURCE BREAKDOWN ──────────────────────────────────────────────────
  const v1Count = products.filter((p) => p.source === "V1").length
  const v2Count = products.filter((p) => p.source === "V2").length
  const v2NoImage = products.filter((p) => p.source === "V2" && !p.image).length
  const v2ZeroPrice = products.filter((p) => p.source === "V2" && p.price === 0).length

  console.log("\n" + "═".repeat(115))
  console.log(" 3. V1 vs V2 BREAKDOWN — is V2 adding noise?")
  console.log("═".repeat(115))
  console.log(`  V1-sourced products           : ${v1Count}`)
  console.log(`  V2-sourced products           : ${v2Count}`)
  console.log(`  V2 items missing image        : ${v2NoImage} / ${v2Count} (${(v2NoImage / v2Count * 100).toFixed(1)}%)`)
  console.log(`  V2 items with $0 price        : ${v2ZeroPrice}`)
  console.log(`  V1 items missing image        : ${products.filter((p) => p.source === "V1" && !p.image).length} / ${v1Count}`)

  console.log("\n" + "═".repeat(115))
}

main().catch((err) => {
  console.error("Fatal:", err)
  process.exit(1)
})
