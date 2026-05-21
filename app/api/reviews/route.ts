import { NextRequest, NextResponse } from "next/server";
import { db, reviews } from "@/lib/db";
import { auth } from "@/lib/auth";
import { reviewSchema } from "@/lib/validations";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const data = reviewSchema.parse(body);
    const userId = (session.user as any).id;

    const [review] = await db.insert(reviews).values({
      productId: data.productId,
      userId,
      rating: data.rating,
      title: data.title || "",
      comment: data.comment,
    }).returning();

    return NextResponse.json(review);
  } catch {
    return NextResponse.json(
      { error: "Failed to create review" },
      { status: 500 }
    );
  }
}

export const runtime = 'edge';
