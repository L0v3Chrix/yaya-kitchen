import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '!STRIPE_SECRET_KEY_PLACEHOLDER!');

async function main() {
  const products = await stripe.products.list({ limit: 50, active: true });
  console.log('\n=== CURRENT STRIPE PRODUCTS & PRICES ===\n');
  
  for (const product of products.data) {
    const prices = await stripe.prices.list({ product: product.id, active: true, limit: 1 });
    const price = prices.data[0];
    const amount = price ? `$${(price.unit_amount || 0) / 100}` : 'NO PRICE';
    console.log(`${product.name}: ${amount} (${product.id})`);
    if (price) console.log(`  └─ ${price.id}`);
  }
}
main();
