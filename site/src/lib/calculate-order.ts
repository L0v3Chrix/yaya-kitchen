/**
 * YaYa's Kitchen — Order Calculation Logic
 * 
 * Calculates order totals and builds Stripe line items.
 */

import { STRIPE_PRODUCTS } from './stripe-products';

// ZIP codes with free delivery (8-mile radius from 32779 Longwood)
export const FREE_DELIVERY_ZIPS = [
  '32779', '32750', '32714', '32701', '32746', 
  '32703', '32791', '32708', '32730', '32707',
  '32765', '32771', '32751', '32789'
];

export interface OrderFormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  zipCode: string;
  // Support both single and multi-week
  deliveryWeek?: string;
  deliveryWeeks?: string[];
  deliveryMode?: 'single' | 'multi' | 'every';
  menuWeek: '1' | '2' | '3' | '4' | '';
  weeklyBasket: 'Yes' | 'No';
  giftBasket: 'Yes' | 'No';
  dinnerEntree: 'None' | '1' | '2' | '3' | '4';
  smoothieQty: string;
  dessert: boolean;
  portionBoost: boolean;
  flowersHome: 'None' | '1 arrangement' | '2-3 arrangements';
  flowersGift: boolean;
  arrivalBasket: boolean;
  pantryStarter: boolean;
  containerDeposit: boolean;
  subscriptionInterest: boolean;
  isFirstOrder?: boolean;
}

export interface LineItem {
  priceId: string;
  quantity: number;
  description?: string;
}

export interface OrderTotal {
  subtotal: number;
  deliveryFee: number;
  containerDeposit: number;
  discount: number;
  total: number;
  lineItems: LineItem[];
  breakdown: { label: string; amount: number }[];
}

export function isInDeliveryZone(zipCode: string): boolean {
  return FREE_DELIVERY_ZIPS.includes(zipCode.trim());
}

