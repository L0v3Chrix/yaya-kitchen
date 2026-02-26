# YaYa's Kitchen — Payment Gateway Integration

**Created:** 2026-02-26
**Status:** 🟡 STARTING
**Owner:** Daniel

---

## Objective

Connect the order form to Stripe so customers can pay at checkout instead of waiting for YaYa to send a manual payment link.

---

## Current State (MVP v1)

| Component | Status | How It Works |
|-----------|--------|--------------|
| Order Form | ✅ Live | Collects all order data |
| Apps Script | ✅ Live | Saves to Google Sheet, sends emails |
| Payment | ⏳ Manual | YaYa reviews order → calculates total → sends Stripe link manually |

**Live Site:** https://yaya-kitchen.vercel.app
**Google Sheet:** https://docs.google.com/spreadsheets/d/1hrM88kkeYrzedNDRcInCzsXLS8He_DC0HrY65KC_y1k/

---

## Target State (v2 with Payment Gateway)

```
Customer fills form → Reviews total → Clicks "Pay Now" → Stripe Checkout → 
Payment confirmed → Order saved with "Paid" status → YaYa notified
```

---

## Integration Options

### Option A: Stripe Payment Links (Quickest)

**How it works:**
1. Create Stripe Products for each item (Weekly Basket, Gift Basket, add-ons)
2. Form calculates total on client
3. On submit, redirect to a pre-built Stripe Payment Link with quantities
4. Webhook confirms payment → update Sheet

**Pros:** Fast to implement, no backend API needed
**Cons:** Fixed prices (can't do dynamic custom totals easily)

### Option B: Stripe Checkout Sessions (Recommended)

**How it works:**
1. Form submit → API creates Stripe Checkout Session with line items
2. Redirect customer to hosted checkout
3. Webhook (`checkout.session.completed`) → update Sheet with payment status
4. Return URL shows confirmation

**Pros:** Dynamic pricing, full control, professional
**Cons:** Requires API route + webhook endpoint

### Option C: Stripe Elements (Embedded)

**How it works:**
1. Embed payment form directly in page
2. Customer never leaves site
3. Handle payment intent client-side with backend confirmation

**Pros:** Seamless UX
**Cons:** More complex, PCI compliance considerations

---

## Recommended Approach: Option B (Checkout Sessions)

**Phase 4.1: Stripe Setup**
- [ ] Confirm YaYa's Stripe account is active
- [ ] Get API keys (publishable + secret)
- [ ] Create Stripe Products:
  - Weekly Basket ($100)
  - Gift Basket ($155)
  - Dinner Anchor Bundle (+$30)
  - Dinner Anchor Add-On (+$15)
  - Smoothie ($8 each)
  - Dessert (+$12)
  - Flowers ($35/$65/$95)
  - Arrival Basket ($125)
  - Pantry Starter ($45)
  - Container Deposit ($35)
  - Out-of-Zone Delivery Fee ($10)

**Phase 4.2: Checkout Session API**
- [ ] Create `/api/create-checkout-session.ts`
- [ ] Accept order data, build line_items array
- [ ] Store pending order in Sheet (paymentStatus: 'Pending')
- [ ] Return checkout URL

**Phase 4.3: Webhook Handler**
- [ ] Create `/api/stripe-webhook.ts`
- [ ] Verify webhook signature
- [ ] On `checkout.session.completed`:
  - Find order by session metadata (orderId)
  - Update Sheet: paymentStatus → 'Paid'
  - Send confirmation email

**Phase 4.4: Frontend Updates**
- [ ] Update form to show calculated total
- [ ] Add "Proceed to Payment" button
- [ ] Handle success/cancel return URLs
- [ ] Show order confirmation page

---

## Environment Variables Needed

```
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_PUBLISHABLE_KEY=pk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
```

---

## Pricing Logic

```javascript
function calculateTotal(order) {
  let total = 0;
  
  if (order.weeklyBasket) total += 100;
  if (order.giftBasket) total += 155;
  
  if (order.dinnerAnchor === 'Bundle') total += 30;
  if (order.dinnerAnchor === 'Add-On') total += 15;
  
  total += (order.smoothieQty || 0) * 8;
  
  if (order.dessert) total += 12;
  
  if (order.flowersHome === '1 arrangement') total += 35;
  if (order.flowersHome === '2 arrangements') total += 65;
  if (order.flowersHome === '3 arrangements') total += 95;
  
  if (order.arrivalBasket) total += 125;
  if (order.pantryStarter) total += 45;
  
  // First order includes container deposit
  if (order.isFirstOrder) total += 35;
  
  // Out-of-zone delivery fee
  if (!isInZone(order.zipCode)) total += 10;
  
  return total;
}
```

---

## Test Plan

**Test Mode First:**
1. Use `sk_test_` and `pk_test_` keys
2. Test card: `4242 4242 4242 4242`
3. Verify:
   - Order created in Sheet (Pending)
   - Redirect to Stripe works
   - Payment completes
   - Webhook fires
   - Sheet updated (Paid)
   - Emails sent

**Live Mode:**
1. Swap to live keys
2. Test with real $1 product
3. Refund immediately
4. Verify all flows work

---

## Files to Create/Modify

| File | Action | Purpose |
|------|--------|---------|
| `site/src/pages/api/create-checkout-session.ts` | Create | Generate Stripe session |
| `site/src/pages/api/stripe-webhook.ts` | Create | Handle payment events |
| `site/src/components/OrderForm.tsx` | Modify | Add total display, payment button |
| `site/src/pages/order-success.tsx` | Create | Confirmation page |
| `site/src/pages/order-cancelled.tsx` | Create | Cancelled payment page |
| `backend/apps-script.js` | Modify | Add updatePaymentStatus function |
| `.env.local` | Modify | Add Stripe keys |

---

## Current Test Status

**Last Verified:** 2026-02-24
- Form submission: ✅ Working
- Sheet write: ✅ Working
- Email notifications: ✅ Working
- Payment: ⏳ Manual (ready for automation)

---

*Ready for Chrix's test submission to verify baseline before adding payment gateway.*
