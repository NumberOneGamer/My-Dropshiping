"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProductCardSkeleton } from "@/components/ui/skeleton";
import { formatPrice, calculateDiscount } from "@/lib/utils/cn";
import { useWishlistStore } from "@/stores/wishlist";
import { services } from "@/lib/services";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: string;
  comparePrice: string | null;
  images: string[];
  category?: { name: string; slug: string } | null;
}

export function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { toggleItem, isInWishlist } = useWishlistStore();

  useEffect(() => {
    (async () => {
      try {
        const data = await services.products.getAll({ featured: true, limit: 8 });
        setProducts(data as any);
      } catch {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <div className="skeleton mx-auto mb-3 h-3 w-20 rounded" />
            <div className="skeleton mx-auto h-8 w-56 rounded" />
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (products.length === 0) return null;

  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Curated Selection
          </p>
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Best Sellers
          </h2>
        </motion.div>

        <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {products.slice(0, 8).map((product, index) => {
            const discount = product.comparePrice
              ? calculateDiscount(parseFloat(product.price), parseFloat(product.comparePrice))
              : 0;

            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: index * 0.06, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="group"
              >
                <Link href={`/products/${product.slug}`}>
                  <div className="relative mb-4 aspect-square overflow-hidden rounded-lg bg-muted/40">
                    <img
                      src={product.images[0] || "/placeholder.svg"}
                      alt={product.name}
                      className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                      loading="lazy"
                    />
                    {discount > 0 && (
                      <div className="absolute left-3 top-3">
                        <Badge variant="default" className="text-[10px]">
                          -{discount}%
                        </Badge>
                      </div>
                    )}
                  </div>
                </Link>

                <button
                  onClick={(e) => {
                    e.preventDefault();
                    toggleItem(product.id);
                  }}
                  className="absolute right-4 top-4 z-10 rounded-full bg-background/80 p-2 backdrop-blur-sm opacity-0 transition-all duration-200 hover:bg-background group-hover:opacity-100"
                  aria-label="Add to wishlist"
                >
                  <Heart
                    className={`h-4 w-4 transition-colors ${
                      isInWishlist(product.id)
                        ? "fill-foreground text-foreground"
                        : "text-muted-foreground"
                    }`}
                  />
                </button>

                <div className="space-y-1.5">
                  {product.category && (
                    <p className="text-[11px] uppercase tracking-wider text-muted-foreground/60">
                      {product.category.name}
                    </p>
                  )}
                  <Link href={`/products/${product.slug}`}>
                    <h3 className="text-sm font-medium leading-snug transition-colors hover:text-foreground/70">
                      {product.name}
                    </h3>
                  </Link>
                  <div className="flex items-baseline gap-2">
                    <span className="text-sm font-semibold">
                      {formatPrice(product.price)}
                    </span>
                    {product.comparePrice && (
                      <span className="text-xs text-muted-foreground/60 line-through">
                        {formatPrice(product.comparePrice)}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-14 text-center"
        >
          <Button asChild variant="outline" size="lg">
            <Link href="/search">
              View All <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
