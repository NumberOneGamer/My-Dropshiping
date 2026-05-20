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
    <section className="border-t border-border/50 bg-secondary/20 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <p className="mb-3 text-sm font-medium uppercase tracking-widest text-muted-foreground">
            Why Choose Us
          </p>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Everything You Need
          </h2>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group rounded-xl border border-border/50 bg-background p-6 transition-all hover:border-primary/20 hover:shadow-sm"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-secondary">
                <benefit.icon className="h-6 w-6" />
              </div>
              <h3 className="mb-2 font-semibold">{benefit.title}</h3>
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
