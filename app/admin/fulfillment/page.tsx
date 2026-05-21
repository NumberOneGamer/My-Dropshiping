import { requireAdmin } from "@/lib/auth/session";
import { db, fulfillmentJobs } from "@/lib/db";
import { desc } from "drizzle-orm";
import { FulfillmentClient } from "./fulfillment-client";

export const runtime = "edge";

export default async function FulfillmentPage() {
  await requireAdmin();

  let jobs: any[] = [];
  let stats = { pending: 0, shipped: 0, delivered: 0, failed: 0, total: 0 };

  try {
    jobs = await db.select().from(fulfillmentJobs).orderBy(desc(fulfillmentJobs.createdAt)).limit(100);
    stats = {
      total: jobs.length,
      pending: jobs.filter((j) => j.status === "PENDING").length,
      shipped: jobs.filter((j) => j.status === "SHIPPED").length,
      delivered: jobs.filter((j) => j.status === "DELIVERED").length,
      failed: jobs.filter((j) => j.status === "FAILED").length,
    };
  } catch {}

  return <FulfillmentClient jobs={jobs} stats={stats} />;
}
