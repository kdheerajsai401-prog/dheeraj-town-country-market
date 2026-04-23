/**
 * debug-uber-menu.mjs
 *
 * Fetches the raw Uber Eats store catalog page by page and reports every
 * product whose title contains a search term (default: "natrel" or "natural").
 * Nothing is parsed, deduped, or reclassified — this is the raw API surface.
 *
 * Usage:
 *   node scripts/debug-uber-menu.mjs
 *   node scripts/debug-uber-menu.mjs "natrel"
 *   node scripts/debug-uber-menu.mjs "natrel,core power,oikos"
 *
 * Requires Node 18+ (built-in fetch).
 */

const STORE_UUID = "0e9689b2-344c-504f-9428-c7c52cd56a8f"
const API_URL = "https://www.ubereats.com/api/getStoreV1"
const CATALOG_V2_URL = "https://www.ubereats.com/_p/api/getCatalogPresentationV2"
const V2_CONCURRENCY = 5

// Search terms from CLI args, or default
const rawTerms = process.argv[2] ?? "natrel,natural"
const SEARCH_TERMS = rawTerms.split(",").map((t) => t.trim().toLowerCase()).filter(Boolean)

// ─── helpers ────────────────────────────────────────────────────────────────

function formatPrice(cents) {
  if (cents == null || cents === 0) return "—"
  return `$${(cents / 100).toFixed(2)}`
}

function matchesAnyTerm(title) {
  const lower = title.toLowerCase()
  return SEARCH_TERMS.some((t) => lower.includes(t))
}

// ─── fetch one page ──────────────────────────────────────────────────────────

async function fetchPage(offset) {
  const body = { storeUuid: STORE_UUID }
  if (offset !== undefined) body.catalogSectionOffset = offset

  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
      "x-csrf-token": "x",
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    throw new Error(`HTTP ${res.status} ${res.statusText}`)
  }

  const json = await res.json()

  if (json.status !== "success") {
    throw new Error(
      `API returned non-success: ${json.data?.message ?? JSON.stringify(json).slice(0, 200)}`
    )
  }

  const csm = json.data?.catalogSectionsMap ?? {}
  const paging = json.data?.catalogSectionPagingInfo ?? {}
  const sections = Object.values(csm).flat()

  return { sections, paging, raw: json }
}

// ─── V2 helpers (mirror uber-eats-menu.ts) ──────────────────────────────────

function extractItemsFromV2Response(json) {
  const items = []
  const seen = new Set()
  function isPlausibleItem(x) {
    return (
      x &&
      typeof x === "object" &&
      typeof x.uuid === "string" &&
      typeof x.title === "string" &&
      typeof x.price === "number"
    )
  }
  function walk(node) {
    if (!node || typeof node !== "object") return
    if (Array.isArray(node)) {
      for (const c of node) walk(c)
      return
    }
    if (Array.isArray(node.catalogItems)) {
      for (const cand of node.catalogItems) {
        if (isPlausibleItem(cand) && !seen.has(cand.uuid)) {
          seen.add(cand.uuid)
          items.push(cand)
        }
      }
    }
    for (const v of Object.values(node)) {
      if (v && typeof v === "object") walk(v)
    }
  }
  try { walk(json) } catch { return [] }
  return items
}

async function fetchSectionV2(sectionUuid) {
  for (const includeSectionTypes of [true, false]) {
    const body = {
      sortAndFilters: null,
      storeFilters: {
        storeUuid: STORE_UUID,
        sectionUuids: [sectionUuid],
        subsectionUuids: null,
      },
    }
    if (includeSectionTypes) body.sectionTypes = ["COLLECTION"]

    try {
      const res = await fetch(CATALOG_V2_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
          "x-csrf-token": "x",
        },
        body: JSON.stringify(body),
      })
      if (!res.ok) continue
      const json = await res.json()
      if (json?.status !== "success") continue
      const items = extractItemsFromV2Response(json)
      if (items.length > 0) return { items, errored: false }
    } catch {
      continue
    }
  }
  return { items: [], errored: false }   // empty but not errored
}

async function fetchSectionV2Safe(sectionUuid) {
  try {
    return await fetchSectionV2(sectionUuid)
  } catch {
    return { items: [], errored: true }
  }
}

// ─── main ────────────────────────────────────────────────────────────────────

