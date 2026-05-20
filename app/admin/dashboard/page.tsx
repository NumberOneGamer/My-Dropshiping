import { prisma } from "@/lib/db/prisma";
import { formatPrice } from "@/lib/utils/cn";
import { DollarSign, ShoppingCart, Users, Package } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

async function getStats() {
  const [totalOrders, totalRevenue, totalProducts, totalCustomers] =
    await Promise.all([
      prisma.order.count(),
      prisma.order.aggregate({ _sum: { total: true } }),
      prisma.product.count({ where: { status: "PUBLISHED" } }),
      prisma.user.count(),
    ]);

  const recentOrders = await prisma.order.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: { items: true },
  });

  return {
    totalOrders,
    totalRevenue: totalRevenue._sum.total || 0,
    totalProducts,
    totalCustomers,
    recentOrders,
  };
}

export default async function AdminDashboardPage() {
  const stats = await getStats();

  const statCards = [
    { title: "Revenue", value: formatPrice(Number(stats.totalRevenue)), icon: DollarSign },
    { title: "Orders", value: stats.totalOrders.toString(), icon: ShoppingCart },
    { title: "Products", value: stats.totalProducts.toString(), icon: Package },
    { title: "Customers", value: stats.totalCustomers.toString(), icon: Users },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Overview of your store
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-3.5 w-3.5 text-muted-foreground/60" />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-semibold tabular-nums">
                {stat.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold">Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          {stats.recentOrders.length === 0 ? (
            <p className="text-sm text-muted-foreground">No orders yet</p>
          ) : (
            <div className="space-y-0">
              {stats.recentOrders.map((order, i) => (
                <div
                  key={order.id}
                  className={cn(
                    "flex items-center justify-between py-3",
                    i < stats.recentOrders.length - 1 && "border-b border-border/30"
                  )}
                >
                  <div>
                    <p className="text-sm font-medium font-mono">
                      {order.orderNumber}
                    </p>
                    <p className="text-xs text-muted-foreground/60">
                      {order.email}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium tabular-nums">
                      {formatPrice(Number(order.total))}
                    </p>
                    <p className="text-[11px] text-muted-foreground/60 capitalize">
                      {order.status.toLowerCase()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function cn(...classes: (string | false | undefined | null)[]) {
  return classes.filter(Boolean).join(" ");
}

export const runtime = 'edge';
