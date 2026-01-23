// YaYa's Kitchen Brand Constants

export const BRAND_COLORS = {
  purple: '#2F1957',
  gold: '#EEA421',
  green: '#7C841D',
  orange: '#D8491F',
  charcoal: '#141412',
  cream: '#FAF8F5',
  creamDark: '#F5F2ED',
} as const

export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const

export const ANIMATION_DURATION = {
  fast: 0.2,
  normal: 0.3,
  slow: 0.5,
  verySlow: 0.8,
} as const

export const SITE_CONFIG = {
  name: "YaYa's Kitchen",
  tagline: 'Care, Delivered Weekly',
  location: 'Wilmington, NC',
  email: 'hello@yayaskitchen.com',
} as const

export const NAV_ITEMS = [
  { label: 'Weekly Basket', href: '#weekly-basket' },
  { label: 'The Menu', href: '#menu' },
  { label: 'Flowers', href: '#flowers' },
  { label: 'Arrival Baskets', href: '#arrival' },
  { label: 'About', href: '#about' },
] as const

export const SECTION_IDS = {
  hero: 'hero',
  weeklyBasket: 'weekly-basket',
  coreKitchen: 'core-kitchen',
  dinnerAnchor: 'dinner-anchor',
  flowers: 'flowers',
  desserts: 'desserts',
  arrival: 'arrival',
  about: 'about',
  order: 'order',
} as const
