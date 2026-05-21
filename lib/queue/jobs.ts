import { registerQueue } from "./index";
import { db, syncJobs, fulfillmentJobs, trackingUpdates, automationLogs, supplierMappings, products } from "@/lib/db";
import { eq, inArray, lt, and, sql } from "drizzle-orm";
import { getAdapter } from "@/lib/suppliers";

registerQueue("sync-inventory", async (job) => {
  const { supplier } = job.data;

  const mappings = await db.select().from(supplierMappings).where(
    and(eq(supplierMappings.isActive, true), supplier ? eq(supplierMappings.supplier, supplier) : undefined as any)
  );

  for (const mapping of mappings) {
    try {
      const adapter = getAdapter(mapping.supplier);
      const result = await adapter.syncInventory(mapping.supplierProductId);
      if (result.success) {
        await db.update(products).set({
          price: result.updatedPrice ? String(result.updatedPrice) : undefined,
          costPrice: undefined,
          updatedAt: new Date(),
        }).where(eq(products.id, mapping.productId));
      }
    } catch (err: any) {
      console.error(`[Sync] Failed for product ${mapping.productId}:`, err);
    }
  }
});

registerQueue("sync-tracking", async (job) => {
  const activeJobs = await db.select().from(fulfillmentJobs).where(
    and(eq(fulfillmentJobs.status, "SHIPPED"), sql`${fulfillmentJobs.trackingNumber} IS NOT NULL`)
  );

  for (const fj of activeJobs) {
    try {
      const adapter = getAdapter(fj.supplier);
      if (!fj.supplierOrderId) continue;
      const tracking = await adapter.getTracking(fj.supplierOrderId);

      if (tracking.updates.length > 0) {
        const lastUpdate = tracking.updates[tracking.updates.length - 1];
        await db.insert(trackingUpdates).values({
          fulfillmentJobId: fj.id,
          status: lastUpdate.status,
          location: lastUpdate.location,
          description: lastUpdate.description,
          timestamp: lastUpdate.timestamp,
        });

        await db.update(fulfillmentJobs).set({
          status: tracking.status as any,
          trackingNumber: tracking.trackingNumber || fj.trackingNumber,
          trackingUrl: tracking.trackingUrl || fj.trackingUrl,
          updatedAt: new Date(),
        }).where(eq(fulfillmentJobs.id, fj.id));
      }
    } catch (err: any) {
      console.error(`[Tracking] Failed for job ${fj.id}:`, err);
    }
  }
});

registerQueue("fulfill-order", async (job) => {
  const { orderId, items, shippingAddress, supplier } = job.data;

  try {
    const adapter = getAdapter(supplier);
    const result = await adapter.createOrder({ items, shippingAddress });

    await db.insert(fulfillmentJobs).values({
      orderId,
      supplier,
      supplierOrderId: result.supplierOrderId,
      status: "PLACED",
      trackingNumber: result.trackingNumber,
      trackingUrl: result.trackingUrl,
      carrier: result.carrier,
      cost: String(result.cost),
      currency: result.currency,
      rawResponse: result.rawResponse,
    });
  } catch (err: any) {
    console.error(`[Fulfillment] Failed for order ${orderId}:`, err);
  }
});

registerQueue("retry-failed", async (job) => {
  const failedJobs = await db.select().from(fulfillmentJobs).where(
    and(eq(fulfillmentJobs.status, "FAILED"), lt(fulfillmentJobs.retryCount, fulfillmentJobs.maxRetries))
  );

  for (const fj of failedJobs) {
    await db.update(fulfillmentJobs).set({
      retryCount: (fj.retryCount || 0) + 1,
      lastRetryAt: new Date(),
      status: "PENDING",
    }).where(eq(fulfillmentJobs.id, fj.id));

    const { enqueue } = await import("./index");
    await enqueue("fulfill-order", { orderId: fj.orderId, supplier: fj.supplier });
  }
});

registerQueue("automation-log", async (job) => {
  const { type, action, status, message, metadata, duration } = job.data;
  await db.insert(automationLogs).values({
    type, action, status, message,
    metadata: metadata || {},
    duration: duration || 0,
  });
});
