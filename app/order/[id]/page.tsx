import { notFound } from "next/navigation";
import { services } from "@/lib/services";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils/cn";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Package } from "lucide-react";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = {
  title: "Order Details",
};

const statusColors: Record<string, "default" | "secondary" | "destructive" | "outline" | "success"> = {
  PENDING: "secondary",
  PROCESSING: "default",
  SHIPPED: "success",
  DELIVERED: "success",
  CANCELLED: "destructive",
};

export default async function OrderPage({ params }: Props) {
  const { id } = await params;
  let order: any = null;
  let failed = false;
  try {
    order = await services.orders.getById(id);
  } catch { failed = true; }
  if (!order && !failed) notFound();
  if (failed) {
    return (
      <div className="py-12">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-4 inline-flex items-center justify-center rounded-full bg-muted p-4">
            <Package className="h-8 w-8 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-bold">Unable to load order</h1>
          <p className="mt-2 text-muted-foreground">The database is currently unavailable. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/account">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Order Details
            </h1>
            <p className="text-sm text-muted-foreground">
              {order.orderNumber}
            </p>
          </div>
          <Badge
            variant={statusColors[order.status]}
            className="ml-auto"
          >
            {order.status}
          </Badge>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-border/50 p-6">
            <h2 className="mb-4 font-semibold">Items</h2>
            <ul className="space-y-4">
              {order.items.map((item: any) => (
                <li
                  key={item.id}
                  className="flex items-center gap-4"
                >
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-muted">
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Qty: {item.quantity} &times; {formatPrice(Number(item.price))}
                    </p>
                  </div>
                  <p className="font-medium">
                    {formatPrice(Number(item.total))}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border border-border/50 p-6">
            <h2 className="mb-4 font-semibold">Order Summary</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatPrice(Number(order.subtotal))}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span>
                  {Number(order.shippingCost) === 0
                    ? "FREE"
                    : formatPrice(Number(order.shippingCost))}
                </span>
              </div>
              {Number(order.discount) > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Discount</span>
                  <span>-{formatPrice(Number(order.discount))}</span>
                </div>
              )}
              <div className="flex justify-between border-t border-border/50 pt-2 text-base font-semibold">
                <span>Total</span>
                <span>{formatPrice(Number(order.total))}</span>
              </div>
            </div>
          </div>

          {order.shippingAddress && (
            <div className="rounded-xl border border-border/50 p-6">
              <h2 className="mb-4 font-semibold">Shipping Address</h2>
              <div className="text-sm text-muted-foreground">
                <p>{(order.shippingAddress as any).firstName} {(order.shippingAddress as any).lastName}</p>
                <p>{(order.shippingAddress as any).line1}</p>
                <p>{(order.shippingAddress as any).city}, {(order.shippingAddress as any).state} {(order.shippingAddress as any).zip}</p>
              </div>
            </div>
          )}

          <div className="flex justify-center">
            <Button asChild variant="outline">
              <Link href="/account">Back to Orders</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export const runtime = 'edge';
