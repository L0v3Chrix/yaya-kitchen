/**
 * YaYa's Kitchen — Stripe Webhook Handler
 * 
 * CRITICAL: This webhook updates EXISTING orders in the Sheet.
 * It does NOT create new orders - orders are created before Stripe redirect.
 * 
 * Flow:
 * 1. Verify webhook signature
 * 2. Extract orderId from session metadata
 * 3. Call Apps Script to update order status to "Paid"
 * 4. Log completion
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

/**
 * Update order status in Google Sheet via Apps Script
 */
async function updateOrderInSheet(
  orderId: string, 
  paymentStatus: string,
  stripePaymentIntentId: string
): Promise<boolean> {
  const scriptUrl = process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL;
  
  if (!scriptUrl) {
    console.error('Google Script URL not configured');
    return false;
  }

  try {
    const response = await fetch(scriptUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'updatePaymentStatus',
        orderId,
        paymentStatus,
        stripePaymentIntentId,
        paidAt: new Date().toISOString(),
      }),
    });

    const result = await response.json();
    
    if (result.success) {
      console.log(`[${orderId}] Sheet updated: ${paymentStatus}`);
      return true;
    } else {
      console.error(`[${orderId}] Sheet update failed:`, result.error);
      return false;
    }
  } catch (error: any) {
    console.error(`[${orderId}] Sheet update error:`, error);
    return false;
  }
}

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
      
      const { orderId } = session.metadata || {};
      const paymentIntentId = session.payment_intent as string;

      console.log(`[WEBHOOK] checkout.session.completed`, {
        sessionId: session.id,
        orderId,
        paymentIntent: paymentIntentId,
        customerEmail: session.customer_email,
      });

      if (orderId) {
        // Update Google Sheet with payment confirmation
        const updated = await updateOrderInSheet(orderId, 'Paid', paymentIntentId);
        
        if (!updated) {
          // Log error but return 200 - we don't want Stripe to retry endlessly
          // The order exists, payment succeeded, just status needs manual update
          console.error(`[${orderId}] MANUAL ACTION NEEDED: Update payment status to Paid`);
        }
      } else {
        console.error('[WEBHOOK] No orderId in session metadata - cannot update Sheet');
      }

      break;
    }

    case 'checkout.session.expired': {
      const session = event.data.object as Stripe.Checkout.Session;
      const { orderId } = session.metadata || {};

      console.log(`[WEBHOOK] checkout.session.expired`, {
        sessionId: session.id,
        orderId,
      });

      if (orderId) {
        // Mark order as expired
        await updateOrderInSheet(orderId, 'Payment Expired', '');
      }

      break;
    }

    case 'payment_intent.payment_failed': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      
      console.log(`[WEBHOOK] payment_intent.payment_failed`, {
        paymentIntentId: paymentIntent.id,
        error: paymentIntent.last_payment_error?.message,
      });

      // Note: We may not have orderId here - payment_intent doesn't always have checkout metadata
      // The order remains in "Pending Payment" status in the Sheet
      
      break;
    }

    default:
      // Unexpected event type - log but don't fail
      console.log(`[WEBHOOK] Unhandled event type: ${event.type}`);
  }

  // Return 200 to acknowledge receipt
  return res.status(200).json({ received: true });
}
