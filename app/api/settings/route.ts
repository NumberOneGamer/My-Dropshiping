import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { auth } from "@/lib/auth";

export async function PUT(req: NextRequest) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const settings = await req.json();
    const data = await prisma.siteSettings.upsert({
      where: { id: "default" },
      create: { id: "default", ...settings },
      update: settings,
    });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Failed to save settings" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const settings = await prisma.siteSettings.findFirst();
    return NextResponse.json(settings || {});
  } catch {
    return NextResponse.json({ announcementText: "Free shipping on all orders over $50", announcementEnabled: true });
  }
}

export const runtime = 'edge';
