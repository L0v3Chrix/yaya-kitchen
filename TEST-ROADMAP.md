# Yaya's Kitchen — Test & Validation Roadmap

**Definition of Done:** Verified form submission in a deployed environment that is repeatable.

**Created:** 2026-02-24 21:55 CST
**Owner:** Daniel (coordinating), Builder (execution)

---

## Current State Assessment

### Working ✅
- Site deploys to `yaya-kitchen.vercel.app`
- Apps Script backend receives and processes POSTs (confirmed executions)
- Google Sheet has Orders, Customers, Capacity tabs
- Previous test submissions exist (2/21 and 2/24 18:30)

### Issues Found 🔴
1. **Silent validation failures** — Form validation runs but user doesn't see why submission didn't go through
2. **no-cors mode** — Response is opaque, can't confirm actual delivery
3. **Missing feedback** — No visible loading state, error messages, or success confirmation observed

### Required Fields (from code)
- `name` (min 2 chars)
- `email` (valid format)
- `phone` (not empty)
- `address` (min 10 chars)
- `zipCode` (5 digits, separate from address)
- `deliveryWeek` (must select)
- `contactPreference` (must select)
- `containerDeposit` (must check)

---

## Test Plan

### Phase 1: Manual Verification (Tonight)
**Goal:** Confirm one successful submission with all required fields

1. [ ] Navigate to https://yaya-kitchen.vercel.app/#order
2. [ ] Fill ALL required fields:
   - Name: "Verification Test"
   - Email: "verify@raizethevibe.com"
   - Phone: "321-555-0001"
   - Address: "456 Verification Ln, Longwood, FL"
   - ZIP: "32779"
   - Delivery Week: Select first option
   - Contact Preference: Select "Text"
   - Container Deposit: Check
3. [ ] Click "Place My Order"
4. [ ] **Verify:** Success state appears
5. [ ] **Verify:** Check Google Sheet — new row appears
6. [ ] **Verify:** All data matches submission

### Phase 2: Error State Testing
**Goal:** Confirm form shows validation errors properly

1. [ ] Submit with empty name → Should show error
2. [ ] Submit with invalid email → Should show error
3. [ ] Submit with no delivery week → Should show error
4. [ ] Submit without container deposit check → Should show error
5. [ ] **Document:** Do error messages appear visually?

### Phase 3: Repeat Verification (3x)
**Goal:** Prove repeatability

1. [ ] Complete 3 full submissions with different test data
2. [ ] Verify all 3 appear in Google Sheet
3. [ ] Verify data integrity (no truncation, encoding issues)

### Phase 4: Edge Cases
1. [ ] Submit from mobile viewport
2. [ ] Submit with out-of-zone ZIP (expect $10 fee warning)
3. [ ] Submit with gift basket selected
4. [ ] Submit with all add-ons selected

---

## Bug Fixes Needed

### P1: Visual Validation Feedback
Form validation runs but errors may not be visible. Need to confirm:
- Error states have red borders
- Error messages appear below fields
- Scroll to first error on failed validation

### P2: Loading State
Confirm "submitting" state shows visual feedback (spinner, disabled button)

### P3: Success Confirmation
After successful submission:
- Form should clear
- Success message should display
- User should know what happens next

---

## Success Criteria

**Definition of Done is met when:**

1. ✅ Test submission reaches Google Sheet
2. ✅ All form data appears correctly in sheet
3. ✅ Validation errors are visible to user
4. ✅ Success state confirms submission
5. ✅ Process is repeatable (3 consecutive successes)
6. ✅ Works from production URL (not just localhost)

---

## Assignment

- **Builder:** Execute Phase 1-4, document results
- **Daniel:** Review completion, confirm DoD

---

*Created during debugging session 2026-02-24*
