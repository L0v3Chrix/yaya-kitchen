/**
 * YaYa's Kitchen — Create Stripe Checkout Session
 * 
 * Stripe is the single source of truth for orders.
 * All order details stored in Stripe metadata.
 * 
 * Flow:
 * 1. Validate order data
 * 2. Generate order ID
 * 3. Create Stripe Checkout session with full order metadata
 * 4. Return session URL for redirect
 * 
 * View orders: Stripe Dashboard → Payments
 * Export: Stripe Dashboard → Reports
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

// Validate Stripe key at startup
if (!process.env.STRIPE_SECRET_KEY) {
  console.error('STRIPE_SECRET_KEY environment variable is not set!');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_missing');

interface LineItem {
  priceId: string;
  quantity: number;
  description?: string;
}

interface OrderData {
  // Customer info
  name: string;
  email: string;
  phone: string;
  address: string;
  zipCode: string;
  
  // Delivery
  deliveryWeek: string;
  menuWeek: string;
  deliveryInstructions?: string;
  contactPreference: string;
  
  // Order items
  weeklyBasket: 'Yes' | 'No';
  giftBasket: 'Yes' | 'No';
  giftBasketRecipient?: string;
  dinnerEntree: string;
  smoothieQty: string;
  dessert: boolean;
  portionBoost?: boolean;
  flowersHome: string;
  flowersGift: boolean;
  giftRecipient?: string;
  giftMessage?: string;
  arrivalBasket: boolean;
  pantryStarter: boolean;
  containerDeposit: boolean;
  subscriptionInterest: boolean;
  specialNotes?: string;
}

interface CreateCheckoutRequest {
  order: OrderData;
  lineItems: LineItem[];
  total: number;
}

interface CreateCheckoutResponse {
  sessionId: string;
  url: string;
  orderId: string;
}

interface ErrorResponse {
  error: string;
  code?: string;
}

/**
 * Generate unique order ID: YAYA-YYYYMMDD-XXX
 */
function generateOrderId(): string {
  const now = new Date();
  const dateStr = now.toISOString().split('T')[0].replace(/-/g, '');
  const random = Math.floor(Math.random() * 900) + 100; // 100-999
  return `YAYA-${dateStr}-${random}`;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CreateCheckoutResponse | ErrorResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Debug: Check if Stripe key exists
  const hasStripeKey = !!process.env.STRIPE_SECRET_KEY;
  const keyPrefix = process.env.STRIPE_SECRET_KEY?.substring(0, 10) || 'missing';
  console.log(`[DEBUG] Stripe key exists: ${hasStripeKey}, prefix: ${keyPrefix}`);

  try {
    const { order, lineItems, total } = req.body as CreateCheckoutRequest;

    // Validate required fields
    if (!order || !lineItems || lineItems.length === 0) {
      return res.status(400).json({ error: 'Invalid order data', code: 'INVALID_ORDER' });
    }

    if (!order.email) {
      return res.status(400).json({ error: 'Customer email required', code: 'MISSING_EMAIL' });
    }

    // Generate order ID
    const orderId = generateOrderId();
    console.log(`[${orderId}] Creating checkout session for ${order.email}`);

    // Create Stripe Checkout session (Stripe is the source of truth)
    const stripeLineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = lineItems.map(item => ({
      price: item.priceId,
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: order.email,
      line_items: stripeLineItems,
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://yaya-kitchen.vercel.app'}/order-success?session_id={CHECKOUT_SESSION_ID}&order_id=${orderId}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://yaya-kitchen.vercel.app'}/#order`,
      metadata: {
        orderId,
        customerName: order.name,
        customerEmail: order.email,
        customerPhone: order.phone,
        deliveryAddress: order.address,
        deliveryZip: order.zipCode,
        deliveryWeek: order.deliveryWeek || '',
        menuWeek: order.menuWeek,
        contactPreference: order.contactPreference,
        weeklyBasket: order.weeklyBasket,
        specialNotes: order.specialNotes || '',
      },
      payment_intent_data: {
        description: `YaYa's Kitchen Order ${orderId} - ${order.deliveryWeek}`,
        metadata: {
          orderId,
          customerName: order.name,
        },
      },
      phone_number_collection: {
        enabled: true,
      },
      custom_text: {
        submit: {
          message: 'Your basket will be delivered Friday 9-11am. YaYa will text when she\'s on the way!',
        },
      },
    });

    if (!session.url) {
      // Stripe session created but no URL - unusual error
      console.error(`[${orderId}] Stripe session created but no URL returned`);
      return res.status(500).json({ 
        error: 'Payment setup failed. Your order was saved - YaYa will contact you.',
        code: 'STRIPE_NO_URL'
      });
    }

    console.log(`[${orderId}] Stripe session created: ${session.id}`);

    return res.status(200).json({
      sessionId: session.id,
      url: session.url,
      orderId,
    });

  } catch (error: any) {
    console.error('Checkout session error:', {
      message: error.message,
      type: error.type,
      code: error.code,
      statusCode: error.statusCode,
    });
    
    // Handle specific Stripe errors
    if (error.type === 'StripeConnectionError') {
      return res.status(503).json({ 
        error: 'Payment service temporarily unavailable. Please try again.',
        code: 'STRIPE_CONNECTION'
      });
    }
    
    if (error.type === 'StripeAPIError') {
      return res.status(500).json({ 
        error: 'Payment processing error. Please contact YaYa.',
        code: 'STRIPE_API'
      });
    }
    
    return res.status(500).json({ 
      error: error.message || 'Failed to create checkout session',
      code: 'UNKNOWN_ERROR'
    });
  }
}
