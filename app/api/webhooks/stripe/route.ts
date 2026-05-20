import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { constructStripeWebhook } from "@/lib/stripe";

async function handleCheckoutCompleted(session: any) {
  const orderNumber = session.metadata?.order_number;
  if (!orderNumber) return;

  const existing = await prisma.order.findUnique({ where: { orderNumber } });
  if (!existing || existing.paymentStatus === "PAID") return;

  await prisma.order.update({
    where: { orderNumber },
    data: {
      status: "PROCESSING",
      paymentStatus: "PAID",
      stripePaymentId: session.payment_intent as string,
    },
  });
}

async function handleCheckoutExpired(session: any) {
  const orderNumber = session.metadata?.order_number;
  if (!orderNumber) return;

  await prisma.order.update({
    where: { orderNumber, paymentStatus: { not: "PAID" } },
    data: { status: "CANCELLED", paymentStatus: "FAILED" },
  });
}

async function handlePaymentFailed(paymentIntent: any) {
  const sessionId = paymentIntent.id;
  const order = await prisma.order.findFirst({ where: { stripePaymentId: sessionId } });
  if (!order) return;

  await prisma.order.update({
    where: { id: order.id },
    data: { paymentStatus: "FAILED" },
  });
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
