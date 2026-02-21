# YaYa's Kitchen — Order System Discovery
**Captured:** 2026-02-21
**Status:** ✅ COMPLETE — Ready for Build Planning

---

## 1. ORDER TIMING & DEADLINES

### Weekly Cutoff
- **Cutoff:** Tuesday 9am for Friday delivery
- **Late orders:** Fulfilled if not at capacity, otherwise rolled to next week

### Advance Ordering
- **Can order ahead:** Yes, up to 4 weeks in advance
- **Calendar picker needed:** Yes

### Recurring/Subscription
- **Available:** Yes
- **Discounts:**
  - Weekly subscription: 15% off
  - Bi-monthly subscription: 10% off
- **Pause/Cancel:** Text or email by Tuesday morning (week before delivery)
- **Notice required:** Same — Tuesday before Friday delivery

---

## 2. MENU & AVAILABILITY

### Weekly Menu
- **Changes:** Yes, weekly — seasonal and themed
- **Customer choice:** Review menu for following week, choose 1, 2, or 3 dinner options
- **Additional items:** Smoothies, dessert, housemade granola, almond butter (seasonal)

### Seasonal/Occasional Items
- Granola, soup, etc. shown in menu only when offered
- **Form behavior:** Hide items not available that week

### Dietary Accommodations
- Some items adjustable for dietary preferences/requirements
- May affect pricing — customer notified
- **Subscriptions:** Adjustments applied automatically
- **One-time orders:** Must request at order time

---

## 3. CAPACITY & LIMITS

### Weekly Capacity
- **Limit:** 10-15 baskets per week
- **When full:** Form shows "sold out"
- **Waitlist:** Yes (implementation TBD)

### Per-Customer Limits
- No limits on baskets per customer
- No limits on add-ons

---

## 4. PRICING & PAYMENT

### Price Calculation
- **Variable based on:**
  - Specific menu items (prices shown per item with quantity, e.g., "almond butter 8oz $8")
  - Number of dinners chosen (1, 2, or 3)
  - Weekly ingredients
  - Portion size (2 adults + 2 children standard; larger = additional charge)
- **Add-on prices:** Variable

### Payment Timing
- **Collected:** When order is confirmed
- **Method:** Stripe (unless simpler/cheaper option available)

### Container Deposit
- **Amount:** $30-40
- **Handling:**
  - Charged upfront with order
  - Returned when containers returned (rinsed, left out for Friday pickup)
  - **Subscriptions:** Deposit rolls forward to next order
  - **Tracking:** In order spreadsheet, including return credits

---

## 5. DELIVERY LOGISTICS

### Delivery Day
- **Day:** Always Friday
- **Window:** 9am - 11am

### Delivery Area
- **Base:** 32779 (Longwood)
- **Included radius:** 8 miles
- **Beyond 8 miles:** $10 additional delivery charge

### Delivery Method
- YaYa delivers personally
- **Delivery instructions needed:** Yes
  - Gate codes, door codes if placing inside house/refrigerator
  - Someone must be home if not leaving at door (1 hour spoilage window)

### Gift Baskets
- Same logistics as regular orders
- Recipient must be notified to receive
- **Gift message:** Yes

---

## 6. ORDER CONFIRMATION & COMMUNICATION

### After Order Submitted
- **Confirmation:** Text preferred, email acceptable
- **Review:** YaYa reviews/approves
- **Total + payment link:** Within 24 hours

### Changes & Cancellations
- **Modifications:** Yes, if >24 hours before delivery
- **Cancellation policy:**
  - Before 24 hours: Full refund
  - Within 24 hours: No refund (exception: family emergency)
  - Spills/breakage: Refund available
  - Customer not home/food spoils: No refund

### Reminders
- **Weekly "time to order" reminder:** Yes
- **Delivery day reminder:** Yes

---

## 7. CUSTOMER MANAGEMENT

### New vs Returning
- **Track history:** Yes
- **Loyalty:** Subscription discounts (15% weekly, 10% bi-monthly)
- **New customer vetting:** Potential questions:
  - Have you used a similar service before?
  - What did you like/dislike?
  - What could be better?
  - Why interested in YaYa's Kitchen?
  - One-time or potential subscription?

### Contact Preferences
- **Both email and text** — customer chooses preference
- **Payment links/updates:** Same channel as preference

---

## 8. TECHNICAL INTEGRATION

### Order Storage
- **Google Sheet** from order form or manual entry
- **Email notification to YaYa** for each order

### Admin Dashboard Needs
- ✅ See all orders for the week
- ✅ Mark orders as paid
- ✅ Mark orders as delivered
- ✅ Close ordering for the week

---

## Build Priority Summary

### Critical (Can't Build Without)
1. ✅ Order cutoff: Tuesday 9am for Friday delivery
2. ✅ Advance orders: Yes, 4 weeks ahead
3. ✅ Pricing: Variable by menu items + dinner count + portions
4. ✅ Payment: Stripe
5. ✅ Order storage: Google Sheet + email notification

### Important (Affects UX)
6. ✅ Capacity: 10-15/week, sold out + waitlist
7. ✅ Recurring: Yes, with 15%/10% discounts
8. ✅ Menu: Changes weekly, seasonal
9. ✅ Delivery area: 8 miles from 32779, $10 beyond

### Nice to Have
10. Customer accounts
11. Order history tracking
12. Automated reminders

---

*Filed: 2026-02-21 09:30 CST*
