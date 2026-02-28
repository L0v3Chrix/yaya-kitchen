/**
 * YaYa's Kitchen — Stripe Webhook Handler
 * 
 * Handles Stripe payment events.
 * Stripe is the source of truth — this webhook logs events
 * and can trigger notifications as needed.
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { buffer } from 'micro';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

// Disable body parsing - we need raw body for signature verification
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  // Verify webhook secret is configured
  if (!webhookSecret) {
    console.error('STRIPE_WEBHOOK_SECRET not configured');
    return res.status(500).json({ error: 'Webhook not configured' });
  }

  let event: Stripe.Event;

  try {
    // Get raw body for signature verification
    const buf = await buffer(req);
    const sig = req.headers['stripe-signature'];

    if (!sig) {
      console.error('Missing stripe-signature header');
      return res.status(400).send('Missing signature');
    }

    // Verify webhook signature
    event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
    
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      const { orderId, customerName, customerEmail, deliveryWeek } = session.metadata || {};
      
      console.log(`[WEBHOOK] ✅ Payment received`, {
        orderId,
        customer: customerName,
        email: customerEmail,
        deliveryWeek,
        amount: session.amount_total ? `$${(session.amount_total / 100).toFixed(2)}` : 'unknown',
      });

      // Future: Send confirmation email, SMS notification, etc.
      break;
    }

    case 'checkout.session.expired': {
      const session = event.data.object as Stripe.Checkout.Session;
      const { orderId, customerName } = session.metadata || {};

      console.log(`[WEBHOOK] ⏰ Checkout expired`, {
        orderId,
        customer: customerName,
      });
      break;
    }

    case 'payment_intent.payment_failed': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      
      console.log(`[WEBHOOK] ❌ Payment failed`, {
        paymentIntentId: paymentIntent.id,
        error: paymentIntent.last_payment_error?.message,
      });
      break;
    }

    default:
      console.log(`[WEBHOOK] Unhandled event: ${event.type}`);
  }

  // Return 200 to acknowledge receipt
  return res.status(200).json({ received: true });
}
