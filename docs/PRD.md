# Product Requirements Document
# Town & Country Market — Brand Website

**Version:** 2.0 (Phased Approach)
**Date:** 2026-03-28
**Status:** Phase 1 Approved — Phase 2 Pending Owner Sign-Off

---

## 1. Executive Summary

Town & Country Market is a local, independent 24/7 convenience and grocery store with two locations in Mississauga, Ontario. This document defines a **two-phase delivery plan**:

- **Phase 1 (Pitch Demo):** A complete, polished frontend built with static content — no backend, no CMS. Purpose: demonstrate the brand vision to the owner and secure the engagement.
- **Phase 2 (Production):** Full Sanity CMS integration, real content management, Sanity Studio dashboard for the owner, Vercel deployment with custom domain.

---

## 2. Business Context

### The Business
- **Name:** Town & Country Market
- **Type:** Independent convenience and grocery store
- **Hours:** Open 24 hours a day, 7 days a week — both locations
- **Locations:**
  - Duke of York: 3885 Duke of York Blvd, Mississauga, ON · (905) 275-8696
  - Hurontario: 4033 Hurontario Rd, Mississauga, ON · (905) 275-9699
- **Delivery:** Uber Eats (listing to be confirmed)
- **Ownership:** Single owner — profitable, independent, not a chain

### The Situation
The developer has not yet spoken to the owner. Phase 1 is a speculative pitch deck in website form — built to demonstrate capability, brand vision, and the value of a professional web presence.

### The Goal of Phase 1
Show the owner:
1. What their brand *could* look like online — premium, clean, trustworthy
2. That the store is findable, well-represented, with real phone numbers and both locations
3. That delivery (Uber Eats) can be prominently featured
4. That a content management system (Phase 2) would let them manage everything themselves

---

## 3. Non-Goals (Both Phases)

- E-commerce / online checkout — no cart, no payment
- Real-time inventory or stock levels
- Deals or flyers sections (owner does not run promotions — TBC)
- Multi-language support
- Blog or news section
- Custom analytics dashboard

---

## 4. Phased Feature Plan

### Phase 1 — Pitch Demo (Build Now)

| Feature | Included | Notes |
|---|---|---|
| Home page (all sections) | ✅ | Static content |
| Our Selection page | ✅ | Hardcoded categories + sample products |
| Locations page | ✅ | Real addresses, real phone numbers |
| Order Online page | ✅ | Links to Uber Eats (URL TBC) |
| Real phone numbers | ✅ | (905) 275-8696 · (905) 275-9699 |
| Google Maps embeds | ✅ | Static iframe embeds |
| Click-to-call links | ✅ | `tel:` on all phones |
| Pricing display | ✅ (demo only) | Show a few sample products with prices to demonstrate the design — not real prices |
| Local SEO / JSON-LD | ✅ | Full schema in HTML |
| Mobile responsive | ✅ | Mobile-first |
| Sanity CMS | ❌ | Phase 2 |
| Owner dashboard | ❌ | Phase 2 |
| Custom domain | ❌ | Phase 2 |
| Logo file | ❌ | Text logo fallback for now |
| Real product photos | ❌ | Placeholder styling for now |

### Phase 2 — Production (After Owner Approval)

| Feature | Notes |
|---|---|
| Sanity CMS integration | Owner manages all content via Studio |
| Sanity Studio at `/studio` | Owner/staff login via Google |
| Full product catalogue | Owner enters products; pre-seeded with categories |
| Logo upload in Studio | Owner can update brand logo without developer |
| Real store photos | Uploaded to Sanity image CDN |
| Price fields (optional) | Regular price + optional sale price; display only, no cart |
| ISR revalidation | Sanity webhook → site updates on publish |
| Custom domain | Owner purchases; connected via Vercel |
| Uber Eats deep link | Confirmed URL from owner's listing |
| Sanity account setup | Guided setup with developer |

---

## 5. Content for Phase 1 (Known Data)

| Piece | Status |
|---|---|
| Store name | Town & Country Market |
| Tagline | "Your neighbourhood, always open." |
| Hours | Open 24 Hours · 7 Days a Week |
| Duke of York address | 3885 Duke of York Blvd, Mississauga, ON |
| Duke of York phone | (905) 275-8696 |
| Hurontario address | 4033 Hurontario Rd, Mississauga, ON |
| Hurontario phone | (905) 275-9699 |
| Uber Eats URL | TBC — to be found or provided by owner |
| Logo | Text fallback — logo file TBC |
| Store photos | TBC — available on Google Maps per owner |
| Prices | TBC — show demo prices only in Phase 1 |

---

## 6. Product Categories (Phase 1)

All 12 categories pre-seeded in static content:
Fresh Produce · Home-Made Bakery · Dairy · Grocery · Chai & Coffee · Bread · Beer & Wine · Frozen Foods · Ice Cream · Chocolates · Rice & Grains · Lottery

A small sample of products (3–5 per category) pre-seeded for demo purposes.

---

## 7. Design Direction

- **Feel:** Premium, clean, urban, trustworthy — local brand, not a discount chain
- **Base:** Light (warm off-white) — dark used selectively for hero/footer/CTA band
- **Font:** Plus Jakarta Sans
- **Accent:** Warm gold `#b8894e`
- **Mobile-first**
- **No heavy animations** — CSS transitions only

---

## 8. Success Criteria — Phase 1

- [ ] Site runs locally (`npm run dev`)
- [ ] All 4 pages render correctly on mobile and desktop
- [ ] Real phone numbers present and tap-to-call on mobile
- [ ] Both locations shown with Google Maps
- [ ] Sample products shown in the selection page
- [ ] `npm run build` passes with zero errors
- [ ] Looks premium enough to pitch to the owner

---

## 9. Success Criteria — Phase 2

- [ ] Owner can log into Sanity Studio and manage content without developer help
- [ ] Site updates within seconds of publishing in Studio
- [ ] `npm run build` passes, Lighthouse ≥ 90
- [ ] Live on custom domain with HTTPS
