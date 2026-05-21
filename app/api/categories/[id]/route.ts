import { NextRequest, NextResponse } from "next/server";
import { db, categories, products } from "@/lib/db";
import { eq, count } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { categorySchema } from "@/lib/validations";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [category] = await db.select().from(categories).where(eq(categories.id, id)).limit(1);
  if (!category) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const [countResult] = await db.select({ count: count() }).from(products).where(eq(products.categoryId, id));
  return NextResponse.json({ ...category, _count: { products: Number(countResult.count) } });
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { id } = await params;
    const body = await req.json();
    const data = categorySchema.parse(body);
    const [category] = await db.update(categories).set(data).where(eq(categories.id, id)).returning();
    return NextResponse.json(category);
  } catch {
    return NextResponse.json({ error: "Failed to update category" }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { id } = await params;
    await db.delete(categories).where(eq(categories.id, id));
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete category" }, { status: 500 });
  }
}

export const runtime = "edge";
