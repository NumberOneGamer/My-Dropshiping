import { NextRequest, NextResponse } from "next/server";
import { db, wishlistItems, products } from "@/lib/db";
import { eq, and } from "drizzle-orm";
import { auth } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { productId } = await req.json();
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = (session.user as any).id;

    const [existing] = await db
      .select()
      .from(wishlistItems)
      .where(and(eq(wishlistItems.userId, userId), eq(wishlistItems.productId, productId)))
      .limit(1);

    if (existing) {
      await db.delete(wishlistItems).where(eq(wishlistItems.id, existing.id));
      return NextResponse.json({ added: false });
    }

    await db.insert(wishlistItems).values({ userId, productId });
    return NextResponse.json({ added: true });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = (session.user as any).id;

  const rows = await db
    .select()
    .from(wishlistItems)
    .leftJoin(products, eq(wishlistItems.productId, products.id))
    .where(eq(wishlistItems.userId, userId));

  return NextResponse.json(
    rows.map((row) => ({
      ...row.wishlist_items,
      product: row.products,
    }))
  );
}

export const runtime = 'edge';
