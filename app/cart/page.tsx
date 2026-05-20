"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Trash2, Minus, Plus, ArrowLeft, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/stores/cart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatPrice } from "@/lib/utils/cn";

export default function CartPage() {
  const {
    items,
    updateQuantity,
    removeItem,
    getSubtotal,
    getItemCount,
    couponCode,
    setCoupon,
    discount,
  } = useCartStore();
  const [couponInput, setCouponInput] = useState("");

  const subtotal = getSubtotal();
  const count = getItemCount();
  const total = subtotal - discount;
  const shipping = subtotal >= 50 ? 0 : 9.99;

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) return;
    try {
      const res = await fetch(`/api/coupons?code=${encodeURIComponent(couponInput.trim().toUpperCase())}`);
      if (!res.ok) { setCoupon(null, 0); return; }
      const coupons = await res.json();
      const coupon = Array.isArray(coupons) ? coupons.find((c: any) => c.code === couponInput.trim().toUpperCase()) : null;
      if (!coupon || (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) || (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit)) {
        setCoupon(null, 0);
        return;
      }
      let disc = coupon.type === "PERCENTAGE" ? subtotal * (coupon.value / 100) : coupon.value;
      if (coupon.maxDiscount) disc = Math.min(disc, coupon.maxDiscount);
      if (coupon.minOrderAmount && subtotal < coupon.minOrderAmount) { setCoupon(null, 0); return; }
      setCoupon(coupon.code, disc);
    } catch {
      setCoupon(null, 0);
    }
  };

  return (
    <div className="py-16 sm:py-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild className="h-9 w-9">
            <Link href="/search">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
              Shopping Cart
            </h1>
            <p className="text-sm text-muted-foreground">{count} items</p>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
            <ShoppingBag className="mb-4 h-12 w-12 text-muted-foreground/20" />
            <h2 className="mb-2 text-lg font-semibold">Your cart is empty</h2>
            <p className="mb-6 text-sm text-muted-foreground">
              Looks like you haven&apos;t added anything yet.
            </p>
            <Button asChild>
              <Link href="/search">Start Shopping</Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-10 lg:grid-cols-5">
            <div className="lg:col-span-3">
              <ul className="space-y-0 divide-y divide-border/30 rounded-lg border border-border/40">
                {items.map((item) => (
                  <motion.li
                    key={`${item.productId}-${item.variantId}`}
                    layout
                    className="flex gap-4 p-4"
                  >
                    <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-muted/40">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex flex-1 flex-col justify-between">
                      <div className="flex justify-between gap-3">
                        <div>
                          <Link
                            href={`/products/${item.productId}`}
                            className="text-sm font-medium hover:text-foreground/70"
                          >
                            {item.name}
                          </Link>
                          {item.variantName && (
                            <p className="mt-0.5 text-xs text-muted-foreground/60">
                              {item.variantName}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() =>
                            removeItem(item.productId, item.variantId)
                          }
                          className="shrink-0 text-muted-foreground/40 transition-colors hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="inline-flex items-center rounded-md border border-border/40">
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.productId,
                                item.quantity - 1,
                                item.variantId
                              )
                            }
                            className="p-1.5 text-muted-foreground transition-colors hover:text-foreground"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-7 text-center text-xs font-medium tabular-nums">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.productId,
                                item.quantity + 1,
                                item.variantId
                              )
                            }
                            className="p-1.5 text-muted-foreground transition-colors hover:text-foreground"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <p className="text-sm font-medium tabular-nums">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  </motion.li>
                ))}
              </ul>
            </div>

            <div className="lg:col-span-2">
              <div className="sticky top-24 space-y-5 rounded-lg border border-border/40 p-5">
                <h2 className="text-sm font-semibold">Order Summary</h2>

                <div className="space-y-2.5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="tabular-nums">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="tabular-nums">
                      {shipping === 0 ? "FREE" : formatPrice(shipping)}
                    </span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-foreground/70">
                      <span>Discount</span>
                      <span className="tabular-nums">-{formatPrice(discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between border-t border-border/40 pt-2.5 text-sm font-semibold">
                    <span>Total</span>
                    <span className="tabular-nums">{formatPrice(total + shipping)}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Input
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="Coupon code"
                    className="h-9 text-xs"
                  />
                  <Button
                    variant="outline"
                    onClick={handleApplyCoupon}
                    className="shrink-0 h-9 text-xs"
                  >
                    Apply
                  </Button>
                </div>
                {couponCode && (
                  <p className="text-xs text-foreground/70">
                    Coupon &quot;{couponCode}&quot; applied
                  </p>
                )}

                <Button asChild className="w-full" size="lg">
                  <Link href="/checkout">Checkout</Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export const runtime = 'edge';
