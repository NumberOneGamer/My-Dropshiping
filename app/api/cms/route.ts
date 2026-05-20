import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const section = searchParams.get("section");

  const where = section ? { section } : {};
  const contents = await prisma.cMSContent.findMany({
    where,
    orderBy: { section: "asc" },
  });

  return NextResponse.json(contents);
}

export async function PUT(req: NextRequest) {
  try {
    const { section, title, subtitle, content, isActive } = await req.json();

    const existing = await prisma.cMSContent.findUnique({
      where: { section },
    });

    if (existing) {
      await prisma.cMSContent.update({
        where: { section },
        data: { title, subtitle, content, isActive },
      });
    } else {
      await prisma.cMSContent.create({
        data: { section, title, subtitle, content, isActive },
      });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to save CMS" }, { status: 500 });
  }
}

export const runtime = 'edge';
