import Stripe from "stripe";

let stripeInstance: Stripe | null = null;

export function getStripe(): Stripe {
  if (!stripeInstance) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      throw new Error("STRIPE_SECRET_KEY is not set");
    }
    stripeInstance = new Stripe(key, {
      apiVersion: "2025-02-24.acacia",
      typescript: true,
    });
  }
  return stripeInstance;
}

export async function createCheckoutSession(params: {
  items: { name: string; price: number; quantity: number; image?: string; productId: string }[];
  email: string;
  orderNumber: string;
  couponCode?: string;
  successUrl: string;
  cancelUrl: string;
}) {
  const stripe = getStripe();

  const lineItems = params.items.map((item) => ({
    price_data: {
      currency: "usd",
      product_data: {
        name: item.name,
        images: item.image ? [item.image] : [],
        metadata: { product_id: item.productId },
      },
      unit_amount: Math.round(item.price * 100),
    },
    quantity: item.quantity,
  }));

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: params.email,
    line_items: lineItems,
    metadata: {
      order_number: params.orderNumber,
    },
    discounts: params.couponCode
      ? [{ coupon: params.couponCode }]
      : undefined,
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
  });

  return session;
}

export async function constructStripeWebhook(
  payload: string,
  signature: string
) {
  const stripe = getStripe();
  return stripe.webhooks.constructEvent(
    payload,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET!
  );
}
