import { NextRequest, NextResponse } from "next/server";
import { db, cmsContents } from "@/lib/db";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const section = searchParams.get("section");

  try {
    if (section) {
      const contents = await db.select().from(cmsContents).where(eq(cmsContents.section, section)).orderBy(cmsContents.section);
      return NextResponse.json(contents);
    }
    const contents = await db.select().from(cmsContents).orderBy(cmsContents.section);
    return NextResponse.json(contents);
  } catch {
    if (section === "hero") {
      return NextResponse.json([{ section: "hero", title: "Premium quality, delivered.", subtitle: "Curated essentials for modern living.", isActive: true }]);
    }
    return NextResponse.json([]);
  }
}

export async function PUT(req: NextRequest) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { section, title, subtitle, content, isActive } = await req.json();

    const existingRows = await db.select().from(cmsContents).where(eq(cmsContents.section, section)).limit(1);
    const existing = existingRows[0] || null;

    if (existing) {
      await db.update(cmsContents).set({ title, subtitle, content, isActive }).where(eq(cmsContents.section, section));
    } else {
      await db.insert(cmsContents).values({ section, title, subtitle, content, isActive });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to save CMS" }, { status: 500 });
  }
}

export const runtime = 'edge';
