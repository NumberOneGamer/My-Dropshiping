"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, Package, Clock } from "lucide-react";
import toast from "react-hot-toast";

const statusColors: Record<string, "default" | "secondary" | "destructive" | "outline" | "success"> = {
  PENDING: "secondary",
  RUNNING: "default",
  COMPLETED: "success",
  FAILED: "destructive",
  CANCELLED: "destructive",
};

export function SyncClient({ jobs, suppliers }: { jobs: any[]; suppliers: { id: string; name: string }[] }) {
  const [syncing, setSyncing] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState("");

  const handleSync = async (type: string) => {
    setSyncing(true);
    try {
      const res = await fetch("/api/analytics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, supplier: selectedSupplier || undefined }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success(`${type} sync triggered`);
      setTimeout(() => window.location.reload(), 1500);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSyncing(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Sync Management</h1>
        <p className="mt-1 text-sm text-muted-foreground">Inventory and price synchronization</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <RefreshCw className="h-4 w-4" />
            Trigger Sync
          </CardTitle>
          <CardDescription>Sync inventory, prices, and order statuses with suppliers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <select
              className="flex h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm"
              value={selectedSupplier}
              onChange={(e) => setSelectedSupplier(e.target.value)}
            >
              <option value="">All Suppliers</option>
              {suppliers.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
            <Button onClick={() => handleSync("INVENTORY")} disabled={syncing} variant="outline">
              <Package className="mr-2 h-4 w-4" />
              Sync Inventory
            </Button>
            <Button onClick={() => handleSync("PRICE")} disabled={syncing} variant="outline">
              Sync Prices
            </Button>
            <Button onClick={() => handleSync("FULL")} disabled={syncing}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Full Sync
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Clock className="h-4 w-4" />
            Sync History
          </CardTitle>
        </CardHeader>
        <CardContent>
          {jobs.length === 0 ? (
            <div className="flex flex-col items-center py-12 text-center">
              <RefreshCw className="mb-3 h-8 w-8 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">No sync jobs yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-border/40">
                    <th className="pb-3 font-medium text-muted-foreground">Type</th>
                    <th className="pb-3 font-medium text-muted-foreground">Supplier</th>
                    <th className="pb-3 font-medium text-muted-foreground">Status</th>
                    <th className="pb-3 font-medium text-muted-foreground">Progress</th>
                    <th className="pb-3 font-medium text-muted-foreground">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.map((job: any, i: number) => (
                    <motion.tr
                      key={job.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.02 }}
                      className="border-b border-border/20 transition-colors hover:bg-accent/30"
                    >
                      <td className="py-3 font-medium">{job.type}</td>
                      <td className="py-3 capitalize text-muted-foreground">{job.supplier || "All"}</td>
                      <td className="py-3">
                        <Badge variant={statusColors[job.status]}>{job.status}</Badge>
                      </td>
                      <td className="py-3 text-xs text-muted-foreground">
                        {job.processedItems}/{job.totalItems}
                      </td>
                      <td className="py-3 text-xs text-muted-foreground">
                        {new Date(job.createdAt).toLocaleDateString()}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
