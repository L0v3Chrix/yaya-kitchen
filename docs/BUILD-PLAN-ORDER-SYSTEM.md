# YaYa's Kitchen Order System — Build Plan
**Created:** 2026-02-21
**Status:** 🟡 DRAFT — Awaiting Clarification

---

## System Overview

This is a **significant build** beyond the original simple form → Google Sheet spec. We're now building:

- Dynamic weekly menu system
- 4-week advance ordering with calendar
- Subscription management (15%/10% discounts)
- Capacity tracking + waitlist
- Stripe payment integration
- Delivery zone calculation
- Admin dashboard
- Automated reminders

---

## Architecture Decision: Simple vs Full

### Option A: Enhanced Google Sheet System
- Form → Apps Script → Sheet
- Admin manages via Sheet (tabs for orders, menu, capacity)
- Stripe payment links sent manually by YaYa
- Reminders via manual text/email
- **Pros:** Fast to build, low maintenance, familiar
- **Cons:** Manual payment flow, no real subscriptions, limited automation

### Option B: Full Order Management System
- Next.js app with database (Supabase/Postgres)
- Stripe Checkout with recurring billing
- Admin dashboard UI
- Automated reminders via Twilio/SendGrid
- **Pros:** Fully automated, scales, professional
- **Cons:** Longer build, hosting costs, more to maintain

### Recommendation
**Start with Option A (Enhanced Sheet)** — get YaYa taking orders this week. Can upgrade to Option B later if volume justifies.

---

## Phase 1: Core Order Flow (MVP)
**Goal:** Accept orders, notify YaYa, track in sheet
**Duration:** 2-3 hours

### Tasks
- [ ] 1.1 Update OrderForm.tsx with new fields:
  - Delivery week picker (next 4 Fridays)
  - Delivery instructions (gate codes, etc.)
  - Gift message field
  - Contact preference (text/email)
