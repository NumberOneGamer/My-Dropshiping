import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/product/product-detail";
import { services } from "@/lib/services";
import { siteConfig } from "@/config/site";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await services.products.getBySlug(slug);
  if (!product) return { title: "Product Not Found" };

  return {
    title: product.name,
    description: product.shortDescription || product.description?.slice(0, 160),
    openGraph: {
      title: product.name,
      description: product.shortDescription || undefined,
      images: product.images.length > 0 ? [{ url: product.images[0] }] : [],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await services.products.getBySlug(slug);

  if (!product) notFound();

  const related = product.category
    ? await services.products.getRelated(product.id, product.category.id)
    : [];

  return (
    <ProductDetail product={product as any} related={related as any} />
  );
}

export const runtime = 'edge';
