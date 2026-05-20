import { notFound } from "next/navigation";
import { services } from "@/lib/services";
import { ProductGrid } from "@/components/product/product-grid";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: `${slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, " ")}`,
  };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const products = await services.products.getAll({
    limit: 50,
  });

  const filtered = products.filter(
    (p: any) => p.category?.slug === slug || slug === "all"
  );

  const categoryName =
    slug === "all"
      ? "All Products"
      : slug.charAt(0).toUpperCase() + slug.replace(/-/g, " ");

  return (
    <div className="py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">{categoryName}</h1>
          <p className="mt-2 text-muted-foreground">
            {filtered.length} products
          </p>
        </div>
        <ProductGrid products={filtered as any} />
      </div>
    </div>
  );
}

export const runtime = 'edge';
