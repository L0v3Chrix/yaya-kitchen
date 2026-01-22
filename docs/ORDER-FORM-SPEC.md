# YaYa's Kitchen Order Form Specification

## Overview

Custom HTML form that submits to Google Sheets via Google Apps Script, with email notification on each submission.

**Notification Email:** chrix@theoneai.ai (temporary — will be changed to Yaya's email)

---

## Form Sections & Fields

### Section 1: Contact Information (Required)

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| Full Name | text | Yes | Min 2 characters |
| Email Address | email | Yes | Valid email format |
| Phone Number | tel | Yes | Any format accepted |
| Delivery Address | textarea | Yes | Min 10 characters |

---

### Section 2: Weekly Basket (Required Choice)

**Question:** Would you like the YaYa's Kitchen Weekly Basket this week?

| Option | Value | Price Display |
|--------|-------|---------------|
| Yes, include the Weekly Basket | `Yes` | $70–90 |
| Not this week | `No` | — |

**Logic:** If "No" is selected, skip to Section 4 (Add-Ons)

---

### Section 3: Dinner Anchor (Conditional)

*Only visible if Weekly Basket = Yes*

| Option | Value | Price Display |
|--------|-------|---------------|
| No dinner anchor this week | `None` | — |
| Add Dinner Anchor | `Add-On` | $68–78 |
| Bundle: Core Basket + Dinner Anchor | `Bundle` | $135–155 (recommended) |

---

### Section 4: Optional Add-Ons

#### Smoothies
| Field | Type | Options |
|-------|------|---------|
| Smoothie Quantity | select | None / 1 / 2 / 3 |
| | | Price: $7–9 each (~16 oz) |

#### Dessert
| Field | Type | Price |
|-------|------|-------|
| Add weekly dessert | checkbox | $16–30 (serves 4–6) |
| | | Rotates: cobbler, cake, tart, ice cream |

#### Flowers for Home
| Field | Type | Options |
|-------|------|---------|
| Flowers for Home | select | None / 1 arrangement ($15–18) / 2–3 arrangements ($30–45) |

#### Flowers as Gift
| Field | Type | |
|-------|------|---|
| Add flowers as gift | checkbox | Same pricing, delivery fee may apply |
| Gift Recipient Details | textarea | *Conditional: only if gift checkbox checked* |

---

### Section 5: One-Time & Traveler Options

| Field | Type | Price |
|-------|------|-------|
| Arrival Basket | checkbox | $105–125 (one-time) |
| Basic Pantry Starter | checkbox | $45–65 |

**Pantry Starter includes:** Coffee or tea, eggs, milk or non-dairy milk, olive oil, salt & pepper

---

### Section 6: Containers & Deposit (Required Acknowledgment)

| Field | Type | Required |
|-------|------|----------|
| Container deposit acknowledgment | checkbox | Yes |

**Text:** "I understand a refundable container deposit applies ($30–40)"

---

### Section 7: Special Notes

| Field | Type | Required |
|-------|------|----------|
| Special Notes | textarea | No |

**Placeholder:** "Dietary needs, allergies, delivery instructions, or anything else we should know"

---

## Form Data Schema

Data sent to Google Apps Script as JSON:

```json
{
  "name": "string",
  "email": "string",
  "phone": "string",
  "address": "string",
  "weeklyBasket": "Yes | No",
  "dinnerAnchor": "None | Add-On | Bundle",
  "smoothieQty": "0 | 1 | 2 | 3",
  "dessert": "Yes | No",
  "flowersHome": "None | 1 arrangement | 2-3 arrangements",
  "flowersGift": "Yes | No",
  "giftRecipient": "string",
  "arrivalBasket": "Yes | No",
  "pantryStarter": "Yes | No",
  "containerDeposit": "Yes | No",
  "specialNotes": "string"
}
```

---

## Google Sheet Columns

Row 1 headers (in order):

```
Timestamp | Name | Email | Phone | Address | Weekly Basket | Dinner Anchor | Smoothie Qty | Dessert | Flowers Home | Flowers Gift | Gift Recipient | Arrival Basket | Pantry Starter | Container Deposit | Special Notes
```

---

## Email Notification Format

**Subject:** 🧺 New YaYa's Kitchen Order from [Customer Name]

**Body:**
```
New order received!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CUSTOMER INFORMATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Name: [name]
Email: [email]
Phone: [phone]
Address: [address]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ORDER DETAILS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

☑ Weekly Basket
☑ Dinner Anchor (Bundle)
☑ Smoothie × 2
☑ Dessert
☑ Flowers for Home (1 arrangement)
☐ Flowers as Gift
☐ Arrival Basket
☐ Pantry Starter

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SPECIAL NOTES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[special notes or "(None)"]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Container deposit acknowledged: Yes
Order received: [timestamp]

View all orders in your Google Sheet.
```

---

## UX Requirements

### Progressive Disclosure
- Dinner Anchor section hidden until Weekly Basket = Yes
- Gift recipient field hidden until Flowers Gift = checked

### Validation
- Required fields show error state if empty on submit
- Email field validates format
- Container deposit must be checked to submit

### Submit Button States
- Default: "Place My Order"
- Loading: "Submitting..." (disabled, spinner)
- Success: Show success message, reset form
- Error: Show error message, keep form data

### Success Message
"Thank you! Your order has been received. We'll be in touch soon."

### Error Message
"Something went wrong. Please try again or email us directly at [email]."

---

## Technical Implementation

### Google Apps Script Setup

1. Create Google Sheet with headers
2. Extensions → Apps Script
3. Paste script code
4. Deploy as Web App (Anyone can access)
5. Copy deployment URL
6. Add URL to website form action

### Form Submission (JavaScript)

```javascript
const response = await fetch(GOOGLE_SCRIPT_URL, {
  method: 'POST',
  mode: 'no-cors',  // Required for Google Apps Script
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(formData)
});
```

*Note: `no-cors` mode means we can't read the response, so assume success if no error thrown.*
