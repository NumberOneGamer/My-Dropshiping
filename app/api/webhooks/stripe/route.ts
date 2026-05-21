import { NextRequest, NextResponse } from "next/server";
import { db, orders } from "@/lib/db";
import { eq } from "drizzle-orm";
import { constructStripeWebhook } from "@/lib/stripe";

async function handleCheckoutCompleted(session: any) {
  const orderNumber = session.metadata?.order_number;
  if (!orderNumber) return;

  const existingRows = await db.select().from(orders).where(eq(orders.orderNumber, orderNumber)).limit(1);
  const existing = existingRows[0] || null;
  if (!existing || existing.paymentStatus === "PAID") return;

  await db.update(orders).set({
    status: "PROCESSING",
    paymentStatus: "PAID",
    stripePaymentId: session.payment_intent as string,
  }).where(eq(orders.orderNumber, orderNumber));
}

async function handleCheckoutExpired(session: any) {
  const orderNumber = session.metadata?.order_number;
  if (!orderNumber) return;

  await db.update(orders).set({ status: "CANCELLED", paymentStatus: "FAILED" })
    .where(eq(orders.orderNumber, orderNumber));
}

async function handlePaymentFailed(paymentIntent: any) {
  const sessionId = paymentIntent.id;
  const orderRows = await db.select().from(orders).where(eq(orders.stripePaymentId, sessionId)).limit(1);
  const order = orderRows[0] || null;
  if (!order) return;

  await db.update(orders).set({ paymentStatus: "FAILED" }).where(eq(orders.id, order.id));
}

export async function POST(req: NextRequest) {
  try {
    const payload = await req.text();
    const signature = req.headers.get("stripe-signature")!;

    const event = await constructStripeWebhook(payload, signature);

    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutCompleted(event.data.object);
        break;
      case "checkout.session.expired":
        await handleCheckoutExpired(event.data.object);
        break;
      case "payment_intent.payment_failed":
        await handlePaymentFailed(event.data.object);
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 400 });
  }
}

export const runtime = "edge";
