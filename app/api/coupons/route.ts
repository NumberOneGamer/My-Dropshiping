import { NextRequest, NextResponse } from "next/server";
import { db, coupons } from "@/lib/db";
import { eq, desc } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { couponSchema } from "@/lib/validations";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  if (code) {
    const [coupon] = await db.select().from(coupons).where(eq(coupons.code, code)).limit(1);
    return NextResponse.json(coupon ? [coupon] : []);
  }
  const result = await db.select().from(coupons).orderBy(desc(coupons.createdAt));
  return NextResponse.json(result);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await req.json();
    const data = couponSchema.parse(body);
    const [coupon] = await db.insert(coupons).values({
      ...data,
      value: String(data.value),
      minOrderAmount: data.minOrderAmount != null ? String(data.minOrderAmount) : null,
      maxDiscount: data.maxDiscount != null ? String(data.maxDiscount) : null,
      startsAt: data.startsAt ? new Date(data.startsAt) : null,
      expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
    }).returning();
    return NextResponse.json(coupon, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create coupon" }, { status: 400 });
  }
}

export const runtime = "edge";
