# YaYa's Kitchen Website Project

## Quick Start for Claude Code

```bash
# Enter planning mode and start the project
claude --plan

# Then paste the start prompt from:
# /docs/CLAUDE-CODE-PROMPT.md
```

---

## Project Overview

Build a beautiful single-page website for YaYa's Kitchen, a small local meal basket delivery service in Orlando, FL.

**Design Inspiration:** [Le Pain Quotidien](https://www.lepainquotidien.com/be/en)

**Key Features:**
- Scroll-reveal hero typography
- Alternating split section layouts
- Custom order form → Google Sheets + email notification
- Mobile responsive
- Optimized imagery

---

## Documentation

| File | Purpose |
|------|---------|
| [CLAUDE-CODE-PROMPT.md](docs/CLAUDE-CODE-PROMPT.md) | **START HERE** — Full project brief and planning mode prompt |
| [BRAND-COLORS.md](docs/BRAND-COLORS.md) | Extracted brand colors with hex values and usage guidelines |
| [DESIGN-REFERENCE.md](docs/DESIGN-REFERENCE.md) | Le Pain Quotidien design patterns to replicate |
| [WEBSITE-COPY.md](docs/WEBSITE-COPY.md) | All approved website copy and messaging |
| [ORDER-FORM-SPEC.md](docs/ORDER-FORM-SPEC.md) | Form fields, validation, Google Sheets schema |
| [IMAGE-AUDIT.md](docs/IMAGE-AUDIT.md) | Image inventory, quality ratings, enhancement plan |

---

## Brand Colors

| Color | Hex | Usage |
|-------|-----|-------|
| Deep Purple | `#2F1957` | Primary, headers, footer |
| Golden Orange | `#EEA421` | Accent, script text, CTAs |
| Olive Green | `#7C841D` | Secondary accent |
| Burnt Orange | `#D8491F` | Tertiary accent |
| Charcoal | `#141412` | Body text |
| Warm Cream | `#FAF8F5` | Background |

---

## Source Assets

### Images
Location: `/YaYa_s Kitchen Tech/YaYa_s-pics/`

- 35 images total
- Logos, food, flowers, kitchen, portraits
- See IMAGE-AUDIT.md for full inventory

### Primary Hero Candidate
`IMG_2043.JPG` — Yaya's stove with pots cooking, beautiful tile backsplash

### Original Documents
- `YaYa's Kitchen — Website Copy.docx`
- `YaYa's Kitchen — Order Form Blueprint & Pricing Framework.docx`

---

## Technical Requirements

### Form Submission Flow
```
User submits form
    ↓
JavaScript POSTs to Google Apps Script
    ↓
Script writes to Google Sheet
    ↓
Script sends email notification
    ↓
User sees success message
```

**Notification Email:** chrix@theoneai.ai (temporary)

### Hosting
Recommended: Netlify (free tier)
Domain: yayaskitchen.net (existing)

---

## Project Phases

1. **Image Preparation** — Review, enhance, optimize all images
2. **Website Structure** — HTML/CSS foundation with brand colors
3. **Hero & Animations** — Scroll-reveal typography effect
4. **Content Sections** — All page sections with copy and images
5. **Order Form** — Complete form with conditional logic
6. **Google Integration** — Apps Script + Sheet + email notifications
7. **Testing** — Mobile, accessibility, performance
8. **Deployment** — Netlify + domain connection

---

## Contact

**Project Owner:** Chrix
**Email:** chrix@theoneai.ai
