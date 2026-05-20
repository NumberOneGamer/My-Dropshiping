"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatPrice, calculateDiscount } from "@/lib/utils/cn";
import { useWishlistStore } from "@/stores/wishlist";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: string;
    comparePrice: string | null;
    images: string[];
    category?: { name: string; slug: string } | null;
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const { toggleItem, isInWishlist } = useWishlistStore();
  const discount = product.comparePrice
    ? calculateDiscount(parseFloat(product.price), parseFloat(product.comparePrice))
    : 0;

  return (
    <div className="group relative">
      <Link href={`/products/${product.slug}`}>
        <div className="relative mb-3 aspect-square overflow-hidden rounded-xl bg-muted">
          <img
            src={product.images[0] || "/placeholder.svg"}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute left-3 top-3 flex flex-col gap-2">
            {discount > 0 && (
              <Badge variant="destructive">-{discount}%</Badge>
            )}
          </div>
        </div>
      </Link>

      <button
        onClick={(e) => {
          e.preventDefault();
          toggleItem(product.id);
        }}
        className="absolute right-3 top-3 z-10 rounded-full bg-background/80 p-2 backdrop-blur-sm transition-colors hover:bg-background"
      >
        <Heart
          className={`h-4 w-4 ${
            isInWishlist(product.id)
              ? "fill-red-500 text-red-500"
              : "text-muted-foreground"
          }`}
        />
      </button>

      <div className="space-y-1">
        {product.category && (
          <p className="text-xs text-muted-foreground">
            {product.category.name}
          </p>
        )}
        <Link href={`/products/${product.slug}`}>
          <h3 className="font-medium line-clamp-1 hover:opacity-70">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center gap-2">
          <span className="font-semibold">{formatPrice(product.price)}</span>
          {product.comparePrice && (
            <span className="text-sm text-muted-foreground line-through">
              {formatPrice(product.comparePrice)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
