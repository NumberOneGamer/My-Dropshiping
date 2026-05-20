"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";

const testimonials = [
  {
    name: "Sarah M.",
    role: "Verified Buyer",
    content:
      "Absolutely love the quality. The packaging was beautiful and it arrived in just 4 days. Will definitely be ordering again.",
    rating: 5,
    avatar: "",
  },
  {
    name: "James K.",
    role: "Verified Buyer",
    content:
      "I was skeptical about ordering online, but the customer service team answered all my questions. The product exceeded my expectations.",
    rating: 5,
    avatar: "",
  },
  {
    name: "Emily R.",
    role: "Verified Buyer",
    content:
      "Bought this as a gift and they were thrilled. The quality is outstanding and the price is very reasonable for what you get.",
    rating: 5,
    avatar: "",
  },
  {
    name: "Michael T.",
    role: "Verified Buyer",
    content:
      "Second time ordering from here and they never disappoint. Fast shipping, great quality, and easy returns if needed.",
    rating: 4,
    avatar: "",
  },
];

export function Testimonials() {
  return (
    <section className="border-t border-border/40 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="mb-14 text-center"
        >
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Testimonials
          </p>
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            What Customers Say
          </h2>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.06, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-lg border border-border/40 bg-card/40 p-6 transition-colors hover:border-border/60"
            >
              <div className="mb-4 flex gap-0.5">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star
                    key={j}
                    className={`h-3.5 w-3.5 ${
                      j < t.rating
                        ? "fill-foreground/80 text-foreground/80"
                        : "text-muted-foreground/20"
                    }`}
                  />
                ))}
              </div>
              <p className="mb-5 text-sm leading-relaxed text-muted-foreground">
                &ldquo;{t.content}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <Avatar fallback={t.name} className="h-8 w-8 text-[10px]" />
                <div>
                  <p className="text-sm font-medium">{t.name}</p>
                  <p className="text-[11px] text-muted-foreground/60">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
