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
    <section className="border-t border-border/40 py-20 sm:py-28">
      <div className="mx-auto max-w-xl px-4 text-center sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
        >
          <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-xl border border-border/40 bg-muted/40">
            <Mail className="h-5 w-5 text-muted-foreground" />
          </div>
          <h2 className="mb-3 text-2xl font-semibold tracking-tight sm:text-3xl">
            Get 10% Off Your First Order
          </h2>
          <p className="mb-8 text-sm leading-relaxed text-muted-foreground sm:text-base">
            Join our newsletter and be the first to know about new arrivals,
            exclusive deals, and special offers.
          </p>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mx-auto flex max-w-sm items-center justify-center gap-2 rounded-lg border border-border/40 bg-muted/30 px-5 py-3"
            >
              <Check className="h-4 w-4 text-foreground/80" />
              <span className="text-sm font-medium">
                Thanks for subscribing! Check your inbox.
              </span>
            </motion.div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="mx-auto flex max-w-sm gap-2"
            >
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="h-11"
              />
              <Button type="submit" size="lg" className="shrink-0 h-11">
                <ArrowRight className="h-4 w-4" />
              </Button>
            </form>
          )}

          <p className="mt-4 text-xs text-muted-foreground/60">
            No spam ever. Unsubscribe anytime.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
