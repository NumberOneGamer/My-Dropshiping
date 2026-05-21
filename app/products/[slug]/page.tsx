import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/product/product-detail";
import { services } from "@/lib/services";
import { siteConfig } from "@/config/site";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { slug } = await params;
    const product = await services.products.getBySlug(slug);
    if (!product) return { title: "Product Not Found" };
    return {
      title: product.name,
      description: product.shortDescription || product.description?.slice(0, 160),
      openGraph: {
        title: product.name,
        description: product.shortDescription || undefined,
        images: product.images?.length ? [{ url: product.images[0] }] : [],
      },
    };
  } catch {
    return { title: "Product" };
  }
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  let product: any = null;
  let related: any[] = [];
  try {
    product = await services.products.getBySlug(slug);
    if (product && product.category) {
      related = await services.products.getRelated(product.id, product.category.id);
    }
  } catch {}

  if (!product) notFound();

  return (
    <ProductDetail product={product as any} related={related as any} />
  );
}

export const runtime = 'edge';
