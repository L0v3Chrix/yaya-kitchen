# YaYa's Kitchen Design Reference

## Inspiration Site: Le Pain Quotidien

**URL:** https://www.lepainquotidien.com/be/en

### Key Design Elements to Replicate

---

## Navigation Header (Priority Feature)

The LPQ navigation is distinctive and should be adapted for YaYa's Kitchen:

### LPQ Navigation Characteristics:
- **Centered logo** — Brand name sits in the middle of the nav bar
- **Split navigation** — Links divided on left and right of logo
- **Bordered container** — Nav bar has a subtle border/box around it
- **Clean typography** — Simple, uppercase, evenly spaced links
- **Sticky behavior** — Stays fixed at top on scroll
- **Compact on scroll** — Shrinks slightly when user scrolls down

### LPQ Nav Structure:
```
[ Home | Atelier | Magazine | Franchise ]  LE PAIN QUOTIDIEN  [ Menu | Order Online | Locations ]
```

### Adapted for YaYa's Kitchen:
```
[ About | The Basket | How It Works ]  YAYA'S KITCHEN LOGO  [ This Week | Order Now ]
```

### CSS Approach:
```css
.nav {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px 40px;
  border: 1px solid #e0e0e0;
  margin: 20px;
  background: var(--yaya-cream);
}

.nav-left, .nav-right {
  display: flex;
  gap: 30px;
}

.nav-logo {
  margin: 0 60px;
}

.nav-link {
  font-size: 13px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--yaya-charcoal);
  border: 1px solid transparent;
  padding: 8px 16px;
  transition: all 0.3s ease;
}

.nav-link:hover {
  border-color: var(--yaya-charcoal);
}

.nav-cta {
  background: var(--yaya-charcoal);
  color: white;
}
```

---

## Hero Section — Scroll-Reveal Typography

### LPQ Approach:
- Text reveals line by line as user scrolls
- Each line transitions from **gray/faded** to **bold black**
- Some lines use **script/italic font** in gold/yellow
- Central product image (bread) stays relatively fixed
- Creates meditative, slow reading experience

### Text Animation States:
1. **Upcoming** — Light gray, slightly blurred
2. **Current** — Bold black, sharp
3. **Passed** — Remains visible, full opacity

### Implementation:
```javascript
// Intersection Observer watches each line
// Triggers class change based on scroll position
// Uses CSS transitions for smooth reveal
```

### Typography Pattern:
```
THIS IS NOT          ← Bold condensed sans-serif
JUST BREAD.          ← Bold condensed sans-serif
This is our          ← Script/italic in gold
PHILOSOPHY.          ← Bold condensed sans-serif
IT'S ABOUT TIME.     ← Bold condensed sans-serif
Time for slowing     ← Script/italic in gold
DOWN.                ← Bold condensed sans-serif
```

---

## Split Section Layouts

### LPQ Pattern:
- 50/50 grid — text on one side, image on other
- **Alternates** — Text left/image right, then text right/image left
- Clean separation, no overlapping elements
- Text side has generous padding
- Image side is full-bleed

### Text Block Structure:
```
[Script label]        ← Gold italic, small: "Discover"
[BOLD HEADLINE]       ← Uppercase, large: "OUR MENU DISHES"

Body text paragraph   ← Regular weight, gray
describing the
content clearly.

[CTA Button]          ← Black fill or outline
```

---

## Button Styles

### Primary Button (LPQ):
- Solid black background
- White text
- No border-radius (square corners)
- Uppercase text
- Generous padding
- Hover: Background changes to brand color

### Secondary Button:
- Transparent background
- Black border
- Black text
- Hover: Fills with black, text turns white

---

## Full-Width Image/Video Breaks

### LPQ Uses:
- Full-viewport-width images between sections
- Autoplay video (muted) showing bread-making
- Creates visual breathing room
- Often has parallax effect on scroll

---

## Footer

### LPQ Footer:
- Dark background (near black)
- Centered logo (inverted/light version)
- Organized link columns
- Social icons
- Copyright at bottom

### Adapted for YaYa:
- Dark purple background (#2F1957)
- Light/gold version of logo
- Minimal links (small operation)
- Personal tagline
- Contact email

---

## Typography System

### Fonts Used (Adapted):

| Purpose | LPQ Style | YaYa Recommendation |
|---------|-----------|---------------------|
| Script accents | Gold script | Cormorant Garamond Italic |
| Headlines | Bold condensed | Oswald 600 |
| Body text | Clean sans | Lato 300/400 |
| Nav links | Uppercase sans | Lato 400 |

### Sizing Scale:
```css
--text-xs: 12px;    /* Nav links, labels */
--text-sm: 14px;    /* Buttons, captions */
--text-base: 16px;  /* Body text */
--text-lg: 18px;    /* Lead paragraphs */
--text-xl: 24px;    /* Section labels (script) */
--text-2xl: 32px;   /* Subheadings */
--text-3xl: 48px;   /* Section titles */
--text-4xl: 64px;   /* Hero lines */
```

---

## Color Application (LPQ → YaYa)

| LPQ Color | Usage | YaYa Equivalent |
|-----------|-------|-----------------|
| Black | Headlines, nav, buttons | Charcoal #141412 |
| Gold #FDC400 | Script text, accents | Gold #EEA421 |
| Cream | Backgrounds | Cream #FAF8F5 |
| Dark (footer) | Footer background | Purple #2F1957 |

---

## Animation & Interaction Notes

### Scroll Animations:
- Subtle fade-up reveals (not bouncy)
- 0.6-0.8s transition duration
- Ease-out timing function
- Staggered delays for grouped elements

### Hover States:
- Buttons: Background color transition
- Links: Underline or border appears
- Images: Subtle scale (1.02) or overlay

### Page Load:
- Hero elements animate in sequentially
- Nav fades in after hero
- No jarring movements

---

## Mobile Considerations

- Navigation collapses to hamburger menu
- Split sections stack vertically (image first, then text)
- Hero text sizes reduce significantly
- Buttons become full-width
- Maintain generous touch targets (44px minimum)
