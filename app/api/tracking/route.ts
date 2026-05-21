import { NextRequest, NextResponse } from "next/server";
import { db, fulfillmentJobs, trackingUpdates, orders } from "@/lib/db";
import { eq, desc } from "drizzle-orm";
import { auth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get("orderId");
    const fulfillmentJobId = searchParams.get("fulfillmentJobId");

    if (fulfillmentJobId) {
      const updates = await db.select().from(trackingUpdates).where(eq(trackingUpdates.fulfillmentJobId, fulfillmentJobId)).orderBy(desc(trackingUpdates.timestamp));
      return NextResponse.json(updates);
    }

    if (orderId) {
      const session = await auth();
      const orderRows = await db.select().from(orders).where(eq(orders.id, orderId)).limit(1);
      const order = orderRows[0];

      if (order && order.userId) {
        const userId = (session?.user as any)?.id;
        if (userId !== order.userId && session?.user?.role !== "ADMIN") {
          return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
      }

      const jobs = await db.select().from(fulfillmentJobs).where(eq(fulfillmentJobs.orderId, orderId));
      if (jobs.length === 0) return NextResponse.json([]);

      const allUpdates = [];
      for (const job of jobs) {
        const updates = await db.select().from(trackingUpdates).where(eq(trackingUpdates.fulfillmentJobId, job.id)).orderBy(desc(trackingUpdates.timestamp));
        allUpdates.push(...updates);
      }
      allUpdates.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

      return NextResponse.json(allUpdates);
    }

    const session = await auth();
    if (session?.user?.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const allUpdates = await db.select().from(trackingUpdates).orderBy(desc(trackingUpdates.timestamp)).limit(100);
    return NextResponse.json(allUpdates);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export const runtime = "edge";
