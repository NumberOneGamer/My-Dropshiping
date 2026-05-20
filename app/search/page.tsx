import { services } from "@/lib/services";
import { ProductGrid } from "@/components/product/product-grid";

interface Props {
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: Props) {
  const { q } = await searchParams;
  const products = q
    ? await services.products.getAll({ search: q, limit: 50 })
    : await services.products.getAll({ limit: 50 });

  return (
    <div className="py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">
            {q ? `Results for "${q}"` : "All Products"}
          </h1>
          <p className="mt-2 text-muted-foreground">
            {products.length} products found
          </p>
        </div>
        <ProductGrid products={products as any} />
      </div>
    </div>
  );
}
