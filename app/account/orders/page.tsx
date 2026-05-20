import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "My Orders",
  description: "View your order history.",
};

export default async function OrdersPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/signin?callbackUrl=/account/orders");

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    include: { items: { include: { product: { select: { name: true, images: true } } } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="py-20 sm:py-28">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">My Orders</h1>
        {orders.length === 0 ? (
          <div className="mt-8 text-sm text-muted-foreground">
            <p>You haven&apos;t placed any orders yet.</p>
            <Link href="/products" className="mt-4 inline-flex text-foreground underline underline-offset-4">
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="mt-8 space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="rounded-lg border border-border/40 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Order #{order.orderNumber}</p>
                    <p className="mt-1 text-sm font-medium">${order.total.toFixed(2)}</p>
                  </div>
                  <span className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium capitalize">
                    {order.status}
                  </span>
                </div>
                <div className="mt-4 text-xs text-muted-foreground">
                  {new Date(order.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export const runtime = "edge";
