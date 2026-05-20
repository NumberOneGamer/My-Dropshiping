"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Star } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  const [hero, setHero] = useState<{ title?: string; subtitle?: string }>({});
  const [timeLeft, setTimeLeft] = useState({ hours: 12, minutes: 0, seconds: 0 });

  useEffect(() => {
    fetch("/api/cms?section=hero")
      .then((r) => r.json())
      .then((data) => {
        const items = Array.isArray(data) ? data : [];
        const section = items.find((c: any) => c.section === "hero");
        if (section) setHero(section);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative overflow-hidden bg-background pb-20 pt-28 sm:pb-32 sm:pt-36">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(255,255,255,0.03),transparent)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_50%_at_50%_50%,rgba(255,255,255,0.01),transparent)]" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-border/40 bg-background/60 px-4 py-1.5 text-xs backdrop-blur-xl">
              <Star className="h-3 w-3 fill-foreground/80 text-foreground/80" />
              <span className="text-muted-foreground">Rated 4.9/5 by 10,000+ customers</span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="text-balance text-[2.75rem] font-semibold tracking-tight leading-[1.1] sm:text-6xl lg:text-7xl"
          >
            {hero.title || "Premium quality, delivered."}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto mt-6 max-w-xl text-balance text-base leading-relaxed text-muted-foreground sm:text-lg"
          >
            {hero.subtitle || "Curated essentials for modern living. Thoughtfully designed, responsibly sourced, delivered to your door."}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.24, ease: [0.16, 1, 0.3, 1] }}
            className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link href="/search">Shop Now <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
              <Link href="/search?sort=newest">New Arrivals</Link>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.32, ease: [0.16, 1, 0.3, 1] }}
            className="mt-14 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs text-muted-foreground"
          >
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-foreground/60" />
              Free Shipping
            </div>
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-foreground/60" />
              Easy Returns
            </div>
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-foreground/60" />
              2-Year Warranty
            </div>
          </motion.div>

          {timeLeft.hours > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="mx-auto mt-10 inline-flex items-center gap-3 rounded-full border border-border/40 bg-background/60 px-5 py-2.5 backdrop-blur-xl"
            >
              <span className="text-xs font-medium text-muted-foreground">Flash Sale ends in</span>
              <div className="flex gap-1.5 text-xs font-mono font-semibold tabular-nums">
                <span className="rounded-md bg-foreground/10 px-2 py-0.5">{String(timeLeft.hours).padStart(2, "0")}</span>
                <span className="text-muted-foreground/40">:</span>
                <span className="rounded-md bg-foreground/10 px-2 py-0.5">{String(timeLeft.minutes).padStart(2, "0")}</span>
                <span className="text-muted-foreground/40">:</span>
                <span className="rounded-md bg-foreground/10 px-2 py-0.5">{String(timeLeft.seconds).padStart(2, "0")}</span>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
