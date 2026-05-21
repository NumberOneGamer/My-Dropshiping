import { db, categories as categoriesTable, products } from "@/lib/db";
import { requireAdmin } from "@/lib/auth/session";
import { AdminCategories } from "@/components/admin/categories-list";
import { asc, count } from "drizzle-orm";

export default async function AdminCategoriesPage() {
  await requireAdmin();

  let categories: any[] = [];
  try {
    const rawCategories = await db.select().from(categoriesTable).orderBy(asc(categoriesTable.order));
    const counts = await db.select({
      categoryId: products.categoryId,
      count: count(),
    }).from(products)
      .groupBy(products.categoryId);

    const countMap = new Map(counts.map(c => [c.categoryId, c.count]));
    categories = rawCategories.map(cat => ({
      ...cat,
      _count: { products: countMap.get(cat.id) ?? 0 },
    }));
  } catch {}

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Categories</h1>
        <p className="text-sm text-muted-foreground">
          Manage product categories
        </p>
      </div>
      <AdminCategories categories={categories as any} />
    </div>
  );
}

export const runtime = 'edge';
