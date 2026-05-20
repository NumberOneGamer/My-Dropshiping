"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export const runtime = "edge";

export default function AdminNewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    fetch("/api/categories?all=true")
      .then((r) => r.json())
      .then((d) => setCategories(d.categories ?? d ?? []))
      .catch(() => {});
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const form = new FormData(e.currentTarget);
    const body = {
      name: form.get("name"),
      slug: form.get("slug"),
      description: form.get("description"),
      price: parseFloat(form.get("price") as string),
      categoryId: form.get("categoryId") || null,
      images: form.get("images") ? (form.get("images") as string).split(",").map((s) => s.trim()) : [],
    };

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const err = await res.json();
        setMessage(err.error || "Failed to create product");
        return;
      }
      router.push("/admin/products");
    } catch {
      setMessage("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="py-20 sm:py-28">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-semibold tracking-tight">New Product</h1>
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <label className="mb-2 block text-xs font-medium text-muted-foreground">Name</label>
            <Input name="name" required />
          </div>
          <div>
            <label className="mb-2 block text-xs font-medium text-muted-foreground">Slug</label>
            <Input name="slug" required />
          </div>
          <div>
            <label className="mb-2 block text-xs font-medium text-muted-foreground">Description</label>
            <Textarea name="description" rows={4} />
          </div>
          <div>
            <label className="mb-2 block text-xs font-medium text-muted-foreground">Price ($)</label>
            <Input name="price" type="number" step="0.01" required />
          </div>
          <div>
            <label className="mb-2 block text-xs font-medium text-muted-foreground">Category</label>
            <select
              name="categoryId"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">None</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-2 block text-xs font-medium text-muted-foreground">Image URLs (comma separated)</label>
            <Input name="images" placeholder="/images/placeholder.svg" />
          </div>
          {message && <p className="text-sm text-foreground">{message}</p>}
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Creating..." : "Create Product"}
          </Button>
        </form>
      </div>
    </div>
  );
}
