"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Import, Search, ExternalLink } from "lucide-react";
import toast from "react-hot-toast";

const statusColors: Record<string, "default" | "secondary" | "destructive" | "outline" | "success"> = {
  PENDING: "secondary",
  IMPORTED: "default",
  MAPPED: "success",
  FAILED: "destructive",
};

export function ImportClient({ imports: initialImports }: { imports: any[] }) {
  const [url, setUrl] = useState("");
  const [importing, setImporting] = useState(false);
  const [imports, setImports] = useState(initialImports);

  const handleImport = async () => {
    if (!url.trim()) return;
    setImporting(true);
    try {
      const res = await fetch("/api/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success("Product imported successfully");
      setUrl("");
      const refresh = await fetch("/api/import");
      const refreshed = await refresh.json();
      setImports(refreshed);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setImporting(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Import Products</h1>
        <p className="mt-1 text-sm text-muted-foreground">Import products from supplier URLs</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Import className="h-4 w-4" />
            Import from URL
          </CardTitle>
          <CardDescription>Paste a supplier product URL to import</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <Input
              placeholder="https://www.aliexpress.com/item/..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleImport()}
            />
            <Button onClick={handleImport} disabled={importing || !url.trim()}>
              {importing ? "Importing..." : "Import"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Search className="h-4 w-4" />
            Import History
          </CardTitle>
          <CardDescription>Recently imported products</CardDescription>
        </CardHeader>
        <CardContent>
          {imports.length === 0 ? (
            <div className="flex flex-col items-center py-12 text-center">
              <Import className="mb-3 h-8 w-8 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">No imports yet</p>
              <p className="text-xs text-muted-foreground/60">Import a product using the form above</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-border/40">
                    <th className="pb-3 font-medium text-muted-foreground">Product</th>
                    <th className="pb-3 font-medium text-muted-foreground">Supplier</th>
                    <th className="pb-3 font-medium text-muted-foreground">Status</th>
                    <th className="pb-3 font-medium text-muted-foreground">Price</th>
                    <th className="pb-3 font-medium text-muted-foreground">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {imports.map((item: any, i: number) => (
                    <motion.tr
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className="border-b border-border/20 transition-colors hover:bg-accent/30"
                    >
                      <td className="py-3">
                        <div className="flex items-center gap-3">
                          {item.images?.[0] && (
                            <img src={item.images[0]} alt="" className="h-10 w-10 rounded-md bg-muted object-cover" />
                          )}
                          <div>
                            <p className="font-medium">{item.title}</p>
                            {item.supplierUrl && (
                              <a href={item.supplierUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
                                Source <ExternalLink className="h-3 w-3" />
                              </a>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 text-muted-foreground capitalize">{item.supplier}</td>
                      <td className="py-3">
                        <Badge variant={statusColors[item.status]}>{item.status}</Badge>
                      </td>
                      <td className="py-3">{item.price ? `$${Number(item.price).toFixed(2)}` : "—"}</td>
                      <td className="py-3 text-muted-foreground">
                        {new Date(item.createdAt).toLocaleDateString()}
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
