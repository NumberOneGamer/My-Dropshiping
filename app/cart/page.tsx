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

  const handleApplyCoupon = () => {
    if (couponInput.toUpperCase() === "SAVE10") {
      setCoupon("SAVE10", subtotal * 0.1);
    } else {
      setCoupon(null, 0);
    }
  };

  return (
    <div className="py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/search">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Shopping Cart
            </h1>
            <p className="text-sm text-muted-foreground">{count} items</p>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="flex min-h-[40vh] flex-col items-center justify-center text-center">
            <ShoppingBag className="mb-4 h-16 w-16 text-muted-foreground/30" />
            <h2 className="mb-2 text-xl font-semibold">Your cart is empty</h2>
            <p className="mb-6 text-sm text-muted-foreground">
              Looks like you haven&apos;t added anything yet.
            </p>
            <Button asChild>
              <Link href="/search">Start Shopping</Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <ul className="space-y-4">
                {items.map((item) => (
                  <motion.li
                    key={`${item.productId}-${item.variantId}`}
                    layout
                    className="flex gap-4 rounded-xl border border-border/50 p-4"
                  >
                    <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-muted">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex flex-1 flex-col justify-between">
                      <div className="flex justify-between">
                        <div>
                          <Link
                            href={`/products/${item.productId}`}
                            className="font-medium hover:opacity-70"
                          >
                            {item.name}
                          </Link>
                          {item.variantName && (
                            <p className="text-sm text-muted-foreground">
                              {item.variantName}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() =>
                            removeItem(item.productId, item.variantId)
                          }
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 rounded-lg border border-border">
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.productId,
                                item.quantity - 1,
                                item.variantId
                              )
                            }
                            className="p-2 hover:bg-accent"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-8 text-center text-sm">
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
                            className="p-2 hover:bg-accent"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <p className="font-semibold">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  </motion.li>
                ))}
              </ul>
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-4 rounded-xl border border-border/50 p-6">
                <h2 className="font-semibold">Order Summary</h2>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>
                      {shipping === 0 ? "FREE" : formatPrice(shipping)}
                    </span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-emerald-600">
                      <span>Discount</span>
                      <span>-{formatPrice(discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between border-t border-border/50 pt-2 text-base font-semibold">
                    <span>Total</span>
                    <span>{formatPrice(total + shipping)}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Input
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="Coupon code"
                    className="h-10"
                  />
                  <Button
                    variant="outline"
                    onClick={handleApplyCoupon}
                    className="shrink-0"
                  >
                    Apply
                  </Button>
                </div>
                {couponCode && (
                  <p className="text-xs text-emerald-600">
                    Coupon &quot;{couponCode}&quot; applied!
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
