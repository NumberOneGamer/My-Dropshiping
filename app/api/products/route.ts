import { NextRequest, NextResponse } from "next/server";
import { db, products as productsTable } from "@/lib/db";
import { auth } from "@/lib/auth";
import { services } from "@/lib/services";
import { productSchema } from "@/lib/validations";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const featured = searchParams.get("featured") === "true";
  const categoryId = searchParams.get("categoryId");
  const search = searchParams.get("q");
  const limit = parseInt(searchParams.get("limit") || "20");
  const offset = parseInt(searchParams.get("offset") || "0");

  const products = await services.products.getAll({
    featured: featured || undefined,
    categoryId: categoryId || undefined,
    search: search || undefined,
    limit,
    offset,
  });

  return NextResponse.json(products);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await req.json();
    const data = productSchema.parse(body);
    const [product] = await db.insert(productsTable).values({
      ...data,
      price: String(data.price),
      comparePrice: data.comparePrice != null ? String(data.comparePrice) : null,
      costPrice: data.costPrice != null ? String(data.costPrice) : null,
      weight: data.weight != null ? String(data.weight) : null,
    }).returning();
    return NextResponse.json(product, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create product" }, { status: 400 });
  }
}

export const runtime = 'edge';
