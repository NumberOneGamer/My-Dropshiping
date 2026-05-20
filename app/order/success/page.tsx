import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Order Confirmed",
};

interface Props {
  searchParams: Promise<{ orderId?: string }>;
}

export default async function OrderSuccessPage({ searchParams }: Props) {
  const { orderId } = await searchParams;

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 py-12 text-center">
      <div className="mx-auto max-w-md">
        <CheckCircle className="mx-auto mb-6 h-16 w-16 text-emerald-500" />
        <h1 className="mb-3 text-3xl font-bold tracking-tight">
          Order Confirmed!
        </h1>
        <p className="mb-2 text-lg text-muted-foreground">
          Thank you for your purchase.
        </p>
        <p className="mb-8 text-sm text-muted-foreground">
          You will receive a confirmation email shortly with your order details.
        </p>

        {orderId && (
          <div className="mb-8 rounded-xl border border-border/50 bg-secondary/30 p-4">
            <p className="text-xs text-muted-foreground">Order ID</p>
            <p className="font-mono text-sm font-medium">{orderId}</p>
          </div>
        )}

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button asChild size="lg">
            <Link href="/">Continue Shopping</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href={`/order/${orderId || ""}`}>Track Order</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
