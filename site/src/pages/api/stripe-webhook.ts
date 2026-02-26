/**
 * YaYa's Kitchen — Stripe Webhook Handler
 * 
 * POST /api/stripe-webhook
 * 
 * Handles Stripe webhook events for payment confirmation.
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
  paymentIntentId?: string
): Promise<void> {
  const scriptUrl = process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL;
  
  if (!scriptUrl) {
    console.error('Google Script URL not configured');
    return;
  }

  try {
    await fetch(scriptUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'updatePaymentStatus',
        orderId,
        paymentStatus,
        paymentIntentId,
        updatedAt: new Date().toISOString(),
      }),
    });
  } catch (error) {
    console.error('Failed to update sheet:', error);
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).end();
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
      
      console.log('Checkout completed:', {
        sessionId: session.id,
        paymentIntent: session.payment_intent,
        metadata: session.metadata,
      });

      const { orderId, customerName, customerEmail, deliveryWeek } = session.metadata || {};

      if (orderId) {
        // Update Google Sheet with payment confirmation
        await updateOrderInSheet(
          orderId, 
          'Paid',
          session.payment_intent as string
        );

        console.log(`Order ${orderId} marked as Paid`);
      }

      break;
    }

    case 'checkout.session.expired': {
      const session = event.data.object as Stripe.Checkout.Session;
      const { orderId } = session.metadata || {};

      if (orderId) {
        // Mark order as expired/cancelled
        await updateOrderInSheet(orderId, 'Payment Expired');
        console.log(`Order ${orderId} payment expired`);
      }

      break;
    }

    case 'payment_intent.payment_failed': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      
      console.log('Payment failed:', {
        paymentIntentId: paymentIntent.id,
        error: paymentIntent.last_payment_error?.message,
      });

      break;
    }

    default:
      // Unexpected event type
      console.log(`Unhandled event type: ${event.type}`);
  }

  // Return 200 to acknowledge receipt
  return res.status(200).json({ received: true });
}
