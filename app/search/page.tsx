import { services } from "@/lib/services";
import { ProductGrid } from "@/components/product/product-grid";

interface Props {
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: Props) {
  const { q } = await searchParams;
  let products: any[] = [];
  try {
    products = q
      ? await services.products.getAll({ search: q, limit: 50 })
      : await services.products.getAll({ limit: 50 });
  } catch {} 

  return (
    <div className="py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
            {q ? `Results for "${q}"` : "All Products"}
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            {products.length} products found
          </p>
        </div>
        <ProductGrid products={products as any} />
      </div>
    </div>
  );
}

export const runtime = 'edge';
