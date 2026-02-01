# Implementation Notes — YaYa's Kitchen Mobile UX Rebuild

## Reference Site Analysis (lepainquotidien.com)

### Footer Navigation (Mobile)
**What we're cloning:**
- Grouped navigation sections with clear section headers (gold/yellow text)
- Section categories: EXPERIENCE, TARTINE CLUB, SUPPORT & SERVICES, PLACE YOUR ORDER, FOLLOW US
- Dark background (#1a1a1a or similar)
- Centered text alignment
- Generous vertical spacing between groups
- External link indicators for social/app links
- Language selector above footer groups
- Copyright and legal links at bottom

**What we're NOT cloning:**
- Exact colors/branding
- Specific section names (we'll adapt to YaYa's context)
- App download links (N/A for YaYa's)

### Parallax / Double Motion Effect
**What we're cloning:**
- Cards with inner media (images) that move at different speed than scroll
- Subtle scale + translateY on images as they enter viewport
- Smooth 60fps performance
- Only active when cards are near/in viewport (IntersectionObserver)

**What we're NOT cloning:**
- The exact timing/easing (we'll tune for our content)
- Video backgrounds (our content is static images)

### Header Navigation (Mobile)
**Reference pattern:**
- Text-based brand statement: "Le Pain Quotidien means The Daily Bread"
- Minimal nav: hamburger Menu button + key action (Locations)
- Clean, centered layout

---

## Spec Corrections to Implement

### C) Header Branding
**Current:** Logo image in navigation
**Required:** Text-based brand name centered in header

**Decision:** The prompt says "Yaya's Baskets" but our actual brand is "YaYa's Kitchen".
I will use **"YaYa's Kitchen"** with the tagline **"A small exhale for your week"** as the header text, following the LPQ pattern of "Le Pain Quotidien means The Daily Bread".

### D) Basket Detail UX
**Current:** "See What's Inside" links directly to order form
**Required:** Show basket contents/descriptions before pushing to order

**Implementation:**
- Create a modal/drawer that opens when "See What's Inside" is clicked
- Display basket name, description, contents list, pricing
- Include CTA to proceed to ordering

### E) Order Form Flow
**Current:** Form has contact info → basket selection → dinner anchor → add-ons → delivery acknowledgment
**Required per spec:** Multi-step selection matching wireframes

**Review of ORDER-FORM-SPEC.md shows:**
- Section 1: Contact Information (required)
- Section 2: Weekly Basket (Yes/No choice)
- Section 3: Dinner Anchor (conditional on basket=Yes)
- Section 4: Optional Add-Ons (smoothies, dessert, flowers)
- Section 5: One-Time & Traveler Options (arrival basket, pantry starter)
- Section 6: Containers & Deposit (acknowledgment)
- Section 7: Special Notes

**Assessment:** Current implementation largely matches spec. The main issue is progressive disclosure and visual separation could be improved. We'll enhance with better visual grouping and step-like progression.

---

## Implementation Plan

### A) Mobile Footer Navigation
1. Create sectioned footer with labeled groups:
   - THE BASKET (Weekly Basket, What's Inside, Dinner Anchor, Add-Ons)
   - FOR VISITORS (Arrival Baskets, Pantry Starter)
   - CONNECT (Contact, About)
   - FOLLOW US (if social links exist)
2. Dark purple background (brand color #2F1957)
3. Gold section headers (brand color #EEA421)
4. Safe-area padding for iOS
5. Semantic `<footer>` and `<nav>` landmarks

### B) Parallax Cards
1. Add data attributes to split sections for parallax configuration
2. Create JavaScript module using IntersectionObserver + requestAnimationFrame
3. Inner image translateY at 0.3-0.5x scroll speed
4. Optional subtle scale (1.0 → 1.05) on entry
5. Respect prefers-reduced-motion
6. GPU-friendly transforms only

### C) Header Text Branding
1. Replace logo `<img>` with styled text
2. Main text: "YaYa's Kitchen"
3. Tagline: "A small exhale for your week"
4. Style with Cormorant Garamond (serif) for brand name
5. Keep hamburger menu + "Order Now" action

### D) Basket Detail Modal
1. Create modal/drawer component
2. Content: Core Kitchen Basket description + contents list
3. Triggered by "See What's Inside" and "What's Inside" links
4. Clear CTA to proceed to order form
5. Accessible: focus trap, ESC to close, aria labels

### E) Order Form Enhancement
1. Add visual step indicators or section numbering
2. Improve progressive disclosure animations
3. Add summary preview of selections
4. Better mobile spacing and touch targets

---

## QA Checklist

### Footer Nav
- [ ] Excellent on iPhone (375px) and Android (360px) widths
- [ ] Safe-area handled (no content hidden by iOS home indicator)
- [ ] Accessible landmarks (footer, nav)
- [ ] Visible focus states
- [ ] Keyboard navigable

### Parallax
- [ ] Smooth 60fps on modern phones
- [ ] Only runs when cards are near viewport
- [ ] prefers-reduced-motion disables effect
- [ ] No memory leaks on long scroll sessions

### Header Branding
- [ ] Text-based "YaYa's Kitchen" centered
- [ ] Tagline visible
- [ ] Responsive (scales appropriately)
- [ ] Accessible (proper heading hierarchy or aria-label)

### Basket Details
- [ ] Modal opens on "See What's Inside" click
- [ ] Shows basket contents clearly
- [ ] CTA to order form works
- [ ] Modal closes on ESC/backdrop click
- [ ] Focus trapped in modal

### Order Form
- [ ] Matches wireframe flow
- [ ] Conditional fields work (dinner anchor, gift recipient)
- [ ] Validation feedback is clear
- [ ] Mobile touch targets adequate (44px minimum)

---

*Notes created: 2026-01-22*
