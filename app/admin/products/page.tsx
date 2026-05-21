import { db, products as productsTable, categories, reviews } from "@/lib/db";
import { requireAdmin } from "@/lib/auth/session";
import { formatPrice } from "@/lib/utils/cn";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { asc, count, inArray } from "drizzle-orm";

export default async function AdminProductsPage() {
  await requireAdmin();

  let products: any[] = [];
  try {
    const productsData = await db.select().from(productsTable).orderBy(asc(productsTable.order));

    const categoryIds = [...new Set(productsData.filter(p => p.categoryId).map(p => p.categoryId!))];
    const categoriesData = categoryIds.length > 0
      ? await db.select().from(categories).where(inArray(categories.id, categoryIds))
      : [];
    const categoryMap = new Map(categoriesData.map(c => [c.id, c]));

    const reviewCounts = await db.select({
      productId: reviews.productId,
      count: count(),
    }).from(reviews).groupBy(reviews.productId);
    const reviewCountMap = new Map(reviewCounts.map(r => [r.productId, r.count]));

    products = productsData.map(p => ({
      ...p,
      category: p.categoryId ? categoryMap.get(p.categoryId) ?? null : null,
      _count: { reviews: reviewCountMap.get(p.id) ?? 0 },
    }));
  } catch {}

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Products</h1>
          <p className="text-sm text-muted-foreground">
            {products.length} products
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/products/new">
            <Plus className="mr-2 h-4 w-4" /> Add Product
          </Link>
        </Button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border/50">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/50 bg-secondary/50">
              <th className="px-4 py-3 text-left font-medium">Product</th>
              <th className="px-4 py-3 text-left font-medium">Category</th>
              <th className="px-4 py-3 text-left font-medium">Status</th>
              <th className="px-4 py-3 text-right font-medium">Price</th>
              <th className="px-4 py-3 text-center font-medium">Reviews</th>
              <th className="px-4 py-3 text-right font-medium">Order</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr
                key={product.id}
                className="border-b border-border/50 last:border-0 hover:bg-secondary/30"
              >
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/products/${product.id}`}
                    className="font-medium hover:opacity-70"
                  >
                    {product.name}
                  </Link>
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {product.category?.name || "-"}
                </td>
                <td className="px-4 py-3">
                  <Badge
                    variant={
                      product.status === "PUBLISHED"
                        ? "success"
                        : product.status === "DRAFT"
                          ? "secondary"
                          : "outline"
                    }
                  >
                    {product.status}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-right font-medium">
                  {formatPrice(Number(product.price))}
                </td>
                <td className="px-4 py-3 text-center text-muted-foreground">
                  {product._count.reviews}
                </td>
                <td className="px-4 py-3 text-right text-xs text-muted-foreground">
                  {product.order}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export const runtime = 'edge';
