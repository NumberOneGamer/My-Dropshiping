import { NextRequest, NextResponse } from "next/server";
import { db, orders, orderItems, products } from "@/lib/db";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [order] = await db.select().from(orders).where(eq(orders.id, id)).limit(1);
  if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const items = await db
    .select()
    .from(orderItems)
    .leftJoin(products, eq(orderItems.productId, products.id))
    .where(eq(orderItems.orderId, id));

  return NextResponse.json({
    ...order,
    items: items.map((item) => ({
      ...item.order_items,
      product: item.products,
    })),
  });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { id } = await params;
    const { status } = await req.json();
    const validStatuses = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];
    if (status && !validStatuses.includes(status)) return NextResponse.json({ error: "Invalid status" }, { status: 400 });

    const [order] = await db.update(orders).set({ status }).where(eq(orders.id, id)).returning();
    return NextResponse.json(order);
  } catch {
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}

export const runtime = "edge";