- [ ] 1.2 Create Google Sheet with full schema:
  - Orders tab (all order data)
  - Menu tab (this week's offerings)
  - Capacity tab (tracking)
  - Customers tab (history)
- [ ] 1.3 Write Apps Script webhook:
  - Receive form data
  - Check capacity (reject if full)
  - Add to Orders tab
  - Send email notification to YaYa
  - Send confirmation text/email to customer
- [ ] 1.4 Deploy script, add URL to Vercel env
- [ ] 1.5 End-to-end test

### Validation (Phase 1)
- [ ] **UI/UX:** Form flows logically, mobile responsive
- [ ] **Code:** TypeScript passes, no console errors
- [ ] **Functional:** Submit → Sheet row appears → YaYa gets email → Customer gets confirmation

---

## Phase 2: Menu & Availability System
**Goal:** Weekly menu drives form options
**Duration:** 2-3 hours

### Tasks
- [ ] 2.1 Design Menu Sheet schema:
  - Week start date
  - Dinner options (name, description, price)
  - Add-ons available (smoothie, dessert, granola, soup, etc.)
  - Capacity for week
- [ ] 2.2 Create API route to fetch current menu from Sheet
- [ ] 2.3 Update form to dynamically show:
  - This week's dinner choices with prices
  - Only available add-ons
  - "Sold out" state if capacity reached
- [ ] 2.4 Add "ordering closed" state (after Tuesday 9am)

### Validation (Phase 2)
- [ ] **UI/UX:** Menu items display correctly, unavailable items hidden
- [ ] **Code:** API route handles sheet errors gracefully
- [ ] **Functional:** Change sheet → form updates (may need cache-bust)

---

## Phase 3: Pricing Calculator
**Goal:** Show customer their total before submission
**Duration:** 2-3 hours

### Tasks
- [ ] 3.1 Build pricing logic:
  - Base price from selected dinners
  - Add-on totals
  - Subscription discount (if applicable)
  - Delivery fee ($10 if >8 miles from 32779)
  - Container deposit
- [ ] 3.2 Add zip code / address distance check
  - Use Google Maps API or simple zip code list
- [ ] 3.3 Show running total in form
- [ ] 3.4 Show itemized breakdown before submit

### Validation (Phase 3)
- [ ] **UI/UX:** Total updates live, clear breakdown
- [ ] **Code:** Math is correct across all combinations
- [ ] **Functional:** Final total matches what YaYa expects to charge

---

## Phase 4: Payment Integration
**Goal:** Stripe checkout for payment collection
**Duration:** 3-4 hours

### Tasks
- [ ] 4.1 Set up Stripe account for YaYa (or use existing)
- [ ] 4.2 Create Stripe Checkout session endpoint
- [ ] 4.3 Flow: Form submit → Create order (pending) → Redirect to Stripe → Webhook confirms payment → Update order status
- [ ] 4.4 Handle deposit as line item
- [ ] 4.5 Send payment confirmation to customer

### Validation (Phase 4)
- [ ] **UI/UX:** Smooth redirect, clear confirmation page
- [ ] **Code:** Webhook signatures verified, idempotent
- [ ] **Functional:** Test mode payment → Order marked paid in sheet

---

## Phase 5: Admin Dashboard
**Goal:** YaYa can manage orders without touching the sheet directly
**Duration:** 4-6 hours

### Tasks
- [ ] 5.1 Build admin route (password protected)
- [ ] 5.2 Views:
  - This week's orders
  - Orders by status (pending, paid, delivered)
  - Customer list
- [ ] 5.3 Actions:
  - Mark as paid
  - Mark as delivered
  - Close ordering for week
  - View/edit capacity
- [ ] 5.4 Simple menu editor (for next week)

### Validation (Phase 5)
- [ ] **UI/UX:** Clean, mobile-friendly, easy for YaYa
- [ ] **Code:** Auth secure, actions logged
- [ ] **Functional:** All actions reflect in Sheet

---

## Phase 6: Subscriptions & Recurring Orders
**Goal:** Customers can subscribe with discounts
**Duration:** 4-6 hours

### Tasks
- [ ] 6.1 Subscription signup flow in form
- [ ] 6.2 Track subscription status in Customers sheet
- [ ] 6.3 Auto-apply discounts (15% weekly, 10% bi-monthly)
- [ ] 6.4 Recurring Stripe billing OR weekly order duplication
- [ ] 6.5 Pause/cancel flow

### Validation (Phase 6)
- [ ] **UI/UX:** Clear subscription terms, easy pause
- [ ] **Code:** Discount math correct, no double-billing
- [ ] **Functional:** Subscription creates weekly orders automatically

---

## Phase 7: Notifications & Reminders
**Goal:** Automated customer communication
**Duration:** 2-3 hours

### Tasks
- [ ] 7.1 Choose provider (Twilio for SMS, SendGrid for email)
- [ ] 7.2 Implement:
  - Order confirmation (immediate)
  - Payment link (if not paid at checkout)
  - Weekly "time to order" (Sunday/Monday)
  - Delivery reminder (Thursday evening)
- [ ] 7.3 Respect contact preference (text vs email)

### Validation (Phase 7)
- [ ] **UI/UX:** Messages are warm, on-brand
- [ ] **Code:** Scheduled jobs run reliably
- [ ] **Functional:** Test customer receives all expected messages

---

## Phase 8: Waitlist & Overflow
**Goal:** Capture demand when at capacity
**Duration:** 1-2 hours

### Tasks
- [ ] 8.1 Waitlist sheet tab
- [ ] 8.2 Form shows "Join waitlist" when capacity full
- [ ] 8.3 Notify waitlist if spot opens
- [ ] 8.4 Track waitlist-to-order conversion

### Validation (Phase 8)
- [ ] **UI/UX:** Clear messaging, hope not frustration
- [ ] **Code:** Race conditions handled
- [ ] **Functional:** Waitlist actually gets notified

---

## Supervision & Orchestration

### Checkpoints (Before Each Phase Merge)
1. **Code review:** Does it build? Tests pass?
2. **UI review:** Screenshot/video walkthrough
3. **Functional test:** End-to-end with real data
4. **Chrix sign-off:** "Ship it" or revision notes

### Loop Structure
```
For each phase:
  1. Build tasks
  2. Self-test (developer)
  3. Document what was built
  4. Present to Chrix for review
  5. Address feedback
  6. Re-test
  7. Deploy to staging
  8. Final approval → merge to production
```

### Orchestration
- **Main agent (Daniel):** Coordinates, reviews, presents
- **Builder agent:** Executes code tasks
- **QA loop:** After each phase, dedicated QA pass

---

## Timeline Estimate

| Phase | Duration | Can Ship After? |
|-------|----------|-----------------|
| 1 - Core Order Flow | 2-3 hrs | ✅ Yes (MVP) |
| 2 - Menu System | 2-3 hrs | ✅ Better |
| 3 - Pricing Calculator | 2-3 hrs | ✅ Good |
| 4 - Payment | 3-4 hrs | ✅ Solid |
| 5 - Admin Dashboard | 4-6 hrs | ✅ Professional |
| 6 - Subscriptions | 4-6 hrs | ✅ Full feature |
| 7 - Notifications | 2-3 hrs | ✅ Polished |
| 8 - Waitlist | 1-2 hrs | ✅ Complete |

**Total:** 20-30 hours across all phases

**Today's Target:** Phase 1 complete, possibly Phase 2

---

## Open Questions (Need Your Eyes)

*See next message for interview questions*

---

*Plan created: 2026-02-21*
