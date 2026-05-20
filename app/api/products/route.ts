import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { services } from "@/lib/services";

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

export const runtime = 'edge';
