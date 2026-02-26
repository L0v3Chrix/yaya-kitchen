import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '!STRIPE_SECRET_KEY_PLACEHOLDER!');

async function main() {
  // Update product name
  const productId = 'prod_U3CNxdhlF0Q1VY'; // Dinner Anchor Add-On
  
  console.log('Updating product name...');
  await stripe.products.update(productId, {
    name: 'Dinner Entrée Add-On',
    description: 'Additional dinner entrée ($25 each)'
  });
  
  // Archive old price and create new one at $25
  console.log('Creating new price at $25...');
  const oldPrice = 'price_1T55yxF4PB0xZAmiVS7Mva7w';
  
  // Archive old price
  await stripe.prices.update(oldPrice, { active: false });
  
  // Create new price
  const newPrice = await stripe.prices.create({
    product: productId,
    unit_amount: 2500, // $25
    currency: 'usd',
  });
  
  console.log('✅ Done!');
  console.log(`New price ID: ${newPrice.id}`);
  console.log('Product renamed to: Dinner Entrée Add-On');
  console.log('New price: $25');
}
main().catch(console.error);
