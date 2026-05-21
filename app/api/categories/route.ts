import { NextRequest, NextResponse } from "next/server";
import { db, categories, products } from "@/lib/db";
import { eq, asc, count } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { categorySchema } from "@/lib/validations";

export async function GET() {
  const categoriesList = await db.select().from(categories).orderBy(asc(categories.order));
  const counts = await db.select({
    categoryId: products.categoryId,
    count: count(),
  })
    .from(products)
    .groupBy(products.categoryId);
  const countMap = new Map(counts.map(c => [c.categoryId, Number(c.count)]));
  const result = categoriesList.map(c => ({
    ...c,
    _count: { products: countMap.get(c.id) ?? 0 },
  }));
  return NextResponse.json(result);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await req.json();
    const data = categorySchema.parse(body);

    const [category] = await db.insert(categories).values(data).returning();
    return NextResponse.json(category, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create category" },
      { status: 400 }
    );
  }
}

export const runtime = 'edge';
