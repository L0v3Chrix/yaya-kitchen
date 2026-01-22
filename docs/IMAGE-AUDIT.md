# YaYa's Kitchen Image Audit & Enhancement Plan

## Current Image Inventory

Location: `/YaYa_s Kitchen Tech/YaYa_s-pics/`

### Logo & Brand Assets

| Filename | Dimensions | Notes | Action Needed |
|----------|-----------|-------|---------------|
| Logo-headder.jpg | Header version | Horizontal, with tagline | Create transparent PNG version |
| Logo-image.jpg | Full logo | With hair illustration | Create transparent PNG version |

### Kitchen/Stove (Hero Candidate)

| Filename | Content | Quality | Action Needed |
|----------|---------|---------|---------------|
| **IMG_2043.JPG** | **Yaya's stove with pots cooking** | **Excellent** | **PRIMARY HERO CANDIDATE** — Beautiful tile backsplash, colorful towel, authentic working kitchen. Crop to wide hero ratio (1920×800), minor color enhancement. This image captures the soul of YaYa's Kitchen. |

### Food Photography

| Filename | Content | Quality | Action Needed |
|----------|---------|---------|---------------|
| IMG_1571.JPG | Plated dinner (chicken, veggies) | Good | Crop to hero ratio, color correct |
| IMG_1620.JPG | Chocolate cake with flowers | Good | Secondary hero option, crop/enhance |
| IMG_1621.JPG | Salad appetizer | Medium | Rotate 90°, crop, brighten |
| IMG_1624.JPG | Chicken dinner plate | Good | Crop, warm up colors |
| IMG_1136.JPG | Orange soup, elegant setting | Excellent | Minimal editing needed |
| IMG_0693.jpeg | TBD | TBD | Needs review |
| IMG_0409.jpeg | TBD | TBD | Needs review |
| IMG_0292.jpeg | TBD | TBD | Needs review |

### Desserts

| Filename | Content | Quality | Action Needed |
|----------|---------|---------|---------------|
| IMG_1620.JPG | Chocolate cake with marigolds | Good | Color correct, crop options |
| IMG_1836.jpeg | Red velvet cake | TBD | Needs review |
| IMG_0236.JPG | White cake with candles | Medium | May be too personal/birthday |

### Flowers

| Filename | Content | Quality | Action Needed |
|----------|---------|---------|---------------|
| IMG_0132.jpeg | Vibrant arrangement (sunflowers, red) | Excellent | Rotate 90°, crop for web |

### About/Personal

| Filename | Content | Quality | Action Needed |
|----------|---------|---------|---------------|
| IMG_2260.jpeg | Yaya in purple shirt, kitchen | Good | Rotate 90°, crop portrait style |
| Sauce-yaya.JPG | Original sauce jar product | Excellent | Clean product shot, minimal edit |
| IMG_0018.JPG | Two sauce jars | Good | Could use for legacy story |

### Unreviewed Images

These need to be viewed and categorized:

- 65419170555__3B27C447-FA53-43D7-B952-C612968F8ECA.jpeg
- 69697036292__2EFAD579-A919-4CA8-ABE1-F807FABDDDD5.jpeg
- IMG_0580.PNG
- IMG_1836.jpeg
- IMG_1871.jpeg
- IMG_1873.jpeg
- IMG_1944.JPG
- IMG_2005.jpeg
- IMG_2043.JPG
- IMG_2044.JPG
- IMG_2064.JPG
- IMG_2066.JPG
- IMG_2224.jpeg
- IMG_3188.jpeg
- IMG_3855.jpeg
- IMG_5785.jpeg
- IMG_7702.jpeg
- IMG_F66DBEB1-FBD6-412B-A00C-922A863BF524.jpeg
- Screen Shot 2025-05-14 at 12.44.47 PM.png

---

## Image Enhancement Pipeline

### Phase 1: Review & Select

1. View all unreviewed images
2. Categorize by content type (food, flowers, about, basket, etc.)
3. Rate quality (1-5)
4. Select best candidates for each website section

### Phase 2: Basic Corrections

For each selected image:

1. **Rotation** — Many images need 90° rotation
2. **Crop** — Remove distracting backgrounds
3. **Exposure** — Adjust brightness/contrast
4. **White balance** — Correct color temperature
5. **Sharpening** — Subtle enhancement

### Phase 3: Web Optimization

1. **Resize** — Create multiple sizes:
   - Hero: 1920×1080 (or 1920×800 for wide)
   - Section: 1200×800
   - Thumbnail: 600×400
   - Mobile: 800×600

2. **Format conversion**:
   - Primary: WebP (with JPEG fallback)
   - Logos: PNG with transparency

3. **Compression**:
   - Target: < 200KB for section images
   - Target: < 400KB for hero images
   - Maintain quality score > 80

### Phase 4: Upscaling (if needed)

For low-resolution images:

1. Use AI upscaling (Real-ESRGAN or similar)
2. Target 2x upscale minimum
3. Run sharpening pass after upscale

---

## Website Image Requirements

### Hero Section
- **Dimensions**: 1920×1080 or 1920×800 (wide)
- **Content**: Bread, basket, or food spread
- **Style**: Clean, centered subject, room for text overlay
- **Candidates**: IMG_1620.JPG (cake), need bread shot

### Split Sections (6 needed)
- **Dimensions**: 1200×800 minimum
- **Content**: Various food, flowers, kitchen
- **Style**: Can be tighter crops, lifestyle feel

| Section | Content Needed | Candidate |
|---------|---------------|-----------|
| Weekly Basket | Basket spread or ingredients | IMG_1624.JPG |
| Core Kitchen | Soup + bread | IMG_1136.JPG |
| Dinner Anchor | Plated dinner | IMG_1571.JPG |
| Flowers & Treats | Flower arrangement | IMG_0132.jpeg |
| Arrival Basket | Basket or spread | IMG_1621.JPG |
| About | Yaya portrait | IMG_2260.jpeg |

### Full-Width Break
- **Dimensions**: 1920×600 minimum
- **Content**: Flowers, food prep, or atmospheric
- **Style**: Works with parallax effect

---

## Recommended Tools

### For Claude Code Implementation

```bash
# ImageMagick for batch processing
convert input.jpg -rotate 90 -crop 1200x800+0+0 -quality 85 output.jpg

# For WebP conversion
cwebp -q 85 input.jpg -o output.webp

# For resizing
convert input.jpg -resize 1920x1080^ -gravity center -extent 1920x1080 output.jpg
```

### Quality Checks

```bash
# Get image dimensions
identify -format "%wx%h" image.jpg

# Get file size
ls -lh image.jpg

# Check color profile
identify -verbose image.jpg | grep -i colorspace
```

---

## Final Deliverables

After enhancement, the `/images` folder should contain:

```
images/
├── hero/
│   ├── hero-main.webp
│   ├── hero-main.jpg (fallback)
│   └── hero-mobile.webp
├── sections/
│   ├── weekly-basket.webp
│   ├── core-kitchen.webp
│   ├── dinner-anchor.webp
│   ├── flowers-treats.webp
│   ├── arrival-basket.webp
│   └── about-yaya.webp
├── brand/
│   ├── logo-full.png (transparent)
│   ├── logo-header.png (transparent)
│   └── logo-footer.png (light version)
└── gallery/ (optional)
    └── [additional food photos]
```
