import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function PUT(req: NextRequest) {
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
  const settings = await prisma.siteSettings.findFirst();
  return NextResponse.json(settings || {});
}
