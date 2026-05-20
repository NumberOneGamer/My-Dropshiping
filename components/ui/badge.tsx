import * as React from "react";
import { cn } from "@/lib/utils/cn";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline" | "success";
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variants = {
    default:
      "bg-foreground text-background",
    secondary:
      "bg-secondary text-secondary-foreground",
    destructive:
      "bg-destructive text-destructive-foreground",
    outline:
      "text-foreground border border-border/60",
    success:
      "bg-emerald-500/10 text-emerald-500 dark:text-emerald-400",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium tracking-wide transition-colors",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}

export { Badge };
