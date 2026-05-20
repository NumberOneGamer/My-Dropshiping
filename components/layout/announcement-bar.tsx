"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils/cn";

export function AnnouncementBar({ text, isActive }: { text?: string; isActive?: boolean }) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isActive || !text) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="relative flex items-center justify-center bg-neutral-900 px-4 py-2 text-center text-sm text-white dark:bg-white dark:text-black"
        >
          <span className="text-xs font-medium tracking-wide sm:text-sm">
            {text}
          </span>
          <button
            onClick={() => setIsVisible(false)}
            className="absolute right-3 top-1/2 -translate-y-1/2 opacity-70 hover:opacity-100"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
