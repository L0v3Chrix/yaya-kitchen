# YaYa's Kitchen Revision Execution Plan
**Created:** 2026-02-11 19:40 CST
**Status:** 📋 PLANNING COMPLETE — Awaiting Authorization

---

## Architecture Overview

**Framework:** Next.js (App Router)
**Location:** `~/clawd/projects/yaya-kitchen/site/`
**Live:** https://yaya-kitchen.vercel.app
**Repo:** L0v3Chrix/yaya-kitchen

### Component Mapping

| Section | Component File | Changes |
|---------|---------------|---------|
| Hero | `src/components/sections/Hero.tsx` | Copy, styling |
| Weekly Basket | `src/components/sections/WeeklyBasket.tsx` | Copy |
| Core Kitchen | `src/components/sections/CoreKitchen.tsx` | Copy, image |
| Dinner Anchor | `src/components/sections/DinnerAnchor.tsx` | Rename, full rewrite |
| Flowers | `src/components/sections/Flowers.tsx` | None |
| Treats | `src/components/sections/DessertGallery.tsx` | Images |
| Arrival | `src/components/sections/ArrivalBaskets.tsx` | None |
| Meet YaYa | `src/components/sections/AboutYaya.tsx` | Copy |
| Order Form | `src/components/forms/OrderForm.tsx` | Fields, pricing |
| Footer | `src/components/layout/Footer.tsx` | Location |

---

## Execution Tasks (Ordered by Dependency)

### Phase 1: Copy & Content Updates (No Dependencies)
*Can execute immediately — text-only changes*

| Task | File | Change | Complexity |
|------|------|--------|------------|
| 1.1 | Hero.tsx | Darken gold script (#D4AF37 → #B8860B or darker) | Low |
| 1.2 | Hero.tsx | Update subheadline text | Low |
| 1.3 | Hero.tsx | Replace supporting text (full paragraph) | Low |
| 1.4 | Hero.tsx | Verify CTA = "Order Your Basket" | Low |
| 1.5 | WeeklyBasket.tsx | Update "What's Inside" description | Low |
| 1.6 | CoreKitchen.tsx | Update contents list + pricing | Medium |
| 1.7 | DinnerAnchor.tsx | Rename to "Weekly Dinner Basket" | Medium |
| 1.8 | DinnerAnchor.tsx | Update dinner type descriptions (Boards, Bowls, Classic) | Medium |
| 1.9 | DinnerAnchor.tsx | Add Optional Additions section | Medium |
| 1.10 | DinnerAnchor.tsx | Add pricing grid | Medium |
| 1.11 | DinnerAnchor.tsx | Add "CORE WEEKLY DINNERS" content block | Medium |
| 1.12 | AboutYaya.tsx | Replace bio/story text | Low |
| 1.13 | OrderForm.tsx | Update Item 2 pricing ($100-$155) | Low |
| 1.14 | OrderForm.tsx | Add gift basket option with address field | Medium |
| 1.15 | OrderForm.tsx | Rename Item 5 to "Delivery Preferences" + Friday note | Low |
| 1.16 | Footer.tsx | Change Wilmington NC → Longwood/Altamonte FL | Low |
| 1.17 | Footer.tsx | Update tagline to "Made with love in Central Florida" | Low |

**Phase 1 Estimate:** 14 low + 5 medium = ~45-60 minutes

---

### Phase 2: Image Updates (Available Images)
*Images already in repo*

| Task | File | Change | Image Source |
|------|------|--------|--------------|
| 2.1 | CoreKitchen.tsx | Replace raw bread photo → arrival-basket.webp | ✅ Available |

**Phase 2 Estimate:** ~5 minutes

---

### Phase 3: Image Updates (Client-Dependent)
*Blocked until client provides images*

| Task | File | Change | Image Needed |
|------|------|--------|--------------|
| 3.1 | DinnerAnchor.tsx | Replace soup image | #1571 |
| 3.2 | DessertGallery.tsx | Replace 1st image (chocolate cake) | #0236 |
| 3.3 | DessertGallery.tsx | Rotate cake image | #2005 (rotated) |

**Status:** ⚠️ BLOCKED — awaiting client images

---

### Phase 4: QA & Deploy

| Task | Description |
|------|-------------|
| 4.1 | Run dev server, visual review all sections |
| 4.2 | Test order form flow end-to-end |
| 4.3 | Mobile responsiveness check (375px, 390px, 428px) |
| 4.4 | Accessibility check (color contrast on gold text) |
| 4.5 | Git commit with descriptive message |
| 4.6 | Push to GitHub → Vercel auto-deploy |
| 4.7 | Verify production at yaya-kitchen.vercel.app |

**Phase 4 Estimate:** ~15-20 minutes

---

## Risk Assessment

| Risk | Mitigation |
|------|------------|
| Gold text still hard to read after darkening | Test multiple shades, add subtle text-shadow if needed |
| Order form gift field UX unclear | Use conditional reveal, clear labels |
| Image #1571, #0236, #2005 not provided | Document as pending, mark tasks blocked |
| Pricing display inconsistent | Standardize format across all mentions |

---

## Sub-Agent Delegation Plan

### Agent 1: Content & Copy (Phase 1)
- Handle all text/copy updates across 7 component files
- Expert skills: React/Next.js, TypeScript, Tailwind CSS
- Deliverable: All Phase 1 tasks complete, committed

### Agent 2: Styling & Design (Phase 1.1 + QA)
- Handle gold text color optimization
- Verify visual hierarchy and contrast
- Expert skills: CSS, Design Systems, Accessibility
- Deliverable: Approved color values, contrast ratios verified

### Agent 3: Form Logic (Phase 1.13-1.15)
- Handle order form field updates
- Add conditional gift basket address field
- Expert skills: React Forms, State Management, UX
- Deliverable: Working form with new fields

### Main Agent: Orchestration & QA
- Coordinate sub-agents
- Final QA and approval
- Deploy and verify

---

## Success Criteria

- [ ] All 17 Phase 1 tasks complete
- [ ] All Phase 2 tasks complete (available images)
- [ ] Phase 3 tasks documented as pending (blocked)
- [ ] All QA checks pass
- [ ] Production deployed and verified
- [ ] Client can see changes at live URL

---

## Execution Authorization

**Ready to execute Phase 1 & 2 immediately upon authorization.**

Phase 3 (client images) will be marked as pending until images are provided.

---

*Plan created: 2026-02-11 19:40 CST*
