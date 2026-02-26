# YaYa's Kitchen — Payment Workflow Specification

**Created:** 2026-02-26
**Status:** 🟢 READY TO BUILD
**Owner:** Daniel

---

## Executive Summary

Transform the current order form from "submit and wait for manual invoice" to "select, review total, pay instantly via Stripe Checkout."

**Key Features:**
1. Weekly menu selection (Week 1-4)
2. Live order total calculation
3. Branded Stripe Checkout
4. Automatic order confirmation

---

## Current vs Target State

### Current Flow
```
Customer fills form → Submits → Sheet logs order (Pending) → 
YaYa reviews → Calculates total → Sends manual Stripe link → 
Customer pays → YaYa marks as Paid
```

### Target Flow
```
Customer fills form → Selects menu week(s) → Sees live total →
Clicks "Proceed to Checkout" → Stripe Checkout (branded) →
Pays → Webhook confirms → Sheet updates (Paid) → 
Both get confirmation emails
```

---

## 1. Weekly Menu Selection

### Requirement
Users ordering a Core Basket need to select which menu week(s) they want.

### Current Menu Weeks
| Week | Theme |
|------|-------|
| Week 1 | Italian Night |
| Week 2 | Comfort Classics |
| Week 3 | Global Flavors |
| Week 4 | Southern Soul |

### Selection Logic

**Single Week Order:**
- User selects ONE delivery Friday
- User selects ONE menu week (1-4)
- Price: $175

**Multi-Week (Subscription-style):**
- User selects "4-week subscription" option
- Gets all 4 weeks, delivered on consecutive Fridays
- 15% discount applied automatically
- Total: $595 (was $700)

### UI Component: `MenuWeekSelector`

```tsx
interface MenuWeekSelectorProps {
  deliveryFriday: string; // Selected delivery date
  subscriptionMode: boolean;
  selectedWeeks: number[]; // [1], [1,2,3,4], etc.
  onWeeksChange: (weeks: number[]) => void;
}
```

**Display:**
- Grid of 4 cards showing menu week images
- Thumbnail of menu preview on each
- Click to select (highlight with gold border)
- If subscription: auto-select all 4
- If single order: select exactly 1

---

## 2. Order Total Calculation

### Price Matrix (from Stripe)

| Item | Price | Price ID |
|------|-------|----------|
| Core Basket | $175 | `price_1T4mcyF4PB0xZAmi2hzl3GG8` |
| Gift Basket | $175 | `price_1T55yvF4PB0xZAmiMdi6Hu8h` |
| Container Deposit | $35 | `price_1T4nSrF4PB0xZAmiAJFS7cxw` |
| Dinner Anchor Add-On | $68 | `price_1T55yxF4PB0xZAmiVS7Mva7w` |
| Dinner Anchor Bundle | $243 | `price_1T55ywF4PB0xZAmic8UBaPEH` |
| Dessert | $24 | `price_1T4mcPF4PB0xZAmiIa01Nq1J` |
| Smoothie Pair (2) | $18 | `price_1T4n10F4PB0xZAmieXxQUFgk` |
| Smoothie Family (4) | $32 | `price_1T4n1dF4PB0xZAmi20WcATNR` |
| Single Smoothie | $15 | `price_1T55z0F4PB0xZAmifetcF1yt` |
| Portion Boost | $25 | `price_1T4mzzF4PB0xZAmiLuTOV3v7` |
| Flowers Small | $25 | `price_1T55z1F4PB0xZAmibn2a6uhy` |
| Flowers Medium | $50 | `price_1T55z1F4PB0xZAmibBkuRfkf` |
| Arrival Basket | $125 | `price_1T55yyF4PB0xZAmia8KAiG8Y` |
| Pantry Starter | $45 | `price_1T55yzF4PB0xZAmiXPZARGqC` |
| Out-of-Zone Delivery | $10 | `price_1T55yzF4PB0xZAmiRtmmmGbR` |

### Calculation Logic

