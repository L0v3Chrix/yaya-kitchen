# YaYa's Kitchen — Monthly Menu Update SOP

## When YaYa sends a new month's menu

### Step 1 — Collect menu content
YaYa provides: Bowl, Classic Dinner, and Board for each of 4 weeks.

### Step 2 — Determine Friday delivery dates
Find the 4 Fridays for the new month (e.g., May 1, 8, 15, 22).

### Step 3 — Generate 4 new menu images
Use the previous month's images as style reference:

```bash
GEMINI_API_KEY=$GEMINI_API_KEY uv run ~/.npm-global/lib/node_modules/openclaw/skills/nano-banana-pro/scripts/generate_image.py \
  --prompt "Recreate this menu card in the exact same style. Change content to:
  Header: 'YAYA'S KITCHEN — [MONTH]'. Large title: 'WEEK [N]'. Subtitle: 'Friday, [DATE]'.
  BOWL: [name] — [items].
  CLASSIC DINNER: [name] — [items].
  FRIDAY BOARD: [name] — [items].
  Keep cream background, purple/navy typography, golden icons, clean elegant layout.
  Footer: 'Portions sized for 2 adults + 2 children • +$15 to increase portions'" \
  -i site/public/images/menu/[prev-month]-week-[N].jpg \
  --filename "[month]-week-[N].jpg" \
  --resolution 1K
```

Repeat for all 4 weeks. Copy generated images to:
`site/public/images/menu/[month]-week-1.jpg` through `...-week-4.jpg`

### Step 4 — Update MonthlyMenu.tsx
Open: `site/src/components/sections/MonthlyMenu.tsx`

In the `MONTHS` array:
1. **Remove** the oldest month entry
2. **Add** the new month at the end (it auto-shows as the active tab)

Example entry:
```ts
{
  label: 'May',
  weeks: [
    { id: 1, label: 'Week 1', date: 'Friday, May 1',  image: '/images/menu/may-week-1.jpg', alt: "YaYa's Kitchen May Week 1 Menu" },
    { id: 2, label: 'Week 2', date: 'Friday, May 8',  image: '/images/menu/may-week-2.jpg', alt: "YaYa's Kitchen May Week 2 Menu" },
    { id: 3, label: 'Week 3', date: 'Friday, May 15', image: '/images/menu/may-week-3.jpg', alt: "YaYa's Kitchen May Week 3 Menu" },
    { id: 4, label: 'Week 4', date: 'Friday, May 22', image: '/images/menu/may-week-4.jpg', alt: "YaYa's Kitchen May Week 4 Menu" },
  ],
},
```

### Step 5 — Build, commit, deploy
```bash
cd site && pnpm build
cd .. && git add -A && git commit -m "feat: Add [Month] menu"
git push origin main
vercel --prod --yes
```

### Step 6 — Verify
Check yayasbaskets.com — new month tab should appear and be the active default.

---
*Created: 2026-03-13 | Update each month takes ~10 minutes end-to-end*
