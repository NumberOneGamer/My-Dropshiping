import { NextRequest, NextResponse } from "next/server";
import { db, orders, products, users } from "@/lib/db";
import { eq, count, sql } from "drizzle-orm";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const [totalOrders, totalRevenue, totalProducts, totalCustomers] =
      await Promise.all([
        db.select({ value: count() }).from(orders).then((r) => Number(r[0].value)),
        db.select({ value: sql`COALESCE(SUM(${orders.total}), 0)` }).from(orders).then((r) => Number(r[0].value)),
        db.select({ value: count() }).from(products).where(eq(products.status, "PUBLISHED")).then((r) => Number(r[0].value)),
        db.select({ value: count() }).from(users).then((r) => Number(r[0].value)),
      ]);

    const recentOrders = await db
      .select({
        id: orders.id,
        orderNumber: orders.orderNumber,
        total: orders.total,
        status: orders.status,
        createdAt: orders.createdAt,
        email: orders.email,
      })
      .from(orders)
      .orderBy(sql`${orders.createdAt} DESC`)
      .limit(5);

    return NextResponse.json({
      totalOrders,
      totalRevenue,
      totalProducts,
      totalCustomers,
      recentOrders,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}

export const runtime = 'edge';
