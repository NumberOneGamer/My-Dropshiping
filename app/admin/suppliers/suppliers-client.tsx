"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Store, Link, Trash2, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";

export function SuppliersClient({ suppliers, mappings }: { suppliers: { id: string; name: string }[]; mappings: any[] }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ productId: "", supplier: "aliexpress", supplierProductId: "", costPrice: "" });

  const handleCreate = async () => {
    try {
      const res = await fetch("/api/suppliers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      toast.success("Supplier mapping created");
      setShowForm(false);
      setForm({ productId: "", supplier: "aliexpress", supplierProductId: "", costPrice: "" });
      window.location.reload();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/suppliers?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error((await res.json()).error);
      toast.success("Mapping deleted");
      window.location.reload();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Suppliers</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage supplier integrations</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Link className="mr-2 h-4 w-4" />
          Add Mapping
        </Button>
      </div>

      {showForm && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}>
          <Card>
            <CardContent className="p-4 space-y-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs text-muted-foreground">Store Product ID</label>
                  <Input value={form.productId} onChange={(e) => setForm({ ...form, productId: e.target.value })} placeholder="Product ID" />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-muted-foreground">Supplier</label>
                  <select
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                    value={form.supplier}
                    onChange={(e) => setForm({ ...form, supplier: e.target.value })}
                  >
                    {suppliers.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs text-muted-foreground">Supplier Product ID</label>
                  <Input value={form.supplierProductId} onChange={(e) => setForm({ ...form, supplierProductId: e.target.value })} placeholder="Supplier product ID" />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-muted-foreground">Cost Price</label>
                  <Input value={form.costPrice} onChange={(e) => setForm({ ...form, costPrice: e.target.value })} placeholder="0.00" type="number" step="0.01" />
                </div>
              </div>
              <Button onClick={handleCreate} className="w-full">
                <CheckCircle className="mr-2 h-4 w-4" />
                Create Mapping
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Store className="h-4 w-4" />
            Supplier Mappings
          </CardTitle>
          <CardDescription>Connected supplier integrations</CardDescription>
        </CardHeader>
        <CardContent>
          {mappings.length === 0 ? (
            <div className="flex flex-col items-center py-12 text-center">
              <Store className="mb-3 h-8 w-8 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">No supplier mappings yet</p>
              <p className="text-xs text-muted-foreground/60">Create a mapping to auto-fulfill orders</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-border/40">
                    <th className="pb-3 font-medium text-muted-foreground">Product</th>
                    <th className="pb-3 font-medium text-muted-foreground">Supplier</th>
                    <th className="pb-3 font-medium text-muted-foreground">Status</th>
                    <th className="pb-3 font-medium text-muted-foreground">Cost</th>
                    <th className="pb-3 font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {mappings.map((m: any, i: number) => (
                    <motion.tr
                      key={m.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className="border-b border-border/20 transition-colors hover:bg-accent/30"
                    >
                      <td className="py-3 font-mono text-xs">{m.productId?.slice(0, 12)}...</td>
                      <td className="py-3 capitalize text-muted-foreground">{m.supplier}</td>
                      <td className="py-3">
                        <Badge variant={m.isActive ? "success" : "secondary"}>
                          {m.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </td>
                      <td className="py-3">{m.costPrice ? `$${Number(m.costPrice).toFixed(2)}` : "—"}</td>
                      <td className="py-3">
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(m.id)}>
                          <Trash2 className="h-3 w-3 text-destructive" />
                        </Button>
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
