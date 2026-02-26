# YaYa's Kitchen — Payment Integration Roadmap

**Created:** 2026-02-26 09:22 CST
**Priority:** DATA INTEGRITY — Never break Sheet integration
**Owner:** Daniel (orchestrating), Builder (executing)

---

## Critical Constraint

**The Google Sheet integration MUST remain functional at all times.**

Current flow that MUST NOT break:
```
Form Submit → Apps Script → Google Sheet (Order logged)
```

Target flow (additive, not replacement):
```
Form Submit → Validate → Create Checkout Session → 
Sheet logs order (status: "Pending Payment") → 
Stripe Checkout → Payment → Webhook → 
Sheet updates (status: "Paid")
```

---

## Architecture Decision: Additive Integration

We will NOT replace the current flow. We will EXTEND it:

1. **Phase 1:** Add status field to existing Sheet write
2. **Phase 2:** Add checkout session creation AFTER Sheet write succeeds
3. **Phase 3:** Add webhook to UPDATE existing row (not create new)
4. **Phase 4:** Wire up frontend to new flow

This ensures: If Stripe fails, order is still in Sheet. If webhook fails, order exists (just needs manual status update).

---

## Phase 1: Apps Script Enhancement

**Goal:** Add payment status tracking to existing Sheet integration

### Tasks
- [ ] 1.1 Add `paymentStatus` column to Orders sheet
- [ ] 1.2 Add `stripeSessionId` column to Orders sheet
- [ ] 1.3 Update `doPost` to accept `paymentStatus` field (default: "Pending Payment")
- [ ] 1.4 Create new function `updatePaymentStatus(orderId, status, stripeData)`
- [ ] 1.5 Test: Verify existing form submission still works
- [ ] 1.6 Test: Verify new fields are populated

### Verification
```
[ ] Submit test order via current form
[ ] Confirm row appears in Sheet
[ ] Confirm paymentStatus shows "Pending Payment"
[ ] Confirm no regression in existing functionality
```

---

## Phase 2: Checkout Session API

**Goal:** Create API that writes to Sheet FIRST, then creates Stripe session

### Tasks
- [ ] 2.1 Update `/api/create-checkout-session` to:
  - First: Submit order to Apps Script (get orderId back)
  - Then: Create Stripe session with orderId in metadata
  - Return: Session URL for redirect
- [ ] 2.2 Add error handling: If Apps Script fails, don't create Stripe session
- [ ] 2.3 Add error handling: If Stripe fails, order still exists in Sheet
- [ ] 2.4 Test: Full flow with test data

### Verification
```
[ ] API creates order in Sheet
[ ] API returns valid Stripe session URL
[ ] Sheet shows "Pending Payment" status
[ ] Stripe session metadata contains orderId
```

---

## Phase 3: Webhook Handler

**Goal:** Update existing Sheet row when payment completes

### Tasks
- [ ] 3.1 Update Apps Script with `updatePaymentStatus` function
- [ ] 3.2 Webhook calls Apps Script to update row (not create new)
- [ ] 3.3 Handle idempotency (same webhook called twice = same result)
- [ ] 3.4 Add logging for debugging
- [ ] 3.5 Test: Simulate webhook, verify Sheet update

### Verification
```
[ ] Webhook receives event
[ ] Apps Script finds order by orderId
[ ] Status updates from "Pending Payment" to "Paid"
[ ] Stripe payment intent ID stored
[ ] No duplicate rows created
```

---

## Phase 4: Frontend Integration

**Goal:** Wire OrderForm to new checkout flow

### Tasks
- [ ] 4.1 Add OrderSummary component to form
- [ ] 4.2 Add MenuWeekSelector component
- [ ] 4.3 Add "Proceed to Checkout" button (replaces "Place Order")
- [ ] 4.4 On checkout: Call API, redirect to Stripe
- [ ] 4.5 Handle errors gracefully (show user-friendly message)
- [ ] 4.6 Test: Full end-to-end flow

### Verification
```
[ ] Form calculates total correctly
[ ] Checkout button calls API
[ ] Redirect to Stripe works
[ ] Payment completes
[ ] Redirect to success page
[ ] Sheet shows "Paid" status
```

---

## Security Checklist

- [ ] Stripe secret key only on server (never in client code)
- [ ] Webhook signature verified before processing
- [ ] Apps Script deployed with "Anyone" access but validates data
- [ ] No PII logged to console in production
- [ ] HTTPS enforced on all endpoints
- [ ] Rate limiting considered for API routes

---

## Stability Checklist

- [ ] Error boundaries in React components
- [ ] Try/catch around all API calls
- [ ] Fallback UI for failed states
- [ ] Graceful degradation: If Stripe down, show "Contact YaYa" message
- [ ] Logging for debugging production issues
- [ ] Idempotent webhook handling

---

## Integration Checklist

- [ ] Apps Script updated and deployed
- [ ] Sheet schema updated
- [ ] API routes deployed to Vercel
- [ ] Environment variables set in Vercel
- [ ] Stripe webhook endpoint registered
- [ ] Webhook secret in environment
- [ ] Success/cancel URLs configured

---

## Rollback Plan

If integration causes issues:

1. **Immediate:** Revert OrderForm.tsx to previous commit
2. **Apps Script:** Previous version accessible via Apps Script version history
3. **Stripe:** Can disable webhook in Stripe Dashboard
4. **Sheet:** Data preserved (additive only, no deletions)

---

## Parallel Work Assignment

| Task | Agent | Dependencies |
|------|-------|--------------|
| Phase 1 (Apps Script) | Builder-1 | None |
| Phase 2 (API) | Builder-2 | Phase 1 |
| Phase 3 (Webhook) | Builder-2 | Phase 1 |
| Phase 4 (Frontend) | Builder-3 | Phase 2, 3 |
| Testing | Daniel | All phases |

---

## Monitoring Cadence

- Check progress every 2 minutes
- Verify each phase before moving to next
- Commit to supermemory at each milestone

---

*Roadmap created: 2026-02-26 09:22 CST*
