import { db, orders as ordersTable, orderItems, users } from "@/lib/db";
import { AdminOrdersTable } from "@/components/admin/orders-table";
import { requireAdmin } from "@/lib/auth/session";
import { desc, inArray } from "drizzle-orm";

export default async function AdminOrdersPage() {
  await requireAdmin();

  let orders: any[] = [];
  try {
    const ordersData = await db.select().from(ordersTable).orderBy(desc(ordersTable.createdAt));
    const orderIds = ordersData.map(o => o.id);

    const items = orderIds.length > 0
      ? await db.select().from(orderItems).where(inArray(orderItems.orderId, orderIds))
      : [];

    const userIds = [...new Set(ordersData.filter(o => o.userId).map(o => o.userId!))];
    const usersData = userIds.length > 0
      ? await db.select({ id: users.id, name: users.name, email: users.email }).from(users).where(inArray(users.id, userIds))
      : [];

    const userMap = new Map(usersData.map(u => [u.id, u]));
    const itemsByOrderId = new Map<string, typeof items>();
    for (const item of items) {
      if (!itemsByOrderId.has(item.orderId)) itemsByOrderId.set(item.orderId, []);
      itemsByOrderId.get(item.orderId)!.push(item);
    }

    orders = ordersData.map(o => ({
      ...o,
      user: o.userId ? userMap.get(o.userId) ?? null : null,
      items: itemsByOrderId.get(o.id) ?? [],
    }));
  } catch {}

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Orders</h1>
        <p className="text-sm text-muted-foreground">
          Manage customer orders ({orders.length})
        </p>
      </div>
      <AdminOrdersTable orders={orders as any} />
    </div>
  );
}

export const runtime = 'edge';
