# YaYa's Kitchen — Pending Questions

Questions sent to YaYa, awaiting answers before build continues.

---

## Answered: 2026-02-21 10:04 CST

### Menu Management
| # | Question | Answer | Status |
|---|----------|--------|--------|
| 1 | How does YaYa update the weekly menu? | YaYa texts Chrix updates (until v2) | ✅ |
| 2 | When does the new menu go live each week? | Saturday morning after Friday deliveries | ✅ |

### Pricing
| # | Question | Answer | Status |
|---|----------|--------|--------|
| 3 | Is there a pricing formula, or does YaYa set exact price each week based on ingredients? | YaYa sets price per menu based on ingredients | ✅ |
| 4 | How much upcharge for larger portions (beyond 2 adults + 2 kids)? | $12-15 based on ingredients | ✅ |

### Delivery
| # | Question | Answer | Status |
|---|----------|--------|--------|
| 5 | Delivery zone check: need actual distance calculation or simple zip code list? | **ZIP code list:** 32779, 32750, 32714, 32701, 32746, 32703, 32791, 32708 | ✅ |

### Payment
| # | Question | Answer | Status |
|---|----------|--------|--------|
| 6 | Does YaYa have a Stripe account already? | Yes, but v1 = manual payment links from spreadsheet | ✅ |
| 7 | Confirm OK for MVP: order submits → YaYa reviews → YaYa texts payment link manually? | Yes, confirmed | ✅ |

### Subscriptions
| # | Question | Answer | Status |
|---|----------|--------|--------|
| 8 | For initial launch: just capture "interested in subscription" as a field, build actual recurring billing later? | Yes — tick box on form, capture in sheet | ✅ |

---

## Summary for Build

**V1 Scope (Today):**
- Form → Google Sheet → Email to YaYa
- YaYa sends Stripe payment links manually
- Hardcode current menu (YaYa texts updates to Chrix for now)
- ZIP code validation for delivery zone (8 zips in-zone, others +$10)
- Subscription = checkbox only, no billing logic

**V2 Roadmap (After Adoption):**
- Dynamic menu management
- Stripe checkout integration
- Subscription billing

**Delivery Zone ZIP Codes (In-Zone, No Extra Fee):**
```
32779  (Longwood - base)
32750  (Longwood)
32714  (Altamonte Springs)
32701  (Altamonte Springs)
32746  (Lake Mary)
32703  (Apopka)
32791  (Longwood)
32708  (Winter Springs)
```

All other ZIPs = +$10 delivery fee

---

*All questions answered: 2026-02-21 10:04 CST*
