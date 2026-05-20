import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { categorySchema } from "@/lib/validations";

export async function GET() {
  const categories = await prisma.category.findMany({
    orderBy: { order: "asc" },
    include: { _count: { select: { products: true } } },
  });
  return NextResponse.json(categories);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = categorySchema.parse(body);

    const category = await prisma.category.create({ data });
    return NextResponse.json(category, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create category" },
      { status: 400 }
    );
  }
}
