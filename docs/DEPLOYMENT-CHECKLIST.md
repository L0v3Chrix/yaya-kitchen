# YaYa's Kitchen — Payment Integration Deployment Checklist

**Created:** 2026-02-26
**Status:** ✅ CODE COMPLETE — Ready for deployment

---

## Code Complete ✅

- [x] Apps Script updated with payment status support
- [x] API: `/api/create-checkout-session` (Sheet-first architecture)
- [x] API: `/api/stripe-webhook` (updates existing orders)
- [x] Frontend: OrderSummary component with live totals
- [x] Frontend: MenuWeekSelector component
- [x] Frontend: OrderForm wired to checkout flow
- [x] All prices synced with Stripe
- [x] "Dinner Anchor" renamed to "Dinner Entrée" ($25 each)
- [x] Build passes

---

## Deployment Steps

### 1. Update Google Apps Script

The Apps Script at `backend/apps-script.js` needs to be deployed:

1. Go to: https://script.google.com/home
2. Open YaYa's Kitchen project
3. Replace code with contents of `backend/apps-script.js`
4. Click **Deploy** → **Manage deployments**
5. Click **Edit** (pencil icon) on active deployment
6. Set version to **New version**
7. Click **Deploy**

**Verify:** Test endpoint still returns order confirmation

### 2. Configure Stripe Webhook

1. Go to: https://dashboard.stripe.com/webhooks
2. Click **Add endpoint**
3. URL: `https://yaya-kitchen.vercel.app/api/stripe-webhook`
4. Select events:
   - `checkout.session.completed`
   - `checkout.session.expired`
5. Click **Add endpoint**
6. Copy **Signing secret** (starts with `whsec_`)

### 3. Set Vercel Environment Variables

1. Go to: https://vercel.com/[your-team]/yaya-kitchen/settings/environment-variables
2. Add:
   - `STRIPE_WEBHOOK_SECRET` = `whsec_xxx` (from step 2)
   - Verify `STRIPE_SECRET_KEY` is set
   - Verify `STRIPE_PUBLISHABLE_KEY` is set
   - Verify `NEXT_PUBLIC_BASE_URL` = `https://yaya-kitchen.vercel.app`

### 4. Deploy to Vercel

```bash
cd ~/clawd/projects/yaya-kitchen/site
git push origin main
```

Or trigger deploy from Vercel dashboard.

### 5. End-to-End Test

1. Go to: https://yaya-kitchen.vercel.app/#order
2. Fill form with test data
3. Select items (note calculated total)
4. Click "Proceed to Checkout"
5. Verify redirect to Stripe Checkout
6. Use test card: `4242 4242 4242 4242` (any future date, any CVC)
7. Complete payment
8. Verify:
   - Redirect to success page
   - Order appears in Google Sheet
   - Payment status shows "Paid"
   - Stripe payment intent ID recorded

### 6. Live Verification

1. Place a real small order ($25 flowers)
2. Complete payment
3. Verify Sheet update
4. **Refund immediately** in Stripe Dashboard

---

## Verification Checklist

### Data Integrity
- [ ] Order written to Sheet before Stripe redirect
- [ ] Order has status "Pending Payment" initially
- [ ] Webhook updates to "Paid" on completion
- [ ] No duplicate orders created

### Security
- [ ] Stripe keys not exposed in client code
- [ ] Webhook signature verified
- [ ] HTTPS enforced

### User Experience
- [ ] Form shows live total
- [ ] Validation errors clear
- [ ] Checkout redirect smooth
- [ ] Success page loads

---

## Rollback Plan

If issues occur:

1. **Immediate:** Comment out `OrderSummary` component, restore old submit button
2. **Apps Script:** Restore from version history
3. **Stripe:** Disable webhook endpoint in dashboard

---

## Support Contacts

- **Stripe Support:** dashboard.stripe.com/support
- **Vercel Support:** vercel.com/support
- **YaYa:** (303) 910-6971

---

*Checklist created: 2026-02-26 09:40 CST*
