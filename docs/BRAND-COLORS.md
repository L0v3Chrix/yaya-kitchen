# YaYa's Kitchen Brand Colors

## Primary Brand Palette

Extracted from official logo files.

### Core Colors

| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| **Deep Purple** | `#2F1957` | rgb(47, 25, 87) | Primary brand color, text, headers, footer background |
| **Golden Orange** | `#EEA421` | rgb(238, 164, 33) | Accent color, CTAs, highlights, script text |
| **Olive Green** | `#7C841D` | rgb(124, 132, 29) | Secondary accent, nature/freshness elements |
| **Burnt Orange** | `#D8491F` | rgb(216, 73, 31) | Tertiary accent, warmth, energy |

### Supporting Colors

| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| **Charcoal** | `#141412` | rgb(20, 20, 18) | Body text, dark elements |
| **Warm Cream** | `#FAF8F5` | rgb(250, 248, 245) | Background, light sections |
| **Light Cream** | `#F5F2ED` | rgb(245, 242, 237) | Alternate section backgrounds |

### CSS Variables

```css
:root {
  /* Primary Brand */
  --yaya-purple: #2F1957;
  --yaya-gold: #EEA421;
  --yaya-green: #7C841D;
  --yaya-orange: #D8491F;

  /* Neutrals */
  --yaya-charcoal: #141412;
  --yaya-cream: #FAF8F5;
  --yaya-cream-dark: #F5F2ED;

  /* Functional */
  --color-text: var(--yaya-charcoal);
  --color-text-muted: #6B6B6B;
  --color-background: var(--yaya-cream);
  --color-accent: var(--yaya-gold);
  --color-primary: var(--yaya-purple);
}
```

### Color Usage Guidelines

1. **Deep Purple (#2F1957)**
   - Navigation text
   - Headlines and section titles
   - Footer background
   - Form labels
   - Primary buttons (with white text)

2. **Golden Orange (#EEA421)**
   - Script/italic accent text
   - Hover states
   - Icons and decorative elements
   - Call-to-action highlights
   - "WOW" badge and emphasis elements

3. **Olive Green (#7C841D)**
   - Secondary buttons
   - Success states
   - Fresh/organic messaging
   - Subtle accents

4. **Burnt Orange (#D8491F)**
   - Tertiary accents
   - Warning/attention elements
   - Warmth in illustrations
   - Use sparingly

### Contrast Ratios

- Purple (#2F1957) on Cream (#FAF8F5): **12.5:1** ✅ AAA
- Gold (#EEA421) on Purple (#2F1957): **5.8:1** ✅ AA
- Charcoal (#141412) on Cream (#FAF8F5): **17.2:1** ✅ AAA

### Logo Files

- `Logo-image.jpg` — Full logo with hair illustration
- `Logo-headder.jpg` — Horizontal header version with tagline
