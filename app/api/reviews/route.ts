import { NextRequest, NextResponse } from "next/server";
import { db, reviews } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { productId, rating, comment } = await req.json();
    const userId = (session.user as any).id;

    const [review] = await db.insert(reviews).values({ productId, userId, rating, comment, title: "" }).returning();

    return NextResponse.json(review);
  } catch {
    return NextResponse.json(
      { error: "Failed to create review" },
      { status: 500 }
    );
  }
}

export const runtime = 'edge';
