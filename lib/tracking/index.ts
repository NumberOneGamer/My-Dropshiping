import { db, fulfillmentJobs, trackingUpdates, orders } from "@/lib/db";
import { eq, and, desc } from "drizzle-orm";
import { getAdapter } from "@/lib/suppliers";
import { sendEmail, trackingConfirmationEmail } from "@/lib/email";

export async function getTrackingForOrder(orderId: string) {
  const jobs = await db.select().from(fulfillmentJobs)
    .where(and(
      eq(fulfillmentJobs.orderId, orderId),
      eq(fulfillmentJobs.status, "SHIPPED")
    ));

  if (jobs.length === 0) return [];

  const allUpdates = [];
  for (const job of jobs) {
    const updates = await db.select().from(trackingUpdates)
      .where(eq(trackingUpdates.fulfillmentJobId, job.id))
      .orderBy(desc(trackingUpdates.timestamp));

    allUpdates.push({
      fulfillmentJobId: job.id,
      carrier: job.carrier,
      trackingNumber: job.trackingNumber,
      trackingUrl: job.trackingUrl,
      status: job.status,
      updates,
    });
  }

  return allUpdates;
}

export async function syncTrackingForJob(jobId: string) {
  const [job] = await db.select().from(fulfillmentJobs).where(eq(fulfillmentJobs.id, jobId)).limit(1);
  if (!job || !job.supplierOrderId) return { success: false, error: "Job or supplier order ID not found" };

  try {
    const adapter = getAdapter(job.supplier);
    const tracking = await adapter.getTracking(job.supplierOrderId);

    if (tracking.updates.length > 0) {
      for (const update of tracking.updates) {
        await db.insert(trackingUpdates).values({
          fulfillmentJobId: jobId,
          status: update.status,
          location: update.location || null,
          description: update.description,
          timestamp: update.timestamp,
        });
      }
    }

    await db.update(fulfillmentJobs).set({
      status: tracking.status as any,
      trackingNumber: tracking.trackingNumber || job.trackingNumber,
      trackingUrl: tracking.trackingUrl || job.trackingUrl,
      carrier: tracking.carrier || job.carrier,
      updatedAt: new Date(),
    }).where(eq(fulfillmentJobs.id, jobId));

    if (tracking.status === "SHIPPED" && job.status !== "SHIPPED") {
      const [order] = await db.select().from(orders).where(eq(orders.id, job.orderId)).limit(1);
      if (order?.email) {
        await sendEmail({
          to: order.email,
          subject: "Your Package is on the Way — KAIRO",
          html: trackingConfirmationEmail({
            customerName: (order.shippingAddress as any)?.firstName || "Valued Customer",
            orderNumber: order.orderNumber,
            trackingNumber: tracking.trackingNumber || job.trackingNumber || "",
            trackingUrl: tracking.trackingUrl || job.trackingUrl || undefined,
            carrier: tracking.carrier || job.carrier || "",
            orderUrl: `${process.env.NEXT_PUBLIC_APP_URL || ""}/order/${order.id}`,
          }),
        });
      }
    }

    return { success: true, tracking };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getTrackingStatusSummary() {
  const [shipped, delivered, processing] = await Promise.all([
    db.select().from(fulfillmentJobs).where(eq(fulfillmentJobs.status, "SHIPPED")),
    db.select().from(fulfillmentJobs).where(eq(fulfillmentJobs.status, "DELIVERED")),
    db.select().from(fulfillmentJobs).where(eq(fulfillmentJobs.status, "PROCESSING")),
  ]);

  return {
    shipped: shipped.length,
    delivered: delivered.length,
    processing: processing.length,
    total: shipped.length + delivered.length + processing.length,
  };
}