```typescript
function calculateOrderTotal(order: OrderFormData): OrderTotal {
  let subtotal = 0;
  const lineItems: LineItem[] = [];

  // Core Basket
  if (order.weeklyBasket === 'Yes') {
    if (order.dinnerAnchor === 'Bundle') {
      lineItems.push({ priceId: STRIPE_PRODUCTS.DINNER_ANCHOR_BUNDLE.priceId, quantity: 1 });
      subtotal += 243;
    } else {
      lineItems.push({ priceId: STRIPE_PRODUCTS.CORE_BASKET.priceId, quantity: 1 });
      subtotal += 175;
      
      if (order.dinnerAnchor === 'Add-On') {
        lineItems.push({ priceId: STRIPE_PRODUCTS.DINNER_ANCHOR_ADD_ON.priceId, quantity: 1 });
        subtotal += 68;
      }
    }
  }

  // Gift Basket
  if (order.giftBasket === 'Yes') {
    lineItems.push({ priceId: STRIPE_PRODUCTS.GIFT_BASKET.priceId, quantity: 1 });
    subtotal += 175;
  }

  // Smoothies
  const smoothieQty = parseInt(order.smoothieQty) || 0;
  if (smoothieQty === 4) {
    lineItems.push({ priceId: STRIPE_PRODUCTS.SMOOTHIE_FAMILY_SET.priceId, quantity: 1 });
    subtotal += 32;
  } else if (smoothieQty === 2) {
    lineItems.push({ priceId: STRIPE_PRODUCTS.SMOOTHIE_PAIR.priceId, quantity: 1 });
    subtotal += 18;
  } else if (smoothieQty === 1 || smoothieQty === 3) {
    lineItems.push({ priceId: STRIPE_PRODUCTS.SINGLE_SMOOTHIE.priceId, quantity: smoothieQty });
    subtotal += smoothieQty * 15;
  }

  // Dessert
  if (order.dessert) {
    lineItems.push({ priceId: STRIPE_PRODUCTS.DESSERT.priceId, quantity: 1 });
    subtotal += 24;
  }

  // Portion Boost
  if (order.portionBoost) {
    lineItems.push({ priceId: STRIPE_PRODUCTS.PORTION_BOOST.priceId, quantity: 1 });
    subtotal += 25;
  }

  // Flowers
  if (order.flowersHome === '1 arrangement') {
    lineItems.push({ priceId: STRIPE_PRODUCTS.FLOWERS_SMALL.priceId, quantity: 1 });
    subtotal += 25;
  } else if (order.flowersHome === '2-3 arrangements') {
    lineItems.push({ priceId: STRIPE_PRODUCTS.FLOWERS_MEDIUM.priceId, quantity: 1 });
    subtotal += 50;
  }

  // Arrival Basket
  if (order.arrivalBasket) {
    lineItems.push({ priceId: STRIPE_PRODUCTS.ARRIVAL_BASKET.priceId, quantity: 1 });
    subtotal += 125;
  }

  // Pantry Starter
  if (order.pantryStarter) {
    lineItems.push({ priceId: STRIPE_PRODUCTS.PANTRY_STARTER.priceId, quantity: 1 });
    subtotal += 45;
  }

  // Container Deposit (first order only - we'll track this)
  if (order.isFirstOrder) {
    lineItems.push({ priceId: STRIPE_PRODUCTS.CONTAINER_DEPOSIT.priceId, quantity: 1 });
    subtotal += 35;
  }

  // Out-of-Zone Delivery Fee
  if (!isInDeliveryZone(order.zipCode)) {
    lineItems.push({ priceId: STRIPE_PRODUCTS.OUT_OF_ZONE_DELIVERY.priceId, quantity: 1 });
    subtotal += 10;
  }

  // Subscription Discount (15% off subtotal)
  let discount = 0;
  if (order.subscriptionInterest && order.subscriptionWeeks === 4) {
    discount = Math.round(subtotal * 0.15);
  }

  return {
    subtotal,
    discount,
    total: subtotal - discount,
    lineItems,
  };
}
```

### UI Component: `OrderSummary`

Display at bottom of form, updates live as user makes selections:

