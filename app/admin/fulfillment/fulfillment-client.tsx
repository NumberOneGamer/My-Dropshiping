"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Truck, RefreshCw, XCircle, Package, ExternalLink, Clock } from "lucide-react";
import toast from "react-hot-toast";

const statusColors: Record<string, "default" | "secondary" | "destructive" | "outline" | "success"> = {
  PENDING: "secondary",
  PLACED: "default",
  CONFIRMED: "default",
  PROCESSING: "outline",
  SHIPPED: "success",
  DELIVERED: "success",
  FAILED: "destructive",
  CANCELLED: "destructive",
};

export function FulfillmentClient({ jobs, stats }: { jobs: any[]; stats: any }) {
  const [processing, setProcessing] = useState<Set<string>>(new Set());

  const handleAction = async (jobId: string, action: string) => {
    setProcessing((prev) => new Set(prev).add(jobId));
    try {
      const res = await fetch("/api/fulfillment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fulfillmentJobId: jobId, action }),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      toast.success(action === "retry" ? "Job queued for retry" : "Job cancelled");
      setTimeout(() => window.location.reload(), 1000);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setProcessing((prev) => { const next = new Set(prev); next.delete(jobId); return next; });
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Fulfillment</h1>
        <p className="mt-1 text-sm text-muted-foreground">Automated order fulfillment queue</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-5">
        {[
          { label: "Total", value: stats.total, icon: Package },
          { label: "Pending", value: stats.pending, icon: Clock },
          { label: "Shipped", value: stats.shipped, icon: Truck },
          { label: "Delivered", value: stats.delivered, icon: Package },
          { label: "Failed", value: stats.failed, icon: XCircle },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                  <p className="mt-1 text-2xl font-bold">{stat.value}</p>
                </div>
                <stat.icon className="h-5 w-5 text-muted-foreground/40" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Truck className="h-4 w-4" />
            Fulfillment Queue
          </CardTitle>
          <CardDescription>Supplier fulfillment jobs</CardDescription>
        </CardHeader>
        <CardContent>
          {jobs.length === 0 ? (
            <div className="flex flex-col items-center py-12 text-center">
              <Package className="mb-3 h-8 w-8 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">No fulfillment jobs</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-border/40">
                    <th className="pb-3 font-medium text-muted-foreground">Order</th>
                    <th className="pb-3 font-medium text-muted-foreground">Supplier</th>
                    <th className="pb-3 font-medium text-muted-foreground">Status</th>
                    <th className="pb-3 font-medium text-muted-foreground">Tracking</th>
                    <th className="pb-3 font-medium text-muted-foreground">Retries</th>
                    <th className="pb-3 font-medium text-muted-foreground">Actions</th>
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
                      <td className="py-3 font-mono text-xs">{job.orderId?.slice(0, 8)}...</td>
                      <td className="py-3 capitalize text-muted-foreground">{job.supplier}</td>
                      <td className="py-3">
                        <Badge variant={statusColors[job.status]}>{job.status}</Badge>
                      </td>
                      <td className="py-3">
                        {job.trackingNumber ? (
                          <div className="flex items-center gap-1">
                            <span className="text-xs">{job.trackingNumber}</span>
                            {job.trackingUrl && (
                              <a href={job.trackingUrl} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-3 w-3 text-muted-foreground" />
                              </a>
                            )}
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="py-3 text-xs text-muted-foreground">
                        {job.retryCount}/{job.maxRetries}
                      </td>
                      <td className="py-3">
                        <div className="flex gap-2">
                          {job.status === "FAILED" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleAction(job.id, "retry")}
                              disabled={processing.has(job.id)}
                            >
                              <RefreshCw className="mr-1 h-3 w-3" />
                              Retry
                            </Button>
                          )}
                          {(job.status === "PENDING" || job.status === "PLACED") && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleAction(job.id, "cancel")}
                              disabled={processing.has(job.id)}
                            >
                              Cancel
                            </Button>
                          )}
                        </div>
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
