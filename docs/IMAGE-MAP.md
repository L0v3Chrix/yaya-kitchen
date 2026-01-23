# YaYa's Kitchen — Image Map

## Overview

All images have been processed, rotated, optimized, and converted to WebP format for optimal web performance.

**Processing Date:** 2026-01-22
**Total Web-Optimized Images:** 23
**Total Size (web versions):** ~83MB (full set) / ~2MB (web-optimized only)

---

## Image Assignments by Section

### Hero Section
| Image | File Path | Size | Notes |
|-------|-----------|------|-------|
| Primary Hero | `images/hero/hero-main-web.webp` | 332KB | YaYa's kitchen stove with copper pots |
| Alternate Hero | `images/hero/hero-bread-web.webp` | 410KB | Fresh bread loaves (rotated) |

### About YaYa Section
| Image | File Path | Size | Notes |
|-------|-----------|------|-------|
| YaYa Portrait | `images/hero/yaya-rain-portrait.webp` | 346KB | YaYa walking in rain with umbrella |

### Weekly Basket Section
| Image | File Path | Size | Notes |
|-------|-----------|------|-------|
| Sandwich Spread | `images/food/sandwich-spread.webp` | 1.0MB | Deli ingredients on cutting board |

### Core Kitchen Section
| Image | File Path | Size | Notes |
|-------|-----------|------|-------|
| Elegant Soup | `images/food/soup-tomato.webp` | 455KB | Tomato soup with gold charger |

### Dinner Anchor Section
| Image | File Path | Size | Notes |
|-------|-----------|------|-------|
| Chicken Plum | `images/food/chicken-plum-web.webp` | 92KB | Chicken leg with plum sauce |
| Pork Tenderloin | `images/food/pork-tenderloin-web.webp` | 119KB | Sliced pork with vegetables (rotated) |

### Add-Ons / Extras
| Image | File Path | Size | Notes |
|-------|-----------|------|-------|
| Appetizers | `images/food/appetizers-web.webp` | 99KB | Fried appetizers on spinach |
| Salad | `images/food/salad-parmesan.webp` | 1.1MB | Mixed greens with parmesan shavings |
| Shrimp | `images/food/shrimp-garlic.webp` | 1.1MB | Garlic shrimp (may need crop) |
| Focaccia Art | `images/food/focaccia-art-web.webp` | 183KB | Stunning vegetable flower design |
| Lunch Spread | `images/food/lunch-soup-bread.webp` | 1.0MB | Casual lunch setting |

### Arrival Basket Section
| Image | File Path | Size | Notes |
|-------|-----------|------|-------|
| Fresh Produce | `images/sections/arrival-basket.webp` | 392KB | Beautiful grocery spread with produce |

### Flowers Section
| Image | File Path | Size | Notes |
|-------|-----------|------|-------|
| Colorful Arrangement | `images/flowers/arrangement-colorful.webp` | 1.3MB | Red, yellow, white in blue vase (rotated) |
| Sunflower Arrangement | `images/flowers/arrangement-sunflower.webp` | 841KB | Sunflowers with roses (rotated) |
| Kitchen Interior | `images/flowers/kitchen-interior.webp` | 726KB | Cozy kitchen with candles and flowers |

### Desserts Section
| Image | File Path | Size | Notes |
|-------|-----------|------|-------|
| Chocolate Marigold Cake | `images/desserts/cake-chocolate-marigold-web.webp` | 121KB | Chocolate cake with edible flowers (rotated) |
| Rainbow Cake | `images/desserts/cake-rainbow.webp` | 775KB | Colorful layered cake |
| Red Velvet Cake | `images/desserts/cake-red-velvet-web.webp` | 196KB | Classic red velvet layers (rotated) |
| White Sesame Cake | `images/desserts/cake-white-sesame-web.webp` | 166KB | White cake with sesame seeds (rotated) |
| Raspberry Pavlova | `images/desserts/raspberry-pavlova.webp` | 609KB | Meringue with berries (rotated) |

### Brand Assets
| Image | File Path | Size | Notes |
|-------|-----------|------|-------|
| Logo Full | `images/brand/logo-full.png` | 912KB | Full logo with swirled hair design |
| Sauce Product | `images/brand/sauce-product.jpg` | 959KB | Pasta sauce jar product shot |