```
┌────────────────────────────────────────┐
│ YOUR ORDER                             │
├────────────────────────────────────────┤
│ Core Basket (Week 2)           $175.00 │
│ Dinner Anchor Add-On            $68.00 │
│ Smoothies × 2                   $18.00 │
│ Dessert                         $24.00 │
│ Container Deposit               $35.00 │
├────────────────────────────────────────┤
│ Subtotal                       $320.00 │
│ Out-of-Zone Delivery            $10.00 │
├────────────────────────────────────────┤
│ TOTAL                          $330.00 │
└────────────────────────────────────────┘
         [ Proceed to Checkout ]
```

---

## 3. Stripe Checkout Integration

### API Route: `/api/create-checkout-session`

```typescript
// src/pages/api/create-checkout-session.ts

import Stripe from 'stripe';
import { STRIPE_PRODUCTS } from '@/lib/stripe-products';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { order, lineItems, customerEmail, orderId } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: customerEmail,
      line_items: lineItems.map((item: LineItem) => ({
        price: item.priceId,
        quantity: item.quantity,
      })),
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/order-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/#order`,
      metadata: {
        orderId,
        customerName: order.name,
        deliveryWeek: order.deliveryWeek,
        menuWeek: order.menuWeek,
      },
      // Branding
      payment_intent_data: {
        description: `YaYa's Kitchen Order - ${order.deliveryWeek}`,
      },
    });

    // Save order to Google Sheet with 'Pending Payment' status
    await saveOrderToSheet({ ...order, orderId, paymentStatus: 'Pending Payment' });

    return res.status(200).json({ sessionId: session.id, url: session.url });
  } catch (error: any) {
    console.error('Stripe session error:', error);
    return res.status(500).json({ error: error.message });
  }
}
```

### API Route: `/api/stripe-webhook`

```typescript
// src/pages/api/stripe-webhook.ts

import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export const config = {
  api: { bodyParser: false },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const buf = await buffer(req);
  const sig = req.headers['stripe-signature']!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const { orderId } = session.metadata || {};

    if (orderId) {
      // Update Google Sheet: paymentStatus → 'Paid'
      await updateOrderPaymentStatus(orderId, 'Paid', session.payment_intent as string);
      
      // Send confirmation emails
      await sendConfirmationEmails(orderId, session);
    }
  }

  return res.status(200).json({ received: true });
}
```

---

## 4. Branded Checkout Experience

### Stripe Dashboard Settings

1. **Business Branding:**
   - Logo: YaYa's Kitchen logo
   - Brand color: `#8B5CF6` (purple from site)
   - Accent color: `#D4AF37` (gold)

2. **Checkout Settings:**
   - Enable: Collect phone number
   - Enable: Promotional codes (for future coupons)
   - Receipt settings: Include order details

### Success Page: `/order-success`

```tsx
// src/pages/order-success.tsx

export default function OrderSuccess() {
  return (
    <div className="min-h-screen bg-[--color-cream] flex items-center justify-center p-4">
      <div className="max-w-md text-center">
        <div className="w-24 h-24 bg-[--color-green] rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckIcon className="w-12 h-12 text-white" />
        </div>
        
        <h1 className="font-headline text-3xl tracking-wide text-[--color-charcoal] mb-4">
          THANK YOU!
        </h1>
        
        <p className="text-[--color-charcoal]/70 mb-6">
          Your order is confirmed and paid. YaYa is already getting excited 
          to prepare your basket!
        </p>
        
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6 text-left">
          <h2 className="font-headline text-sm tracking-wider text-[--color-charcoal] mb-3">
            WHAT'S NEXT
          </h2>
          <ul className="space-y-2 text-sm text-[--color-charcoal]/80">
            <li>✅ Confirmation email sent</li>
            <li>📅 Your basket will be delivered Friday 9-11am</li>
            <li>📱 YaYa will text when she's on the way</li>
          </ul>
        </div>
        
        <Link href="/" className="text-[--color-purple] hover:text-[--color-green]">
          ← Back to YaYa's Kitchen
        </Link>
      </div>
    </div>
  );
}
```

---

## 5. Form Updates Required

### New Fields to Add

