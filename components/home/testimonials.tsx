"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";

const testimonials = [
  {
    name: "Sarah M.",
    role: "Verified Buyer",
    content:
      "Absolutely love the quality! The packaging was beautiful and it arrived in just 4 days. Will definitely be ordering again.",
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
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <p className="mb-3 text-sm font-medium uppercase tracking-widest text-muted-foreground">
            Testimonials
          </p>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            What Our Customers Say
          </h2>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card rounded-xl p-6"
            >
              <div className="mb-4 flex gap-1">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star
                    key={j}
                    className={`h-4 w-4 ${
                      j < t.rating
                        ? "fill-yellow-500 text-yellow-500"
                        : "text-muted-foreground/30"
                    }`}
                  />
                ))}
              </div>
              <p className="mb-4 text-sm leading-relaxed">&ldquo;{t.content}&rdquo;</p>
              <div className="flex items-center gap-3">
                <Avatar fallback={t.name} />
                <div>
                  <p className="text-sm font-medium">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
