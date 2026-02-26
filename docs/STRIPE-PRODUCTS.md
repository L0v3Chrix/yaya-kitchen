# Yaya's Kitchen — Stripe Products

**Created:** 2026-02-26
**Status:** ✅ Products Created in Stripe

---

## Stripe Account

**Account ID:** acct_xxx (from pk_live)
**Mode:** LIVE

---

## Products & IDs

| Product | Stripe Product ID | Price | Notes |
|---------|-------------------|-------|-------|
| Core Basket | `prod_U2sNTG2gWg812s` | $100 | Weekly basket |
| Container Deposit | `prod_U2tFvKn4X2NZoy` | $35 | First order only |
| Smoothie Pair | `prod_U2smZd44ocIhGz` | $16 | 2 smoothies |
| Smoothie Family Set | `prod_U2snq567TfLhyh` | $32 | 4 smoothies |
| Portion Boost | `prod_U2sluKL2q9Dx4C` | $? | TBD |
| Flowers | `prod_U2sOhdVa9Ta6yv` | $35-95 | Variable |
| Dessert | `prod_U2sNPu9jjbaeIr` | $12 | Weekly dessert |

---

## Still Needed

These products from the original spec don't have IDs yet:

| Product | Expected Price | Status |
|---------|----------------|--------|
| Gift Basket | $155 | ❓ Need to create |
| Dinner Anchor Bundle | $30 | ❓ Need to create |
| Dinner Anchor Add-On | $15 | ❓ Need to create |
| Arrival Basket | $125 | ❓ Need to create |
| Pantry Starter | $45 | ❓ Need to create |
| Out-of-Zone Delivery | $10 | ❓ Need to create |

---

## Price IDs

**Note:** The IDs above are Product IDs (`prod_xxx`). For Checkout Sessions, we need Price IDs (`price_xxx`).

Need to either:
1. Look up existing prices via Stripe Dashboard
2. Create prices via API for each product

```javascript
// To get price IDs, run in Stripe Dashboard or via API:
const prices = await stripe.prices.list({ product: 'prod_U2sNTG2gWg812s' });
```

---

## Next Steps

1. [ ] Get Price IDs for each product (check Stripe Dashboard)
2. [ ] Create missing products (Gift Basket, Dinner Anchor, etc.)
3. [ ] Build checkout session endpoint
4. [ ] Set up webhook endpoint
5. [ ] Test with real checkout flow

---

*Updated: 2026-02-26 07:25 CST*
