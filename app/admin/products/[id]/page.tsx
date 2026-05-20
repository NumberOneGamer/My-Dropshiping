"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export const runtime = "edge";

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  categoryId: string | null;
  images: string[];
}

export default function AdminEditProductPage() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [product, setProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const [prodRes, catRes] = await Promise.all([
          fetch(`/api/products/${params.id}`),
          fetch("/api/categories?all=true"),
        ]);
        if (prodRes.ok) {
          const d = await prodRes.json();
          setProduct(d);
        }
        const catData = await catRes.json();
        setCategories(catData.categories ?? catData ?? []);
      } catch {
        setMessage("Failed to load product");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [params.id]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
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
      const res = await fetch(`/api/products/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const err = await res.json();
        setMessage(err.error || "Failed to update");
        return;
      }
      router.push("/admin/products");
    } catch {
      setMessage("Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="py-28 text-center text-sm text-muted-foreground">Loading...</div>;
  if (!product) return <div className="py-28 text-center text-sm text-muted-foreground">Product not found</div>;

  return (
    <div className="py-20 sm:py-28">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-semibold tracking-tight">Edit Product</h1>
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <label className="mb-2 block text-xs font-medium text-muted-foreground">Name</label>
            <Input name="name" defaultValue={product.name} required />
          </div>
          <div>
            <label className="mb-2 block text-xs font-medium text-muted-foreground">Slug</label>
            <Input name="slug" defaultValue={product.slug} required />
          </div>
          <div>
            <label className="mb-2 block text-xs font-medium text-muted-foreground">Description</label>
            <Textarea name="description" rows={4} defaultValue={product.description} />
          </div>
          <div>
            <label className="mb-2 block text-xs font-medium text-muted-foreground">Price ($)</label>
            <Input name="price" type="number" step="0.01" defaultValue={product.price.toString()} required />
          </div>
          <div>
            <label className="mb-2 block text-xs font-medium text-muted-foreground">Category</label>
            <select
              name="categoryId"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">None</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id} selected={c.id === product.categoryId}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-2 block text-xs font-medium text-muted-foreground">Image URLs (comma separated)</label>
            <Input name="images" defaultValue={product.images?.join(", ")} />
          </div>
          {message && <p className="text-sm text-foreground">{message}</p>}
          <Button type="submit" disabled={saving} className="w-full">
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </div>
    </div>
  );
}
