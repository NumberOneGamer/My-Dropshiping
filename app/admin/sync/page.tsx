import { requireAdmin } from "@/lib/auth/session";
import { db, syncJobs } from "@/lib/db";
import { desc } from "drizzle-orm";
import { getAllAdapters } from "@/lib/suppliers";
import { SyncClient } from "./sync-client";

export const runtime = "edge";

export default async function SyncPage() {
  await requireAdmin();

  let jobs: any[] = [];
  try {
    jobs = await db.select().from(syncJobs).orderBy(desc(syncJobs.createdAt)).limit(100);
  } catch {}

  const suppliers = getAllAdapters().map((a) => ({ id: a.supplier, name: a.name }));

  return <SyncClient jobs={jobs} suppliers={suppliers} />;
}