async function main() {
  console.log("═".repeat(60))
  console.log(" Uber Eats raw catalog inspector")
  console.log(` Store UUID : ${STORE_UUID}`)
  console.log(` Search     : ${SEARCH_TERMS.map((t) => `"${t}"`).join(", ")}`)
  console.log("═".repeat(60))

  const allMatches = []   // { pageNum, offset, sectionName, sectionUUID, item }
  // Track V1 per-section item UUIDs for V2 comparison later
  const v1SectionItems = new Map()   // sectionUUID → Set<itemUuid>
  const v1SectionNames = new Map()   // sectionUUID → section name
  const v1AllItemUuids = new Set()
  let pageNum = 0
  let nextOffset = undefined  // undefined = initial request (no offset param)
  let keepGoing = true

  while (keepGoing) {
    pageNum++
    const label = nextOffset === undefined ? "initial" : nextOffset

    console.log(`\n${"─".repeat(60)}`)
    console.log(` PAGE ${pageNum}  (catalogSectionOffset=${label})`)
    console.log("─".repeat(60))

    let result
    try {
      result = await fetchPage(nextOffset)
    } catch (err) {
      console.error(`  ✗ Fetch failed: ${err.message}`)
      break
    }

    const { sections, paging } = result

    console.log(`  paging info : ${JSON.stringify(paging)}`)
    console.log(`  sections    : ${sections.length}`)

    if (sections.length === 0) {
      console.log("  (no sections on this page — stopping)")
      break
    }

    // Count all products on this page
    let totalItemsThisPage = 0
    let matchesThisPage = 0

    for (const sec of sections) {
      const sip = sec.payload?.standardItemsPayload
      if (!sip) continue

      const sectionName = sip.title?.text ?? "(unnamed)"
      const sectionUUID = sec.catalogSectionUUID

      // Track for V2 comparison phase
      if (!v1SectionItems.has(sectionUUID)) {
        v1SectionItems.set(sectionUUID, new Set())
        v1SectionNames.set(sectionUUID, sectionName)
      }
      const sectionItemSet = v1SectionItems.get(sectionUUID)

      for (const item of sip.catalogItems ?? []) {
        totalItemsThisPage++
        sectionItemSet.add(item.uuid)
        v1AllItemUuids.add(item.uuid)

        if (!matchesAnyTerm(item.title)) continue

        matchesThisPage++
        allMatches.push({ pageNum, offset: label, sectionName, sectionUUID, item })

        const matchedTerms = SEARCH_TERMS.filter((t) =>
          item.title.toLowerCase().includes(t)
        )
        console.log(`\n  ✓ MATCH (term: ${matchedTerms.join(", ")})`)
        console.log(`    title       : ${item.title}`)
        console.log(`    section     : "${sectionName}"`)
        console.log(`    sectionUUID : ${sectionUUID}`)
        console.log(`    item UUID   : ${item.uuid}`)
        console.log(`    price       : ${formatPrice(item.price)}`)
        console.log(`    isAvailable : ${item.isAvailable}`)
        console.log(`    isSoldOut   : ${item.isSoldOut}`)
      }
    }

    console.log(`\n  products on this page : ${totalItemsThisPage}`)
    console.log(`  matches on this page  : ${matchesThisPage}`)

    // Determine whether there is a next page.
    // The Uber Eats API sets paging.offset to the next offset when more pages
    // exist, and to 0 (or omits it) when this is the last page.
    const rawNext = paging.offset
    if (rawNext != null && rawNext !== 0) {
      nextOffset = rawNext
    } else {
      keepGoing = false
    }
  }

  // ─── final report ──────────────────────────────────────────────────────────

  console.log("\n" + "═".repeat(60))
  console.log(" FINAL REPORT")
  console.log("═".repeat(60))
  console.log(`  Total pages fetched     : ${pageNum}`)
  console.log(`  Total matches found     : ${allMatches.length}`)

  if (allMatches.length === 0) {
    console.log("\n  ✗ NO MATCHES FOUND IN RAW API RESPONSE.")
    console.log("\n  What this means:")
    console.log("    → These products do NOT exist in the public Uber Eats storefront.")
    console.log("    → They are either in a hidden/paused Uber section,")
    console.log("      or only visible in the merchant's internal tablet catalog.")
    console.log("    → Our pipeline is NOT the cause — the data simply isn't there.")
    console.log("    → Fix: ask the store owner to make those sections public on Uber Eats.")
  } else {
    const page1Matches = allMatches.filter((m) => m.pageNum === 1)
    const laterMatches = allMatches.filter((m) => m.pageNum > 1)

    console.log(`  Matches on page 1       : ${page1Matches.length}`)
    console.log(`  Matches on later pages  : ${laterMatches.length}`)

    if (laterMatches.length > 0) {
      console.log("\n  ⚠ MATCHES FOUND ON LATER PAGINATION PAGES.")
      console.log("\n  What this means:")
      console.log("    → The products exist in the API but were on page 2+.")
      console.log("    → If our production code stops after page 1,")
      console.log("      those products would never enter the pipeline.")
      console.log("    → Inspect the 'paging info' lines above to verify")
      console.log("      whether each page's offset was non-zero (more pages exist).")
      console.log("    → Fix: verify the pagination loop in fetchPage() terminates correctly.")
    }

    if (page1Matches.length > 0 && pageNum === 1) {
      console.log("\n  ✓ ALL MATCHES ARE ON PAGE 1 (only one page returned).")
      console.log("\n  What this means:")
      console.log("    → The API returned all data in a single page.")
      console.log("    → If the website is still missing these products,")
      console.log("      the problem is in our pipeline AFTER fetching:")
      console.log("      deduplication, reclassification, or the ISR cache")
      console.log("      is serving a stale build that predates the product.")
    }

    console.log("\n  Matched items summary:")
    for (const { pageNum: pg, sectionName, item } of allMatches) {
      const avail = item.isAvailable ? "available" : "unavailable"
      const sold = item.isSoldOut ? ", soldOut" : ""
      console.log(`    [page ${pg}] "${item.title}"  →  section: "${sectionName}"  (${avail}${sold})`)
    }

    const unavailableMatches = allMatches.filter(
      (m) => !m.item.isAvailable || m.item.isSoldOut
    )
    if (unavailableMatches.length > 0) {
      console.log(`\n  ⚠ ${unavailableMatches.length} match(es) are unavailable/soldOut.`)
      console.log("    These will appear on the website with a grayscale 'Unavailable' badge.")
    }
  }

  // ═════════════════════════════════════════════════════════════════════════
  //  PHASE B — V2 PER-SECTION PROBE
  // ═════════════════════════════════════════════════════════════════════════
  console.log("\n" + "═".repeat(60))
  console.log(" PHASE B — getCatalogPresentationV2 per-section probe")
  console.log("═".repeat(60))

  const sectionUuids = Array.from(v1SectionItems.keys())
  const perSection = []   // { uuid, name, v1Count, v2Count, newCount, status }
  const v2NewItemUuids = new Set()

  for (let i = 0; i < sectionUuids.length; i += V2_CONCURRENCY) {
    const batch = sectionUuids.slice(i, i + V2_CONCURRENCY)
    const results = await Promise.all(
      batch.map(async (uuid) => ({
        uuid,
        ...(await fetchSectionV2Safe(uuid)),
      }))
    )
    for (const { uuid, items, errored } of results) {
      const name = v1SectionNames.get(uuid) ?? "(unnamed)"
      const v1Set = v1SectionItems.get(uuid) ?? new Set()
      let newCount = 0
      for (const it of items) {
        if (!v1Set.has(it.uuid) && !v1AllItemUuids.has(it.uuid) && !v2NewItemUuids.has(it.uuid)) {
          v2NewItemUuids.add(it.uuid)
          newCount++
        }
      }
      const status = errored ? "error" : items.length === 0 ? "empty" : "ok"
      perSection.push({ uuid, name, v1Count: v1Set.size, v2Count: items.length, newCount, status })
    }
  }

  // Per-section table
  console.log("\n  section name                        | V1 | V2 | NEW | status")
  console.log("  " + "─".repeat(70))
  for (const row of perSection) {
    const truncName = row.name.length > 34 ? row.name.slice(0, 33) + "…" : row.name.padEnd(34)
    console.log(
      `  ${truncName} | ${String(row.v1Count).padStart(2)} | ${String(row.v2Count).padStart(2)} | ${String(row.newCount).padStart(3)} | ${row.status}`
    )
  }

  const okCount = perSection.filter((r) => r.status === "ok").length
  const emptyCount = perSection.filter((r) => r.status === "empty").length
  const errorCount = perSection.filter((r) => r.status === "error").length
  const v1Total = v1AllItemUuids.size
  const v2Added = v2NewItemUuids.size
  const combined = v1Total + v2Added
  const uplift = v1Total === 0 ? 0 : (v2Added / v1Total) * 100
  const verdict = uplift >= 25 ? "MEANINGFUL" : uplift >= 10 ? "MARGINAL" : "NOT WORTH IT"

  console.log("\n" + "═".repeat(60))
  console.log(" V1 + V2 COVERAGE REPORT")
  console.log("═".repeat(60))
  console.log(`  V1 unique products       : ${v1Total}`)
  console.log(`  V1 unique categories     : ${sectionUuids.length}`)
  console.log(`  V2 additional unique     : ${v2Added}`)
  console.log(`  Combined unique products : ${combined}`)
  console.log("")
  console.log(`  Sections probed via V2   : ${sectionUuids.length}`)
  console.log(`  Sections with V2 items   : ${okCount}`)
  console.log(`  Sections returning zero  : ${emptyCount}`)
  console.log(`  Sections with V2 errors  : ${errorCount}`)
  console.log("")
  console.log(`  Coverage uplift          : ${uplift.toFixed(1)}%`)
  console.log(`  Verdict                  : ${verdict}`)
  console.log("═".repeat(60) + "\n")
}

main().catch((err) => {
  console.error("\nFatal error:", err)
  process.exit(1)
})
