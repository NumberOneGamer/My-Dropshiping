"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Heart, ShoppingBag, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useWishlistStore } from "@/stores/wishlist";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product/product-card";
import { ProductCardSkeleton } from "@/components/ui/skeleton";

export default function WishlistPage() {
  const { data: session } = useSession();
  const { items } = useWishlistStore();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (items.length > 0) {
      fetch(`/api/products?limit=50`)
        .then((res) => res.json())
        .then((data) => {
          setProducts(data.filter((p: any) => items.includes(p.id)));
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
      setProducts([]);
    }
  }, [items]);

  return (
    <div className="py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild className="h-9 w-9">
            <Link href="/">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
              Wishlist
            </h1>
            <p className="text-sm text-muted-foreground">
              {items.length} saved items
            </p>
          </div>
        </div>

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
            <Heart className="mb-4 h-10 w-10 text-muted-foreground/20" />
            <h2 className="mb-2 text-base font-semibold">
              Your wishlist is empty
            </h2>
            <p className="mb-6 text-sm text-muted-foreground">
              Save items you love to your wishlist.
            </p>
            <Button asChild>
              <Link href="/search">
                <ShoppingBag className="mr-2 h-4 w-4" /> Shop Now
              </Link>
            </Button>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
          >
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}

export const runtime = 'edge';
