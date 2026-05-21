import { NextRequest, NextResponse } from "next/server";
import { db, siteSettings } from "@/lib/db";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";

export async function PUT(req: NextRequest) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const settings = await req.json();
    const existingRows = await db.select().from(siteSettings).where(eq(siteSettings.id, "default")).limit(1);
    const existing = existingRows[0] || null;

    if (existing) {
      const [data] = await db.update(siteSettings).set(settings).where(eq(siteSettings.id, "default")).returning();
      return NextResponse.json(data);
    } else {
      const [data] = await db.insert(siteSettings).values({ id: "default", ...settings }).returning();
      return NextResponse.json(data);
    }
  } catch {
    return NextResponse.json(
      { error: "Failed to save settings" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const result = await db.select().from(siteSettings).limit(1);
    return NextResponse.json(result[0] || {});
  } catch {
    return NextResponse.json({ announcementText: "Free shipping on all orders over $50", announcementEnabled: true });
  }
}

export const runtime = 'edge';
