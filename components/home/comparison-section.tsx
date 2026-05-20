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
    <section className="border-t border-border/40 py-20 sm:py-28">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="mb-14 text-center"
        >
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Comparison
          </p>
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            We Compare, You Decide
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="overflow-hidden rounded-lg border border-border/40"
        >
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/40 bg-muted/30">
                <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Feature
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider">
                  KAIRO
                </th>
                <th className="px-6 py-4 text-center text-xs font-medium uppercase tracking-wider text-muted-foreground/60">
                  Others
                </th>
              </tr>
            </thead>
            <tbody>
              {comparisons.map((row, i) => (
                <tr
                  key={row.feature}
                  className="border-b border-border/30 last:border-0"
                >
                  <td className="px-6 py-4 text-sm">{row.feature}</td>
                  <td className="px-6 py-4 text-center">
                    {row.us === true ? (
                      <Check className="mx-auto h-4 w-4 text-foreground/80" />
                    ) : (
                      <span className="text-sm font-medium">{row.us}</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {row.others === false ? (
                      <X className="mx-auto h-4 w-4 text-muted-foreground/30" />
                    ) : (
                      <span className="text-sm text-muted-foreground/60">
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
          transition={{ delay: 0.2 }}
          className="mt-10 text-center"
        >
          <Button asChild size="lg">
            <Link href="/search">Experience the Difference</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
