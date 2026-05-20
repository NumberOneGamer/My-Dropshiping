"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils/cn";

const statusColors: Record<string, "default" | "secondary" | "destructive" | "outline" | "success"> = {
  PENDING: "secondary",
  PROCESSING: "default",
  SHIPPED: "success",
  DELIVERED: "success",
  CANCELLED: "destructive",
  REFUNDED: "outline",
};

interface Order {
  id: string;
  orderNumber: string;
  email: string;
  status: string;
  paymentStatus: string;
  total: string;
  createdAt: string;
  items: any[];
  user?: { name: string | null; email: string | null } | null;
}

export function AdminOrdersTable({ orders }: { orders: Order[] }) {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="overflow-hidden rounded-lg border border-border/40">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border/40 bg-muted/30">
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground/60">Order</th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground/60">Customer</th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground/60">Status</th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground/60">Payment</th>
            <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground/60">Total</th>
            <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground/60">Date</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr
              key={order.id}
              className="border-b border-border/30 last:border-0 transition-colors hover:bg-muted/20 cursor-pointer"
              onClick={() => setSelected(selected === order.id ? null : order.id)}
            >
              <td className="px-4 py-3 font-mono text-xs tabular-nums">
                {order.orderNumber}
              </td>
              <td className="px-4 py-3">
                <p className="text-sm font-medium">{order.user?.name || "Guest"}</p>
                <p className="text-xs text-muted-foreground/60">{order.email}</p>
              </td>
              <td className="px-4 py-3">
                <Badge variant={statusColors[order.status] || "secondary"} className="capitalize text-[10px]">
                  {order.status.toLowerCase()}
                </Badge>
              </td>
              <td className="px-4 py-3">
                <Badge variant={order.paymentStatus === "PAID" ? "success" : "secondary"} className="capitalize text-[10px]">
                  {order.paymentStatus.toLowerCase()}
                </Badge>
              </td>
              <td className="px-4 py-3 text-right text-sm font-medium tabular-nums">
                {formatPrice(order.total)}
              </td>
              <td className="px-4 py-3 text-right text-xs text-muted-foreground/60 tabular-nums">
                {new Date(order.createdAt).toLocaleDateString()}
              </td>
            </tr>
          ))}
          {orders.length === 0 && (
            <tr>
              <td colSpan={6} className="px-4 py-10 text-center text-sm text-muted-foreground">
                No orders found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
