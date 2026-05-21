import { db, orders, orderItems, fulfillmentJobs, supplierMappings } from "@/lib/db";
import { eq, and, desc } from "drizzle-orm";
import { getAdapter } from "@/lib/suppliers";
import { enqueue } from "@/lib/queue";
import { sendEmail, orderConfirmationEmail } from "@/lib/email";

interface FulfillOptions {
  orderId: string;
}

export async function autoFulfillOrder(options: FulfillOptions): Promise<{ success: boolean; jobs?: any[]; error?: string }> {
  const { orderId } = options;

  try {
    const orderRows = await db.select().from(orders).where(eq(orders.id, orderId)).limit(1);
    const order = orderRows[0];
    if (!order) return { success: false, error: "Order not found" };

    const items = await db.select().from(orderItems).where(eq(orderItems.orderId, orderId));
    if (items.length === 0) return { success: false, error: "No items in order" };

    const productIds = items.map((i) => i.productId);
    const mappings = [];

    for (const pid of productIds) {
      const [mapping] = await db.select().from(supplierMappings).where(
        and(eq(supplierMappings.productId, pid), eq(supplierMappings.isActive, true))
      ).limit(1);
      if (mapping) mappings.push(mapping);
    }

    if (mappings.length === 0) {
      await enqueue("automation-log", {
        type: "FULFILLMENT", action: "auto-fulfill", status: "WARNING",
        message: `No supplier mappings found for order ${order.orderNumber}`,
        metadata: { orderId, orderNumber: order.orderNumber },
      });
      return { success: false, error: "No supplier mappings found" };
    }

    const bySupplier = new Map<string, typeof mappings>();
    for (const m of mappings) {
      const existing = bySupplier.get(m.supplier) || [];
      existing.push(m);
      bySupplier.set(m.supplier, existing);
    }

    const jobs = [];

    for (const [supplier, supplierMaps] of bySupplier.entries()) {
      try {
        const adapter = getAdapter(supplier);
        const shippingAddr = order.shippingAddress as any;

        const fulfillmentItems = supplierMaps.map((m) => {
          const orderItem = items.find((i) => i.productId === m.productId);
          return {
            supplierProductId: m.supplierProductId,
            quantity: orderItem?.quantity || 1,
            price: Number(orderItem?.price || 0),
          };
        });

        const result = await adapter.createOrder({
          items: fulfillmentItems,
          shippingAddress: {
            firstName: shippingAddr?.firstName || "",
            lastName: shippingAddr?.lastName || "",
            line1: shippingAddr?.line1 || "",
            line2: shippingAddr?.line2,
            city: shippingAddr?.city || "",
            state: shippingAddr?.state,
            zip: shippingAddr?.zip || "",
            country: shippingAddr?.country || "US",
            phone: shippingAddr?.phone,
          },
        });

        const [job] = await db.insert(fulfillmentJobs).values({
          orderId,
          supplier,
          supplierOrderId: result.supplierOrderId,
          status: "PLACED",
          trackingNumber: result.trackingNumber,
          trackingUrl: result.trackingUrl,
          carrier: result.carrier,
          cost: String(result.cost),
          currency: result.currency,
          estimatedDelivery: result.estimatedDelivery || null,
          rawResponse: result.rawResponse,
        }).returning();

        jobs.push(job);

        await enqueue("automation-log", {
          type: "FULFILLMENT", action: "order-placed", status: "SUCCESS",
          message: `Fulfillment order placed with ${supplier} for order ${order.orderNumber}`,
          metadata: { orderId, supplier, supplierOrderId: result.supplierOrderId, jobId: job?.id },
        });
      } catch (err: any) {
        await enqueue("automation-log", {
          type: "FULFILLMENT", action: "order-failed", status: "FAILED",
          message: `Failed to fulfill with ${supplier}: ${err.message}`,
          metadata: { orderId, supplier, error: err.message },
        });

        const [failedJob] = await db.insert(fulfillmentJobs).values({
          orderId,
          supplier,
          status: "FAILED",
          error: err.message,
          retryCount: 0,
          maxRetries: 3,
        }).returning();
        jobs.push(failedJob);
      }
    }

    const customerEmail = order.email;
    if (customerEmail) {
      await sendEmail({
        to: customerEmail,
        subject: "Order Confirmed — KAIRO",
        html: orderConfirmationEmail({
          customerName: (order.shippingAddress as any)?.firstName || "Valued Customer",
          orderNumber: order.orderNumber,
          items: items.map((i) => ({
            name: i.name,
            quantity: i.quantity,
            price: `$${Number(i.price).toFixed(2)}`,
            image: i.image || "",
          })),
          total: `$${Number(order.total).toFixed(2)}`,
          orderUrl: `${process.env.NEXT_PUBLIC_APP_URL || ""}/order/${order.id}`,
        }),
      });
    }

    return { success: true, jobs };
  } catch (error: any) {
    await enqueue("automation-log", {
      type: "FULFILLMENT", action: "auto-fulfill", status: "FAILED",
      message: error.message,
      metadata: { orderId },
    });
    return { success: false, error: error.message };
  }
}

export async function getFulfillmentJobs(status?: string, limit = 50) {
  if (status) {
    return db.select().from(fulfillmentJobs).where(eq(fulfillmentJobs.status, status)).orderBy(desc(fulfillmentJobs.createdAt)).limit(limit);
  }
  return db.select().from(fulfillmentJobs).orderBy(desc(fulfillmentJobs.createdAt)).limit(limit);
}

export async function getFulfillmentStats() {
  const all = await db.select().from(fulfillmentJobs);
  const stats = {
    total: all.length,
    pending: all.filter((j) => j.status === "PENDING").length,
    placed: all.filter((j) => j.status === "PLACED").length,
    confirmed: all.filter((j) => j.status === "CONFIRMED").length,
    processing: all.filter((j) => j.status === "PROCESSING").length,
    shipped: all.filter((j) => j.status === "SHIPPED").length,
    delivered: all.filter((j) => j.status === "DELIVERED").length,
    failed: all.filter((j) => j.status === "FAILED").length,
    cancelled: all.filter((j) => j.status === "CANCELLED").length,
  };
  return stats;
}

export async function retryFulfillmentJob(jobId: string) {
  const [job] = await db.select().from(fulfillmentJobs).where(eq(fulfillmentJobs.id, jobId)).limit(1);
  if (!job) return { success: false, error: "Job not found" };

  await db.update(fulfillmentJobs).set({
    status: "PENDING",
    retryCount: (job.retryCount || 0) + 1,
    lastRetryAt: new Date(),
    updatedAt: new Date(),
  }).where(eq(fulfillmentJobs.id, jobId));

  await enqueue("fulfill-order", {
    orderId: job.orderId,
    supplier: job.supplier,
  });

  return { success: true };
}
