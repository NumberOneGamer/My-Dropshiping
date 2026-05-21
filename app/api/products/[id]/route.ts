import { NextRequest, NextResponse } from "next/server";
import { db, products, categories, productVariants, reviews, users } from "@/lib/db";
import { eq, and } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { productSchema } from "@/lib/validations";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [product] = await db.select().from(products).where(eq(products.id, id)).limit(1);
  if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const [category] = product.categoryId
    ? await db.select().from(categories).where(eq(categories.id, product.categoryId)).limit(1)
    : [null];

  const variants = await db.select().from(productVariants)
    .where(and(eq(productVariants.productId, id), eq(productVariants.isActive, true)));

  const reviewsRows = await db.select({
    id: reviews.id,
    rating: reviews.rating,
    title: reviews.title,
    comment: reviews.comment,
    createdAt: reviews.createdAt,
    userName: users.name,
    userImage: users.image,
  })
    .from(reviews)
    .leftJoin(users, eq(reviews.userId, users.id))
    .where(eq(reviews.productId, id));

  return NextResponse.json({
    ...product,
    category,
    variants,
    reviews: reviewsRows.map(r => ({
      id: r.id,
      rating: r.rating,
      title: r.title,
      comment: r.comment,
      createdAt: r.createdAt,
      user: { name: r.userName, image: r.userImage },
    })),
  });
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { id } = await params;
    const body = await req.json();
    const data = productSchema.parse(body);
    const [product] = await db.update(products).set({
      ...data,
      price: String(data.price),
      comparePrice: data.comparePrice != null ? String(data.comparePrice) : null,
      costPrice: data.costPrice != null ? String(data.costPrice) : null,
      weight: data.weight != null ? String(data.weight) : null,
    }).where(eq(products.id, id)).returning();
    return NextResponse.json(product);
  } catch {
    return NextResponse.json({ error: "Failed to update product" }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { id } = await params;
    await db.update(products).set({ isActive: false, status: "ARCHIVED" }).where(eq(products.id, id));
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}

export const runtime = "edge";
