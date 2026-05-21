import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getSupportedSuppliers } from "@/lib/import";
import { db, supplierMappings, products } from "@/lib/db";
import { eq } from "drizzle-orm";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const action = searchParams.get("action");

  if (action === "list") {
    return NextResponse.json(getSupportedSuppliers());
  }

  if (action === "mappings") {
    const mappings = await db.select().from(supplierMappings).where(eq(supplierMappings.isActive, true));
    return NextResponse.json(mappings);
  }

  return NextResponse.json(getSupportedSuppliers());
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const { productId, supplier, supplierProductId, variantMapping, costPrice, supplierSku } = body;

    if (!productId || !supplier || !supplierProductId) {
      return NextResponse.json({ error: "productId, supplier, and supplierProductId required" }, { status: 400 });
    }

    const [mapping] = await db.insert(supplierMappings).values({
      productId,
      supplier,
      supplierProductId,
      variantMapping,
      costPrice: costPrice ? String(costPrice) : null,
      supplierSku,
      isActive: true,
    }).returning();

    await db.update(products).set({
      supplier,
      supplierProductId,
      updatedAt: new Date(),
    }).where(eq(products.id, productId));

    return NextResponse.json(mapping);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) return NextResponse.json({ error: "Mapping ID required" }, { status: 400 });

    await db.delete(supplierMappings).where(eq(supplierMappings.id, id));
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export const runtime = "edge";
