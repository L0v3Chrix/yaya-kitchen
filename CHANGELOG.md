# YaYa's Kitchen — Changelog

All notable changes, decisions, and updates tracked here.

---

## [2026-02-21] Order System Build Kickoff

### Added
- `docs/ORDER-SYSTEM-DISCOVERY.md` — Full discovery Q&A with YaYa's answers
- `docs/BUILD-PLAN-ORDER-SYSTEM.md` — Phased build plan with validation loops

### Decisions
- **Architecture:** Starting with Enhanced Google Sheet approach (Option A)
  - Faster to ship
  - YaYa can manage via familiar Sheet interface
  - Can upgrade to full system later if volume justifies
- **Today's Target:** MVP that can take real orders
  - Core form with delivery week picker
  - Sheet + email notification to YaYa
  - Manual payment flow (YaYa sends Stripe links after review)
  - Hardcode this week's menu options

### Questions Answered (10:04 CST)
1. Menu updates: YaYa texts Chrix (until v2)
2. Menu goes live: Saturday morning after Friday deliveries
3. Pricing: YaYa sets per menu based on ingredients
4. Portion upcharge: $12-15 based on ingredients
5. Delivery zone: ZIP code list (8 zips in-zone)
   - 32779, 32750, 32714, 32701, 32746, 32703, 32791, 32708
6. Stripe: YaYa has account, but v1 = manual payment links
7. Manual flow: Confirmed OK for MVP
8. Subscriptions: Checkbox only, capture in sheet

### Status
🟢 **All questions answered** — building Phase 1

---

## [2026-02-11] Customer Revisions Implemented

### Changed
- Hero section: Darkened gold script, new copy
- Weekly Basket section: Updated description
- Core Kitchen Basket: New contents, pricing, image swap
- Dinner Anchor → Weekly Dinner Basket: Full rename + content overhaul
- Treats section: Image swaps
- Meet YaYa: Full bio replacement
- Order Form: Pricing update, gift option
- Footer: NC → FL location

### Commits
- `bc944c8` fix: supervisor audit - correct image placements
- `925beed` feat: add client images - basket, dinner plate, rainbow cake
- `6afec0c` feat: customer revisions 2026-02-11

---

## [2026-02-01] Initial Client Edits

### Changed
- First round of client feedback implemented

### Commits
- `de1f7e9` Client edits 2026-02-01

---

## [2026-01-28] Project Setup

### Added
- Initial Next.js site structure
- Brand colors, design reference docs
- Website methodology applied

---

*This file is the source of truth for project history.*
