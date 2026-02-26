/**
 * YaYa's Kitchen — Create Stripe Checkout Session
 * 
 * CRITICAL: This API writes to Google Sheet FIRST, then creates Stripe session.
 * This ensures orders are never lost even if Stripe fails.
 * 
 * Flow:
 * 1. Validate order data
 * 2. Generate order ID
 * 3. Submit to Apps Script (Sheet write with status "Pending Payment")
 * 4. Create Stripe Checkout session with orderId in metadata
 * 5. Return session URL for redirect
 * 
 * If Step 3 fails → Return error, no Stripe session created
 * If Step 4 fails → Order exists in Sheet with "Pending Payment" (manual recovery possible)
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

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

/**
 * Submit order to Google Apps Script
 * Returns orderId on success, throws on failure
 */
async function submitToSheet(order: OrderData, orderId: string): Promise<boolean> {
  const scriptUrl = process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL;
  
  if (!scriptUrl) {
    throw new Error('Google Script URL not configured');
  }

  const submitData = {
    ...order,
    orderId,
    zip: order.zipCode,
    paymentStatus: 'Pending Payment',
    stripeSessionId: '', // Will be updated by webhook
    stripePaymentIntentId: '',
    submittedAt: new Date().toISOString(),
  };

  try {
    const response = await fetch(scriptUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(submitData),
    });

    // Apps Script returns JSON
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to save order');
    }

    return true;
  } catch (error: any) {
    console.error('Sheet submission error:', error);
    throw new Error(`Failed to save order: ${error.message}`);
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CreateCheckoutResponse | ErrorResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { order, lineItems, total } = req.body as CreateCheckoutRequest;

    // Validate required fields
    if (!order || !lineItems || lineItems.length === 0) {
      return res.status(400).json({ error: 'Invalid order data', code: 'INVALID_ORDER' });
    }

    if (!order.email) {
      return res.status(400).json({ error: 'Customer email required', code: 'MISSING_EMAIL' });
    }

    // Step 1: Generate order ID
    const orderId = generateOrderId();
    console.log(`[${orderId}] Creating checkout session for ${order.email}`);

    // Step 2: Submit to Sheet FIRST (critical - ensures order is never lost)
    try {
      await submitToSheet(order, orderId);
      console.log(`[${orderId}] Order saved to Sheet with status "Pending Payment"`);
    } catch (sheetError: any) {
      console.error(`[${orderId}] Sheet submission failed:`, sheetError);
      return res.status(500).json({ 
        error: 'Failed to save order. Please try again or contact YaYa directly.',
        code: 'SHEET_ERROR'
      });
    }

    // Step 3: Create Stripe Checkout session
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
        deliveryWeek: order.deliveryWeek,
        menuWeek: order.menuWeek,
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

    // Step 4: Update Sheet with Stripe session ID (best effort - don't fail if this fails)
    try {
      const scriptUrl = process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL;
      if (scriptUrl) {
        await fetch(scriptUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'updateStripeSession',
            orderId,
            stripeSessionId: session.id,
          }),
        });
      }
    } catch (updateError) {
      // Log but don't fail - order and session both exist
      console.warn(`[${orderId}] Failed to update Sheet with session ID (non-critical)`);
    }

    return res.status(200).json({
      sessionId: session.id,
      url: session.url,
      orderId,
    });

  } catch (error: any) {
    console.error('Checkout session error:', error);
    return res.status(500).json({ 
      error: error.message || 'Failed to create checkout session',
      code: 'UNKNOWN_ERROR'
    });
  }
}
