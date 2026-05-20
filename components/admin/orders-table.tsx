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
    <div className="overflow-x-auto rounded-xl border border-border/50">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border/50 bg-secondary/50">
            <th className="px-4 py-3 text-left font-medium">Order</th>
            <th className="px-4 py-3 text-left font-medium">Customer</th>
            <th className="px-4 py-3 text-left font-medium">Status</th>
            <th className="px-4 py-3 text-left font-medium">Payment</th>
            <th className="px-4 py-3 text-right font-medium">Total</th>
            <th className="px-4 py-3 text-right font-medium">Date</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr
              key={order.id}
              className="border-b border-border/50 last:border-0 hover:bg-secondary/30 cursor-pointer"
              onClick={() => setSelected(selected === order.id ? null : order.id)}
            >
              <td className="px-4 py-3 font-mono text-xs">
                {order.orderNumber}
              </td>
              <td className="px-4 py-3">
                <p className="font-medium">{order.user?.name || "Guest"}</p>
                <p className="text-xs text-muted-foreground">{order.email}</p>
              </td>
              <td className="px-4 py-3">
                <Badge variant={statusColors[order.status] || "secondary"}>
                  {order.status}
                </Badge>
              </td>
              <td className="px-4 py-3">
                <Badge variant={order.paymentStatus === "PAID" ? "success" : "secondary"}>
                  {order.paymentStatus}
                </Badge>
              </td>
              <td className="px-4 py-3 text-right font-medium">
                {formatPrice(order.total)}
              </td>
              <td className="px-4 py-3 text-right text-xs text-muted-foreground">
                {new Date(order.createdAt).toLocaleDateString()}
              </td>
            </tr>
          ))}
          {orders.length === 0 && (
            <tr>
              <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                No orders found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
