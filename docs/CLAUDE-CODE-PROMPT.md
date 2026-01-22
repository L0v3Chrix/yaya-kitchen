# YaYa's Kitchen Website — Claude Code Project Brief

## Start Prompt for Planning Mode

```
I need to build a beautiful website for YaYa's Kitchen, a small local meal basket delivery service in Orlando, FL. This is an MVP serving about 12 families weekly.

Please enter planning mode and review all documentation in the /docs folder before creating an implementation plan.

## Project Context

YaYa's Kitchen delivers weekly meal baskets containing breakfast items, soup, salad, bread, and a "Dinner Anchor" (boards, bowls, or traditional meals). They also offer flowers, desserts, smoothies, and one-time arrival baskets for travelers.

## Documentation to Review

1. **BRAND-COLORS.md** — Extracted hex values from logo (purple, gold, green, orange)
2. **DESIGN-REFERENCE.md** — Le Pain Quotidien design patterns to replicate
3. **WEBSITE-COPY.md** — All approved copy and messaging
4. **ORDER-FORM-SPEC.md** — Complete form fields and Google Sheets integration
5. **IMAGE-AUDIT.md** — Image inventory, quality assessment, enhancement needs

## Key Requirements

### Design (Inspired by lepainquotidien.com)
- Scroll-reveal hero typography (text fades in line by line)
- Centered logo navigation with split links
- Alternating split sections (50/50 text + image)
- Gold script font for accent labels
- Bold condensed headlines
- Dark purple footer

### Technical
- Single-page HTML/CSS/JS website
- Custom order form → Google Sheets via Apps Script
- Email notification on each submission (to chrix@theoneai.ai initially)
- Mobile responsive
- Optimized images (WebP with JPEG fallback)

### Image Pipeline (Must Complete Before Final Build)
- Review all 35 images in /YaYa_s Kitchen Tech/YaYa_s-pics/
- Select best candidates for each section
- Enhance: rotate, crop, color correct, sharpen
- Optimize: resize, compress, convert to WebP
- Primary hero candidate: IMG_2043.JPG (stove/kitchen shot)

## Brand Colors

- Deep Purple: #2F1957 (primary)
- Golden Orange: #EEA421 (accent/script)
- Olive Green: #7C841D (secondary)
- Burnt Orange: #D8491F (tertiary)
- Charcoal: #141412 (text)
- Warm Cream: #FAF8F5 (background)

## Deliverables

1. Implementation plan with phases
2. Image enhancement pipeline
3. Complete website (HTML/CSS/JS)
4. Google Apps Script for form handling
5. Setup instructions for Google Sheet
6. Deployment guide

Please create a detailed plan covering all phases of this project.
```

---

## Project File Structure

```
/Yaya-kitchen/
├── docs/
│   ├── BRAND-COLORS.md
│   ├── DESIGN-REFERENCE.md
│   ├── WEBSITE-COPY.md
│   ├── ORDER-FORM-SPEC.md
│   ├── IMAGE-AUDIT.md
│   └── CLAUDE-CODE-PROMPT.md (this file)
├── YaYa_s Kitchen Tech/
│   ├── YaYa_s-pics/           (35 source images)
│   ├── YaYa's Kitchen — Order Form Blueprint & Pricing Framework.docx
│   └── YaYa's Kitchen — Website Copy.docx
└── [build outputs will go here]
```

---

## Planning Mode Checklist

When Claude Code enters planning mode, it should:

- [ ] Read all /docs/*.md files
- [ ] Review source images in /YaYa_s Kitchen Tech/YaYa_s-pics/
- [ ] Identify image enhancement requirements
- [ ] Plan website structure and sections
- [ ] Plan form → Google Sheets integration
- [ ] Create phased implementation timeline
- [ ] Identify any blockers or questions

---

## Implementation Phases (Suggested)

### Phase 1: Image Preparation
- Review and categorize all 35 images
- Select final images for each website section
- Rotate images that need 90° correction
- Crop to appropriate aspect ratios
- Color correct and enhance
- Export optimized versions (WebP + JPEG fallback)
- Create transparent PNG versions of logos

### Phase 2: Website Structure
- Set up HTML document structure
- Implement CSS variables for brand colors
- Build navigation component
- Create section layout templates
- Implement responsive breakpoints

### Phase 3: Hero & Scroll Animations
- Build hero section with scroll-reveal text
- Implement Intersection Observer for animations
- Add scroll indicator
- Test scroll performance

### Phase 4: Content Sections
- Build all split sections with images
- Add full-width image break
- Implement about section
- Add footer with dark background

### Phase 5: Order Form
- Build form HTML with all fields
- Implement conditional logic (show/hide fields)
- Add form validation
- Style form to match site design

### Phase 6: Google Sheets Integration
- Create Google Apps Script
- Set up Google Sheet with headers
- Deploy script as web app
- Connect form to script endpoint
- Test submission flow
- Verify email notifications

### Phase 7: Testing & Optimization
- Test on mobile devices
- Verify all images load correctly
- Test form submission end-to-end
- Check accessibility (contrast, focus states)
- Optimize performance (lazy loading, compression)

### Phase 8: Deployment
- Choose hosting (Netlify recommended)
- Deploy website
- Connect custom domain (yayaskitchen.net)
- Final testing on live site

---

## Questions to Resolve

1. **Hero image**: Confirm IMG_2043.JPG (stove) as primary hero, or prefer bread/food shot?
2. **Domain**: Will this deploy to yayaskitchen.net?
3. **"This Week" section**: How will weekly menu be updated? (Manual HTML edit, or separate system?)
4. **Legacy story**: Include the sauce jar photo and manufacturing history in About section?
5. **Additional images**: Should remaining unreviewed images be cataloged for future use?

---

## Success Criteria

- [ ] Website matches Le Pain Quotidien aesthetic quality
- [ ] All brand colors correctly applied
- [ ] Scroll animations feel smooth and intentional
- [ ] Form submits successfully to Google Sheet
- [ ] Email notification received on submission
- [ ] Mobile experience is excellent
- [ ] Images are optimized (<200KB each)
- [ ] Page loads in <3 seconds
