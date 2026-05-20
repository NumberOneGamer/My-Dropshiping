"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  Heart,
  ShoppingBag,
  Truck,
  Shield,
  RefreshCcw,
  Minus,
  Plus,
  Share2,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ProductCard } from "./product-card";
import { ReviewList } from "./review-list";
import { formatPrice, calculateDiscount, cn } from "@/lib/utils/cn";
import { useCartStore } from "@/stores/cart";
import { useWishlistStore } from "@/stores/wishlist";
import { useUIStore } from "@/stores/ui";
import toast from "react-hot-toast";

interface ProductDetailProps {
  product: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    shortDescription: string | null;
    price: string;
    comparePrice: string | null;
    images: string[];
    tags: string[];
    variants: { id: string; name: string; price?: string; stock: number; sku?: string }[];
    category: { name: string; slug: string } | null;
    reviews: { id: string; rating: number; title: string | null; comment: string | null; createdAt: string; user: { name: string | null; image: string | null } }[];
  };
  related: any[];
}

export function ProductDetail({ product, related }: ProductDetailProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const { addItem, openCart } = useCartStore();
  const { toggleItem, isInWishlist } = useWishlistStore();
  const { addRecentlyViewed } = useUIStore();
  const [added, setAdded] = useState(false);

  const discount = product.comparePrice
    ? calculateDiscount(parseFloat(product.price), parseFloat(product.comparePrice))
    : 0;

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      price: parseFloat(product.price),
      image: product.images[0] || "",
      quantity,
      variantId: selectedVariant || undefined,
      variantName: selectedVariant
        ? product.variants.find((v) => v.id === selectedVariant)?.name
        : undefined,
    });
    setAdded(true);
    toast.success("Added to cart!");
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    setTimeout(() => openCart(), 300);
  };

  useState(() => {
    addRecentlyViewed(product.slug);
  });

  return (
    <div className="pb-24 pt-8 sm:pt-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-square overflow-hidden rounded-xl bg-muted/40">
              <AnimatePresence mode="wait">
                <motion.img
                  key={selectedImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  src={product.images[selectedImage] || "/placeholder.svg"}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
              </AnimatePresence>
              {discount > 0 && (
                <div className="absolute left-4 top-4">
                  <Badge variant="default" className="text-[10px]">
                    -{discount}%
                  </Badge>
                </div>
              )}
              <button
                onClick={() => toggleItem(product.id)}
                className="absolute right-4 top-4 rounded-full bg-background/80 p-2 backdrop-blur-sm transition-colors hover:bg-background"
              >
                <Heart
                  className={`h-4 w-4 transition-colors ${
                    isInWishlist(product.id)
                      ? "fill-foreground text-foreground"
                      : "text-muted-foreground"
                  }`}
                />
              </button>
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={cn(
                      "relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border transition-all",
                      i === selectedImage
                        ? "border-foreground/60"
                        : "border-border/40 opacity-60 hover:opacity-100"
                    )}
                  >
                    <img
                      src={img}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="flex flex-col gap-6">
            <div>
              {product.category && (
                <p className="mb-2 text-xs uppercase tracking-wider text-muted-foreground/60">
                  {product.category.name}
                </p>
              )}
              <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                {product.name}
              </h1>
              {product.shortDescription && (
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {product.shortDescription}
                </p>
              )}
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-2xl font-semibold">
                {formatPrice(product.price)}
              </span>
              {product.comparePrice && (
                <span className="text-base text-muted-foreground/50 line-through">
                  {formatPrice(product.comparePrice)}
                </span>
              )}
            </div>

            {/* Variants */}
            {product.variants.length > 0 && (
              <div>
                <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground/60">
                  Options
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((variant) => (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedVariant(variant.id)}
                      className={cn(
                        "rounded-lg border px-4 py-2 text-sm transition-all",
                        selectedVariant === variant.id
                          ? "border-foreground/40 bg-foreground/5 text-foreground"
                          : "border-border/40 text-muted-foreground hover:border-border/60"
                      )}
                    >
                      {variant.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div>
              <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground/60">
                Quantity
              </p>
              <div className="inline-flex items-center rounded-lg border border-border/40">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2.5 text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span className="w-10 text-center text-sm font-medium tabular-nums">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2.5 text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col gap-2.5 sm:flex-row">
              <Button
                size="lg"
                onClick={handleBuyNow}
                className="flex-1 gap-2"
              >
                <ShoppingBag className="h-4 w-4" />
                Buy Now
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={handleAddToCart}
                className="flex-1 gap-2"
              >
                {added ? (
                  <>
                    <Check className="h-4 w-4" /> Added
                  </>
                ) : (
                  "Add to Cart"
                )}
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 rounded-lg border border-border/40 p-4">
              <div className="text-center">
                <Truck className="mx-auto mb-2 h-4 w-4 text-muted-foreground" />
                <p className="text-[11px] text-muted-foreground">Free Shipping</p>
              </div>
              <div className="text-center">
                <Shield className="mx-auto mb-2 h-4 w-4 text-muted-foreground" />
                <p className="text-[11px] text-muted-foreground">Secure Checkout</p>
              </div>
              <div className="text-center">
                <RefreshCcw className="mx-auto mb-2 h-4 w-4 text-muted-foreground" />
                <p className="text-[11px] text-muted-foreground">Easy Returns</p>
              </div>
            </div>

            {/* Description & Details */}
            <Accordion type="multiple" className="w-full">
              <AccordionItem value="description">
                <AccordionTrigger className="text-sm font-medium">Description</AccordionTrigger>
                <AccordionContent>
                  <div className="rich-text text-sm">
                    {product.description || "No description available."}
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="reviews">
                <AccordionTrigger className="text-sm font-medium">
                  Reviews ({product.reviews.length})
                </AccordionTrigger>
                <AccordionContent>
                  <ReviewList reviews={product.reviews} productId={product.id} />
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="shipping">
                <AccordionTrigger className="text-sm font-medium">Shipping & Returns</AccordionTrigger>
                <AccordionContent className="text-sm">
                  <p className="mb-2">
                    Free shipping on all orders over $50. Orders typically arrive
                    within 3-5 business days.
                  </p>
                  <p>
                    Not satisfied? Return within 30 days for a full refund. No
                    questions asked.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div className="mt-20 border-t border-border/40 pt-16">
            <h2 className="mb-10 text-xl font-semibold tracking-tight">You May Also Like</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((p: any) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
