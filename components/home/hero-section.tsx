"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Star } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  const [timeLeft, setTimeLeft] = useState({
    hours: 12,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0)
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0)
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background to-secondary/30 pb-16 pt-20 sm:pb-24 sm:pt-28">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_hsl(var(--primary)/0.05),transparent_50%)]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border/50 bg-background/50 px-4 py-1.5 text-sm backdrop-blur-sm">
              <Star className="h-3.5 w-3.5 fill-yellow-500 text-yellow-500" />
              <span className="text-muted-foreground">
                Rated 4.9/5 by 10,000+ customers
              </span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-balance text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl"
          >
            Premium Quality,{" "}
            <span className="bg-gradient-to-r from-neutral-600 to-neutral-900 bg-clip-text text-transparent dark:from-neutral-300 dark:to-white">
              Delivered
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 text-balance text-lg leading-relaxed text-muted-foreground sm:text-xl"
          >
            Curated products designed for modern living. Free shipping, easy
            returns, and exceptional quality you can feel.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Button asChild size="xl" className="w-full sm:w-auto">
              <Link href="/search">
                Shop Now <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              asChild
              variant="glass"
              size="xl"
              className="w-full sm:w-auto"
            >
              <Link href="/categories/new-arrivals">New Arrivals</Link>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-12 flex items-center justify-center gap-8 text-sm text-muted-foreground"
          >
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-emerald-500" />
              Free Shipping
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-emerald-500" />
              Easy Returns
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-emerald-500" />
              2-Year Warranty
            </div>
          </motion.div>

          {timeLeft.hours > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mx-auto mt-8 inline-flex items-center gap-3 rounded-xl border border-border/50 bg-background/50 px-6 py-3 backdrop-blur-sm"
            >
              <span className="text-sm font-medium">Flash Sale ends in:</span>
              <div className="flex gap-2 text-sm font-bold">
                <span className="rounded-lg bg-primary px-2 py-1 text-primary-foreground">
                  {String(timeLeft.hours).padStart(2, "0")}h
                </span>
                <span className="rounded-lg bg-primary px-2 py-1 text-primary-foreground">
                  {String(timeLeft.minutes).padStart(2, "0")}m
                </span>
                <span className="rounded-lg bg-primary px-2 py-1 text-primary-foreground">
                  {String(timeLeft.seconds).padStart(2, "0")}s
                </span>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
