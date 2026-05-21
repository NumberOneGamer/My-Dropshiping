import { NextRequest, NextResponse } from "next/server";
import { db, coupons } from "@/lib/db";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { couponSchema } from "@/lib/validations";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [coupon] = await db.select().from(coupons).where(eq(coupons.id, id)).limit(1);
  if (!coupon) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(coupon);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { id } = await params;
    const body = await req.json();
    const data = couponSchema.parse(body);
    const [coupon] = await db.update(coupons).set({
      ...data,
      value: String(data.value),
      minOrderAmount: data.minOrderAmount != null ? String(data.minOrderAmount) : null,
      maxDiscount: data.maxDiscount != null ? String(data.maxDiscount) : null,
      startsAt: data.startsAt ? new Date(data.startsAt) : null,
      expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
    }).where(eq(coupons.id, id)).returning();
    return NextResponse.json(coupon);
  } catch {
    return NextResponse.json({ error: "Failed to update coupon" }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { id } = await params;
    await db.delete(coupons).where(eq(coupons.id, id));
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete coupon" }, { status: 500 });
  }
}

export const runtime = "edge";
