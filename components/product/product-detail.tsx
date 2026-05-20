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
  ChevronLeft,
  ChevronRight,
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
    <div className="pb-24 pt-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-square overflow-hidden rounded-2xl bg-muted">
              <AnimatePresence mode="wait">
                <motion.img
                  key={selectedImage}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  src={product.images[selectedImage] || "/placeholder.svg"}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
              </AnimatePresence>
              <div className="absolute left-3 top-3 flex flex-col gap-2">
                {discount > 0 && (
                  <Badge variant="destructive">-{discount}%</Badge>
                )}
              </div>
              <button
                onClick={() => toggleItem(product.id)}
                className="absolute right-3 top-3 rounded-full bg-background/80 p-2.5 backdrop-blur-sm transition-colors hover:bg-background"
              >
                <Heart
                  className={`h-5 w-5 ${
                    isInWishlist(product.id)
                      ? "fill-red-500 text-red-500"
                      : "text-muted-foreground"
                  }`}
                />
              </button>
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={cn(
                      "relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 transition-all",
                      i === selectedImage
                        ? "border-primary"
                        : "border-transparent opacity-60 hover:opacity-100"
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
                <p className="mb-2 text-sm text-muted-foreground">
                  {product.category.name}
                </p>
              )}
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                {product.name}
              </h1>
              {product.shortDescription && (
                <p className="mt-3 text-lg text-muted-foreground">
                  {product.shortDescription}
                </p>
              )}
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold">
                {formatPrice(product.price)}
              </span>
              {product.comparePrice && (
                <span className="text-lg text-muted-foreground line-through">
                  {formatPrice(product.comparePrice)}
                </span>
              )}
              {discount > 0 && (
                <Badge variant="destructive">Save {discount}%</Badge>
              )}
            </div>

            {/* Variants */}
            {product.variants.length > 0 && (
              <div>
                <p className="mb-3 text-sm font-medium">Options</p>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((variant) => (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedVariant(variant.id)}
                      className={cn(
                        "rounded-lg border px-4 py-2 text-sm transition-all",
                        selectedVariant === variant.id
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border hover:border-primary/50"
                      )}
                    >
                      {variant.name}
                      {variant.price && (
                        <span className="ml-1 text-xs opacity-70">
                          ({formatPrice(variant.price)})
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div>
              <p className="mb-3 text-sm font-medium">Quantity</p>
              <div className="flex items-center gap-3">
                <div className="flex items-center rounded-lg border border-border">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 hover:bg-accent"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-12 text-center text-sm font-medium">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3 hover:bg-accent"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                size="xl"
                onClick={handleBuyNow}
                className="flex-1 gap-2"
              >
                <ShoppingBag className="h-5 w-5" />
                Buy Now
              </Button>
              <Button
                size="xl"
                variant="outline"
                onClick={handleAddToCart}
                className="flex-1 gap-2"
              >
                {added ? (
                  <>
                    <Check className="h-5 w-5" /> Added
                  </>
                ) : (
                  "Add to Cart"
                )}
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-3 rounded-xl border border-border/50 p-4">
              <div className="text-center">
                <Truck className="mx-auto mb-1 h-5 w-5 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">Free Shipping</p>
              </div>
              <div className="text-center">
                <Shield className="mx-auto mb-1 h-5 w-5 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">Secure Checkout</p>
              </div>
              <div className="text-center">
                <RefreshCcw className="mx-auto mb-1 h-5 w-5 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">Easy Returns</p>
              </div>
            </div>

            {/* Description & Details */}
            <Accordion type="multiple" className="w-full">
              <AccordionItem value="description">
                <AccordionTrigger>Description</AccordionTrigger>
                <AccordionContent>
                  <div className="rich-text text-sm text-muted-foreground">
                    {product.description || "No description available."}
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="reviews">
                <AccordionTrigger>
                  Reviews ({product.reviews.length})
                </AccordionTrigger>
                <AccordionContent>
                  <ReviewList reviews={product.reviews} productId={product.id} />
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="shipping">
                <AccordionTrigger>Shipping & Returns</AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">
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
          <div className="mt-16">
            <h2 className="mb-8 text-2xl font-bold">You May Also Like</h2>
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
