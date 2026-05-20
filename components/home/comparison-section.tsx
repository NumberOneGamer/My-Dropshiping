"use client";

import { motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const comparisons = [
  { feature: "Premium Quality", us: true, others: false },
  { feature: "Free Shipping", us: true, others: "Over $100" },
  { feature: "Easy Returns", us: "30 Days", others: "14 Days" },
  { feature: "24/7 Support", us: true, others: false },
  { feature: "Eco Packaging", us: true, others: false },
  { feature: "Price Match", us: true, others: false },
];

export function ComparisonSection() {
  return (
    <section className="border-t border-border/50 bg-secondary/20 py-16 sm:py-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <p className="mb-3 text-sm font-medium uppercase tracking-widest text-muted-foreground">
            Why We&apos;re Different
          </p>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            We Compare, You Decide
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="overflow-hidden rounded-xl border border-border/50 bg-background"
        >
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/50 bg-secondary/50">
                <th className="px-6 py-4 text-left text-sm font-medium">
                  Features
                </th>
                <th className="px-6 py-4 text-center text-sm font-medium">
                  <span className="text-primary">Dropship</span>
                </th>
                <th className="px-6 py-4 text-center text-sm font-medium text-muted-foreground">
                  Others
                </th>
              </tr>
            </thead>
            <tbody>
              {comparisons.map((row, i) => (
                <tr
                  key={row.feature}
                  className="border-b border-border/50 last:border-0"
                >
                  <td className="px-6 py-4 text-sm">{row.feature}</td>
                  <td className="px-6 py-4 text-center">
                    {row.us === true ? (
                      <Check className="mx-auto h-5 w-5 text-emerald-500" />
                    ) : (
                      <span className="text-sm font-medium text-emerald-500">
                        {row.us}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {row.others === false ? (
                      <X className="mx-auto h-5 w-5 text-red-400" />
                    ) : (
                      <span className="text-sm text-muted-foreground">
                        {row.others}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-8 text-center"
        >
          <Button asChild size="lg">
            <Link href="/search">Experience the Difference</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
