# YaYa's Kitchen — Claude Code Image Processing Prompt

## Start Prompt for Image Processing Pipeline

```
I need to process ALL images for YaYa's Kitchen website. These images need to be cleaned up, enhanced, upscaled if needed, cropped appropriately, and prepared for web use.

## Image Inventory (23 images total)

Source location: `/YaYa_s Kitchen Tech/YaYa_s-pics/`

### Logo/Brand Assets (2 files)
- Logo-image.-footer.png (1MB) — Footer logo, needs transparency check
- Sauce-yaya.png (9.9MB) — Original sauce jar product shot, needs optimization

### Food Photography (12 files)
- apps.JPG (5.4MB) — Appetizers
- chicken-plum.JPG (4.7MB) — Chicken with plum sauce
- groceries.jpeg (870KB) — Grocery/ingredients shot
- lunch-at-yaya.jpeg (2.5MB) — Lunch spread
- pork-tenderloy.JPG (4.8MB) — Pork tenderloin dish
- salad.jpeg (2.6MB) — Salad dish
- shrimp.jpeg (2.6MB) — Shrimp dish
- soup.JPG (2MB) — Soup
- spread.jpeg (2.7MB) — Food spread
- wild-brtead.jpeg (3MB) — Bread (note: typo in filename)

### Desserts (5 files)
- merrygold-cake.JPG (4.6MB) — Chocolate cake with marigolds
- rainbow-cake.jpeg (1.8MB) — Rainbow cake
- rasbaerry-dessert.jpeg (1.7MB) — Raspberry dessert
- red-velvet-cake.jpeg (2.8MB) — Red velvet cake
- white-cake.jpeg (2.7MB) — White cake

### Flowers (3 files)
- yaya-floer-2.jpeg (2.2MB) — Flower arrangement (note: typo in filename)
- yaya-flower-3.jpeg (4.3MB) — Flower arrangement
- yaya-hose-flowers.JPG (1.9MB) — Flowers at house (note: typo in filename)

### Hero/Portrait (2 files)
- hero-1.JPG (4.6MB) — Hero candidate image
- yaya-stove.JPG (5.3MB) — Yaya's kitchen stove shot (PRIMARY HERO CANDIDATE)
- yaya-in-the-rain.jpeg (1.2MB) — Portrait of Yaya

## Processing Requirements

### Step 1: Analyze Each Image
For every image, please:
1. View the image and note its current state
2. Check dimensions and resolution
3. Identify issues: rotation needed? Poor lighting? Cropping required?
4. Rate quality 1-5

### Step 2: Corrections Needed
Apply as needed per image:
- **Rotation** — Fix any sideways/upside-down images
- **Cropping** — Remove distracting backgrounds, improve composition
- **Color correction** — Fix white balance, adjust exposure
- **Sharpening** — Subtle enhancement for soft images
- **Noise reduction** — Clean up grainy images

### Step 3: Create Web-Optimized Versions
For each processed image, create:

**Standard sizes:**
- Hero: 1920×1080 or 1920×800 (wide format)
- Section: 1200×800
- Thumbnail: 600×400
- Mobile: 800×600

**Formats:**
- Primary: WebP (quality 85)
- Fallback: JPEG (quality 85)
- Logos: PNG with transparency

**Target file sizes:**
- Hero images: < 400KB
- Section images: < 200KB
- Thumbnails: < 50KB

### Step 4: Upscaling (if needed)
If any image is too small for its target size:
- Use AI upscaling (Real-ESRGAN or similar)
- Target 2x minimum upscale
- Apply sharpening after upscale

### Step 5: Output Structure
Create this folder structure:

```
/images/
├── original/           # Backup of processed originals
├── hero/
│   ├── hero-main.webp
│   ├── hero-main.jpg
│   └── hero-mobile.webp
├── sections/
│   ├── weekly-basket.webp
│   ├── core-kitchen.webp
│   ├── dinner-anchor.webp
│   ├── flowers-treats.webp
│   ├── arrival-basket.webp
│   ├── about-yaya.webp
│   └── [additional sections].webp
├── desserts/
│   ├── cake-chocolate.webp
│   ├── cake-rainbow.webp
│   ├── cake-red-velvet.webp
│   └── [etc].webp
├── flowers/
│   └── [flower images].webp
├── food/
│   └── [food images].webp
└── brand/
    ├── logo-full.png
    ├── logo-header.png
    └── logo-footer.png
```

### Step 6: Fix Filenames
Correct these typos during processing:
- wild-brtead.jpeg → wild-bread.webp
- yaya-floer-2.jpeg → yaya-flower-2.webp
- yaya-hose-flowers.JPG → yaya-house-flowers.webp
- rasbaerry-dessert.jpeg → raspberry-dessert.webp
- pork-tenderloy.JPG → pork-tenderloin.webp

## Brand Colors for Reference
When color correcting, keep these brand colors in mind:
- Deep Purple: #2F1957
- Golden Orange: #EEA421
- Olive Green: #7C841D
- Warm tones preferred

## Tools Available
```bash
# ImageMagick for processing
convert input.jpg -rotate 90 -resize 1200x800^ -gravity center -extent 1200x800 -quality 85 output.jpg

# WebP conversion
cwebp -q 85 input.jpg -o output.webp

# Get image info
identify -format "%wx%h %b" image.jpg

# Python PIL for advanced processing
python3 -c "from PIL import Image; img = Image.open('file.jpg'); print(img.size)"
```

## Deliverables
1. All 23 images processed and optimized
2. Web-ready versions in proper folder structure
3. Image map document showing which image goes where on site
4. Before/after comparison for major edits
5. Total file size report (should be under 5MB for all images combined)

Please start by viewing each image, creating an assessment, then proceed with processing.
```

---

## Quick Reference

### Priority Images

| Priority | Filename | Purpose |
|----------|----------|---------|
| 1 | yaya-stove.JPG | Primary hero |
| 2 | hero-1.JPG | Alternate hero |
| 3 | spread.jpeg | Weekly basket section |
| 4 | soup.JPG | Core kitchen section |
| 5 | chicken-plum.JPG | Dinner anchor section |
| 6 | yaya-flower-3.jpeg | Flowers section |
| 7 | yaya-in-the-rain.jpeg | About section |

### Known Issues to Fix

| Image | Issue |
|-------|-------|
| Several images | May need 90° rotation |
| Sauce-yaya.png | 9.9MB — needs heavy optimization |
| Logo-image.-footer.png | Check transparency |
| Multiple | Typos in filenames |

---

## After Image Processing

Once all images are processed, the next step is to:
1. Create an IMAGE-MAP.md showing exactly where each image goes on the website
2. Update index.html to reference the new optimized images
3. Test loading performance
