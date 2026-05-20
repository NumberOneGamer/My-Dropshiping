import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { generateOrderNumber } from "@/lib/utils/cn";
import { createCheckoutSession } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      email,
      firstName,
      lastName,
      line1,
      line2,
      city,
      state,
      zip,
      items,
      subtotal,
      shipping,
      discount,
      total,
    } = body;

    if (!email || !items?.length) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const orderNumber = generateOrderNumber();

    const order = await prisma.order.create({
      data: {
        orderNumber,
        email,
        subtotal,
        shippingCost: shipping,
        discount,
        total,
        shippingAddress: {
          firstName,
          lastName,
          line1,
          line2,
          city,
          state,
          zip,
        },
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            name: item.name,
            image: item.image,
            price: item.price,
            quantity: item.quantity,
            total: item.price * item.quantity,
          })),
        },
      },
    });

    const session = await createCheckoutSession({
      items: items.map((item: any) => ({
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
        productId: item.productId,
      })),
      email,
      orderNumber,
      successUrl: `${process.env.NEXT_PUBLIC_APP_URL}/order/success?orderId=${order.id}`,
      cancelUrl: `${process.env.NEXT_PUBLIC_APP_URL}/checkout?canceled=true`,
    });

    await prisma.order.update({
      where: { id: order.id },
      data: { stripeSessionId: session.id },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
