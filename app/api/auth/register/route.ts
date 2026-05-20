import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { hash } from "bcryptjs";
import { registerSchema } from "@/lib/validations";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  const rl = rateLimit(req, 5, 60000);
  if (rl.status === 429) return rl;

  try {
    const body = await req.json();
    const { name, email, password } = registerSchema.parse(body);

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }

    const hashedPassword = await hash(password, 12);
    await prisma.user.create({ data: { name, email, password: hashedPassword } });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }
}

export const runtime = "edge";
