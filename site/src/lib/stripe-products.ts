/**
 * Yaya's Kitchen — Stripe Products Configuration
 * Generated: 2026-02-26T14:56:08.048Z
 * 
 * DO NOT EDIT MANUALLY — regenerate with scripts/stripe-setup.ts
 */

export const STRIPE_PRODUCTS = {
  CORE_BASKET: {
    productId: 'prod_U2sNTG2gWg812s',
    priceId: 'price_1T4mcyF4PB0xZAmi2hzl3GG8',
    amount: 17500, // $175
  },
  CONTAINER_DEPOSIT: {
    productId: 'prod_U2tFvKn4X2NZoy',
    priceId: 'price_1T4nSrF4PB0xZAmiAJFS7cxw',
    amount: 3500, // $35
  },
  SMOOTHIE_PAIR: {
    productId: 'prod_U2smZd44ocIhGz',
    priceId: 'price_1T4n10F4PB0xZAmieXxQUFgk',
    amount: 1800, // $18
  },
  SMOOTHIE_FAMILY_SET: {
    productId: 'prod_U2snq567TfLhyh',
    priceId: 'price_1T4n1dF4PB0xZAmi20WcATNR',
    amount: 3200, // $32
  },
  PORTION_BOOST: {
    productId: 'prod_U2sluKL2q9Dx4C',
    priceId: 'price_1T4mzzF4PB0xZAmiLuTOV3v7',
    amount: 2500, // $25
  },
  FLOWERS: {
    productId: 'prod_U2sOhdVa9Ta6yv',
    priceId: 'price_1T4me0F4PB0xZAmimFsgVatF',
    amount: 2500, // $25
  },
  DESSERT: {
    productId: 'prod_U2sNPu9jjbaeIr',
    priceId: 'price_1T4mcPF4PB0xZAmiIa01Nq1J',
    amount: 2400, // $24
  },
  GIFT_BASKET: {
    productId: 'prod_U3CNLa5KSVjnO0',
    priceId: 'price_1T55yvF4PB0xZAmiMdi6Hu8h',
    amount: 17500, // $175
  },
  DINNER_ANCHOR_BUNDLE: {
    productId: 'prod_U3CNSzgLjYT3LL',
    priceId: 'price_1T55ywF4PB0xZAmic8UBaPEH',
    amount: 24300, // $243
  },
  DINNER_ENTREE_ADD_ON: {
    productId: 'prod_U3CNxdhlF0Q1VY',
    priceId: 'price_1T56A9F4PB0xZAmiYOXi0Dul',
    amount: 2500, // $25 per entrée
  },
  ARRIVAL_BASKET: {
    productId: 'prod_U3CNHmDep4Es2X',
    priceId: 'price_1T55yyF4PB0xZAmia8KAiG8Y',
    amount: 12500, // $125
  },
  PANTRY_STARTER: {
    productId: 'prod_U3CNYgXMFnsfoy',
    priceId: 'price_1T55yzF4PB0xZAmiXPZARGqC',
    amount: 4500, // $45
  },
  OUT_OF_ZONE_DELIVERY: {
    productId: 'prod_U3CN5kDgOWNVl1',
    priceId: 'price_1T55yzF4PB0xZAmiRtmmmGbR',
    amount: 1000, // $10
  },
  SINGLE_SMOOTHIE: {
    productId: 'prod_U3CNCnUMKcwp6Z',
    priceId: 'price_1T55z0F4PB0xZAmifetcF1yt',
    amount: 1500, // $15
  },
  FLOWERS_SMALL: {
    productId: 'prod_U3CNiiglORftO3',
    priceId: 'price_1T55z1F4PB0xZAmibn2a6uhy',
    amount: 2500, // $25
  },
  FLOWERS_MEDIUM: {
    productId: 'prod_U3CN0v2Mu2Wuju',
    priceId: 'price_1T55z1F4PB0xZAmibBkuRfkf',
    amount: 5000, // $50
  },
} as const;

export type StripeProductKey = keyof typeof STRIPE_PRODUCTS;
