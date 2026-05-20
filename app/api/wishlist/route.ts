import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function POST(req: NextRequest) {
  try {
    const { productId } = await req.json();
    const session = await import("@/lib/auth").then((m) => m.auth());
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = (session.user as any).id;

    const existing = await prisma.wishlistItem.findUnique({
      where: { userId_productId: { userId, productId } },
    });

    if (existing) {
      await prisma.wishlistItem.delete({ where: { id: existing.id } });
      return NextResponse.json({ added: false });
    }

    await prisma.wishlistItem.create({ data: { userId, productId } });
    return NextResponse.json({ added: true });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function GET() {
  const session = await import("@/lib/auth").then((m) => m.auth());
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = (session.user as any).id;

  const items = await prisma.wishlistItem.findMany({
    where: { userId },
    include: { product: true },
  });

  return NextResponse.json(items);
}

export const runtime = 'edge';
