import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { importProduct, getImportHistory } from "@/lib/import";
import { db, supplierProducts, products } from "@/lib/db";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { url, supplier, supplierProductId } = await req.json();
    const result = await importProduct({ url, supplier, supplierProductId });

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ success: true, product: result.product });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "50");
    const imports = await getImportHistory(limit);
    return NextResponse.json(imports);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { importId, productId } = await req.json();

    if (productId) {
      await db.update(supplierProducts).set({ mappedProductId: productId, status: "MAPPED" }).where(eq(supplierProducts.id, importId));
    }

    await db.update(supplierProducts).set({ status: "IMPORTED" }).where(eq(supplierProducts.id, importId));

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export const runtime = "edge";
