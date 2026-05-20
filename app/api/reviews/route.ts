import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { auth } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { productId, rating, comment } = await req.json();
    const userId = (session.user as any).id;

    const review = await prisma.review.create({
      data: {
        productId,
        userId,
        rating,
        comment,
        title: "",
      },
    });

    return NextResponse.json(review);
  } catch {
    return NextResponse.json(
      { error: "Failed to create review" },
      { status: 500 }
    );
  }
}

export const runtime = 'edge';
