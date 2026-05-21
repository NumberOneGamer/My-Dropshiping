import { NextRequest, NextResponse } from "next/server";
import { db, products, orders, orderItems, coupons } from "@/lib/db";
import { eq, inArray } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { generateOrderNumber } from "@/lib/utils/cn";
import { createCheckoutSession } from "@/lib/stripe";
import { checkoutSchema } from "@/lib/validations";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const body = await req.json();
    const parsed = checkoutSchema.parse(body);

    const { email, firstName, lastName, line1, line2, city, state, zip, country, phone, couponCode, notes, items: rawItems } = parsed;

    if (!rawItems?.length) return NextResponse.json({ error: "Cart is empty" }, { status: 400 });

    const productIds = rawItems.map((i) => i.productId);
    const productRows = await db.select().from(products).where(inArray(products.id, productIds));

    const activeProducts = productRows.filter((p) => p.isActive && p.status === "PUBLISHED");
    if (activeProducts.length !== productIds.length) {
      return NextResponse.json({ error: "Some products are unavailable" }, { status: 400 });
    }

    const productMap = new Map(activeProducts.map((p) => [p.id, p]));
    let subtotal = 0;
    for (const item of rawItems) {
      const product = productMap.get(item.productId);
      if (!product) return NextResponse.json({ error: `Product ${item.productId} not found` }, { status: 400 });
      const unitPrice = Number(product.price);
      subtotal += unitPrice * item.quantity;
    }

    let discount = 0;
    let couponRecord = null;
    if (couponCode) {
      const couponRows = await db.select().from(coupons).where(eq(coupons.code, couponCode)).limit(1);
      couponRecord = couponRows[0] || null;
      if (!couponRecord || (couponRecord.expiresAt && couponRecord.expiresAt < new Date()) || (couponRecord.usageLimit && couponRecord.usedCount >= couponRecord.usageLimit)) {
        return NextResponse.json({ error: "Invalid or expired coupon" }, { status: 400 });
      }
      const couponValue = Number(couponRecord.value);
      discount = couponRecord.type === "PERCENTAGE" ? subtotal * (couponValue / 100) : couponValue;
      if (couponRecord.maxDiscount) discount = Math.min(discount, Number(couponRecord.maxDiscount));
      discount = Math.min(discount, subtotal);
    }

    const shipping = subtotal >= 50 ? 0 : 9.99;
    const total = Math.max(0, subtotal + shipping - discount);

    const orderNumber = generateOrderNumber();

    const [order] = await db.insert(orders).values({
      orderNumber,
      userId: (session?.user as any)?.id,
      email,
      subtotal: String(subtotal),
      shippingCost: String(shipping),
      discount: String(discount),
      total: String(total),
      couponId: couponRecord?.id,
      shippingAddress: { firstName, lastName, line1, line2, city, state, zip, country },
      notes,
    }).returning();

    if (!order) throw new Error("Failed to create order");

    const itemValues = rawItems.map((item) => {
      const product = productMap.get(item.productId)!;
      return {
        orderId: order.id,
        productId: item.productId,
        name: product.name,
        image: product.images?.[0] ?? "",
        price: String(Number(product.price)),
        quantity: item.quantity,
        total: String(Number(product.price) * item.quantity),
      };
    });

    await db.insert(orderItems).values(itemValues);

    if (couponRecord) {
      await db.update(coupons).set({ usedCount: (couponRecord.usedCount || 0) + 1 }).where(eq(coupons.id, couponRecord.id));
    }

    const stripeSession = await createCheckoutSession({
      items: rawItems.map((item) => {
        const product = productMap.get(item.productId)!;
        return {
          name: product.name,
          price: Number(product.price),
          quantity: item.quantity,
          image: product.images?.[0],
          productId: item.productId,
        };
      }),
      email,
      orderNumber,
      successUrl: `${process.env.NEXT_PUBLIC_APP_URL}/order/success?orderId=${order.id}`,
      cancelUrl: `${process.env.NEXT_PUBLIC_APP_URL}/checkout?canceled=true`,
    });

    await db.update(orders).set({ stripeSessionId: stripeSession.id }).where(eq(orders.id, order.id));

    return NextResponse.json({ url: stripeSession.url });
  } catch (error: any) {
    if (error?.name === "ZodError") return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
  }
}

export const runtime = "edge";
