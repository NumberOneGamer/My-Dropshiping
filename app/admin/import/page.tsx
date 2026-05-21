import { requireAdmin } from "@/lib/auth/session";
import { db, supplierProducts } from "@/lib/db";
import { desc } from "drizzle-orm";
import { ImportClient } from "./import-client";

export const runtime = "edge";

export default async function ImportPage() {
  await requireAdmin();

  let imports: any[] = [];
  try {
    imports = await db.select().from(supplierProducts).orderBy(desc(supplierProducts.createdAt)).limit(100);
  } catch {}

  return <ImportClient imports={imports} />;
}