export function calculateOrderTotal(
  order: OrderFormData,
  isFirstOrder: boolean = true
): OrderTotal {
  let subtotal = 0;
  const lineItems: LineItem[] = [];
  const breakdown: { label: string; amount: number }[] = [];

  // Core Basket
  if (order.weeklyBasket === 'Yes') {
    lineItems.push({ 
      priceId: STRIPE_PRODUCTS.CORE_BASKET.priceId, 
      quantity: 1,
      description: `Core Weekly Basket (Week ${order.menuWeek})`
    });
    subtotal += 175;
    breakdown.push({ label: `Core Weekly Basket (Week ${order.menuWeek})`, amount: 175 });
  }

  // Dinner Entrée Add-Ons ($25 each)
  const dinnerEntreeQty = order.dinnerEntree !== 'None' ? parseInt(order.dinnerEntree) : 0;
  if (dinnerEntreeQty > 0) {
    lineItems.push({ 
      priceId: STRIPE_PRODUCTS.DINNER_ENTREE_ADD_ON.priceId, 
      quantity: dinnerEntreeQty 
    });
    const entreeTotal = dinnerEntreeQty * 25;
    subtotal += entreeTotal;
    breakdown.push({ label: `Dinner Entrée × ${dinnerEntreeQty}`, amount: entreeTotal });
  }

  // Portion Boost
  if (order.portionBoost && order.weeklyBasket === 'Yes') {
    lineItems.push({ 
      priceId: STRIPE_PRODUCTS.PORTION_BOOST.priceId, 
      quantity: 1 
    });
    subtotal += 25;
    breakdown.push({ label: 'Portion Boost (+4 adults)', amount: 25 });
  }

  // Gift Basket
  if (order.giftBasket === 'Yes') {
    lineItems.push({ 
      priceId: STRIPE_PRODUCTS.GIFT_BASKET.priceId, 
      quantity: 1 
    });
    subtotal += 175;
    breakdown.push({ label: 'Gift Basket', amount: 175 });
  }

  // Smoothies
  const smoothieQty = parseInt(order.smoothieQty) || 0;
  if (smoothieQty > 0) {
    if (smoothieQty >= 4) {
      // Family set (best value)
      lineItems.push({ 
        priceId: STRIPE_PRODUCTS.SMOOTHIE_FAMILY_SET.priceId, 
        quantity: 1 
      });
      subtotal += 32;
      breakdown.push({ label: 'Smoothie Family Set (4)', amount: 32 });
    } else if (smoothieQty >= 2) {
      // Pair
      lineItems.push({ 
        priceId: STRIPE_PRODUCTS.SMOOTHIE_PAIR.priceId, 
        quantity: 1 
      });
      subtotal += 18;
      breakdown.push({ label: 'Smoothie Pair (2)', amount: 18 });
    } else {
      // Single
      lineItems.push({ 
        priceId: STRIPE_PRODUCTS.SINGLE_SMOOTHIE.priceId, 
        quantity: smoothieQty 
      });
      subtotal += smoothieQty * 15;
      breakdown.push({ label: `Smoothie × ${smoothieQty}`, amount: smoothieQty * 15 });
    }
  }

  // Dessert
  if (order.dessert) {
    lineItems.push({ 
      priceId: STRIPE_PRODUCTS.DESSERT.priceId, 
      quantity: 1 
    });
    subtotal += 24;
    breakdown.push({ label: 'Weekly Dessert', amount: 24 });
  }

  // Flowers for Home
  if (order.flowersHome === '1 arrangement') {
    lineItems.push({ 
      priceId: STRIPE_PRODUCTS.FLOWERS_SMALL.priceId, 
      quantity: 1 
    });
    subtotal += 25;
    breakdown.push({ label: 'Flowers (1 arrangement)', amount: 25 });
  } else if (order.flowersHome === '2-3 arrangements') {
    lineItems.push({ 
      priceId: STRIPE_PRODUCTS.FLOWERS_MEDIUM.priceId, 
      quantity: 1 
    });
    subtotal += 50;
    breakdown.push({ label: 'Flowers (2-3 arrangements)', amount: 50 });
  }

  // Flowers as Gift (same pricing as home)
  if (order.flowersGift) {
    lineItems.push({ 
      priceId: STRIPE_PRODUCTS.FLOWERS_SMALL.priceId, 
      quantity: 1,
      description: 'Flowers (Gift)'
    });
    subtotal += 25;
    breakdown.push({ label: 'Flowers (Gift)', amount: 25 });
  }

  // Arrival Basket
  if (order.arrivalBasket) {
    lineItems.push({ 
      priceId: STRIPE_PRODUCTS.ARRIVAL_BASKET.priceId, 
      quantity: 1 
    });
    subtotal += 125;
    breakdown.push({ label: 'Arrival Basket', amount: 125 });
  }

  // Pantry Starter
  if (order.pantryStarter) {
    lineItems.push({ 
      priceId: STRIPE_PRODUCTS.PANTRY_STARTER.priceId, 
      quantity: 1 
    });
    subtotal += 45;
    breakdown.push({ label: 'Pantry Starter', amount: 45 });
  }

  // Container Deposit (first order only)
  let containerDeposit = 0;
  if (isFirstOrder && (order.weeklyBasket === 'Yes' || order.giftBasket === 'Yes')) {
    lineItems.push({ 
      priceId: STRIPE_PRODUCTS.CONTAINER_DEPOSIT.priceId, 
      quantity: 1 
    });
    containerDeposit = 35;
  }

  // Out-of-Zone Delivery Fee
  let deliveryFee = 0;
  if (!isInDeliveryZone(order.zipCode)) {
    lineItems.push({ 
      priceId: STRIPE_PRODUCTS.OUT_OF_ZONE_DELIVERY.priceId, 
      quantity: 1 
    });
    deliveryFee = 10;
  }

  // Subscription Discount (15% if 4-week commitment)
  // For now, this is expressed interest only - actual discount handled separately
  const discount = 0;

  const total = subtotal + deliveryFee + containerDeposit - discount;

  return {
    subtotal,
    deliveryFee,
    containerDeposit,
    discount,
    total,
    lineItems,
    breakdown,
  };
}

/**
 * Format currency for display
 */
export function formatCurrency(cents: number): string {
  return `$${(cents).toFixed(2)}`;
}
