# YaYa's Kitchen — Google Sheet Schema
**Created:** 2026-02-21
**Purpose:** Order management, customer tracking, capacity control

---

## Sheet Name
`YaYa's Kitchen Orders`

---

## Tab 1: Orders

Primary order log. One row per order submitted.

| Column | Header | Data Type | Example | Notes |
|--------|--------|-----------|---------|-------|
| A | Timestamp | DateTime | 2026-02-21 10:45:23 | Auto-generated on submission |
| B | Order ID | Text | YAYA-20260221-001 | Format: YAYA-YYYYMMDD-XXX |
| C | Status | Text | New | New / Confirmed / Paid / Delivered / Cancelled |
| D | Name | Text | Jane Smith | Customer full name |
| E | Email | Text | jane@email.com | Customer email |
| F | Phone | Text | 407-555-1234 | Customer phone |
| G | Address | Text | 123 Oak St, Longwood FL 32779 | Full delivery address |
| H | ZIP | Text | 32779 | Extracted ZIP code |
| I | Delivery Zone | Text | In-Zone | In-Zone / Out-of-Zone (+$10) |
| J | Delivery Week | Date | 2026-02-28 | Friday delivery date selected |
| K | Weekly Basket | Text | Yes | Yes / No |
| L | Gift Basket | Text | No | Yes / No |
| M | Gift Recipient | Text | | Recipient name/address if gift |
| N | Dinner Anchor | Text | Bundle | None / Add-On / Bundle |
| O | Smoothie Qty | Number | 2 | 0, 1, 2, or 3 |
| P | Dessert | Text | Yes | Yes / No |
| Q | Flowers Home | Text | 1 arrangement | None / 1 arrangement / 2-3 arrangements |
| R | Flowers Gift | Text | No | Yes / No |
| S | Gift Message | Text | | Personal message for gift orders |
| T | Arrival Basket | Text | No | Yes / No |
| U | Pantry Starter | Text | No | Yes / No |
| V | Delivery Instructions | Text | Gate code: 1234, leave at door | Customer delivery notes |
| W | Container Deposit | Text | Yes | Yes (acknowledged) |
| X | Subscription Interest | Text | Weekly | None / Weekly / Bi-monthly |
| Y | Contact Preference | Text | Text | Text / Email / Both |
| Z | Special Notes | Text | Nut allergy | Dietary needs, other notes |
| AA | Payment Status | Text | Pending | Pending / Sent / Paid |
| AB | Delivered | Text | No | Yes / No |

### Row 1 (Headers)
```
Timestamp | Order ID | Status | Name | Email | Phone | Address | ZIP | Delivery Zone | Delivery Week | Weekly Basket | Gift Basket | Gift Recipient | Dinner Anchor | Smoothie Qty | Dessert | Flowers Home | Flowers Gift | Gift Message | Arrival Basket | Pantry Starter | Delivery Instructions | Container Deposit | Subscription Interest | Contact Preference | Special Notes | Payment Status | Delivered
```

### Conditional Formatting Suggestions
- **Status = "New"** → Yellow background
- **Status = "Paid"** → Green background
- **Delivery Zone = "Out-of-Zone (+$10)"** → Orange text
- **Delivered = "Yes"** → Strikethrough

---

## Tab 2: Customers

Customer directory. One row per unique customer (by email).

| Column | Header | Data Type | Example | Notes |
|--------|--------|-----------|---------|-------|
| A | Customer ID | Text | CUST-001 | Auto-increment |
| B | Name | Text | Jane Smith | Latest name used |
| C | Email | Text | jane@email.com | Primary key (unique) |
| D | Phone | Text | 407-555-1234 | Latest phone |
| E | Address | Text | 123 Oak St, Longwood FL 32779 | Latest address |
| F | ZIP | Text | 32779 | Latest ZIP |
| G | First Order | Date | 2026-02-21 | Date of first order |
| H | Last Order | Date | 2026-02-21 | Date of most recent order |
| I | Total Orders | Number | 1 | Count of all orders |
| J | Subscription Status | Text | Interested (Weekly) | None / Interested (Weekly) / Interested (Bi-monthly) / Active |
| K | Contact Preference | Text | Text | Text / Email / Both |
| L | Notes | Text | | YaYa's notes about customer |

### Row 1 (Headers)
```
Customer ID | Name | Email | Phone | Address | ZIP | First Order | Last Order | Total Orders | Subscription Status | Contact Preference | Notes
```

---

## Tab 3: Capacity

Weekly capacity tracking. One row per delivery week.

| Column | Header | Data Type | Example | Notes |
|--------|--------|-----------|---------|-------|
| A | Week | Date | 2026-02-28 | Friday delivery date |
| B | Orders Count | Number | 7 | Current orders for this week |
| C | Max Capacity | Number | 15 | Fixed at 15 |
| D | Status | Text | Open | Open / Closed / Sold Out |

### Row 1 (Headers)
```
Week | Orders Count | Max Capacity | Status
```

### Pre-populate Next 8 Weeks
| Week | Orders Count | Max Capacity | Status |
|------|--------------|--------------|--------|
| 2026-02-28 | 0 | 15 | Open |
| 2026-03-07 | 0 | 15 | Open |
| 2026-03-14 | 0 | 15 | Open |
| 2026-03-21 | 0 | 15 | Open |
| 2026-03-28 | 0 | 15 | Open |
| 2026-04-04 | 0 | 15 | Open |
| 2026-04-11 | 0 | 15 | Open |
| 2026-04-18 | 0 | 15 | Open |

### Status Logic
- **Open:** Orders Count < Max Capacity
- **Sold Out:** Orders Count >= Max Capacity
- **Closed:** Manually closed by YaYa (even if capacity available)

---

## In-Zone ZIP Codes

Based on 8-mile radius from 32779 (Longwood):

```
32779 (Longwood - base)
32750 (Longwood)
32701 (Altamonte Springs)
32714 (Altamonte Springs)
32730 (Casselberry)
32707 (Casselberry)
32708 (Winter Springs)
32765 (Oviedo - partial)
32746 (Lake Mary)
32771 (Sanford - partial)
32751 (Maitland)
32789 (Winter Park - partial)
```

**Out-of-Zone:** Any ZIP not listed above = +$10 delivery fee

---

## Data Relationships

```
Orders.Email ← → Customers.Email (lookup/update)
Orders.Delivery Week ← → Capacity.Week (count increment)
```

---

*Schema Version: 1.0 | 2026-02-21*
