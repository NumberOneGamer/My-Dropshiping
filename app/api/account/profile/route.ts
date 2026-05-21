import { NextRequest, NextResponse } from "next/server";
import { db, users } from "@/lib/db";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";

export async function PUT(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { name, phone } = body;
    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return NextResponse.json({ error: "Name must be at least 2 characters" }, { status: 400 });
    }

    const [updated] = await db.update(users)
      .set({ name: name.trim(), phone: phone?.trim() || null, updatedAt: new Date() })
      .where(eq(users.id, session.user.id))
      .returning();

    return NextResponse.json({ name: updated.name, email: updated.email, phone: updated.phone });
  } catch {
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}

export const runtime = "edge";
