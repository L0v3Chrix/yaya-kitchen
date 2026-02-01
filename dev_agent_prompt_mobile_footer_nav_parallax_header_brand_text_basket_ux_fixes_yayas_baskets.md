# Dev Agent Prompt — Rebuild Mobile UX to Match Reference (Yaya’s Baskets)

## Context
We’re building a customer website for **Yaya’s Baskets**. Use this reference site as the interaction/design baseline (mobile-first):
- Reference: https://www.lepainquotidien.com/be/en

On mobile, the reference has:
1) A **navigation menu in the footer** (grouped links + clear section blocks).
2) **Parallax / scroll-driven motion** on an infinite-scroll style page where cards feel like they have “double motion” (page scroll + inner media movement).

Our current v1 does **not** replicate these behaviors.

You will be given access to our site (localhost or a tunnel URL) **plus our internal documents/wireframes**. Your job is to:
- Identify the relevant interaction patterns from the reference, and
- Implement them cleanly in our codebase,
- While correcting known UX/spec mismatches described below.

---

## High-Level Objective
Implement on our site:

### A) Mobile Footer Navigation System (Reference-inspired)
- Create a **footer navigation experience that works especially well on mobile**:
  - Sectioned/footer navigation with clearly labeled groups (scan-friendly).
  - Readable typography, generous tap targets, clean spacing.
- If we already have a footer, refactor into **clearly labeled groups** and ensure the most important links are discoverable from mobile footer.
- Avoid mobile pitfalls:
  - Safe area overlap (iOS), fixed elements hiding content, awkward bottom padding.
- Accessibility:
  - Semantic landmarks (`footer`, `nav`), visible focus states, keyboard support, sensible tab order.
  - Respect `prefers-reduced-motion` where motion exists.

**Deliverable for A**
- Reusable footer component with:
  - Config-driven link groups (easy reorder/edit)
  - Mobile spacing + safe-area padding support (`env(safe-area-inset-bottom)`)
  - Styles consistent with our design system

---

### B) Parallax + “Double Motion” Card Scroll Feel (Reference-inspired)
Implement a scroll experience where **cards feel alive while the page scrolls**:
- As the user scrolls, each card’s **inner media layer** (image/background/video) subtly moves at a different speed than the card container (parallax).
- Add an optional second subtle effect (the “double motion” feel), such as:
  - inner media translateY + slight scale, OR
  - card content translateY + inner media translateY, OR
  - gentle opacity easing on entry while media parallax continues.

**Constraints**
- Smooth on modern phones (aim for 60fps).
- Avoid jank:
  - use `requestAnimationFrame` or a proven scroll abstraction.
  - avoid layout thrash (no expensive reads/writes per frame).
- Use `IntersectionObserver` to activate effects only when cards are near/in viewport.
- GPU-friendly transforms (`transform: translate3d(...)`) vs top/left.
- Provide a `prefers-reduced-motion: reduce` mode that disables or greatly reduces motion.

**Deliverable for B**
- Reusable `ParallaxCard` (or equivalent) module:
  - Configurable intensity (low/med/high)
  - Optional second-effect toggle (“double motion”)
  - Works with infinite-scroll/list rendering
  - Clean separation: styles + logic + hooks/utilities

---

## Critical Spec Fixes to Implement (Must Do)
These are known mismatches in v1 that must be corrected by returning to the original docs/wireframes.

### C) Header / Navigation Branding (Must Match Spec)
- Current header uses an **image** for the brand area.
- Update to a **text-based brand name** centered in the navigation header:
  - Exact text: **“Yaya’s Baskets”**
  - Centered horizontally in the top navigation area.
  - Must work responsively (mobile-first) and maintain brand clarity.

**Deliverable for C**
- Replace image header branding with text-based brand name centered.
- Ensure accessible markup (e.g., `aria-label`, logo text as link to home if appropriate).

---

### D) “What’s in the Basket” UX (Missing Description)
Current behavior:
- Clicking **“What’s in the basket”** takes users directly to the order form.

Required behavior (per wireframes/spec):
- The user should see **basket descriptions/contents** before being pushed into the order form.
- “What’s in the basket” should open a detail view (page/section/modal/drawer—choose what fits the build) that includes:
  - Basket name
  - A short description
  - A contents list (what’s included)
  - Any notes/variations
  - A clear CTA to proceed to ordering

**Deliverable for D**
- Implement basket detail UX so users can understand contents prior to ordering.
- Ensure the path to ordering is still easy and obvious.

---

### E) Order Form Selection Flow (Currently Incorrect)
Current behavior:
- The order form only supports selecting the basket itself.

Required behavior:
- The order form must match the **provided wireframe** selection process.
- You MUST:
  1) Re-open and review **all documents + wireframes from the beginning**, and
  2) Rebuild the order form UX to match that spec.

**Deliverable for E**
- An order form that implements the correct multi-step (or multi-section) selection flow exactly as defined in the wireframes.
- Validation + clear user feedback.
- Cleanly structured data model/state management for choices.

---

## Investigation Instructions (Do This First)
1) Open the reference site with **mobile emulation**.
2) Identify:
   - Footer grouping structure and spacing/typography.
   - Whether any elements are sticky/fixed and how they handle safe-area.
   - How the scroll/parallax is achieved (CSS-only vs JS; any libs).
3) Open our internal docs/wireframes:
   - Confirm the required header behavior, basket detail UX, and order form selection flow.
4) Write a short `NOTES.md`:
   - What we’re cloning (behaviorally)
   - What we’re not cloning (branding/assets/exact layout that conflicts)
   - The exact spec corrections you’re making for C/D/E

---

## Implementation Requirements
- Do **not** copy the reference site’s assets or code verbatim. Recreate the behavior and structure.
- Keep dependencies minimal:
  - Prefer vanilla/CSS + small utilities.
  - If you add a library (GSAP/Framer Motion/etc.), justify it and keep scope tight.
- Ship as a clean PR with:
  - Components (FooterNav, HeaderBrand, BasketDetail, OrderForm)
  - Styles
  - Config/data for footer nav groups
  - Reduced motion handling
  - Basic tests OR at minimum a thorough QA checklist

---

## QA / Acceptance Criteria
### Footer nav
- Excellent on iPhone + Android widths.
- No content hidden by fixed UI; safe-area handled.
- Accessible landmarks + focus + keyboard flow.

### Parallax
- Smooth, no jank.
- Only runs near viewport.
- Reduced motion works.
- Infinite scroll does not degrade memory/perf over long sessions.

### Header branding
- Text-based **“Yaya’s Baskets”** centered in the top navigation.
- Responsive + accessible.

### Basket details
- “What’s in the basket” shows descriptions/contents before ordering.

### Order form
- Matches wireframes.
- Proper selection process beyond just basket selection.

---

## What to Return
1) Summary of findings from the reference.
2) Summary of wireframe/doc spec alignment changes (C/D/E).
3) Implementation details + where to adjust:
   - Parallax intensity
   - Footer group config
   - Basket detail content source
   - Order form steps/validation
4) QA checklist results + known issues (if any).