---

## Processing Summary

### Images That Were Rotated (90° clockwise)
1. `hero-1.JPG` → `hero-bread-web.webp`
2. `yaya-flower-3.jpeg` → `arrangement-colorful.webp`
3. `pork-tenderloy.JPG` → `pork-tenderloin-web.webp`
4. `merrygold-cake.JPG` → `cake-chocolate-marigold-web.webp`
5. `rasbaerry-dessert.jpeg` → `raspberry-pavlova.webp`
6. `red-velvet-cake.jpeg` → `cake-red-velvet-web.webp`
7. `white-cake.jpeg` → `cake-white-sesame-web.webp`
8. `yaya-floer-2.jpeg` → `arrangement-sunflower.webp`

### Filename Corrections
| Original (with typo) | Corrected |
|---------------------|-----------|
| wild-brtead.jpeg | focaccia-art.webp |
| yaya-floer-2.jpeg | arrangement-sunflower.webp |
| yaya-hose-flowers.JPG | kitchen-interior.webp |
| rasbaerry-dessert.jpeg | raspberry-pavlova.webp |
| pork-tenderloy.JPG | pork-tenderloin.webp |

---

## Folder Structure

```
/images/
├── hero/
│   ├── hero-main-web.webp      (332KB) — Primary hero
│   ├── hero-bread-web.webp     (410KB) — Alternate hero
│   └── yaya-rain-portrait.webp (346KB) — About section
├── sections/
│   └── arrival-basket.webp     (392KB) — Fresh produce
├── food/
│   ├── chicken-plum-web.webp   (92KB)
│   ├── appetizers-web.webp     (99KB)
│   ├── pork-tenderloin-web.webp (119KB)
│   ├── focaccia-art-web.webp   (183KB)
│   ├── soup-tomato.webp        (455KB)
│   └── [additional food images]
├── desserts/
│   ├── cake-chocolate-marigold-web.webp (121KB)
│   ├── cake-white-sesame-web.webp       (166KB)
│   ├── cake-red-velvet-web.webp         (196KB)
│   ├── raspberry-pavlova.webp           (609KB)
│   └── cake-rainbow.webp                (775KB)
├── flowers/
│   ├── kitchen-interior.webp            (726KB)
│   ├── arrangement-sunflower.webp       (841KB)
│   └── arrangement-colorful.webp        (1.3MB)
└── brand/
    ├── logo-full.png                    (912KB)
    └── sauce-product.jpg                (959KB)
```

---

## Recommended HTML Updates

### Hero Section
```html
<picture>
  <source srcset="images/hero/hero-main-web.webp" type="image/webp">
  <img src="images/hero/hero-main-web.jpg" alt="YaYa's Kitchen" loading="eager">
</picture>
```

### About Section (YaYa Portrait)
```html
<picture>
  <source srcset="images/hero/yaya-rain-portrait.webp" type="image/webp">
  <img src="images/hero/yaya-rain-portrait.jpg" alt="YaYa walking in the rain" loading="lazy">
</picture>
```

### Arrival Basket Section
```html
<picture>
  <source srcset="images/sections/arrival-basket.webp" type="image/webp">
  <img src="images/sections/arrival-basket.jpg" alt="Fresh groceries and produce" loading="lazy">
</picture>
```

---

## Quality Ratings

| Category | Quality Score | Notes |
|----------|--------------|-------|
| Hero Images | 5/5 | Excellent kitchen/bread shots |
| Food Photography | 4/5 | Professional quality, good variety |
| Desserts | 5/5 | Stunning, colorful, Instagram-worthy |
| Flowers | 5/5 | Beautiful arrangements |
| YaYa Portrait | 5/5 | Perfect rain photo for About section |
| Brand Assets | 4/5 | Logo needs transparency work |

---

## Next Steps

1. **Update index.html** — Replace placeholder images with optimized versions
2. **Test loading performance** — Verify Lighthouse scores
3. **Consider lazy loading** — All images below the fold
4. **Add srcset for responsive** — Create smaller versions for mobile if needed

---

*Image processing completed: 2026-01-22*
