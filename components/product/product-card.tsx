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
    <div className="group">
      <Link href={`/products/${product.slug}`}>
        <div className="relative mb-3 aspect-square overflow-hidden rounded-lg bg-muted/40">
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
            <span className="text-xs text-muted-foreground/50 line-through">
              {formatPrice(product.comparePrice)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
