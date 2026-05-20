import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { constructStripeWebhook } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  try {
    const payload = await req.text();
    const signature = req.headers.get("stripe-signature")!;

    const event = await constructStripeWebhook(payload, signature);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const orderNumber = session.metadata?.order_number;

      if (orderNumber) {
        await prisma.order.update({
          where: { orderNumber },
          data: {
            status: "PROCESSING",
            paymentStatus: "PAID",
            stripePaymentId: session.payment_intent as string,
          },
        });
      }
    }

    if (event.type === "checkout.session.expired") {
      const session = event.data.object;
      const orderNumber = session.metadata?.order_number;

      if (orderNumber) {
        await prisma.order.update({
          where: { orderNumber },
          data: { status: "CANCELLED", paymentStatus: "FAILED" },
        });
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 400 }
    );
  }
}

export const runtime = 'edge';
