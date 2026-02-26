/**
 * YaYa's Kitchen — Create Stripe Checkout Session
 * 
 * POST /api/create-checkout-session
 * 
 * Creates a Stripe Checkout session and returns the URL for redirect.
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

interface CreateCheckoutRequest {
  lineItems: Array<{
    priceId: string;
    quantity: number;
    description?: string;
  }>;
  customerEmail: string;
  customerName: string;
  orderId: string;
  deliveryWeek: string;
  menuWeek: string;
  metadata?: Record<string, string>;
}

interface CreateCheckoutResponse {
  sessionId: string;
  url: string;
}

interface ErrorResponse {
  error: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CreateCheckoutResponse | ErrorResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      lineItems,
      customerEmail,
      customerName,
      orderId,
      deliveryWeek,
      menuWeek,
      metadata = {},
    } = req.body as CreateCheckoutRequest;

    // Validate required fields
    if (!lineItems || lineItems.length === 0) {
      return res.status(400).json({ error: 'No items in order' });
    }

    if (!customerEmail) {
      return res.status(400).json({ error: 'Customer email required' });
    }

    // Build line items for Stripe
    const stripeLineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = lineItems.map(item => ({
      price: item.priceId,
      quantity: item.quantity,
    }));

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: customerEmail,
      line_items: stripeLineItems,
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://yaya-kitchen.vercel.app'}/order-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://yaya-kitchen.vercel.app'}/#order`,
      metadata: {
        orderId,
        customerName,
        customerEmail,
        deliveryWeek,
        menuWeek,
        ...metadata,
      },
      payment_intent_data: {
        description: `YaYa's Kitchen Order - ${deliveryWeek}`,
        metadata: {
          orderId,
          customerName,
        },
      },
      // Collect billing address for fraud prevention
      billing_address_collection: 'auto',
      // Phone number collection
      phone_number_collection: {
        enabled: true,
      },
      // Custom text
      custom_text: {
        submit: {
          message: 'Your basket will be delivered Friday 9-11am. YaYa will text when she\'s on the way!',
        },
      },
    });

    if (!session.url) {
      return res.status(500).json({ error: 'Failed to create checkout session' });
    }

    return res.status(200).json({
      sessionId: session.id,
      url: session.url,
    });

  } catch (error: any) {
    console.error('Stripe checkout session error:', error);
    return res.status(500).json({ 
      error: error.message || 'Failed to create checkout session' 
    });
  }
}
