import { requireAdmin } from "@/lib/auth/session";
import { db, supplierMappings } from "@/lib/db";
import { desc } from "drizzle-orm";
import { getSupplierList } from "@/lib/suppliers";
import { SuppliersClient } from "./suppliers-client";

export const runtime = "edge";

export default async function SuppliersPage() {
  await requireAdmin();

  const supplierList = getSupplierList();
  let mappings: any[] = [];

  try {
    mappings = await db.select().from(supplierMappings).orderBy(desc(supplierMappings.createdAt)).limit(100);
  } catch {}

  return <SuppliersClient suppliers={supplierList} mappings={mappings} />;
}
