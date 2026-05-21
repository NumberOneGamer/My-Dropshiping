import { db, supplierProducts } from "@/lib/db";
import { eq } from "drizzle-orm";
import { getAdapter, getAdapterForUrl, getAllAdapters } from "@/lib/suppliers";
import type { ImportResult } from "@/lib/suppliers/types";
import { enqueue } from "@/lib/queue";

interface ImportOptions {
  url?: string;
  supplier?: string;
  supplierProductId?: string;
}

export async function importProduct(options: ImportOptions): Promise<ImportResult> {
  const { url, supplier, supplierProductId } = options;

  try {
    let adapter;
    let productId = supplierProductId;

    if (url) {
      adapter = getAdapterForUrl(url);
      if (!adapter) return { success: false, error: "No adapter found for this URL" };
    } else if (supplier) {
      adapter = getAdapter(supplier);
      if (!productId) return { success: false, error: "supplierProductId required when supplier is specified" };
    } else {
      return { success: false, error: "Either url or supplier+supplierProductId required" };
    }

    if (!adapter || !productId) return { success: false, error: "Could not determine adapter or product ID" };

    const result = await adapter.importProduct(url || `supplier://${supplier}/${productId}`);

    if (!result.success || !result.product) {
      await logImport(result.error || "Import failed", "FAILED", { supplier, supplierProductId: productId, url });
      return result;
    }

    const { product } = result;

    const [saved] = await db.insert(supplierProducts).values({
      supplier: product.supplier,
      supplierProductId: product.supplierProductId,
      supplierUrl: product.supplierUrl,
      title: product.title,
      description: product.description,
      images: product.images,
      price: product.price ? String(product.price) : null,
      comparePrice: product.comparePrice ? String(product.comparePrice) : null,
      costPrice: product.costPrice ? String(product.costPrice) : null,
      currency: product.currency,
      variants: product.variants,
      tags: product.tags,
      weight: product.weight ? String(product.weight) : null,
      sku: product.sku,
      stock: product.stock,
      attributes: product.attributes,
      status: "IMPORTED",
      rawData: product,
    }).returning();

    await logImport(`Product "${product.title}" imported successfully`, "SUCCESS", {
      supplierProductId: saved?.id,
      supplier: product.supplier,
    });

    return result;
  } catch (error: any) {
    await logImport(error.message, "FAILED", { url, supplier, supplierProductId });
    return { success: false, error: error.message };
  }
}

async function logImport(message: string, status: "SUCCESS" | "FAILED", metadata?: Record<string, any>) {
  try {
    await enqueue("automation-log", {
      type: "IMPORT",
      action: "import-product",
      status,
      message,
      metadata,
    });
  } catch { /* ignore logging errors */ }
}

export async function getImportHistory(limit = 50) {
  return db.select().from(supplierProducts).orderBy(supplierProducts.createdAt).limit(limit);
}

export function getSupportedSuppliers() {
  return getAllAdapters().map((a) => ({ id: a.supplier, name: a.name }));
}
