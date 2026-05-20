"use client";

import { motion } from "framer-motion";
import {
  Truck,
  Shield,
  RefreshCcw,
  Headphones,
  Zap,
  Package,
} from "lucide-react";

const benefits = [
  {
    icon: Truck,
    title: "Free Shipping",
    description: "On all orders over $50. Delivered in 3-5 business days.",
  },
  {
    icon: Shield,
    title: "Premium Quality",
    description: "Every product is tested and verified for quality.",
  },
  {
    icon: RefreshCcw,
    title: "Easy Returns",
    description: "30-day no-questions-asked return policy.",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "Our team is here to help anytime, day or night.",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Optimized ordering process takes under 2 minutes.",
  },
  {
    icon: Package,
    title: "Secure Packaging",
    description: "Eco-friendly packaging that protects your items.",
  },
];

export function BenefitsGrid() {
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
            Why Choose Us
          </p>
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Everything You Need
          </h2>
        </motion.div>

        <div className="grid gap-px bg-border/40 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: index * 0.06, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="group bg-background p-8 transition-colors hover:bg-accent/30"
            >
              <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-lg bg-muted/60">
                <benefit.icon className="h-5 w-5 text-muted-foreground" />
              </div>
              <h3 className="mb-2 text-sm font-semibold">{benefit.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {benefit.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
