import { db, users, orders } from "@/lib/db";
import { requireAdmin } from "@/lib/auth/session";
import { desc, count } from "drizzle-orm";

export default async function AdminCustomersPage() {
  await requireAdmin();

  let customers: any[] = [];
  try {
    const rawCustomers = await db.select().from(users).orderBy(desc(users.createdAt));
    const orderCounts = await db.select({
      userId: orders.userId,
      count: count(),
    }).from(orders)
      .groupBy(orders.userId);

    const countMap = new Map(orderCounts.map(o => [o.userId, o.count]));
    customers = rawCustomers.map(u => ({
      ...u,
      _count: { orders: countMap.get(u.id) ?? 0 },
    }));
  } catch {}

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Customers</h1>
        <p className="text-sm text-muted-foreground">
          {customers.length} registered customers
        </p>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border/50">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/50 bg-secondary/50">
              <th className="px-4 py-3 text-left font-medium">Name</th>
              <th className="px-4 py-3 text-left font-medium">Email</th>
              <th className="px-4 py-3 text-center font-medium">Orders</th>
              <th className="px-4 py-3 text-right font-medium">Joined</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((user) => (
              <tr
                key={user.id}
                className="border-b border-border/50 last:border-0 hover:bg-secondary/30"
              >
                <td className="px-4 py-3 font-medium">
                  {user.name || "N/A"}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {user.email}
                </td>
                <td className="px-4 py-3 text-center">
                  {user._count.orders}
                </td>
                <td className="px-4 py-3 text-right text-xs text-muted-foreground">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export const runtime = 'edge';
