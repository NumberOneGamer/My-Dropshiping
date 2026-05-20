"use client";

import { ShoppingBag } from "lucide-react";
import { useCartStore } from "@/stores/cart";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils/cn";
import { useRouter } from "next/navigation";

export function StickyCta() {
  const { items, getSubtotal, openCart } = useCartStore();
  const router = useRouter();
  const count = items.reduce((sum, i) => sum + i.quantity, 0);

  if (count === 0) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border/50 bg-background/80 backdrop-blur-xl md:hidden">
      <div className="flex items-center justify-between px-4 py-3">
        <div>
          <p className="text-xs text-muted-foreground">{count} items</p>
          <p className="font-semibold">{formatPrice(getSubtotal())}</p>
        </div>
        <Button
          size="lg"
          onClick={() => {
            openCart();
          }}
          className="gap-2"
        >
          <ShoppingBag className="h-4 w-4" />
          View Cart
        </Button>
      </div>
    </div>
  );
}