```typescript
interface FormData {
  // ... existing fields ...
  
  // NEW: Menu week selection
  menuWeek: '1' | '2' | '3' | '4' | '';
  
  // NEW: Portion boost
  portionBoost: boolean;
  
  // NEW: For tracking first order
  isFirstOrder: boolean;
  
  // NEW: Subscription weeks (for 4-week orders)
  subscriptionWeeks: 1 | 4;
}
```

### Form Section Updates

**Section 2 (Delivery Week) → Add Menu Week:**
```tsx
<div className="mt-6">
  <label className={labelClasses}>
    Select Your Menu *
  </label>
  <div className="grid grid-cols-2 gap-3">
    {menuWeeks.map((week) => (
      <button
        key={week.id}
        type="button"
        onClick={() => setFormData(prev => ({ ...prev, menuWeek: week.id }))}
        className={`p-3 border-2 rounded-lg ${
          formData.menuWeek === week.id
            ? 'border-[--color-gold] bg-[--color-gold]/10'
            : 'border-[--color-charcoal]/20'
        }`}
      >
        <span className="font-headline text-sm">{week.label}</span>
        <span className="text-xs text-[--color-charcoal]/60 block">
          {week.theme}
        </span>
      </button>
    ))}
  </div>
</div>
```

**Section 3 (Weekly Basket) → Add Portion Boost:**
```tsx
<label className="flex items-center gap-3 p-4 border-2 ...">
  <input
    type="checkbox"
    name="portionBoost"
    checked={formData.portionBoost}
    onChange={handleChange}
  />
  <span className="flex-1">
    <span className="block">Add Portion Boost</span>
    <span className="text-sm text-[--color-charcoal]/60">
      Increase portions for older kids or up to 4 adults
    </span>
  </span>
  <span className="font-headline text-[--color-gold]">+$25</span>
</label>
```

**New Section: Order Summary (before submit):**
```tsx
<OrderSummary 
  formData={formData} 
  total={orderTotal} 
  onCheckout={handleCheckout}
/>
```

---

## 6. Files to Create/Modify

| File | Action | Purpose |
|------|--------|---------|
| `src/lib/stripe-products.ts` | ✅ Created | Product/Price ID config |
| `src/lib/calculate-order.ts` | Create | Order total calculation |
| `src/pages/api/create-checkout-session.ts` | Create | Stripe session API |
| `src/pages/api/stripe-webhook.ts` | Create | Payment confirmation |
| `src/pages/order-success.tsx` | Create | Success page |
| `src/components/forms/OrderForm.tsx` | Modify | Add menu week, totals |
| `src/components/forms/OrderSummary.tsx` | Create | Live order total display |
| `src/components/forms/MenuWeekSelector.tsx` | Create | Menu week UI |
| `.env.local` | Modify | Add webhook secret |

---

## 7. Environment Variables

```bash
# Existing
STRIPE_PUBLISHABLE_KEY=pk_live_xxx
STRIPE_SECRET_KEY=sk_live_xxx
NEXT_PUBLIC_GOOGLE_SCRIPT_URL=https://script.google.com/...

# New
STRIPE_WEBHOOK_SECRET=whsec_xxx
NEXT_PUBLIC_BASE_URL=https://yaya-kitchen.vercel.app
```

---

## 8. Webhook Setup

1. Go to Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://yaya-kitchen.vercel.app/api/stripe-webhook`
3. Select events: `checkout.session.completed`
4. Copy webhook signing secret to `.env.local`

---

## 9. Testing Plan

### Test Mode
1. Switch to test keys (`sk_test_`, `pk_test_`)
2. Test card: `4242 4242 4242 4242`
3. Verify full flow

### Live Mode Verification
1. Place real $25 test order (flowers)
2. Verify Sheet updates
3. Verify emails
4. Refund immediately in Stripe Dashboard

---

## 10. Deployment Checklist

- [ ] Stripe products verified
- [ ] API routes deployed
- [ ] Webhook endpoint configured
- [ ] Environment variables in Vercel
- [ ] Form UI updated
- [ ] Success page working
- [ ] Test order placed
- [ ] Sheet integration verified
- [ ] Emails sending

---

*Spec created: 2026-02-26 08:56 CST*
