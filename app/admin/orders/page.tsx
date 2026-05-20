import { prisma } from "@/lib/db/prisma";
import { AdminOrdersTable } from "@/components/admin/orders-table";
import { requireAdmin } from "@/lib/auth/session";

export default async function AdminOrdersPage() {
  await requireAdmin();
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { items: true, user: { select: { name: true, email: true } } },
  });

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
