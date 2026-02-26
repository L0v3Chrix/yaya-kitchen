/**
 * Yaya's Kitchen — Stripe Product & Price Setup
 * 
 * Run with: npx ts-node scripts/stripe-setup.ts
 * 
 * This script:
 * 1. Gets existing products and their prices
 * 2. Creates any missing products
 * 3. Creates prices for products without them
 * 4. Outputs a config file with all IDs
 */

import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// Existing product IDs from Chrix
const EXISTING_PRODUCTS = {
  'Core Basket': 'prod_U2sNTG2gWg812s',
  'Container Deposit': 'prod_U2tFvKn4X2NZoy',
  'Smoothie Pair': 'prod_U2smZd44ocIhGz',
  'Smoothie Family Set': 'prod_U2snq567TfLhyh',
  'Portion Boost': 'prod_U2sluKL2q9Dx4C',
  'Flowers': 'prod_U2sOhdVa9Ta6yv',
  'Dessert': 'prod_U2sNPu9jjbaeIr',
};

// Products that need to be created
const NEW_PRODUCTS = [
  { name: 'Gift Basket', description: 'Weekly basket sent as a gift', price: 17500 }, // $175
  { name: 'Dinner Anchor Bundle', description: 'Core basket + dinner options bundle', price: 24300 }, // $243 ($175 + $68)
  { name: 'Dinner Anchor Add-On', description: 'Extra dinner options', price: 6800 }, // $68
  { name: 'Arrival Basket', description: 'Stock your kitchen before arrival', price: 12500 }, // $125
  { name: 'Pantry Starter', description: 'Coffee, eggs, milk, olive oil, salt & pepper', price: 4500 }, // $45
  { name: 'Out-of-Zone Delivery', description: 'Delivery fee for addresses outside free zone', price: 1000 }, // $10
  { name: 'Single Smoothie', description: '16oz protein smoothie', price: 1500 }, // $15
  { name: 'Flowers Small', description: '1 arrangement', price: 2500 }, // $25
  { name: 'Flowers Medium', description: '2-3 arrangements', price: 5000 }, // $50
];

// Expected prices for existing products (in cents)
const EXPECTED_PRICES: Record<string, number> = {
  'Core Basket': 17500, // $175
  'Container Deposit': 3500, // $35
  'Smoothie Pair': 3000, // $30 (2x$15)
  'Smoothie Family Set': 6000, // $60 (4x$15)
  'Portion Boost': 1500, // $15
  'Flowers': 3500, // $35 (base)
  'Dessert': 2000, // $20
};

async function main() {
  console.log('🧺 YaYa\'s Kitchen Stripe Setup\n');
  console.log('='.repeat(50));

  const results: Record<string, { productId: string; priceId: string; amount: number }> = {};

  // 1. Get prices for existing products
  console.log('\n📦 Checking existing products...\n');
  
  for (const [name, productId] of Object.entries(EXISTING_PRODUCTS)) {
    try {
      const prices = await stripe.prices.list({ product: productId, active: true, limit: 1 });
      
      if (prices.data.length > 0) {
        const price = prices.data[0];
        console.log(`✅ ${name}: ${productId}`);
        console.log(`   Price: ${price.id} ($${(price.unit_amount || 0) / 100})`);
        results[name] = {
          productId,
          priceId: price.id,
          amount: price.unit_amount || 0,
        };
      } else {
        // Create price if missing
        console.log(`⚠️  ${name}: No price found, creating...`);
        const expectedAmount = EXPECTED_PRICES[name] || 0;
        
        if (expectedAmount > 0) {
          const newPrice = await stripe.prices.create({
            product: productId,
            unit_amount: expectedAmount,
            currency: 'usd',
          });
          console.log(`   Created price: ${newPrice.id} ($${expectedAmount / 100})`);
          results[name] = {
            productId,
            priceId: newPrice.id,
            amount: expectedAmount,
          };
        }
      }
    } catch (error: any) {
      console.log(`❌ ${name}: Error - ${error.message}`);
    }
  }

  // 2. Create new products
  console.log('\n📦 Creating missing products...\n');

  for (const product of NEW_PRODUCTS) {
    try {
      // Check if already exists by name
      const existing = await stripe.products.search({
        query: `name:'${product.name}'`,
      });

      let productId: string;
      
      if (existing.data.length > 0) {
        productId = existing.data[0].id;
        console.log(`✅ ${product.name}: Already exists (${productId})`);
      } else {
        const newProduct = await stripe.products.create({
          name: product.name,
          description: product.description,
        });
        productId = newProduct.id;
        console.log(`🆕 ${product.name}: Created (${productId})`);
      }

      // Check for existing price
      const prices = await stripe.prices.list({ product: productId, active: true, limit: 1 });
      
      if (prices.data.length > 0) {
        const price = prices.data[0];
        console.log(`   Price: ${price.id} ($${(price.unit_amount || 0) / 100})`);
        results[product.name] = {
          productId,
          priceId: price.id,
          amount: price.unit_amount || 0,
        };
      } else {
        // Create price
        const newPrice = await stripe.prices.create({
          product: productId,
          unit_amount: product.price,
          currency: 'usd',
        });
        console.log(`   Created price: ${newPrice.id} ($${product.price / 100})`);
        results[product.name] = {
          productId,
          priceId: newPrice.id,
          amount: product.price,
        };
      }
    } catch (error: any) {
      console.log(`❌ ${product.name}: Error - ${error.message}`);
    }
  }

  // 3. Output configuration
  console.log('\n' + '='.repeat(50));
  console.log('\n📋 STRIPE PRODUCTS CONFIGURATION\n');
  console.log('Copy this to your config:\n');
  
  console.log('export const STRIPE_PRODUCTS = {');
  for (const [name, data] of Object.entries(results)) {
    const key = name.toUpperCase().replace(/[^A-Z0-9]/g, '_');
    console.log(`  ${key}: {`);
    console.log(`    productId: '${data.productId}',`);
    console.log(`    priceId: '${data.priceId}',`);
    console.log(`    amount: ${data.amount}, // $${data.amount / 100}`);
    console.log(`  },`);
  }
  console.log('};');

  // 4. Write to config file
  const configContent = `/**
 * Yaya's Kitchen — Stripe Products Configuration
 * Generated: ${new Date().toISOString()}
 * 
 * DO NOT EDIT MANUALLY — regenerate with scripts/stripe-setup.ts
 */

export const STRIPE_PRODUCTS = {
${Object.entries(results).map(([name, data]) => {
  const key = name.toUpperCase().replace(/[^A-Z0-9]/g, '_');
  return `  ${key}: {
    productId: '${data.productId}',
    priceId: '${data.priceId}',
    amount: ${data.amount}, // $${data.amount / 100}
  }`;
}).join(',\n')},
} as const;

export type StripeProductKey = keyof typeof STRIPE_PRODUCTS;
`;

  const fs = await import('fs');
  fs.writeFileSync('./src/lib/stripe-products.ts', configContent);
  console.log('\n✅ Config written to src/lib/stripe-products.ts');

  console.log('\n🎉 Setup complete!\n');
}

main().catch(console.error);
