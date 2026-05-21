import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db, fulfillmentJobs, trackingUpdates, orders, automationLogs } from "@/lib/db";
import { eq, desc } from "drizzle-orm";
import { enqueue } from "@/lib/queue";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const limit = parseInt(searchParams.get("limit") || "50");

    let jobs;
    if (status) {
      jobs = await db.select().from(fulfillmentJobs).where(eq(fulfillmentJobs.status, status)).orderBy(desc(fulfillmentJobs.createdAt)).limit(limit);
    } else {
      jobs = await db.select().from(fulfillmentJobs).orderBy(desc(fulfillmentJobs.createdAt)).limit(limit);
    }

    return NextResponse.json(jobs);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { fulfillmentJobId, action } = await req.json();

    if (action === "retry" && fulfillmentJobId) {
      await db.update(fulfillmentJobs).set({
        status: "PENDING",
        retryCount: 0,
        updatedAt: new Date(),
      }).where(eq(fulfillmentJobs.id, fulfillmentJobId));

      const job = await db.select().from(fulfillmentJobs).where(eq(fulfillmentJobs.id, fulfillmentJobId)).limit(1);
      const fj = job[0];
      if (fj) {
        await enqueue("fulfill-order", { orderId: fj.orderId, supplier: fj.supplier });
      }

      return NextResponse.json({ success: true });
    }

    if (action === "cancel" && fulfillmentJobId) {
      await db.update(fulfillmentJobs).set({
        status: "CANCELLED",
        updatedAt: new Date(),
      }).where(eq(fulfillmentJobs.id, fulfillmentJobId));
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export const runtime = "edge";
