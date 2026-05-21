"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2, User, Mail, Phone, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const { data: session, update } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });

  useEffect(() => {
    if (session?.user) {
      setForm({
        name: (session.user as any).name || "",
        email: (session.user as any).email || "",
        phone: (session.user as any).phone || "",
      });
    }
  }, [session]);

  if (!session?.user) {
    router.push("/auth/login?callbackUrl=/account/profile");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/account/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, phone: form.phone }),
      });
      if (!res.ok) { toast.error("Failed to update profile"); return; }
      await update({ name: form.name });
      toast.success("Profile updated");
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-20 sm:py-28">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">My Profile</h1>
        <form onSubmit={handleSubmit}>
          <div className="mt-8 space-y-6 text-sm text-muted-foreground">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-lg border border-border/40 p-6"
            >
              <h2 className="mb-4 text-sm font-semibold text-foreground">Account Info</h2>
              <div className="space-y-4">
                <div>
                  <p className="mb-1.5 text-xs font-medium">Name</p>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/50" />
                    <Input
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Your name"
                      className="h-10 pl-10"
                      required
                    />
                  </div>
                </div>
                <div>
                  <p className="mb-1.5 text-xs font-medium">Email</p>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/50" />
                    <Input
                      value={form.email}
                      disabled
                      className="h-10 pl-10 opacity-60"
                    />
                  </div>
                  <p className="mt-1 text-[11px] text-muted-foreground/50">Email cannot be changed</p>
                </div>
                <div>
                  <p className="mb-1.5 text-xs font-medium">Phone</p>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/50" />
                    <Input
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="(555) 123-4567"
                      className="h-10 pl-10"
                      type="tel"
                    />
                  </div>
                </div>
              </div>
              <Button type="submit" className="mt-5 gap-2" size="sm" disabled={loading}>
                {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </motion.div>
          </div>
        </form>
      </div>
    </div>
  );
}
