import { NextRequest, NextResponse } from "next/server";
import { db, users } from "@/lib/db";
import { eq } from "drizzle-orm";
import { hash } from "bcryptjs";
import { registerSchema } from "@/lib/validations";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  const rl = rateLimit(req, 5, 60000);
  if (rl.status === 429) return rl;

  try {
    const body = await req.json();
    const { name, email, password } = registerSchema.parse(body);

    const [existing] = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (existing) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }

    const hashedPassword = await hash(password, 12);
    await db.insert(users).values({ name, email, password: hashedPassword });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }
}

export const runtime = "edge";
