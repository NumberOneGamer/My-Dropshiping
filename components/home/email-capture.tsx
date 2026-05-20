"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function EmailCapture() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
    }
  };

  return (
    <section className="border-t border-border/50 bg-gradient-to-b from-background to-secondary/30 py-16 sm:py-24">
      <div className="mx-auto max-w-2xl px-4 text-center sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary">
            <Mail className="h-8 w-8" />
          </div>
          <h2 className="mb-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Get 10% Off Your First Order
          </h2>
          <p className="mb-8 text-lg text-muted-foreground">
            Join our newsletter and be the first to know about new arrivals,
            exclusive deals, and special offers.
          </p>

          {submitted ? (
            <div className="mx-auto flex max-w-sm items-center justify-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-50 px-6 py-4 dark:bg-emerald-950/20">
              <Check className="h-5 w-5 text-emerald-500" />
              <span className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
                Thanks for subscribing! Check your inbox.
              </span>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="mx-auto flex max-w-sm gap-3"
            >
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="h-12"
              />
              <Button type="submit" size="lg" className="shrink-0">
                <ArrowRight className="h-5 w-5" />
              </Button>
            </form>
          )}

          <p className="mt-4 text-xs text-muted-foreground">
            No spam ever. Unsubscribe anytime.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
