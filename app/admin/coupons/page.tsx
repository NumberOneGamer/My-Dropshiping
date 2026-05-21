import { db, coupons as couponsTable } from "@/lib/db";
import { requireAdmin } from "@/lib/auth/session";
import { formatPrice } from "@/lib/utils/cn";
import { Badge } from "@/components/ui/badge";
import { desc } from "drizzle-orm";

export default async function AdminCouponsPage() {
  await requireAdmin();

  let coupons: any[] = [];
  try {
    coupons = await db.select().from(couponsTable).orderBy(desc(couponsTable.createdAt));
  } catch {}

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Coupons</h1>
        <p className="text-sm text-muted-foreground">
          Manage discount coupons
        </p>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border/50">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/50 bg-secondary/50">
              <th className="px-4 py-3 text-left font-medium">Code</th>
              <th className="px-4 py-3 text-left font-medium">Type</th>
              <th className="px-4 py-3 text-right font-medium">Value</th>
              <th className="px-4 py-3 text-center font-medium">Used</th>
              <th className="px-4 py-3 text-center font-medium">Status</th>
              <th className="px-4 py-3 text-right font-medium">Expires</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map((coupon: any) => (
              <tr
                key={coupon.id}
                className="border-b border-border/50 last:border-0 hover:bg-secondary/30"
              >
                <td className="px-4 py-3 font-mono text-xs font-medium">
                  {coupon.code}
                </td>
                <td className="px-4 py-3">{coupon.type}</td>
                <td className="px-4 py-3 text-right">
                  {coupon.type === "PERCENTAGE"
                    ? `${coupon.value}%`
                    : formatPrice(Number(coupon.value))}
                </td>
                <td className="px-4 py-3 text-center">
                  {coupon.usedCount}
                  {coupon.usageLimit ? ` / ${coupon.usageLimit}` : ""}
                </td>
                <td className="px-4 py-3 text-center">
                  <Badge variant={coupon.isActive ? "success" : "secondary"}>
                    {coupon.isActive ? "Active" : "Inactive"}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-right text-xs text-muted-foreground">
                  {coupon.expiresAt
                    ? new Date(coupon.expiresAt).toLocaleDateString()
                    : "Never"}
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
